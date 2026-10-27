#!/usr/bin/env python3
"""Weekly energy budget from a daily schedule (sleep / work / free) for a self-charging player.

Usage: daily_budget.py [--office] [--area 2.5] [--play-mw 0.5] [--play-h 1.5] [--idle-uw 10]
                       [--chain-eff 0.7] [--worn-factor 0.4]

Schedule below is editable: hours spent at each light level, per day type. 5 weekdays + 2 weekend days.
Light is uW per cm2 at the cell (E, typical). While WORN outdoors the cell is partly covered/tilted,
so outdoor light is multiplied by --worn-factor. At the desk the cell lies flat in the light (factor 1).
Prints: harvest J/day, use J/day, net J/day per day type and per week, and the storage the
net-positive pattern needs (energy harvested at work that must wait until evening).
"""
import sys

a = sys.argv[1:]
o = {"--area": 2.5, "--play-mw": 0.5, "--play-h": 1.5, "--idle-uw": 10.0,
     "--chain-eff": 0.7, "--worn-factor": 0.4}
a = [x for x in a if x != "--office"]
for i in range(0, len(a), 2):
    o[a[i]] = float(a[i + 1])
area, play_mw, play_h, idle_uw, eff, worn = (
    o["--area"], o["--play-mw"], o["--play-h"], o["--idle-uw"], o["--chain-eff"], o["--worn-factor"])

# (hours, uW/cm2, worn?)  E values (~0.05 uW/cm2 per lux). Edit to match the real week.
# Sleep 6 h in the dark. Gym 1 h indoors (~300 lux, worn), groceries 0.5 h outdoors in shade (worn).
# Home: bright indirect daylight at the desk ~1000 lux, lights off by day; evening lights ~150 lux.
# Office: lights on + windows ~500 lux at the desk.
DESK = 50 if "--office" not in sys.argv[1:] else 25
OFFICE = "--office" in sys.argv[1:]
WEEKDAY = [(6, 0, False),        # sleep
           (8, DESK, False),     # work at the desk (home or office)
           (1, 15, True),        # gym
           (0.5, 1500, True),    # groceries outdoors
           (4.5, 37, False),   # home, daylight at the desk (~750 lux)
           (4, 7, False)]        # home evening, lights on
WEEKEND = [(6, 0, False),        # sleep
           (1, 15, True),        # gym
           (0.5, 1500, True),    # groceries
           (10, 37, False),      # home by day
           (6.5, 7, False)]      # home evening

def day(sched):
    j = sum(h * 3600 * u * area * eff * (worn if w else 1) for h, u, w in sched) / 1e6
    use = play_mw * play_h * 3.6 + idle_uw * 24 * 3.6 / 1000  # mW*h*3.6 = J ; uW*h*3.6/1000 = J
    return j, use

hw, uw_ = day(WEEKDAY)
he, ue = day(WEEKEND)
print(f"area {area:g} cm2, play {play_mw:g} mW x {play_h:g} h/day, idle {idle_uw:g} uW, worn-factor {worn:g}")
print(f"weekday: harvest {hw:6.2f} J  use {uw_:5.2f} J  net {hw - uw_:+6.2f} J")
print(f"weekend: harvest {he:6.2f} J  use {ue:5.2f} J  net {he - ue:+6.2f} J")
week = 5 * (hw - uw_) + 2 * (he - ue)
print(f"week net {week:+.1f} J -> {'self-sustaining' if week >= 0 else 'NOT self-sustaining'}")
work_j = 8 * 3600 * DESK * area * eff / 1e6
print(f"harvested during work {work_j:.2f} J; storage needed to hold a day's play {play_mw * play_h * 3.6:.2f} J "
      f"= supercap ~{2 * play_mw * play_h * 3.6 / 8.12 / 0.85:.2f} F (3.6->2.2 V) or a ~{play_mw * play_h * 3.6 / 13:.1f} mAh battery (3.6 V)")
