#!/usr/bin/env python3
"""Turn log.csv signal readings into harvestable power, and beeper interval.

Usage:
  harvest_calc.py [log.csv] [--eff 0.05] [--beep-mj 0.1]

For each scan (same timestamp), sums the received power of all networks (dBm -> uW at a 0 dBi antenna,
which is what a laptop RSSI roughly is), multiplies by rectifier efficiency --eff, and prints the
resulting harvest in uW and the seconds between beeps for a beep costing --beep-mj millijoules.
Efficiency at nW-uW input is low (a few %); 0.05 is a guess, not a measurement.
"""
import csv
import sys
from collections import defaultdict

args = sys.argv[1:]
path = "log.csv"
eff, beep_mj = 0.05, 0.1
i = 0
while i < len(args):
    if args[i] == "--eff":
        eff = float(args[i + 1]); i += 2
    elif args[i] == "--beep-mj":
        beep_mj = float(args[i + 1]); i += 2
    else:
        path = args[i]; i += 1

per_scan = defaultdict(float)  # time -> total uW received
with open(path) as f:
    for row in csv.DictReader(f):
        dbm = float(row["rssi_dbm"])
        per_scan[row["time"]] += 10 ** (dbm / 10) * 1000  # mW->uW

if not per_scan:
    print("FAIL no rows in", path)
    sys.exit(1)

rx = sorted(per_scan.values())
avg_rx = sum(rx) / len(rx)
harvest = avg_rx * eff
interval = beep_mj * 1000 / harvest if harvest > 0 else float("inf")  # mJ->uJ / uW = s
print(f"OK scans={len(rx)} rx_avg={avg_rx:.4f} uW rx_max={rx[-1]:.4f} uW "
      f"harvest@eff{eff:g}={harvest:.5f} uW beep_every={interval:.0f} s "
      f"(need ~31 uW for a 1.5 h/day player: {harvest / 31 * 100:.3f}% of it)")
