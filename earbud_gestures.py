#!/usr/bin/env python3
"""Earbud button gestures on the Mac: single / double / long, read from the mic line.

Needs: ffmpeg. No other packages. Wear the earbuds (you hear a beep as the GO sound).
  python3 earbud_gestures.py train 10   # teach it: 10 tries of each gesture
  python3 earbud_gestures.py test 20    # check it: 20 random tries, shows your score
  python3 earbud_gestures.py file X.wav [IDLE.wav]   # numbers for one recording
Add --debug to see the numbers after each try. Press Ctrl+C to stop any time.

How it works: a button press changes the signal on the mic line. We cut the
recording into 10 ms windows and compare each to the quiet level. Big jumps that
last ~0.3 s = single, ~0.5 s = double. A steady raised level for 0.8 s or more = long.
The single/double limit is learned from your training tries.
"""
import array, json, math, os, random, statistics, subprocess, sys, time

RATE, WIN = 48000, 480            # 10 ms windows
DEVICE = ":External Microphone"
TRIALS = os.path.join(os.path.dirname(os.path.abspath(__file__)), "earbud_trials.json")
GESTURES = ["single", "double", "long"]
HOW = {
    "single": "ONE quick click (press and let go fast)",
    "double": "TWO quick clicks, one right after the other",
    "long": "PRESS AND HOLD for about 1.5 seconds, then let go",
}
DEBUG = "--debug" in sys.argv
ARGS = [a for a in sys.argv[1:] if a != "--debug"]


def levels(pcm):
    s = array.array("h")
    s.frombytes(pcm[: len(pcm) // 2 * 2])
    out = []
    for i in range(0, len(s) - WIN, WIN):
        ms = sum(x * x for x in s[i : i + WIN]) / WIN
        out.append(10 * math.log10(ms / 32768**2) if ms > 0 else -120.0)
    return out


def features(lv, base):
    """dur: first to last big change (s); shift: longest steady raised level (s)."""
    dev = [x - base for x in lv]
    idx = [i for i, d in enumerate(dev) if abs(d) > 12]
    dur = (idx[-1] - idx[0] + 1) * WIN / RATE if idx else 0.0
    run = best = 0
    for i in range(len(dev) - 4):
        run = run + 1 if sum(dev[i : i + 5]) / 5 > 4 else 0
        best = max(best, run)
    return {"dur": round(dur, 2), "shift": round(best * WIN / RATE, 2)}


def record(seconds: float = 3):
    cmd = ["ffmpeg", "-loglevel", "error", "-f", "avfoundation", "-i", DEVICE,
           "-t", str(seconds), "-ar", str(RATE), "-ac", "1", "-f", "s16le", "-"]
    return subprocess.run(cmd, capture_output=True, check=True).stdout


def read_file(path):
    cmd = ["ffmpeg", "-loglevel", "error", "-i", path, "-ar", str(RATE), "-ac", "1", "-f", "s16le", "-"]
    return subprocess.run(cmd, capture_output=True, check=True).stdout


BEEP = "/tmp/earbud_beep.wav"


def beep():
    """Short beep in the earbuds. Does not wait."""
    if not os.path.exists(BEEP):
        subprocess.run(["ffmpeg", "-loglevel", "error", "-f", "lavfi", "-i", "sine=frequency=880:duration=0.15", BEEP])
    subprocess.Popen(["afplay", BEEP])


def capture_try(on_go):
    """One continuous recording. Quiet level is measured at 0.3-0.9 s, GO (screen + beep) at 1.2 s,
    and only audio from 1.4 s on is checked for the gesture (so the beep and the start-up are ignored)."""
    cmd = ["ffmpeg", "-loglevel", "error", "-f", "avfoundation", "-i", DEVICE,
           "-t", "4.2", "-ar", str(RATE), "-ac", "1", "-f", "s16le", "-"]
    proc = subprocess.Popen(cmd, stdout=subprocess.PIPE)
    first = proc.stdout.read(2)               # waits until the mic is really recording
    t0 = time.time()
    time.sleep(max(0.0, 1.2 - (time.time() - t0)))
    on_go()
    beep()
    pcm = first + proc.stdout.read()
    proc.wait()
    lv = levels(pcm)
    return features(lv[140:], statistics.median(lv[30:90]))


def trial(gesture, label):
    """One try with a countdown. Returns the measured features."""
    print(f"\n=== {label} ===")
    print(f"Do: {gesture.upper()} = {HOW[gesture]}")
    print("Hold still. Do it right after the BEEP. You have 3 seconds.")
    for n in (3, 2, 1):
        print(f"  {n}...", flush=True)
        time.sleep(1)
    f = capture_try(lambda: print("  GO!", flush=True))
    if DEBUG:
        print("  numbers:", f)
    return f


def thresholds(data):
    single = statistics.mean(f["dur"] for f in data["single"])
    double = statistics.mean(f["dur"] for f in data["double"])
    return [(single + double) / 2]


def classify(f, th):
    if f["shift"] >= 0.8:
        return "long"
    if f["dur"] == 0:
        return "none"
    return "single" if f["dur"] < th[0] else "double"


def train(n):
    data = {g: [] for g in GESTURES}
    order = GESTURES * n
    random.shuffle(order)
    total, done = len(order), 0
    print(f"Training: {total} tries, about {total * 6 // 60 + 1} minutes. I will say what to do each time.")
    try:
        for g in order:
            for _ in range(3):
                f = trial(g, f"Try {done + 1} of {total}")
                if f["dur"] > 0 or f["shift"] > 0:
                    break
                print("I heard nothing. Check the earbud is plugged in. Trying again.")
            else:
                print("Still nothing after 3 attempts. Stopping."); break
            data[g].append(f)
            done += 1
            print(f"Saved. ({done} of {total} done)")
    except KeyboardInterrupt:
        print("\nStopped. Keeping the tries done so far.")
    if all(data[g] for g in ("single", "double")):
        json.dump(data, open(TRIALS, "w"), indent=1)
        th = thresholds(data)
        print(f"\nDone. Saved {done} tries to {TRIALS}.")
        print(f"A click shorter than {th[0]:.2f} s counts as single, longer as double.")
        print("Next: run  python3 earbud_gestures.py test 20")
    else:
        print("Not enough single and double tries to learn from. Nothing saved.")


def test(n):
    if not os.path.exists(TRIALS):
        sys.exit("No training yet. Run first:  python3 earbud_gestures.py train 10")
    th = thresholds(json.load(open(TRIALS)))
    right, mistakes, done = 0, {}, 0
    print(f"Test: {n} tries in random order. I will not tell you if you are right until I hear it.")
    try:
        for i in range(n):
            g = random.choice(GESTURES)
            got = classify(trial(g, f"Try {i + 1} of {n}"), th)
            done += 1
            if got == g:
                right += 1
                print(f"  I heard: {got.upper()}.  You asked: {g.upper()}.  RIGHT")
            else:
                mistakes[(g, got)] = mistakes.get((g, got), 0) + 1
                print(f"  I heard: {got.upper()}.  You asked: {g.upper()}.  WRONG")
    except KeyboardInterrupt:
        print("\nStopped early.")
    if done:
        print(f"\nResult: {right} of {done} right ({100 * right // done}%). Your plan wants 95% or more.")
        for (asked, got), c in sorted(mistakes.items(), key=lambda kv: -kv[1]):
            heard = "nothing" if got == "none" else got
            print(f"  {c}x you did {asked}, I heard {heard}")
        if right == done:
            print("No mistakes.")


def main():
    cmd = ARGS[0] if ARGS else ""
    n = int(ARGS[1]) if len(ARGS) > 1 else None
    if cmd == "file":
        lv = levels(read_file(ARGS[1]))
        idle = levels(read_file(ARGS[2])) if len(ARGS) > 2 else lv[:50]
        print(features(lv, statistics.median(idle)))
    elif cmd == "train":
        train(n or 10)
    elif cmd == "test":
        test(n or 20)
    else:
        sys.exit(__doc__)


if __name__ == "__main__":
    main()
