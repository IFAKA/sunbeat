#!/usr/bin/env python3
"""Mac tool: song -> 4-bit IMA ADPCM file for the Pico player, and a self-check.

Usage:
  adpcm.py encode IN_AUDIO OUT.adpcm [--rate 8000] [--seconds 30] [--start 0]
  adpcm.py check  IN_AUDIO [--rate 8000] [--seconds 30]    # encode, decode, print SNR dB, write check.wav

File format: 4 bytes little-endian sample rate, then nibbles (low nibble first), predictor 0, index 0.
8 kHz 4-bit = 4 kB/s = 14 MB/hour. Needs ffmpeg. Run with python3 -I.
"""
import struct
import subprocess
import sys
import wave

STEP = [7, 8, 9, 10, 11, 12, 13, 14, 16, 17, 19, 21, 23, 25, 28, 31, 34, 37, 41, 45, 50, 55, 60, 66, 73, 80, 88, 97,
        107, 118, 130, 143, 157, 173, 190, 209, 230, 253, 279, 307, 337, 371, 408, 449, 494, 544, 598, 658, 724, 796,
        876, 963, 1060, 1166, 1282, 1411, 1552, 1707, 1878, 2066, 2272, 2499, 2749, 3024, 3327, 3660, 4026, 4428,
        4871, 5358, 5894, 6484, 7132, 7845, 8630, 9493, 10442, 11487, 12635, 13899, 15289, 16818, 18500, 20350,
        22385, 24623, 27086, 29794, 32767]
IDX = [-1, -1, -1, -1, 2, 4, 6, 8]


def pcm(path, rate, seconds, start):
    cmd = ["ffmpeg", "-v", "error", "-ss", str(start), "-t", str(seconds), "-i", path, "-ac", "1", "-ar", str(rate),
           "-af", "highpass=f=60,loudnorm=I=-16:TP=-1.5", "-ar", str(rate), "-f", "s16le", "-"]
    raw = subprocess.run(cmd, check=True, capture_output=True).stdout
    return list(struct.unpack("<%dh" % (len(raw) // 2), raw))


def encode(samples):
    pred, idx, out = 0, 0, []
    for s in samples:
        step = STEP[idx]
        d = s - pred
        n = 0
        if d < 0:
            n, d = 8, -d
        if d >= step:
            n |= 4; d -= step
        if d >= step >> 1:
            n |= 2; d -= step >> 1
        if d >= step >> 2:
            n |= 1
        diff = step >> 3
        if n & 4: diff += step
        if n & 2: diff += step >> 1
        if n & 1: diff += step >> 2
        pred += -diff if n & 8 else diff
        pred = max(-32768, min(32767, pred))
        idx = max(0, min(88, idx + IDX[n & 7]))
        out.append(n)
    if len(out) % 2:
        out.append(0)
    return bytes(out[i] | (out[i + 1] << 4) for i in range(0, len(out), 2))


def decode(data):
    pred, idx, out = 0, 0, []
    for b in data:
        for n in (b & 15, b >> 4):
            step = STEP[idx]
            diff = step >> 3
            if n & 4: diff += step
            if n & 2: diff += step >> 1
            if n & 1: diff += step >> 2
            pred += -diff if n & 8 else diff
            pred = max(-32768, min(32767, pred))
            idx = max(0, min(88, idx + IDX[n & 7]))
            out.append(pred)
    return out


def snr(a, b):
    sig = sum(x * x for x in a)
    err = sum((x - y) ** 2 for x, y in zip(a, b)) or 1
    import math
    return 10 * math.log10(sig / err) if sig else 0.0


def main():
    a = sys.argv[1:]
    if len(a) < 2 or a[0] not in ("encode", "check"):
        print(__doc__); sys.exit(1)
    opt = {"--rate": 8000, "--seconds": 30, "--start": 0}
    pos = [x for x in a[1:] if not x.startswith("--")]
    flags = a[1:]
    for i, x in enumerate(flags):
        if x in opt:
            opt[x] = int(flags[i + 1]); pos = [p for p in pos if p != flags[i + 1]]
    rate, seconds, start = opt["--rate"], opt["--seconds"], opt["--start"]
    s = pcm(pos[0], rate, seconds, start)
    data = encode(s)
    if a[0] == "encode":
        with open(pos[1], "wb") as f:
            f.write(struct.pack("<I", rate) + data)
        print(f"OK {pos[1]} {len(s) / rate:.1f}s {len(data) + 4} bytes rate={rate}")
        return
    d = decode(data)
    db = snr(s, d)
    with wave.open("check.wav", "wb") as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(rate)
        w.writeframes(struct.pack("<%dh" % len(d), *d))
    print(f"{'OK' if db > 15 else 'FAIL'} snr={db:.1f} dB samples={len(s)} bytes={len(data)} -> check.wav (listen to it)")
    sys.exit(0 if db > 15 else 1)


if __name__ == "__main__":
    main()
