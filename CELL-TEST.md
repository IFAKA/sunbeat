# Solar cell test plan

Goal: find a solar cell with more than one seller that gives close to the Panasonic AMG-1401C
(datasheet: 74.3 uW at 200 lux, 41.4 x 26.1 mm = 10.8 cm2 = 6.9 uW per cm2).

## Buy (about 30-40 EUR total)
| What | Why | Where | Notes |
|---|---|---|---|
| Panasonic AMG-1401C x1 | the reference | Farnell Spain (es.farnell.com), order code 4531800 | about 8.6 EUR ex VAT; Spain stock not confirmed (only the Austria page was seen) |
| 3 generic indoor amorphous cells | the cheap second source | AliExpress / es.aliexpress.com | search "amorphous silicon solar cell indoor 3V" and "dim light solar cell"; pick one 3 V, one 3.3 V, one 2 V; choose listings that say "200 lux" and have wires or solder pads |
| PowerFilm INP3.6-24x44T x1 (optional) | second source with a datasheet (31 uW at 200 lux) | DigiKey.es or Mouser.es | flexible, 24 x 44 mm |
| Multimeter with a uA range | measure current | Amazon.es "multimetro digital" | about 10-15 EUR, skip if you have one |
| 1 Mohm trimmer (potentiometer) or a few resistors: 22k 47k 100k 220k 470k | the "load" | Amazon.es resistor kit | the trimmer is easier |
| Alligator clip leads | hold bare cells | Amazon.es | cheap; bare glass cells are hard to solder |
| Lux meter (optional) | know the light level | Amazon.es "luxometro" | about 10-15 EUR. Without it, compare to the Panasonic in the same spot |

## Measure (same spot, same angle, cell flat, no shadow)
1. **Voltage, no load:** multimeter on volts across the cell. Write it down (Voc).
2. **Load test:** connect the trimmer across the cell and read the volts across it.
   Turn it until volts x volts / resistance is highest.
   - Power in uW = V x V / R, with R in Mohm.
   - Tiny example: 2.0 V across 0.056 Mohm = 4 / 0.056 = 71 uW.
   - Quick way: try each resistor, keep the best.
3. **Power per cm2** = power / cell area (length x width in cm).
4. Do it in 3 places: your room (lamp on), next to a window, outside in shade.
5. Write the table:

| Cell | Area cm2 | Place | Volts | R (Mohm) | uW | uW per cm2 |
|---|---|---|---|---|---|---|

## Decide
- Use a generic cell if it gives at least 70% of the Panasonic's uW per cm2 in the same spot
  (so about 5 uW per cm2 at room light), and the numbers stay the same after 2 weeks.
- A listing that says "3 V 19.8 uA on 66 x 37 mm" is about 59 uW on 24 cm2 = 2.4 uW per cm2.
  If that is at 200 lux, it is about 3x worse per cm2 and would need 3x the area. Measure to see.
- Design rule for the board: two pads for the cell, so any 2-3.6 V cell fits.
