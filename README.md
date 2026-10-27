<div align="center">

<img src="docs/social.png" alt="Sunbeat: music that never needs charging" width="100%">

# Sunbeat

**Music that never needs charging.**<br>
A clip with a solar cell. Your own songs. Your own wired earbuds.

[**Website**](https://sunbeat-black.vercel.app) &nbsp;·&nbsp; [**3D model**](https://sunbeat-black.vercel.app/build) &nbsp;·&nbsp; [**Desk test**](#try-it-today) &nbsp;·&nbsp; [**Honest status**](#honest-status)

</div>

<br>

Sunbeat is an open **concept** for a tiny self-powered MP3 player. It started with one pain: *I hate remembering to charge things.* Light is the one strong energy source, so the whole front of the clip is an indoor solar cell. A coin cell is the savings account.

> **Not for sale. Not built yet.** Every hour below is an estimate until the chip power is measured (Step 3).

## How it works

1. **Add songs.** USB-C to a laptop; an app shrinks them to 4-bit ADPCM at 8 kHz (about 14 MB per hour).
2. **Clip it on.** Plug in any wired earbuds (3.5 mm).
3. **Play.** Use the button on your own earbud cable: 1 click play/pause, 2 next, 3 previous, hold = volume.
4. **Forget it.** Room light fills the battery. In the dark it plays about 490 hours (best case). When the battery is low it falls back to a chiptune version of your songs.

Sound comes from one pin (1-bit PWM) through a resistor and a capacitor. The earbud smooths the fast ON/OFF pulses into real sound, like SACD does.

## The numbers (design, not measured)

| | Sunbeat |
|---|---|
| Size | 44.4 × 55.2 × 11.2 mm |
| Solar cell | 21.6 cm², ~149 µW at 200 lux |
| Battery | 2 × ML2032, 390 mWh |
| Songs from room light | about 3 h/day |
| Song memory | 128 MB, about 9 h |
| Parts cost (ex VAT, no PCB or case) | ~88 € |

**Who it is for (a hypothesis, built from public numbers, not from interviews).** A person who listens to music a lot and is on the move: commute, trips, gym, errands. They do not want one more thing to charge. What the numbers say:
- People aged 16-64 listen to music about 20.7 h a week, about 3 h a day on average ([IFPI, Engaging with Music 2023](https://www.musicweek.com/labels/read/ifpi-engaging-with-music-2023-73-use-audio-streaming-services-tiktok-is-top-for-young-audiences/088976); 26 countries, 43,000 people; the daily figure is my division by 7, and it is a mean, not a median).
- The average commute in Spain is about 25 minutes one way ([Eurostat, 2019](https://ec.europa.eu/eurostat/statistics-explained/index.php?title=Main_place_of_work_and_commuting_time_-_statistics)), so a commute is under 1 h of music a day.
- We have not talked to buyers yet. Next step: interview people who travel a lot and listen more than 3 h a day.

**Travel and long days.** The 3 h/day is what room light pays for on average. It is not a limit. The battery is the buffer. Playing costs about 0.5 mW (design estimate, not measured), so 390 mWh is about 490 h of music with no light (best case). A 10 h day uses about 1.3% of it, and a 14-day trip at 10 h/day uses about 30%. After that the light refills it. If someone plays 10 h every single day, the battery drains and needs a USB-C charge after about 3 months. Light matters: indoor rooms are about 100-500 lux and outdoor shade is about 10,000 lux ([Epishine](https://www.epishine.com/news/the-importance-of-lux-understanding-indoor-light), [Good Light Group](https://www.goodlightgroup.org/post/how-many-lux-do-you-actually-need)). Clip the player outside a bag or jacket so it charges while you travel.

**Why not bone conduction.** Commercial bone conduction sets run 8-10 h on a 140-200 mAh battery ([Shokz OpenRun](https://shokz.com.au/products/openrun): 8 h, 160 mAh; [OpenRun Pro Mini](https://www.newegg.com/p/2SK-00F8-00008): 10 h, 140 mAh, 8.5 ohm). That is about 50-75 mW for the whole set, including Bluetooth (my calculation from battery size and hours; no teardown found). Our player is about 0.5 mW, so bone conduction would use roughly 100 times more power, and the solar cell could not keep up. We use normal earbuds.

Chosen from common parts sold in Spain (Panasonic AMG-1401C cell, Ambiq Apollo3 module, AEM10941 harvester, Winbond W25N01GV flash). See [the parts list](https://sunbeat-black.vercel.app/docs/bom).

## Try it today

You only need a Raspberry Pi Pico 2 WH.

- [`DESK-TEST.md`](DESK-TEST.md): flash MicroPython, run [`gestures.py`](gestures.py) (button test, no parts), then wire a resistor and capacitor to hear real songs with [`player.py`](player.py).
- `python3 -I build_songs.py IN_DIR OUT_DIR` makes the song files ([`build_songs.py`](build_songs.py), [`adpcm.py`](adpcm.py)).
- `python3 test_decoder.py` checks that the Pico decoder matches the Mac decoder.
- [`CELL-TEST.md`](CELL-TEST.md): buy and measure test solar cells.

## Honest status

| Part | Status |
|---|---|
| 3D model, parts list, prices | Done (stock in Spain partly unconfirmed) |
| Desk test code | Written, decoder checked on a Mac. **Not run on a Pico yet.** |
| Solar cell test | Plan written, cells not bought |
| Real power use | **Not measured** |
| Song memory power | Open: 2.7 V flash on a 1.9 V rail |
| Circuit board | Concept drawing only |
| Laptop app | Not built |

## Repo

- `site/`: the website (Next.js, deployed to Vercel). `site/public/viewer/` is the 3D model (three.js); `site/content/` holds the docs shown on the site.
- Root `.py` files: player, song converter, energy calculators and button experiments.
- `HANDOFF.md`, `PLAN.md`, `IDEAS.md`: the thinking so far.

MIT.
