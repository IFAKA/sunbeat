# Self-charging wearable MP3 player: plan

Goal: a custom-PCB, clip-on music player (iPod-nano style, visible on the outer layer). Wired earbuds, 1 button (gestures), no phone, no screen. It charges its own battery from light (solar face) and any other free energy. Lowest possible power. First make it work, then optimize.

Use: ~1.5-3 h/day (chores, errands, gym), never at work. Idle at night; sits in window light when not worn. City: Spain.

The Pico 2 W is a lab tool for Phase 1. It is not the final chip: its board draws ~1 mA (~3 mW) even asleep.

Legend: M measured, D datasheet, E estimate. Nothing below is measured by us yet unless marked.

## Why light, why low power (research summary)
- Harvest, 24 h average (E): sun on a few cm2 cell 30-150 uW; motion 6-20 uW; indoor light 3-90 uW (depends on hours and area); body heat ~1 uW; sweat 0-20 uW; ambient radio 0.01-1 uW. Light is the only strong source.
- Our own measure (M): Wi-Fi at home, summed over 44 networks, = 0.23 uW at a laptop antenna. Harvester chips need ~14 uW (AEM30940, -18.5 dBm) or 15 uW + 600 mV (BQ25570) to start, so Wi-Fi alone cannot work. Radio only helps right next to a TV/AM tower.
- The player's draw matters more than the harvest. Target: 0.5 mW playing, <=10 uW asleep. 1.5 h/day = 2.7 J/day (+0.8 J idle). A 100 mAh LiPo holds ~1300 J = ~185 days without any harvest (E), and 20-100 uW of solar then makes it effectively endless. A bone-conduction transducer needs far more power (E), so we use normal earbuds.
- Nobody has published a battery-free or self-charging music player (research found only the battery-free Game Boy, solar speakers, solar headphones with big batteries).
- Floor for the audio chain (E): ADPCM from flash on a low-power MCU 0.05-0.5 mW; GPIO PWM + RC filter, no amp. MP3 decode costs 1-10 mW, so use ADPCM.

## Phase 1: make it work (Pico 2 W, not efficient)
Parts: 3.5 mm jack breakout, 4.7k resistor, breadboard (~5 EUR); LiPo 500-1000 mAh with protection (~5-8 EUR); small solar panel + solar LiPo charger board (~10-15 EUR). Prices unchecked.
1. Button: flash MicroPython (build after 2025-03-13, BOOTSEL fix), run gestures.py. Check: 20 tries each of single/double/long, >=95% right.
2. Sound: convert a song on the Mac to 1-bit/ADPCM, store in Pico flash (4 MB = ~8 min at 16 kHz 4-bit), play through the 4.7k resistor. Check: clear, listenable.
3. Player: play/pause and next by gesture. Check: all gestures work with music.
4. Battery: run from the LiPo. Check: plays for hours.
5. Charging: panel + charger, Pico logs battery voltage. Check: voltage rises in sunlight.
End of Phase 1: works end to end. It will drain faster than it charges; Phase 2 closes that gap.

## Phase 2: optimize, then the PCB
1. Measure Phase 1 power: playing mW, sleeping uW.
2. Same player on a low-power dev board (nRF52 class; Ambiq Apollo later if needed). Pass: play <= 1 mW (target 0.5), sleep <= 10 uW.
3. Better power chip (AEM10941) + indoor-light cell; ADPCM from external SPI flash (16 kHz 4-bit = 29 MB/hour).
4. Light log: a week on a windowsill, desk and worn outside; uW per day. Pass: net J/day >= 0 for your real days.
5. When the numbers close, design the custom PCB.

## Battery-free burst player (option 2; model only, all inputs E)
Design: 2.5 cm2 solar cell -> harvester chip (AEM10941 or BQ25570) -> 10-30 mF supercap -> nRF52-class MCU -> ADPCM clip -> GPIO PWM + RC -> earbud. Plays when the cap is full; no battery.
Run: `python3 -I burst_budget.py [--area --play-mw --clip-s]` (burst_budget.py).
- 30 s clip at 1 mW = 30 mJ -> cap >= 9 mF. 3 min at 0.5 mW = 90 mJ -> cap >= 26 mF.
- Outdoors (shade or sun) it plays non-stop. Window light: 3-9 min charge per 30 s clip. Dim room: about an hour.
- So it is a real battery-free player outdoors and a "short clips" player indoors. The same cell and cap also work as the battery's charger in the main plan.
- Gap: the 1 mW play power is a target (see Phase 2 step 2); the cell uW/cm2 values are typical, not measured. A cheap cell + one week of light log closes the second.

### Weekly model (daily_budget.py; your real week; all E)
Run: `python3 -I daily_budget.py [--office] [--area --play-mw --play-h --idle-uw --worn-factor]`. Edit the schedule lists inside.
Week: sleep 6 h dark; work 8 h at the desk; gym 1 h indoors; groceries 0.5 h outdoors; home by day (bright indirect light, ~750-1000 lux, lights off); evening lights on. Cell lies on the desk.
- Home desk, 2.5 cm2, 0.5 mW x 1.5 h/day, 10 uW idle: week net +12.5 J. Office desk (500 lux): +6.2 J. Both self-sustaining, small margin.
- At 1 mW: home -6.4 J, office -12.7 J. Not enough. A 5 mW chip is far off. So the player must stay near 0.5 mW.
- Daily harvest is 4.4-5.7 J on weekdays, 4.6 J on weekends. Most comes from the desk hours (1.3-2.5 J) and the 0.5 h outdoors (1.9 J).
- A day's play (2.7 J) waits from work time to evening: ~0.8 F supercap (leaks) or a tiny battery (0.2 mAh; use a thin-film or small LiPo for margin). A small battery is simpler.
- Gap: light levels are guesses (~0.05 uW/cm2 per lux). The light log (Phase 2 step 4) replaces them. Moving the cell to be larger (4-5 cm2) doubles the margin.

## Side experiments (not on the main path)
- Radio beeper: wire antenna, Schottky diode, 100 uF capacitor, voltage detector, piezo buzzer. Beep interval shows the harvested uW. Parts ~10-15 EUR.
- RTL-SDR dongle (~50 EUR on Amazon) only if the beeper shows voltage. Needs a city/location check for TV/FM towers.
- Sharing (later): both users do the share gesture, devices touching, radio off otherwise, audio files only, size limit. Wi-Fi on the Pico is far cheaper than Bluetooth for a file (1-3 J vs ~30 J per song, E); an nRF52 BLE link is probably cheaper (not checked).
- NFC tap on a phone as an emergency top-up (5-15 mW burst, E).
- Copy the battery-free Game Boy idea (play in bursts, save state) if we ever go battery-free.

## Open gaps (only real use can close)
- Real play and sleep power of the player.
- Outdoor minutes per day, cell position (jacket coverage), indoor light at home.
- Earbud sensitivity (model needed).
- Board prices and stock; STM32U5/ESP32-S3/bare RP2350 numbers unchecked; nRF/Apollo numbers single-source.
- BQ25570 cold start: 330 mV (old) vs 600 mV (new datasheet).

## Files
- gestures.py: BOOTSEL button gestures (untested until the Pico arrives).
- wifi_survey_mac.swift, harvest_calc.py: Mac Wi-Fi survey and harvest/beep calculator (tested).
- adpcm.py (Mac): song -> 4-bit ADPCM 8 kHz. `python3 -I adpcm.py check IN` gave 27 dB SNR on a real song (M); `encode IN song.adpcm`. Tested.
- player.py (Pico): plays song.adpcm on GP15 via 4.7k. Decoder math matches adpcm.py (M, on Mac). Not run on a Pico yet.
- v0 rule: smallest thing that plays; measure power after it works, then shrink (Phase 2).
