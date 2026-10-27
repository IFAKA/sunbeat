#!/usr/bin/env python3
"""Earbud button practice: the screen says DO X, you do it, it says RIGHT or WRONG, then the next one.

Run:  python3 earbud_ui.py      (or double-click earbud_gestures.command)
It listens to the earbud mic line all the time (needs ffmpeg). Stop with the Stop button or Ctrl+C.
Every 10 ms window is logged to /tmp/earbud_live.csv, so a bad run can be studied afterwards.
"""
import array, json, math, random, statistics, subprocess, threading, webbrowser
from collections import deque
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer

PORT = 8765
RATE, WIN = 48000, 480              # 10 ms windows
DEVICE = ":External Microphone"
LOG = "/tmp/earbud_live.csv"
GESTURES = ["single", "double", "long"]
HOLD_T = 1.5                        # the bar fills in this many seconds
LONG_RUN = 40                       # line held down for 0.40 s (windows) = a long press; clicks gate <= 0.34 s
QUIET = 50                          # 0.5 s of quiet ends a gesture
RESULT_T = 140                      # result stays 1.4 s


def level_of(chunk):
    s = array.array("h")
    s.frombytes(chunk)
    ms = sum(x * x for x in s) / max(1, len(s))
    return 10 * math.log10(ms / 32768**2) if ms > 0 else -120.0


class Session:
    """Pure logic: feed() one level (dB) per 10 ms window. No audio or screen in here."""

    def __init__(self, rounds=7):
        self.order = []
        for _ in range(rounds):
            block = GESTURES[:]
            random.shuffle(block)
            if self.order and block[0] == self.order[-1]:
                block.reverse()
            self.order += block
        self.t = 0
        self.base_buf = deque(maxlen=150)
        self.sm = deque(maxlen=5)
        self.run = 0
        self.grun = self.gmax = self.rmax = 0
        self.first: int | None = None
        self.last: int | None = None
        self.phase, self.i, self.asked = "calib", -1, ""
        self.ok = None
        self.heard, self.right, self.done_n = "", 0, 0
        self.until = 0
        self.th = 0.33
        self.durs = {"single": [], "double": []}
        self.mistakes = {}
        self.summary = ""
        self.rows = []
        self.attempts = []

    def classify(self, d):
        if self.gmax >= LONG_RUN:      # line held down, not just clicked
            return "long"
        return "single" if d < self.th else "double"

    def next_ask(self):
        self.i += 1
        if self.i >= len(self.order):
            return self.finish()
        self.asked, self.phase, self.first, self.last = self.order[self.i], "ask", None, None

    def finish(self):
        n = max(1, self.done_n)
        lines = [f"{self.right} of {self.done_n} right ({100 * self.right // n}%). Goal: 95%."]
        lines += [f"{c}x you did {a}, I heard {h}" for (a, h), c in self.mistakes.items()]
        self.summary, self.phase = "\n".join(lines), "done"

    def judge(self, d):
        got = self.classify(d)
        self.ok, self.heard = got == self.asked, got
        self.done_n += 1
        self.right += self.ok
        if not self.ok:
            self.mistakes[(self.asked, got)] = self.mistakes.get((self.asked, got), 0) + 1
        if self.asked in self.durs and got != "long":
            self.durs[self.asked].append(d)
            if all(len(v) >= 2 for v in self.durs.values()):
                m = [statistics.mean(v) for v in self.durs.values()]
                self.th = min(0.8, max(0.2, (m[0] + m[1]) / 2))
        self.attempts.append((self.asked, got, round(d, 2), self.gmax, self.rmax))
        self.phase, self.until = "result", self.t + RESULT_T

    def feed(self, level):
        self.t += 1
        base = statistics.median(self.base_buf) if len(self.base_buf) >= 100 else None
        dev = 0.0 if base is None else level - base
        self.sm.append(dev)
        self.run = self.run + 1 if abs(sum(self.sm) / len(self.sm)) > 5 else 0   # steady raised level
        self.grun = self.grun + 1 if base is not None and dev < -30 else 0          # line pulled down (held)
        if self.first is None:
            self.gmax = self.rmax = 0
        self.gmax, self.rmax = max(self.gmax, self.grun), max(self.rmax, self.run)
        active = base is not None and (abs(dev) > 12 or self.run >= 8)
        self.rows.append((self.t, round(level, 1), round(dev, 1), int(active)))
        if active:
            if self.first is None:
                self.first = self.t - (7 if self.run >= 8 else 0)
            self.last = self.t
        elif self.first is None:
            self.base_buf.append(level)          # only quiet windows set the quiet level
        if self.phase == "calib" and base is not None:
            self.next_ask()
        elif self.phase == "ask" and self.first is not None and self.t - self.last >= QUIET:
            self.judge((self.last - self.first + 1) / 100)
            self.first = self.last = None
        elif self.phase == "result":
            if self.first is not None and self.t - self.last >= QUIET:
                self.first = self.last = None    # drop movement during the result screen
            if self.t >= self.until:
                self.next_ask()

    def state(self):
        live = self.first is not None and self.t - self.last < QUIET
        elapsed = (self.t - self.first) / 100 if live else 0.0
        return {"phase": self.phase, "asked": self.asked, "ok": self.ok, "heard": self.heard,
                "active": live, "hold": min(1.0, elapsed / HOLD_T) if self.asked == "long" else 0.0,
                "progress": [min(self.i + 1, len(self.order)), len(self.order)],
                "score": [self.right, self.done_n], "summary": self.summary}


SESSION = None
STOP = threading.Event()
IDLE = {"phase": "idle", "asked": "", "ok": None, "heard": "", "active": False, "hold": 0,
        "progress": [0, 0], "score": [0, 0], "summary": ""}


def engine():
    global SESSION
    sess = SESSION = Session()
    STOP.clear()
    cmd = ["ffmpeg", "-loglevel", "error", "-f", "avfoundation", "-i", DEVICE,
           "-ar", str(RATE), "-ac", "1", "-f", "s16le", "-"]
    proc = subprocess.Popen(cmd, stdout=subprocess.PIPE)
    try:
        while sess.phase != "done" and not STOP.is_set():
            chunk = proc.stdout.read(WIN * 2)
            if len(chunk) < WIN * 2:
                break
            sess.feed(level_of(chunk))
    finally:
        proc.kill()
        if sess.phase != "done":
            sess.finish()
        with open(LOG.replace("live", "attempts"), "w") as f:
            f.write("asked,heard,dur_s,gated_run,raised_run\n")
            f.writelines(",".join(map(str, a)) + "\n" for a in sess.attempts)
        with open(LOG, "w") as f:
            f.write("window,level_db,dev_db,active\n")
            f.writelines(",".join(map(str, r)) + "\n" for r in sess.rows)


PAGE = """<!doctype html><meta charset=utf-8><title>Earbud practice</title>
<style>
body{margin:0;font-family:-apple-system,Helvetica,Arial;color:#fff;background:#222;height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center}
#big{font-size:12vw;font-weight:800;line-height:1.05;white-space:pre-line}
#mid{font-size:3.6vw;margin:2vh 6vw;white-space:pre-line}
#small{font-size:2.4vw;opacity:.85;white-space:pre-line}
button{font-size:4vw;padding:2vh 4vw;margin:2vh;border:0;border-radius:2vw;color:#fff;cursor:pointer;font-weight:700;background:#16a34a}
#holdbox{width:70vw;height:7vh;border:.6vh solid #fff;border-radius:2vh;margin-top:3vh;display:none;overflow:hidden}
#hold{height:100%;width:0;background:#fff}
#stop{position:fixed;top:1vh;right:1vw;font-size:1.8vw;padding:1vh 1.5vw;background:#0006}
#dot{position:fixed;top:2vh;left:2vw;font-size:2vw;display:none}
</style>
<div id=dot>●</div>
<div id=big></div><div id=mid></div><div id=holdbox><div id=hold></div></div><div id=small></div><div id=btns></div>
<button id=stop onclick="fetch('/stop',{method:'POST'})">Stop</button>
<script>
const NAME={single:'ONE CLICK',double:'DOUBLE CLICK',long:'HOLD'};
const $=id=>document.getElementById(id);
const START='<button onclick="fetch(\\'/start\\',{method:\\'POST\\'})">START</button>';
async function tick(){
 const s=await (await fetch('/state')).json();
 let bg='#222',big='',mid='',small='',btns='',box=false;
 const sc=s.score[1]?`${s.progress[0]}/${s.progress[1]}  ·  ${s.score[0]} right`:'';
 if(s.phase=='idle'){btns=START;}
 else if(s.phase=='calib'){bg='#444';big='Stay still';}
 else if(s.phase=='ask'){bg='#1f5fbf';big=NAME[s.asked];small=sc;
  if(s.asked=='long'){box=true;$('hold').style.width=(100*s.hold)+'%';
   if(s.hold>=1){bg='#16a34a';big='RELEASE';}}}
 else if(s.phase=='result'){
  if(s.ok){bg='#16a34a';big='RIGHT';}
  else{bg='#c62828';big='WRONG';mid='heard: '+NAME[s.heard];}small=sc;}
 else if(s.phase=='done'){big='Done';mid=s.summary;btns=START;}
 document.body.style.background=bg;$('big').textContent=big;$('mid').textContent=mid;$('small').textContent=small;
 $('btns').innerHTML=btns;$('holdbox').style.display=box?'block':'none';
 $('dot').style.display=(s.active&&s.phase=='ask')?'block':'none';
 $('big').style.fontSize=s.phase=='done'?'8vw':'12vw';
}
setInterval(tick,100);tick();
</script>"""


class H(BaseHTTPRequestHandler):
    def log_message(self, format, *args):
        pass

    def send(self, body, ctype="application/json"):
        b = body.encode()
        self.send_response(200)
        self.send_header("Content-Type", ctype + "; charset=utf-8")
        self.send_header("Content-Length", str(len(b)))
        self.end_headers()
        self.wfile.write(b)

    def do_GET(self):
        if self.path == "/":
            self.send(PAGE, "text/html")
        else:
            self.send(json.dumps(SESSION.state() if SESSION else IDLE))

    def do_POST(self):
        if self.path == "/start":
            if not SESSION or SESSION.phase == "done":
                threading.Thread(target=engine, daemon=True).start()
        elif self.path == "/stop":
            STOP.set()
        self.send("{}")


if __name__ == "__main__":
    srv = ThreadingHTTPServer(("127.0.0.1", PORT), H)
    url = f"http://127.0.0.1:{PORT}"
    print("Open", url, "- press Ctrl+C here to quit")
    webbrowser.open(url)
    try:
        srv.serve_forever()
    except KeyboardInterrupt:
        pass
