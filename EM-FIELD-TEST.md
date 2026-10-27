# EM field test: notes (2026-10-25)

Goal: find out how much energy is around us for the self-powered MP3 wearable, without buying an expensive meter.

## Main answers

- **Phone:** the magnetometer (Phyphox / Physics Toolbox apps) sees slow magnetic fields, like 50/60 Hz hum near cables. It cannot see radio waves (FM, TV, 433 MHz, cell). Phone signal apps only show the phone's own cell/Wi-Fi/Bluetooth.
- **Alfa AWUS036ACS:** Wi-Fi only (2.4/5 GHz). Not useful for non-Wi-Fi tests.
- **Cheap radio tools (if needed later):** RTL-SDR (~30-40 EUR, 24 MHz-1.7 GHz, relative levels), tinySA (~60-130 EUR, real dBm up to 6 GHz). Used RTL-SDR can be ~15 EUR.
- **We can't measure the field directly, but we can measure the energy a harvester collects.** That is the number that matters. Like putting a bucket in the rain.

## Harvest test (planned, not done yet)

Circuit: coil/antenna -> diode -> capacitor -> back to coil. Multimeter across the capacitor. No soldering needed: twist wires, alligator clips, or a breadboard.

- Diode = one-way door (turns back-and-forth signal into one-way flow).
- Capacitor = bucket (saves the energy so you can read it).
- Use a **Schottky or germanium diode** (BAT43, 1N5711, 1N34A). Ordinary 1N4148 needs too much voltage for a tiny signal.

Formulas:
- Energy: `E = 1/2 * C * V^2`
- Average power: `P = E / t`
- Example: C = 100 uF, V = 0.5 V after 60 s -> E = 12.5 uJ, P ~ 0.2 uW. An MP3 player needs ~10-50 mW (about 50,000x more). Ambient radio alone will not power it. Motion, light or heat sources are needed.

## Earbud magnetic sensor test (DONE)

Wired earbuds plug into the MacBook jack and show up as "External Microphone". The coil in the earbud senses low-frequency magnetic fields (up to ~20 kHz). It does not see radio.

Method: record 5 s with ffmpeg, measure level in narrow bands.

```sh
ffmpeg -loglevel error -y -f avfoundation -i ":External Microphone" -t 5 -ar 48000 -ac 1 X.wav
# band level (script saved at /tmp/band.sh, may be gone; recreate):
ffmpeg -hide_banner -i X.wav -af "bandpass=f=50:width_type=h:w=4,astats" -f null - 2>&1 | grep "RMS level dB" | tail -1
```

Setup that worked: laptop on battery (charger unplugged), earbud on the bed far from cables, then earbud on a plugged-in phone charger brick.

Results:

| Case | 50 Hz | 60 Hz |
|---|---|---|
| Laptop charger plugged in (bad baseline) | -40 dB | -40 dB |
| A: far from charger, laptop on battery | -73, -75 dB | -75, -76 dB |
| B: on phone charger brick | -61, -60 dB | -61, -61 dB |

- B is about 14 dB above A, repeated twice, within 1-2 dB each time. The earbud works as a simple magnetic sensor.
- Mistake caught: my first baseline was bad because the laptop charger was plugged in near the earbud.
- Not proven: exact mains frequency. 50 and 60 Hz rise equally, so the signal may be wide-band noise, not a clean mains peak. Number of recordings is small.
- Which earbud feeds the input is unknown (tested left earbud only).

## Shopping list (about 8-12 EUR, rough)

| Part | Spec | Qty |
|---|---|---|
| Diodes | Schottky BAT43 / 1N5711, or germanium 1N34A | 5 |
| Capacitors | 10 uF and 100 uF, >= 10 V | 2 of each |
| Breadboard | small, 400 holes | 1 |
| Jumper wires | male-to-male pack | 1 |
| Alligator clip cables | pack of 10 | 1 |
| Magnet wire | enameled, 0.2-0.3 mm, 10-20 m | 1 |
| Multimeter | any cheap one (borrow if possible) | 1 |

Tip: an electronics starter kit is often ~10 EUR. Check it has Schottky/germanium diodes. Order from one shop to pay shipping once. Diodes and capacitors can also be salvaged from old chargers or radios.

## Next steps

1. Get the parts.
2. Make a coil (a few turns of magnet wire) and build the harvest circuit.
3. Measure capacitor voltage near a charger, in other places, and at different times.
4. Compute power with `P = E / t` and compare with the MP3 player need.
5. Optional: find the exact hum frequency; try the right earbud and both earbuds.

## Earbud button gestures (built, not yet run live)

- Button test (2026-10-25): single click, double click and long press are all visible in the Mac mic recording. Single ~0.25 s, double ~0.4 s, long = steady raised level ~3.9 s.
- Run the big-screen test: double-click `earbud_gestures.command` (or `python3 earbud_ui.py`). Press the blue TEACH button (30 tries), then the green TEST button (20 tries). Goal from PLAN.md: 95% right.
- Text-only version: `python3 earbud_gestures.py train 10` / `test 20`.
- Risk: single vs double are close in length; if the score is low, tune the limit.

## Gesture practice results (earbud_ui.py, live)

- Run 1: 17/21 (80%): double/long mixed up (judged by total time).
- Fix: long = line held down >= 0.45 s ("gated run"); single/double by length (single ~0.15-0.23 s, double ~0.30-0.37 s).
- Run 2: 19/21 (90%). Singles 7/7, long 6/7, double 6/7. Misses: a hold released after 0.27 s (looked like a click) and a double where only one click showed up (0.16 s).
- Logs: /tmp/earbud_live.csv (every 10 ms), /tmp/earbud_attempts.csv (asked, heard, lengths). Goal 95%.
- Run 3: 19/21 (90%). Misses: a double where only one click showed up (0.28 s, gated 8) and a hold released at 0.44 s (gated 44, limit was 45).
- Change: LONG_RUN 45 -> 40. Real holds gated 44-59 (full holds 173-186); clicks and doubles gated 7-30 (34 seen once). Run 4 will show if this helps.
- Run 4 (LONG_RUN 40): 20/21 (95%), goal reached. One miss: a hold heard as single (released too early).
