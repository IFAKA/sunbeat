# Wearable self-powered MP3 — handoff

Goal: tiny player, wired earbuds, no phone, no screen, 1 button (gestures), ideally self-powered. Must work first, then optimize.
Owner: FAKA (codes with AI, no Python/PCB experience). Hardware on hand: Raspberry Pi Pico 2 W only, plus wired earbuds with 1 button.

## Findings so far
- Stage 0 (works now): DFPlayer Mini box + small battery.
- Custom player estimate: 6-18 mW normal; ~0.25 mW for extreme 1-bit + piezo/high-impedance drive (my estimate).
- Usage ~1.5 h/day -> a 0.25 mW player needs ~16 uW 24h average; a 10 mW player ~0.6 mW.
- Ambient RF (my calc): cable ~88 cm2 aperture at 900 MHz; needs ~1.8 V/m field for 16 uW. Typical city 0.1-1 V/m (unverified). RF alone likely falls short except near transmitters.
- Medium-wave ferrite rod claim: 1 mW into 1 kOhm up to 9 km (Dyo 2013, abstract only, unverified).
- Fallbacks: solar + motion + small buffer (BQ25570 PMIC).

## Files
- gestures.py: BOOTSEL button + LED, test 1-button gestures (no parts).
- wifi_survey.py: logs 2.4 GHz Wi-Fi power to log.csv (no parts; power bank for walking).
- beep1bit.py: 1-bit melody on GP15 through >=4.7k series resistor (never direct to earbud).

## Next steps
1. Flash MicroPython (Pico 2 W uf2), run gestures.py, tune click timing.
2. Wi-Fi survey at home, then on commute with power bank.
3. Buy ~5 EUR: 4.7k resistor, 3.5 mm jack breakout, breadboard; run beep1bit.py.
4. RF test: Schottky rectenna + BQ25570 EVM + supercap; Pico ADC logs voltage. Pass >=16 uW avg; partial 3-16; fail <3.
5. Store 1-bit/ADPCM audio in the Pico's 4 MB flash and build the real player.
