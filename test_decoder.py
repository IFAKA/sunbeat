#!/usr/bin/env python3
"""Checks (on the Mac, no Pico) that the player's decoder gives the same samples as adpcm.py's decoder,
and that build_songs.py works. Usage: python3 -I test_decoder.py"""
import importlib.util, os, re, struct, subprocess, sys, tempfile

HERE = os.path.dirname(os.path.abspath(__file__))
spec = importlib.util.spec_from_file_location("adpcm", os.path.join(HERE, "adpcm.py"))
adpcm = importlib.util.module_from_spec(spec); spec.loader.exec_module(adpcm)

# 1. pull dec() out of player.py, turn the viper types into plain Python, run it on a test signal
src = open(os.path.join(HERE, "player.py")).read()
body = re.search(r"@micropython\.viper\n(def dec\(.*?\n    return o\n)", src, re.S).group(1)
body = re.sub(r": ptr\d+", "", body).replace("-> int", "")
ns = {}
exec(body, ns)
STEP = adpcm.STEP
DELTA = bytes([0, 0, 0, 0, 3, 5, 7, 9])
import math
sig = [int(9000 * math.sin(i / 7.0) + 3000 * math.sin(i / 2.3)) for i in range(4000)]
data = adpcm.encode(sig)
dst = bytearray(len(data) * 2); st = [0, 0]
n = ns["dec"](data, len(data), dst, st, STEP, DELTA)
want = [(p >> 8) + 128 for p in adpcm.decode(data)]
assert n == len(want), (n, len(want))
bad = sum(1 for a, b in zip(dst, want) if a != b)
print("decoder samples", n, "mismatches", bad)
assert bad == 0

# 2. build_songs.py on two made-up tones (needs ffmpeg)
with tempfile.TemporaryDirectory() as d:
    for i, f in enumerate((440, 660)):
        subprocess.run(["ffmpeg", "-v", "error", "-f", "lavfi", "-i", f"sine=f={f}:d=8", os.path.join(d, f"t{i}.wav")], check=True)
    out = os.path.join(d, "songs")
    r = subprocess.run([sys.executable, "-I", os.path.join(HERE, "build_songs.py"), d, out, "--budget-mb", "0.05"], capture_output=True, text=True)
    print(r.stdout.strip()); assert r.returncode == 0, r.stderr
    sizes = sorted(os.path.getsize(os.path.join(out, f)) for f in os.listdir(out) if f.endswith(".adpcm"))
    print("file sizes", sizes)
    assert len(sizes) == 2 and sum(sizes) <= 0.05 * 1024 * 1024 and sizes[0] < sizes[1]
print("ALL OK")
