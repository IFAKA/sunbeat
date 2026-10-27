#!/usr/bin/env python3
"""Earbud button = music remote. A player on screen shows what each gesture does.

Run:  python3 earbud_music.py          (screen player only)
      python3 earbud_music.py --music  (also controls the Apple Music app)
One click = play/pause. Double click = next song. Hold = volume up (wraps to low after max).
Uses the same detector as earbud_ui.py.
"""
import subprocess, sys, webbrowser
from http.server import ThreadingHTTPServer

import earbud_ui as ui

REAL = "--music" in sys.argv
LABEL = {"single": "ONE CLICK: play / pause", "double": "DOUBLE CLICK: next song", "long": "HOLD: volume up"}


def apple(script):
    subprocess.Popen(["osascript", "-e", f'tell application "Music" to {script}'])


class Live(ui.Session):
    """Same detector, but instead of asking for gestures it acts on them."""

    def __init__(self):
        super().__init__()
        self.th = 0.27                  # single ~0.17-0.25 s, double ~0.29-0.37 s in practice runs
        self.playing, self.track, self.volume = False, 1, 5
        self.events, self.seq = [], 0

    def next_ask(self):
        self.asked, self.phase, self.first, self.last = "", "ask", None, None

    def judge(self, d):
        if self.gmax < 3:               # a button pulls the line far down; a shake only wobbles it
            return
        got = self.classify(d)
        if got == "single":
            self.playing = not self.playing
            if REAL:
                apple("playpause")
        elif got == "double":
            self.track += 1
            if REAL:
                apple("next track")
        else:
            self.volume = 2 if self.volume >= 10 else self.volume + 2
            if REAL:
                apple(f"set sound volume to {self.volume * 10}")
        self.seq += 1
        self.events = ([LABEL[got]] + self.events)[:5]
        self.heard = got

    def state(self):
        live = self.first is not None and self.t - self.last < ui.QUIET
        return {"phase": self.phase, "playing": self.playing, "track": self.track, "volume": self.volume,
                "seq": self.seq, "events": self.events, "active": live,
                "trace": [r[1] for r in self.rows[-500:]],
                "elapsed": (self.t - self.first) / 100 if live else 0.0}


PAGE = r"""<!doctype html><meta charset=utf-8><title>Earbud music</title>
<style>
body{margin:0;font-family:-apple-system,Helvetica,Arial;color:#fff;background:#222;height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center}
#icon{font-size:16vw;line-height:1}
#track{font-size:5vw;font-weight:700;margin:1vh}
#volbox{display:flex;gap:1vw;margin:2vh}
.v{width:4vw;height:4vw;border-radius:.6vw;background:#555}.v.on{background:#fff}
#flash{font-size:4vw;font-weight:800;height:7vh;color:#facc15}
#log{position:fixed;top:12vh;right:2vw;font-size:1.6vw;opacity:.7;white-space:pre-line;text-align:right}
button{font-size:4vw;padding:2vh 4vw;border:0;border-radius:2vw;color:#fff;cursor:pointer;font-weight:700;background:#16a34a}
#stop{position:fixed;top:1vh;right:1vw;font-size:1.8vw;padding:1vh 1.5vw;background:#0006}
#cv{position:fixed;left:0;bottom:0;width:100vw;height:24vh;background:#0008}
#cap{position:fixed;left:1vw;bottom:24.5vh;font-size:1.5vw;opacity:.7}
#dot{position:fixed;top:2vh;left:2vw;font-size:2vw;display:none}
</style>
<div id=dot>&#9679; button pressed</div><div id=main></div>
<div id=cap>Earbud signal, last 5 s (up = louder). Press, tap or shake the earbud and watch it move.</div><canvas id=cv width=1000 height=120></canvas>
<button id=stop onclick="fetch('/stop',{method:'POST'})">Stop</button>
<script>
let lastSeq=0,flashUntil=0,flashText='';
async function tick(){
 const s=await (await fetch('/state')).json();
 const m=document.getElementById('main');
 const c=document.getElementById('cv').getContext('2d');c.clearRect(0,0,1000,120);
 if(s.trace){c.strokeStyle='#facc15';c.lineWidth=2;c.beginPath();
  s.trace.forEach((v,i)=>{const x=i*2,y=120-Math.max(0,Math.min(120,(v+100)*1.2));i?c.lineTo(x,y):c.moveTo(x,y);});c.stroke();}
 document.getElementById('dot').style.display=s.active?'block':'none';
 if(s.phase=='idle'||s.phase=='done'){m.innerHTML="<button onclick=\"fetch('/start',{method:'POST'})\">START</button>";document.body.style.background='#222';return;}
 if(s.phase=='calib'){m.innerHTML='<div id=track>Stay still</div>';document.body.style.background='#444';return;}
 if(s.seq!=lastSeq){lastSeq=s.seq;flashText=s.events[0]||'';flashUntil=Date.now()+1500;}
 const vol=Array.from({length:10},(_,i)=>`<div class="v ${i<s.volume?'on':''}"></div>`).join('');
 document.body.style.background=s.playing?'#15803d':'#1f2937';
 m.innerHTML=`<div id=icon>${s.playing?'&#9208;':'&#9654;'}</div><div id=track>${s.playing?'Playing':'Paused'} &middot; Song ${s.track}</div>
 <div id=volbox>${vol}</div><div id=flash>${Date.now()<flashUntil?flashText:''}</div>
 <div id=log>${s.events.slice(1).join('\n')}</div>`;
}
setInterval(tick,100);tick();
</script>"""


if __name__ == "__main__":
    ui.Session, ui.PAGE = Live, PAGE
    srv = ThreadingHTTPServer(("127.0.0.1", ui.PORT), ui.H)
    url = f"http://127.0.0.1:{ui.PORT}"
    print("Open", url, "- press Ctrl+C here to quit", "(also controls Apple Music)" if REAL else "")
    webbrowser.open(url)
    try:
        srv.serve_forever()
    except KeyboardInterrupt:
        pass
