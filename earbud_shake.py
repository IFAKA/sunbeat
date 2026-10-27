#!/usr/bin/env python3
"""Shake page: shake or tap the earbud and see how strong it is. Run: python3 earbud_shake.py

The earbud coil makes a tiny voltage when it moves. The Mac mic sees it as a wobble in the line.
The numbers are a RELATIVE level in dB, not real energy (real energy needs the diode + capacitor test).
A button press pulls the line far down, so it is ignored here.
"""
import sys, webbrowser
from collections import deque
from http.server import ThreadingHTTPServer

import earbud_ui as ui


class Shake(ui.Session):
    def __init__(self):
        super().__init__()
        self.recent = deque(maxlen=15)
        self.count, self.best, self.armed, self.quiet = 0, 0.0, True, 0

    def next_ask(self):
        self.asked, self.phase, self.first, self.last = "", "ask", None, None

    def judge(self, d):
        pass

    def feed(self, level):
        super().feed(level)
        dev = self.rows[-1][2]
        self.recent.append(0.0 if dev < -30 else abs(dev))
        now = max(self.recent)
        self.best = max(self.best, now)
        self.quiet = self.quiet + 1 if now < 4 else 0
        if self.armed and now > 8:
            self.count, self.armed = self.count + 1, False
        elif self.quiet >= 30:
            self.armed = True

    def state(self):
        now = max(self.recent) if self.recent else 0.0
        return {"phase": self.phase, "now": round(now, 1), "best": round(self.best, 1), "count": self.count,
                "trace": [0.0 if r[2] < -30 else r[2] for r in self.rows[-500:]]}


PAGE = r"""<!doctype html><meta charset=utf-8><title>Earbud shake</title>
<style>
body{margin:0;font-family:-apple-system,Helvetica,Arial;color:#fff;background:#111827;height:100vh;overflow:hidden;transition:background .3s}
#stage{position:absolute;left:0;right:0;top:0;bottom:24vh;display:flex;align-items:center;justify-content:center}
#ring{position:absolute;border-radius:50%;border:.6vh solid #fff;opacity:0;width:20vh;height:20vh}
#orb{border-radius:50%;width:20vh;height:20vh;display:flex;align-items:center;justify-content:center;font-size:7vh;font-weight:800;color:#0008;transition:all .12s linear}
#meter{position:absolute;left:15vw;right:15vw;bottom:27vh;height:2.2vh;border-radius:2vh;background:linear-gradient(90deg,#334155,#facc15,#f97316,#ef4444)}
#mark{position:absolute;top:-1.2vh;width:.7vh;height:4.6vh;background:#fff;border-radius:1vh;left:0;transition:left .15s}
#cv{position:fixed;left:0;bottom:0;width:100vw;height:24vh;background:#0008}
#msg{position:absolute;top:30vh;width:100%;text-align:center;font-size:5vh;font-weight:700}
button{font-size:4vw;padding:2vh 4vw;border:0;border-radius:2vw;color:#fff;cursor:pointer;font-weight:700;background:#16a34a}
#start{position:absolute;top:40vh;left:50%;transform:translateX(-50%)}
#stop{position:fixed;top:1vh;right:1vw;font-size:1.8vw;padding:1vh 1.5vw;background:#0006}
@keyframes pulse{0%{transform:scale(1);opacity:.9}100%{transform:scale(3.2);opacity:0}}
</style>
<div id=stage><div id=ring></div><div id=orb>0</div></div><div id=msg></div>
<div id=meter><div id=mark></div></div><canvas id=cv width=1000 height=120></canvas>
<button id=start onclick="fetch('/start',{method:'POST'})">START</button>
<button id=stop onclick="fetch('/stop',{method:'POST'})">Stop</button>
<script>
const $=id=>document.getElementById(id);let last=0;
const col=v=>v<5?'#475569':v<35?'#facc15':v<70?'#f97316':'#ef4444';
async function tick(){
 const s=await (await fetch('/state')).json();
 const idle=s.phase=='idle'||s.phase=='done',cal=s.phase=='calib';
 $('start').style.display=idle?'block':'none';$('msg').textContent=cal?'Stay still':'';
 $('stage').style.display=$('meter').style.display=$('cv').style.display=idle?'none':'';
 if(idle||cal)return;
 const sc=Math.min(100,s.now*2.5),hi=Math.min(100,s.best*2.5),size=18+sc*0.5;
 const o=$('orb');o.style.width=o.style.height=size+'vh';o.style.background=col(sc);o.textContent=s.count;
 $('mark').style.left=hi+'%';
 if(s.count!=last){last=s.count;const r=$('ring');r.style.borderColor=col(sc);r.style.width=r.style.height=size+'vh';
  r.style.animation='none';r.offsetHeight;r.style.animation='pulse .6s ease-out';}
 const c=$('cv').getContext('2d');c.clearRect(0,0,1000,120);c.strokeStyle=col(sc);c.lineWidth=2;c.beginPath();
 s.trace.forEach((v,i)=>{const y=60-Math.max(-55,Math.min(55,v*2));i?c.lineTo(i*2,y):c.moveTo(i*2,y);});c.stroke();
}
setInterval(tick,100);tick();
</script>"""

if __name__ == "__main__":
    ui.Session, ui.PAGE = Shake, PAGE
    srv = ThreadingHTTPServer(("127.0.0.1", ui.PORT), ui.H)
    print("Open", f"http://127.0.0.1:{ui.PORT}", "- Ctrl+C to quit (close the music page first: same port)")
    webbrowser.open(f"http://127.0.0.1:{ui.PORT}")
    try:
        srv.serve_forever()
    except KeyboardInterrupt:
        pass
