#!/usr/bin/env python3
"""Mac tool: a folder of songs -> a songs/ folder for the Pico player (4-bit ADPCM, one sample rate).

Usage:  python3 -I build_songs.py IN_DIR OUT_DIR [--rate 8000] [--budget-mb 2.4] [--seconds 600]
Needs ffmpeg. Songs are taken in name order. It stops when the budget is full (the last song is cut to fit).
The Pico 2 W has 4 MB flash; MicroPython takes ~1.5 MB, so ~2.4 MB is free. 8 kHz 4-bit = 4 kB/s (14 MB/hour).
Writes OUT_DIR/01.adpcm, 02.adpcm ... and OUT_DIR/index.txt (which number is which song). Copy OUT_DIR to the Pico.
"""
import importlib.util
import os
import struct
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
spec = importlib.util.spec_from_file_location("adpcm", os.path.join(HERE, "adpcm.py"))
adpcm = importlib.util.module_from_spec(spec)
spec.loader.exec_module(adpcm)

EXT = (".mp3", ".m4a", ".aac", ".wav", ".flac", ".ogg", ".opus")


def main():
    a = sys.argv[1:]
    opt = {"--rate": 8000, "--budget-mb": 2.4, "--seconds": 600}
    pos = []
    i = 0
    while i < len(a):
        if a[i] in opt:
            opt[a[i]] = type(opt[a[i]])(a[i + 1])
            i += 2
        else:
            pos.append(a[i])
            i += 1
    if len(pos) != 2:
        print(__doc__)
        sys.exit(1)
    src, out = pos
    rate, seconds = opt["--rate"], opt["--seconds"]
    budget = int(opt["--budget-mb"] * 1024 * 1024)
    os.makedirs(out, exist_ok=True)
    files = sorted(f for f in os.listdir(src) if f.lower().endswith(EXT))
    used, lines = 0, []
    for name in files:
        left = budget - used - 4
        if left < 20000:
            print("budget full, skipping", name)
            continue
        s = adpcm.pcm(os.path.join(src, name), rate, seconds, 0)
        s = s[: left * 2]  # 2 samples per byte
        data = adpcm.encode(s)
        n = len(lines) + 1
        with open(os.path.join(out, f"{n:02d}.adpcm"), "wb") as fh:
            fh.write(struct.pack("<I", rate) + data)
        used += len(data) + 4
        lines.append(f"{n:02d}  {len(s) / rate / 60:.1f} min  {name}")
        print(lines[-1])
    with open(os.path.join(out, "index.txt"), "w") as fh:
        fh.write("\n".join(lines) + "\n")
    print(f"{len(lines)} songs, {used / 1024 / 1024:.2f} MB of {budget / 1024 / 1024:.1f} MB, {used / (rate // 2) / 60:.1f} min")


if __name__ == "__main__":
    main()
