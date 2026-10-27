# Desk test: your real songs on the Pico

Files: `player.py` (runs on the Pico), `build_songs.py` + `adpcm.py` (run on the Mac), `gestures.py` (button test).
Checked on the Mac: the Pico decoder gives the same samples as the Mac decoder; the song builder works.
NOT checked yet (needs the Pico and parts): real sound, button reading while playing.

## A. Today, with only the Pico (no parts)
1. Put MicroPython on the Pico 2 W: hold BOOTSEL, plug in USB, a drive opens, drag the `.uf2` from
   https://micropython.org/download/RPI_PICO2_W/ (choose a build dated after 2025-03-13) onto it.
2. Install Thonny (thonny.org). Bottom right: choose "MicroPython (Raspberry Pi Pico)".
3. Open `gestures.py` in Thonny, press Run. Click the BOOTSEL button 1, 2, 3 times, and hold it.
   The text window should show GESTURE 1 / 2 / 3 / long. This tests your button timing.

## B. When the parts arrive
1. Wire (see the viewer, "how to wire it"): GP15 -> 4.7k resistor -> 1 uF capacitor -> jack tip and ring 1;
   jack ground -> Pico GND. Never connect GP15 straight to the earbud.
2. Make your songs on the Mac (put 2-4 of your songs in a folder, for example ~/songs-in):
   `python3 -I build_songs.py ~/songs-in songs`
   It writes a `songs/` folder (8 kHz, about 10 minutes in total) and `songs/index.txt`.
3. In Thonny: View > Files. Upload the whole `songs` folder to the Pico. Upload `player.py` too.
4. Put the earbuds in at the LOWEST volume you can hear, then run `player.py`.
5. Buttons (BOOTSEL): 1 click play/pause, 2 clicks next, 3 clicks previous, long press = volume.
   To start by itself at power-up: save `player.py` on the Pico as `main.py`.

## If something is wrong
- No sound: check the capacitor and the jack wires. Run `songs/index.txt` check: the folder must be called `songs`.
- Crackles when you press the button: tell me. The button read may pause the sound for a moment.
- Too quiet or too loud: long press cycles 1/4, 1/2, full. The resistor value also sets the loudness.
