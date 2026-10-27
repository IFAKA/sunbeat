# Buy list (checked 2026-10-27)

Prices are ex VAT. Spain adds 21% VAT. USD converted at about 0.92. "not read" means I did not get the page number: I do not guess stock. Mouser, Farnell Spain, Newark and Amazon.es pages did not load for me (time-out or error), so stock there is marked NOT verified. DigiKey Spain: free shipping from EUR 75, otherwise EUR 25. Not priced anywhere: circuit board (PCB), case, clip, button cap.

## Step 3: desk test (you own the Pico 2 WH)

All Amazon.es links come from search results only. I could not open the pages, so stock and price are NOT verified. Check the page before you pay.

| Part | What it does | Exact part / listing | Qty | Shop | Price seen | Stock seen | URL | Lifecycle |
|---|---|---|---|---|---|---|---|---|
| Breadboard 400 points + jumpers (male-male) | Holes to plug parts in, wires | HUAREW kit B0B5TCKTQH (2 x 830 + 2 x 400 point boards, M-M, M-F, F-F wires) | 1 | Amazon.es | EUR 14.99 (search snippet) | NOT verified | https://www.amazon.es/HUAREW-Protoboard-incluye-conexi%C3%B3n-Breadboard/dp/B0B5TCKTQH | Current listing |
| Cheaper option: board only | 400-point board | Spacnana B0C39DWPQX | 1 | Amazon.es | EUR 5.91 (snippet) | NOT verified | https://www.amazon.es/Protoboard-Breadboard-Reutilizable-Electr%C3%B3nico-Computadoras/dp/B0C39DWPQX | Current listing |
| Jumper wires only (if you buy the board only) | 4 wires needed | ELEGOO 120 wires B01NGTXASZ (40 male-male) | 1 | Amazon.es | not shown | NOT verified | https://www.amazon.es/Macho-Hembra-Macho-Macho-Hembra-Hembra-Prototipo-Protoboard/dp/B01NGTXASZ | Current listing |
| Resistor 4.7 kOhm and capacitor 1 uF | Sound parts | ELEGOO component kit B01MRIG6YM (has a 400-point board, 65 jumpers, resistors, ceramic capacitors; 4.7k and 1 uF values NOT verified) | 1 | Amazon.es | not shown | NOT verified | https://www.amazon.es/-/pt/Electr%C3%B3nicos-Resistencias-Condensadores-Potenci%C3%B3metro-Especificaciones/dp/B01MRIG6YM | Current listing |
| 3.5 mm 4-pole jack board (TRRS breakout) | Earbud socket on pins | Youmile 10 pcs B08SM46DWW, or ICQUANZX 5 pcs B088QXGQTH | 1 pack | Amazon.es | ICQUANZX EUR 5.99 (snippet) | NOT verified | https://www.amazon.es/Youmile-Module-Auriculares-Breakout-Arduino/dp/B08SM46DWW | Current listing |
| Micro-USB data cable | Power and code for the Pico | USB 2.0 A to micro-B 1 m B006WNCC9G (or any phone data cable you own) | 1 | Amazon.es | not shown (other 1 m cables from about EUR 5.90) | NOT verified | https://amazon.es/CABLE-USB-2-0-TIPO-MICRO/dp/B006WNCC9G | Current listing |

Warnings: the TRRS boards may come with loose header pins (soldering needed) and I do not know their pin order. Check the photos. No board with a ready 4-pin header was confirmed. The simplest basket is the HUAREW kit + one TRRS pack + resistor/capacitor kit or loose parts, about EUR 25 to 30 in total (estimate from snippets).

## Step 4 final device (table lists 1 solar cell and 1 coin cell; the changes for 2 follow it)

| Part | What it does | Exact part number | Qty to buy (spares) | Best shop for Spain | Unit price | Stock seen | URL | Lifecycle |
|---|---|---|---|---|---|---|---|---|
| Solar cell | Makes power from room light | Panasonic AMG-1401C | 2 (1 used +1 spare) | Farnell (AT page seen; Spain page not loaded) | EUR 8.63 | 1,177 (AT page, via search) | https://at.farnell.com/en-AT/panasonic/amg-1401c/solarzelle-35-4ua-41-4-x-26-1/dp/4531800 | Active |
| Coin cell | Stores energy | Jauch ML2032 (3 V, 65 mAh) | 2 (1 used +1) | DigiKey.es | EUR 1.45 | 2,000 | https://www.digikey.es/en/products/result?keywords=ML2032 | Active |
| Cell holder | Holds the coin cell on the board | Keystone 3034TR | 2 (1 used +1) | DigiKey.es | EUR 0.53 | 44,448 | https://www.digikey.es/en/products/result?keywords=3034TR | Active |
| Harvester chip | Charges the battery from the cell | e-peas AEM10941-QFN (Mouser 120-AEM10941-QFN) | 2 (1+1) | Mouser | about USD 4.50 | NOT verified (Mouser page did not load; price sites show stock) | https://www.mouser.es/c/?q=AEM10941 | Active (e-peas product) |
| Inductors L1, L2 | Coils for the harvester | TDK VLS252012CX-100M-1 | 4 (2+2) | DigiKey.es | EUR 0.31 cut tape | 10,668 | https://www.digikey.es/en/products/result?keywords=VLS252012CX-100M-1 | Active |
| C1 10 uF 10 V | Cell input buffer | Murata GXT188R61A106KE13D | 3 (1+2) | DigiKey.es | not read | not read | https://www.digikey.es/en/products/result?keywords=GXT188R61A106KE13D | Active (not re-checked) |
| C2 22 uF | Boost buffer | Samsung CL21A226MQQNNNE | 3 (1+2) | DigiKey.es | not read | not read | https://www.digikey.es/en/products/result?keywords=CL21A226MQQNNNE | Active (not re-checked) |
| C3, C4, C5 10 uF 6.3 V | Output buffers | Murata GRM188R60J106ME47D | 5 (3+2) | DigiKey.es | EUR 0.11 | 843,830 | https://www.digikey.es/en/products/result?keywords=GRM188R60J106ME47D | Active |
| R1, R4a 6.2 M | Battery limits | Yageo RC0402FR-076M2L | 4 (2+2) | DigiKey.es | not read (about 0.09) | not read | https://www.digikey.es/en/products/result?keywords=RC0402FR-076M2L | Active |
| R2 1.2 M | Battery limits | Vishay CRCW04021M20FKED | 3 (1+2) | DigiKey.es | EUR 0.09 | in stock (count not shown) | https://www.digikey.es/en/products/result?keywords=CRCW04021M20FKED | Active |
| R3 1.0 M | Battery limits | Yageo RC0402FR-071ML | 3 (1+2) | DigiKey.es | not read (about 0.09) | not read | https://www.digikey.es/en/products/result?keywords=RC0402FR-071ML | Active |
| R4b, R6 4.7 M | Battery limits, output | Yageo RC0402FR-074M7L | 4 (2+2) | DigiKey.es | not read (about 0.09) | not read | https://www.digikey.es/en/products/result?keywords=RC0402FR-074M7L | Active |
| R5 5.1 M | Output voltage | Yageo RC0402FR-075M1L | 3 (1+2) | DigiKey.es | not read (about 0.09) | not read | https://www.digikey.es/en/products/result?keywords=RC0402FR-075M1L | Active |
| R7 4.7 k | Sound resistor | Yageo RC0402FR-074K7L | 3 (1+2) | DigiKey.es | EUR 0.09 | 983,617 | https://www.digikey.es/en/products/result?keywords=RC0402FR-074K7L | Active |
| R8, R9 5.1 k | USB-C CC | Yageo RC0402FR-075K1L | 4 (2+2) | DigiKey.es | not read (about 0.09) | not read | https://www.digikey.es/en/products/result?keywords=RC0402FR-075K1L | Active |
| C6 1 uF | Sound capacitor | Samsung CL05A105KA5NQNC | 3 (1+2) | DigiKey.es | not read | not read | https://www.digikey.es/en/products/result?keywords=CL05A105KA5NQNC | Active (not re-checked) |
| C7 100 nF | USB chip power | Murata GRM155R61A104KA01D | 3 (1+2) | DigiKey.es | EUR 0.10 | 1,868,230 | https://www.digikey.es/en/products/result?keywords=GRM155R61A104KA01D | Active |
| Song memory (flash) | Stores your songs: 1 Gbit = 128 MB, WSON-8 6 x 8 mm, SPI | Winbond W25N01GVZEIG (needs 2.7 to 3.6 V: see warning below) | 2 (1+1) | LCSC (Spain shipping NOT checked) or DigiKey.es | LCSC about USD 7.25 to 11.35 (tiers, reel and tray pages); DigiKey.es EUR 13.77 | LCSC 3,820 to 4,740 (search snippets, not on the page itself); DigiKey.es not shown | https://www.lcsc.com/product-detail/C907680.html ; https://www.digikey.es/en/products/result?keywords=W25N01GVZEIG | No end-of-life notice found; NOT confirmed on a Winbond page |
| C8 100 nF | Song memory power | Murata GRM188R71C104KA01D (0603) | 3 (1+2) | DigiKey.es | not read (about 0.10) | not read | https://www.digikey.es/en/products/result?keywords=GRM188R71C104KA01D | Active (not re-checked) |
| Audio jack | Earbud socket | Same Sky SJ-43514-SMT-TR | 2 (1+1) | DigiKey.es | EUR 1.35 | 10,933 | https://www.digikey.es/en/products/result?keywords=SJ-43514-SMT-TR | Active |
| USB-C socket | Add songs from the laptop | GCT USB4105-GF-A | 2 (1+1) | DigiKey.es | EUR 0.71 | not shown | https://www.digikey.es/en/products/result?keywords=USB4105-GF-A | Active |
| Side button | REMOVED (the earbud button is the control) | Omron/Aratas B3U-3000P-B | 2 (1+1) | DigiKey.es | about EUR 0.55 (USD 0.60) | 18,109 (earlier search) | https://www.digikey.es/en/products/result?keywords=B3U-3000P-B | Active |
| USB chip | Laptop to Artemis serial | WCH CH340E (LCSC C99652) | 2 (1+1) | LCSC (Spain shipping NOT checked) | from USD 0.46 | 13,621 to 40,478 (two pages differ) | https://www.lcsc.com/product-detail/C99652.html | Active |
| Brain | Plays the sound | SparkFun WRL-15484 Artemis module | 1 | SparkFun (or DigiKey.es) | USD 9.95 | In stock (SparkFun page) | https://www.sparkfun.com/products/15484 | Active |

Parts total ex VAT (with spares, without PCB, case, shipping): about EUR 78 (includes the song memory at DigiKey.es price, 2 x EUR 13.77 = EUR 27.5; at LCSC prices about EUR 8 to 10 less; some small parts at an assumed EUR 0.05 to 0.15 each).

Suggested baskets (no single shop has everything):
1. DigiKey.es: all passives, C8, inductors, jack, USB-C, button, ML2032, holder (and the Artemis if you prefer it here). About EUR 23.4 ex VAT without the song memory (add EUR 27.5 if the flash is bought here too), about EUR 28 with VAT. Under EUR 75 you pay EUR 25 shipping, so add the PCB parts you need later.
2. Farnell: AMG-1401C (about EUR 17 for 2). Shipping to Spain NOT checked.
3. Mouser: AEM10941-QFN (about EUR 8 for 2). Shipping NOT checked. Mouser may also stock most of the DigiKey list, but I could not load it.
4. LCSC: CH340E (about EUR 1) and the song memory W25N01GVZEIG (about EUR 15 to 20 for 2). Shipping NOT checked. Alternative: any shop that sells CH340E in MSOP-10.
5. SparkFun: Artemis module (USD 9.95), if not bought at DigiKey.

## Step 4 final device: changes for 2 solar cells and 2 coin cells

Start from the table above, with these changes: AMG-1401C 3 pieces (2 used + 1 spare), ML2032 3 pieces, holder 3 pieces. The song memory and C8 rows are unchanged (2 flash chips, 3 caps). All other lines are the same.

Parts total ex VAT (with spares, without PCB, case, shipping): about EUR 88 (one-cell total plus EUR 10.5 for the second cell, holder and solar cell).

Basket: same shops as above. DigiKey.es part: about EUR 25 ex VAT. Add what is missing for the PCB order.

## Check of the parts (2026-10-27)

Done by web search and page loads. DigiKey and Farnell block scripts, so their own pages were not opened; numbers come from search results. Nothing was ordered, so "can buy" means "a shop lists it", not "I received it".

| Part | Result | Note |
|---|---|---|
| AMG-1401C solar cell | Exists, in stock (Farnell/element14 1,177; Newark 1,163) | Panasonic's own page gives a 404 now, so the link is the Farnell page. Spain shipping not checked. Newark lead time for more is 52 weeks. |
| AEM10941-QFN | Exists, in stock at Mouser (about 7,500 on the UK page) | DigiKey does not list it. |
| W25N01GVZEIG flash | Exists, LCSC shows about 1,300 in stock | Spain shipping not checked. |
| Artemis module WRL-15484 | SparkFun still sells it; Pimoroni dropped it, Amazon UK unavailable | Buy it at SparkFun. Live stock not confirmed. |
| ML2032 (Jauch) | Listed at DigiKey, but 22 weeks lead time and a notice that air shipping is not available | RISK. Maxell ML2032 is sold on eBay, Amazon and Console5 as a backup. Second source found: Farnell ML 2032 T26 (order code 3032012, about GBP 4.78, the UK page did not confirm stock) and batterijservice.nl (EUR 2.95, page about 2 years old). Check live stock before you order. |
| Keystone 3034TR holder | Exists, over 100,000 in stock on DigiKey sites | OK |
| SJ-43514-SMT-TR jack | Exists, about 8,000 to 13,000 in stock on DigiKey.com | OK |
| CH340E | Exists, LCSC shows 14,000 to 57,000 in stock (pages differ) | OK. Not at Mouser or DigiKey. |
| Resistors, capacitors, inductor, USB-C, button | Not checked one by one | Common parts. DigiKey search links are not verified. |

Shipping to Spain: Mouser.es is confirmed (prices include duty, free shipping over about EUR 75, per its own page). Farnell and LCSC Spain terms were not found. Check the cart before paying.

## Power check (datasheet numbers)

- AEM10941: solar input at most 5 V (5.5 V absolute max), cold start 380 mV. AMG-1401C: 2.7 V open circuit at 200 lux (2.3 V minimum), about 2.9 V at 1000 lux, estimated 3.6 to 4 V outdoors (the datasheet curve stops at 1000 lux). OK.
- Battery limits set by R1 to R6: full at 3.11 V (ML2032 charges at 2.8 to 3.2 V), empty at 2.30 V (chip needs 2.2 V or more), output about 1.92 V (allowed range 1.8 V to empty-limit minus 0.3 V). OK.
- Capacitors follow the datasheet: CSRC 10 uF, CBOOST 22 uF, CBUCK 10 uF, CHV and CLV 10 uF (allowed 8 to 14 uF). No CBATT needed with a battery.
- Power at 200 lux: 74.3 uW per cell, 148.6 uW for the two cells. The player needs about 500 uW while playing.

## Song memory warning (found while checking)

- W25N01GV runs on 2.7 to 3.6 V (LCSC page and search results). The harvester output that feeds the Artemis is about 1.92 V, and the battery is 2.3 to 3.1 V. So the song memory cannot just share the Artemis supply. Options: power it straight from the battery (2.3 V is below its 2.7 V minimum), add a small 3 V boost, or use the 1.8 V twin Winbond W25N01GWZEIG (1.7 to 1.95 V, same size, DigiKey.es EUR 14.43, showed OUT OF STOCK on 2026-10-27). Also the Artemis I/O is about 1.9 V, which is low for a 3 V chip. Not solved yet.
- Which Artemis pins carry SPI is not checked. The viewer uses 4 pads on the left edge as a guess.
- In the viewer the flash and its capacitor sit on the front (solar) side of the board, inside the 1.5 mm gap, because the back side is full. Outside size did not change.
