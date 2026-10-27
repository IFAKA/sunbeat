#!/usr/bin/env python3
"""Energy budget for a battery-free burst player (solar cell + supercap + low-power MCU).

Usage: burst_budget.py [--area 2.5] [--play-mw 1.0] [--clip-s 30] [--chain-eff 0.7]

Prints, per light level: harvest in uW, supercap size for one clip, and minutes of charging per clip.
All inputs are estimates (E), not measurements. Cell power per cm2 is a typical value for
amorphous-Si / DSSC indoor cells and ~15% mono-Si in sun; check the datasheet of the real cell.
"""
import sys

a = sys.argv[1:]
opt = {"--area": 2.5, "--play-mw": 1.0, "--clip-s": 30.0, "--chain-eff": 0.7}
for i in range(0, len(a), 2):
    opt[a[i]] = float(a[i + 1])
area, play_mw, clip_s, eff = opt["--area"], opt["--play-mw"], opt["--clip-s"], opt["--chain-eff"]

LEVELS = [  # name, uW per cm2 at the cell (E)
    ("dim room 100 lux", 5),
    ("window/office 500 lux", 25),
    ("bright window 2000 lux", 100),
    ("outdoor shade 10 klux", 1500),
    ("full sun 100 klux", 10000),
]
V_HI, V_LO = 3.6, 2.2  # supercap window the converter works in
need_mj = play_mw * clip_s
cap_f = 2 * (need_mj / 1000) / (V_HI**2 - V_LO**2) / 0.85  # 85% converter eff on the way out
print(f"clip={clip_s:g}s play={play_mw:g}mW -> {need_mj:g} mJ per clip; supercap >= {cap_f * 1000:.0f} mF "
      f"({V_HI}->{V_LO} V); cell {area:g} cm2, chain eff {eff:g}")
for name, uw_cm2 in LEVELS:
    h = uw_cm2 * area * eff
    t = need_mj * 1000 / h  # uJ / uW = s
    note = "plays continuously" if h >= play_mw * 1000 else f"{t / 60:.1f} min charge per clip"
    print(f"  {name:26s} harvest {h:8.1f} uW  {note}")
