# Pico MicroPython player v1: plays every song in songs/ (made by build_songs.py) on GP15, through a >=4.7k series
# resistor and a 1 uF capacitor to the earbud. Never connect GP15 straight to the earbud.
# Button = BOOTSEL.  1 click = play/pause, 2 clicks = next, 3 clicks = previous, long press = volume (1/4, 1/2, full).
# Needs MicroPython built after 2025-03-13 (older RP2350 builds always read the button as pressed).
# UNTESTED on a real Pico until you flash it. Copy player.py as main.py (or run it from Thonny) and the songs/ folder.
import os
import time
from array import array

import micropython
import rp2
from machine import PWM, Pin, Timer

PIN = 15
DIR = "songs"
N = 2048  # samples per buffer (decoded 8-bit)
POLL_MS = 5
LONG_MS = 800
GAP_MS = 350

STEP = array("H", [7, 8, 9, 10, 11, 12, 13, 14, 16, 17, 19, 21, 23, 25, 28, 31, 34, 37, 41, 45, 50, 55, 60, 66, 73, 80,
    88, 97, 107, 118, 130, 143, 157, 173, 190, 209, 230, 253, 279, 307, 337, 371, 408, 449, 494, 544, 598, 658, 724,
    796, 876, 963, 1060, 1166, 1282, 1411, 1552, 1707, 1878, 2066, 2272, 2499, 2749, 3024, 3327, 3660, 4026, 4428,
    4871, 5358, 5894, 6484, 7132, 7845, 8630, 9493, 10442, 11487, 12635, 13899, 15289, 16818, 18500, 20350, 22385,
    24623, 27086, 29794, 32767])
DELTA = bytes([0, 0, 0, 0, 3, 5, 7, 9])  # index change + 1 (viper reads unsigned)
VOLS = (1, 2, 4)  # quarter, half, full


@micropython.viper
def dec(src: ptr8, nb: int, dst: ptr8, st: ptr32, step: ptr16, delta: ptr8) -> int:
    pred = int(st[0])
    idx = int(st[1])
    o = 0
    for i in range(nb):
        b = int(src[i])
        for h in range(2):
            n = (b >> (4 * h)) & 15
            s = int(step[idx])
            d = s >> 3
            if n & 4:
                d += s
            if n & 2:
                d += s >> 1
            if n & 1:
                d += s >> 2
            if n & 8:
                pred -= d
            else:
                pred += d
            if pred > 32767:
                pred = 32767
            if pred < -32768:
                pred = -32768
            idx += int(delta[n & 7]) - 1
            if idx < 0:
                idx = 0
            if idx > 88:
                idx = 88
            dst[o] = (pred >> 8) + 128
            o += 1
    st[0] = pred
    st[1] = idx
    return o


try:
    songs = sorted(n for n in os.listdir(DIR) if n.endswith(".adpcm"))
except OSError:
    songs = []
if not songs:
    raise SystemExit("no songs: copy the songs/ folder (from build_songs.py) to the Pico")

raw = bytearray(N // 2)
bufs = (bytearray(N), bytearray(N))
dst = array("i", [0, 0])  # decoder state: predictor, index
play = array("I", [0, 0, 0, 0, 2])  # position, active buffer, "needs refill", paused, volume (index into VOLS)
vol = array("I", [VOLS[2]])  # volume multiplier read by the timer
f = None
done = False
cur = 0

pwm = PWM(Pin(PIN))
pwm.freq(62500)
pwm.duty_u16(32768)


def fill(which):
    """Decode the next chunk into bufs[which]; silence after the end of the song."""
    global done
    n = f.readinto(raw)
    if not n:
        done = True
        for j in range(N):
            bufs[which][j] = 128
        return
    o = dec(raw, n, bufs[which], dst, STEP, DELTA)
    for j in range(o, N):  # a short last chunk: pad with silence
        bufs[which][j] = 128


def tick(t):
    if play[3]:
        pwm.duty_u16(32768)
        return
    p = play[0]
    pwm.duty_u16(32768 + (((bufs[play[1]][p] - 128) * vol[0]) << 6))
    p += 1
    if p >= N:
        p = 0
        play[1] ^= 1
        play[2] = 1
    play[0] = p


tim = Timer()


def open_song(i):
    global f, done, cur
    if f:
        f.close()
    cur = i % len(songs)
    f = open(DIR + "/" + songs[cur], "rb")
    rate = int.from_bytes(f.read(4), "little")
    dst[0] = 0
    dst[1] = 0
    done = False
    tim.deinit()
    play[0] = 0
    play[1] = 0
    play[2] = 0
    fill(0)
    fill(1)
    tim.init(freq=rate, mode=Timer.PERIODIC, callback=tick)
    print("song", cur + 1, "/", len(songs), songs[cur], "rate", rate)


g = array("I", [0, 0, 0])  # button state: is down, press start time, clicks


def poll():
    """Non-blocking button reader. Returns 0 (nothing yet), 1/2/3 (clicks) or -1 (long press)."""
    now = time.ticks_ms()
    b = rp2.bootsel_button()
    if b and not g[0]:
        g[0] = 1
        g[1] = now
    elif not b and g[0]:
        g[0] = 0
        held = time.ticks_diff(now, g[1])
        if held >= LONG_MS and g[2] == 0:
            return -1
        g[2] += 1
        g[1] = now
    elif not b and g[2] and time.ticks_diff(now, g[1]) > GAP_MS:
        n = g[2]
        g[2] = 0
        return n
    return 0


open_song(0)
tail = 0
try:
    while True:
        if play[2]:
            play[2] = 0
            if done:
                tail += 1
                if tail >= 2:  # both buffers are silence now: song over
                    tail = 0
                    open_song(cur + 1)
                    continue
            fill(play[1] ^ 1)  # refill the buffer that just finished
        c = poll()
        if c == 1:
            play[3] ^= 1
            print("pause" if play[3] else "play")
        elif c == 2:
            tail = 0
            open_song(cur + 1)
        elif c == 3:
            tail = 0
            open_song(cur - 1)
        elif c == -1:
            play[4] = (play[4] + 1) % len(VOLS)
            vol[0] = VOLS[play[4]]
            print("volume", vol[0], "/ 4")
        time.sleep_ms(POLL_MS)
finally:
    tim.deinit()
    pwm.duty_u16(0)
    if f:
        f.close()
