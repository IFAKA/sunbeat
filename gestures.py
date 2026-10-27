# Test 1-button gestures on a Pico 2 W (MicroPython, no extra parts).
# Button = BOOTSEL (rp2.bootsel_button()). Feedback = onboard LED ("LED").
# Needs MicroPython built after 2025-03-13 (older RP2350 builds always read 1).
# Poll from the main loop only; never call bootsel_button() from an interrupt or from code on core 1.
#
# Gestures: 1 click = "play/pause", 2 clicks = "next", 3 clicks = "share", long press (>=0.8 s) = "volume".
# LED blinks once per click as you press; after the gesture is decided it blinks the gesture number
# (1, 2, 3 blinks; long = one long blink) and prints the name.
import time
import rp2
from machine import Pin

led = Pin("LED", Pin.OUT)

POLL_MS = 20       # how often we read the button
LONG_MS = 800      # press at least this long = long press
GAP_MS = 350       # silence after the last release = gesture is finished
NAMES = {1: "play/pause", 2: "next", 3: "share"}


def blink(n, on=80, off=120):
    for _ in range(n):
        led.on(); time.sleep_ms(on)
        led.off(); time.sleep_ms(off)


def read_gesture():
    """Block until a full gesture is read. Returns ('click', n) or ('long', 0)."""
    clicks = 0
    while not rp2.bootsel_button():
        time.sleep_ms(POLL_MS)
    while True:
        t0 = time.ticks_ms()
        while rp2.bootsel_button():
            time.sleep_ms(POLL_MS)
        held = time.ticks_diff(time.ticks_ms(), t0)
        if held >= LONG_MS and clicks == 0:
            return ("long", 0)
        clicks += 1
        t1 = time.ticks_ms()
        while not rp2.bootsel_button():
            if time.ticks_diff(time.ticks_ms(), t1) > GAP_MS:
                return ("click", clicks)
            time.sleep_ms(POLL_MS)


print("gestures ready: 1/2/3 clicks or long press on BOOTSEL")
while True:
    kind, n = read_gesture()
    if kind == "long":
        print("GESTURE long (volume)")
        led.on(); time.sleep_ms(700); led.off()
    else:
        print("GESTURE", n, NAMES.get(n, "unknown"))
        blink(n)
