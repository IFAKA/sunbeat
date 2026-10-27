// parts.js - all part data for the viewer. Units: millimetres. Scene axes: x right, y UP, z toward the viewer.
// Every part: id, group, name, short (label), minor (small part), role (one simple sentence),
// size [x,y,z] (bounding box in scene axes), dimOrder (how to print the size), pos [x,y,z] (centre or origin),
// explode [dx,dy,dz], build {kind,...}, source (URL or "estimate" + note).
// To fix a size: change `size` (or the numbers in `build`). The 3D shape and the card both read from here.

export const P = 2.54; // breadboard / header pitch

// ---------------------------------------------------------------- STAGE 3: desk test
const ROWS = { a: -13.97, b: -11.43, c: -8.89, d: -6.35, e: -3.81, f: 3.81, g: 6.35, h: 8.89, i: 11.43, j: 13.97 };
export const hole = (col, row) => [(col - 14.5) * P, ROWS[row]]; // col 0..29, row 'a'..'j' -> [x,z]
export const BB = { w: 82.6, h: 8.5, d: 55, top: 8.5, rows: ROWS };

const PICO = { cx: -12.7, L: 51, W: 21, T: 1, bottom: BB.top + 2.54 }; // Pico sits on 2.54 mm header plastic
PICO.top = PICO.bottom + PICO.T;
PICO.cy = PICO.bottom + PICO.T / 2;
PICO.usbEnd = PICO.cx - PICO.L / 2; // x of the USB end of the board
const picoX = (fromUsb) => PICO.usbEnd + fromUsb; // x at a distance from the USB end

const SRC_PICO = 'https://datasheets.raspberrypi.com/picow/pico-2-w-datasheet.pdf';
const colX = (c) => hole(c, 'a')[0];

// jack breakout: header pins in row a, columns 25..28 (T, R1, R2, S)
const JACK_COL0 = 25;
const jackX = (colX(JACK_COL0) + colX(JACK_COL0 + 3)) / 2;
const JB = { w: 18.5, d: 14.8, pcb: 1.6, spacer: P };
const jbZc = ROWS.a + 1.27 - JB.d / 2; // pcb centre z (pins 1.27 from the board edge, body hangs off the far edge)
const jbPcbTop = BB.top + JB.spacer + JB.pcb;
const jackAxisY = jbPcbTop + 2.6;
const jackFrontZ = jbZc - JB.d / 2 + 0.2 - 1.0; // jack face, a little past the board edge


export const stage3 = {
  id: 3,
  title: 'Step 3: test on your desk',
  intro: 'This is what you plug together on a breadboard. No soldering. You only buy the breadboard, the jack board, 1 resistor, 1 capacitor and 4 jumper wires. The Pico holds about 8 minutes of song in its own 4 MB memory: enough to test real songs. No extra part needed.',
  groups: ['Pico (you have this)', 'Parts you buy', 'Cables'],
  camera: { pos: [38, 78, 108], target: [-2, 8, -2] },
  camExploded: { pos: [60, 120, 150], target: [-2, 26, -2] },
  grid: { y: -0.05, size: 160, step: 10 },
  parts: [
    {
      id: 'breadboard', group: 1, name: 'Half-size breadboard (400 points)', short: 'Breadboard',
      role: 'A board with small holes. You push parts into the holes and they connect, with no solder. Holes in a short column are joined.',
      size: [BB.w, BB.h, BB.d], dimOrder: 'xzy', pos: [0, BB.h / 2, 0], explode: [0, 0, 0],
      build: { kind: 'breadboard' },
      source: 'https://www.adafruit.com/product/64 (82.6 x 55 mm, 400 points). Spain: Amazon.es, search result only (stock and price NOT checked): https://www.amazon.es/Protoboard-Breadboard-Reutilizable-Electr%C3%B3nico-Computadoras/dp/B0C39DWPQX (400 points, about EUR 5.91 in a search snippet) or the ELEGOO kit https://www.amazon.es/-/pt/Electr%C3%B3nicos-Resistencias-Condensadores-Potenci%C3%B3metro-Especificaciones/dp/B01MRIG6YM (400-point board, jumpers, resistors, capacitors). Height 8.5 mm: estimate.',
    },
    {
      id: 'pico-board', group: 0, name: 'Raspberry Pi Pico 2 WH board', short: 'Pico 2 WH',
      role: 'The small computer you already own. It plays the 1-bit sound on pin GP15.',
      size: [PICO.L, PICO.T, PICO.W], dimOrder: 'xzy', pos: [PICO.cx, PICO.cy, 0], explode: [0, 44, 0],
      build: { kind: 'picoBoard' },
      source: SRC_PICO + ' (51 x 21 x 1 mm, four 2.1 mm holes, 2.54 mm pin pitch: from the datasheet text).',
      labelPoints: [
        { text: 'GP15 (pin 20)', at: [colX(19), PICO.top + 5, ROWS.h + 3.5] },
        { text: 'GND (pin 18)', at: [colX(17) - 6, PICO.top + 5, ROWS.h + 3.5] },
      ],
    },
    {
      id: 'pico-headers', group: 0, name: 'Male pin headers (2 x 20)', short: 'Pin headers',
      role: 'Two rows of 20 metal pins under the Pico. They go into the breadboard holes.',
      size: [20 * P, 7.14, 17.78 + P], dimOrder: 'xzy', pos: [PICO.cx, BB.top + 1.27, 0], explode: [0, 26, 0],
      build: { kind: 'headerRows', n: 20, pitch: P, rows: 2, rowGap: 17.78, axis: 'x', plasticH: 2.54, pinBelow: 3.0, pinAbove: 1.6, color: '#1c1c1e' },
      source: 'estimate (standard 0.1 inch header; rows 17.78 mm apart as in the Pico datasheet).',
    },
    {
      id: 'pico-usb', group: 0, name: 'Micro-USB socket (Pico)', short: 'USB socket',
      role: 'Power and data come in here from the USB cable.',
      size: [5.6, 2.6, 7.5], dimOrder: 'xzy', pos: [PICO.usbEnd - 1.1 + 2.8, PICO.top + 1.3, 0], explode: [0, 50, 0],
      build: { kind: 'usbSocket', dir: -1 },
      source: SRC_PICO + ' says the USB port overhangs the board edge. Size 5.6 x 7.5 x 2.6: estimate (typical micro-USB B socket).',
    },
    {
      id: 'pico-rp2350', group: 0, name: 'RP2350 chip', short: 'RP2350',
      role: 'The main chip (the brain) of the Pico.',
      size: [7, 0.9, 7], dimOrder: 'xzy', pos: [picoX(21.5), PICO.top + 0.45, 0], explode: [0, 54, 0],
      build: { kind: 'chip', color: '#18181b', label: ['RP2350', 'Raspberry Pi'], font: 1.5 },
      source: 'https://datasheets.raspberrypi.com/rp2350/rp2350-datasheet.pdf (QFN-60, 7 x 7 mm). Place on the board: estimate. Height 0.9 mm: estimate.',
    },
    {
      id: 'pico-wifi', group: 0, name: 'Wireless module with metal shield', short: 'Wi-Fi shield',
      role: 'Wi-Fi and Bluetooth part. We do not use it for the sound test.',
      size: [12, 1.2, 10], dimOrder: 'xzy', pos: [picoX(36.5), PICO.top + 0.6, 2.2], explode: [0, 54, 0],
      build: { kind: 'shield', label: ['CYW43439'] },
      source: 'estimate (size and place read from photos; the datasheet only gives the 14 x 9 mm antenna keep-out).',
    },
    {
      id: 'pico-antenna', group: 0, name: 'Wi-Fi antenna', short: 'Antenna',
      role: 'The small antenna at the board edge. Keep metal away from it.',
      size: [3.2, 1.0, 1.6], dimOrder: 'xzy', pos: [picoX(49.0), PICO.top + 0.5, -6.5], explode: [0, 54, 0],
      build: { kind: 'box', color: '#c8b88a' },
      source: 'estimate (small ceramic antenna).', minor: true,
    },
    {
      id: 'pico-bootsel', group: 0, name: 'BOOTSEL button', short: 'BOOTSEL',
      role: 'Hold it while you plug in USB to load new software. We also use it as the test button.',
      size: [5.0, 2.0, 3.8], dimOrder: 'xzy', pos: [picoX(13.5), PICO.top + 1.0, -3.2], explode: [0, 54, 0],
      build: { kind: 'tact' },
      source: 'estimate (size and place from photos).',
    },
    {
      id: 'pico-swd', group: 0, name: 'Debug header (3 pins)', short: 'Debug pins',
      role: 'Three pins at the far end for a debug probe. We do not use them now.',
      size: [2.54, 8.0, 3 * P], dimOrder: 'xzy', pos: [picoX(47.2), PICO.top + 1.27, 0], explode: [0, 54, 0],
      build: { kind: 'headerRows', n: 3, pitch: P, rows: 1, rowGap: 0, axis: 'z', plasticH: 2.54, pinBelow: 1.2, pinAbove: 5.2, color: '#1c1c1e' },
      source: 'estimate (3 pins at 2.54 mm pitch, as on the Pico WH).',
    },
    {
      id: 'jack-board', group: 1, name: '3.5 mm 4-pole jack board (TRRS breakout)', short: 'Jack board',
      role: 'Your earbud plug goes in here. Its 4 pins let you wire the sound to the plug.',
      size: [JB.w, 6.75, JB.d], dimOrder: 'xzy', pos: [jackX, 0, jbZc], explode: [0, 14, 0],
      build: { kind: 'jackBoard', w: JB.w, d: JB.d, pcb: JB.pcb, spacer: JB.spacer, spacerTop: BB.top, axisY: jackAxisY, frontZ: jackFrontZ, pinCols: 4, pitch: P },
      source: 'Spain: Amazon.es, search result only (stock and price NOT checked): https://www.amazon.es/Youmile-Module-Auriculares-Breakout-Arduino/dp/B08SM46DWW (10 pieces) or https://www.amazon.es/TRRS-M%C3%B3dulo-est%C3%A9reo-Arduino-unidades/dp/B088QXGQTH (5 pieces, about EUR 5.99). Size here is from the SparkFun BOB-11570 (18.5 x 14.8 x 6.75 mm); the Amazon boards may differ a little.',
      labelPoints: [{ text: 'Pins: T  R1  R2  S', at: [jackX, jbPcbTop + 9.5, jbZc + 2] }],
    },
    {
      id: 'resistor', group: 1, name: 'Resistor 4.7 kOhm', short: '4.7k resistor',
      role: 'Keeps the signal small and safe for the earbuds. Never connect a Pico pin straight to earbuds.',
      size: [6.3, 2.4, 2.4], dimText: 'body 6.3 mm long x 2.4 mm wide, legs 10.2 mm apart', dimOrder: 'xzy',
      pos: [0, 0, 0], explode: [0, 24, 0],
      build: { kind: 'resistor', a: hole(21, 'j'), b: hole(25, 'j'), bodyL: 6.3, bodyD: 2.4, y0: BB.top, lift: 1.5 },
      source: 'estimate (standard 1/4 W axial resistor; body 6.3 x 2.4 mm). Bands: yellow, violet, red = 4.7k. Spain: comes in the ELEGOO kit https://www.amazon.es/-/pt/Electr%C3%B3nicos-Resistencias-Condensadores-Potenci%C3%B3metro-Especificaciones/dp/B01MRIG6YM (check the kit has 4.7k: not verified).',
    },
    {
      id: 'capacitor', group: 1, name: 'Capacitor 1 uF (ceramic)', short: '1uF capacitor',
      role: 'Blocks DC and lets the sound pass to the earbuds.',
      size: [5.0, 5.5, 2.5], dimOrder: 'xzy', pos: [0, 0, 0], explode: [0, 24, 0],
      build: { kind: 'capRadial', a: hole(25, 'i'), b: hole(27, 'i'), w: 5.0, h: 5.5, t: 2.5, y0: BB.top },
      source: 'estimate (typical 1 uF radial ceramic, 5.08 mm leg spacing; no sign, any way round is fine). Spain: ELEGOO kit lists ceramic capacitors (1 uF value not verified).',
    },
    {
      id: 'wire-gp15', group: 2, name: 'Wire 1: GP15 to resistor', short: 'Wire 1',
      role: 'Connects Pico pin 20 (GP15, the sound pin) to the resistor.',
      size: [2 * P, 12, 0], dimText: 'about 60 mm male-male jumper wire', dimOrder: 'xzy', pos: [0, 0, 0], explode: [0, 20, 0],
      build: { kind: 'jumper', from: hole(19, 'j'), to: hole(21, 'i'), arc: 9, color: '#f28c28', y0: BB.top },
      source: 'estimate (standard male-male jumper wires).',
    },
    {
      id: 'wire-tip', group: 2, name: 'Wire 2: capacitor to jack TIP', short: 'Wire 2',
      role: 'Takes the sound from the capacitor to the TIP pin (left earbud).',
      size: [2 * P, 12, 0], dimText: 'about 90 mm male-male jumper wire', dimOrder: 'xzy', pos: [0, 0, 0], explode: [0, 20, 0],
      build: { kind: 'jumper', from: hole(27, 'g'), to: hole(JACK_COL0, 'c'), arc: 12, color: '#2f7de1', y0: BB.top },
      source: 'estimate (standard male-male jumper wires).',
    },
    {
      id: 'wire-ring1', group: 2, name: 'Wire 3: capacitor to jack RING 1', short: 'Wire 3',
      role: 'Same sound to RING 1 (right earbud). Both ears get the same sound (mono).',
      size: [2 * P, 12, 0], dimText: 'about 90 mm male-male jumper wire', dimOrder: 'xzy', pos: [0, 0, 0], explode: [0, 20, 0],
      build: { kind: 'jumper', from: hole(27, 'h'), to: hole(JACK_COL0 + 1, 'c'), arc: 15, color: '#9b59d0', y0: BB.top },
      source: 'estimate (standard male-male jumper wires).',
    },
    {
      id: 'wire-gnd', group: 2, name: 'Wire 4: Pico GND to jack ground', short: 'Wire 4',
      role: 'Ground wire. Pico pin 18 (GND) goes to RING 2 of the jack. The last pin (S) is the earbud button line: wire it to Pico GP26 (pin 31) and add a 2.2k resistor from GP22 (pin 29) to GP26 (not drawn yet).',
      size: [10 * P, 18, 0], dimText: 'about 150 mm male-male jumper wire', dimOrder: 'xzy', pos: [0, 0, 0], explode: [0, 20, 0],
      build: { kind: 'jumper', from: hole(17, 'j'), to: hole(JACK_COL0 + 2, 'c'), arc: 20, color: '#222222', y0: BB.top },
      source: 'estimate (standard male-male jumper wires). Most earbuds use RING 2 as ground; if you hear nothing, swap the wire to pin S.',
    },
    {
      id: 'earbud-plug', group: 2, name: 'Your earbud plug (3.5 mm, 4 poles)', short: 'Earbud plug',
      role: 'The plug of your wired earbuds, pushed into the jack board.',
      size: [7, 7, 14 + 12 + 30], dimText: 'plug 3.5 mm wide x 14 mm long, housing 7 mm x 12 mm, cable stub 30 mm', dimOrder: 'xzy',
      pos: [jackX, jackAxisY, jackFrontZ + 12], rotY: 180, explode: [0, 14, -30],
      build: { kind: 'trrsPlug', plugL: 14, plugD: 3.5, houseL: 12, houseD: 7, cableL: 30, cableD: 2.4 },
      source: '3.5 mm plug size is the standard (plug 14 mm). Housing size: estimate.',
    },
    {
      id: 'usb-plug', group: 2, name: 'Micro-USB cable plug', short: 'USB cable',
      role: 'Brings power from your computer or power bank into the Pico.',
      size: [5.8 + 14 + 35, 7, 11], dimText: 'plug 6.9 x 1.8 mm metal, 5.8 mm deep; housing about 11 x 7 mm; cable stub 35 mm', dimOrder: 'xzy',
      pos: [PICO.usbEnd - 1.1 + 5.6, PICO.top + 1.3, 0], rotY: -90, explode: [-30, 44, 0],
      build: { kind: 'usbPlug' },
      source: 'estimate (standard micro-USB B plug; metal part 6.9 x 1.8 mm). You may already own one (phone cable). Spain: Amazon.es https://amazon.es/CABLE-USB-2-0-TIPO-MICRO/dp/B006WNCC9G (USB-A to micro-B, 1 m; stock NOT checked). Use a DATA cable, not a charge-only one.',
    },
  ],
};


// ---------------------------------------------------------------- STAGE 4: the final device (big and mini)
// ---------------------------------------------------------------- STAGE 4: the final device (big and mini)
const DK = (pn) => 'https://www.digikey.es/en/products/result?keywords=' + pn;
const SRC_AEM = 'https://e-peas.com/wp-content/uploads/2024/09/ds-aem10941_qfn28-v2-1.pdf';
const SRC_USBC = 'https://www.digikey.es/en/products/result?keywords=USB4105-GF-A (GCT drawing: 8.94 wide x 7.35 deep x 3.31 high; EUR 0.71 ex VAT; lifecycle: active)';
const SRC_CH340 = 'https://www.lcsc.com/product-detail/C99652.html (WCH CH340E, MSOP-10; LCSC pages showed 13,621 to 40,478 in stock, from USD 0.46; lifecycle: active). Datasheet https://cdn.sparkfun.com/assets/5/0/a/8/5/CH340DS1.PDF. Lead span 4.9 and height 1.1 mm are the standard MSOP-10 size, not read from the WCH drawing.';
const G_CASE = 0, G_POWER = 1, G_BRAIN = 2, G_USB = 3, G_PCB = 4, G_SONG = 5;
const GROUPS = ['Case', 'Power', 'Brain and sound', 'USB: songs and code', 'Circuit board', 'Song memory'];
const PCB_EXP = [0, 0, 12];
const cap = (id, short, name, role, size, dim, pn, note) => ({ group: G_POWER, name, short, minor: true, role,
  build: { kind: 'smd', color: '#a5844f' }, dimText: dim, source: `${DK(pn)} (${pn}; ${note}; shop DigiKey.es; lifecycle: active)` });

// Shared description of each small part (name, role, source). Sizes come from the PCB layout of each device.
const META = {
  artemis: { group: G_BRAIN, name: 'SparkFun Artemis module (Apollo3 chip)', short: 'Artemis',
    role: 'The brain. It is made for very low power and plays the sound.',
    build: { kind: 'artemis', label: ['Artemis', 'Apollo3'] },
    source: 'https://www.sparkfun.com/products/15484 (WRL-15484, 10.5 x 15.5 mm; USD 9.95; page shows in stock; DigiKey.es also lists it). Lifecycle: active. Pad layout in 3D is simplified.' },
  aem: { group: G_POWER, name: 'e-peas AEM10941 energy harvester chip', short: 'AEM10941',
    role: 'Takes the tiny power from the solar cell, charges the battery and gives steady power to the brain. Its HVOUT pin (about 1.92 V) feeds the Artemis.',
    build: { kind: 'chip', color: '#18181b', label: ['AEM', '10941'], font: 1.1 },
    source: SRC_AEM + ' (QFN-28, 5.00 x 5.00 x 0.85 mm). Shop: Mouser part 120-AEM10941-QFN, about USD 4.50 each; stock came only from price-list sites (Mouser page did not load: NOT verified). Lifecycle: active (e-peas product).' },
  'l-boost': { group: G_POWER, name: 'Inductor 10 uH (boost)', short: 'L1 10uH', minor: true,
    role: 'A small coil that the harvester uses to lift the solar voltage.',
    build: { kind: 'inductor' }, dimText: '2.5 x 2.0 x 1.2 mm',
    source: DK('VLS252012CX-100M-1') + ' (TDK VLS252012CX-100M-1, 10 uH, 2.5 x 2.0 x 1.2 mm, Isat 790 mA; 10,668 in stock, EUR 0.29 ex VAT; lifecycle: active). The datasheet asks for 4 to 10 uH and at least 50 mA.' },
  'l-buck': { group: G_POWER, name: 'Inductor 10 uH (buck)', short: 'L2 10uH', minor: true,
    role: 'A tiny coil that makes the steady low voltage for the brain.',
    build: { kind: 'inductor' }, dimText: '2.5 x 2.0 x 1.2 mm',
    source: DK('VLS252012CX-100M-1') + ' (same TDK part as L1, so you buy one type; lifecycle: active).' },
  'c-src': cap('c-src', 'C1 10uF', 'Capacitor 10 uF 10 V (solar input)', 'Smooths the power that comes from the solar cell.', 0, '1.6 x 0.8 x 0.8 mm (0603)', 'GXT188R61A106KE13D', 'Murata, 10 uF 10 V X5R 0603; CSRC needs 8 to 22 uF; stock not read'),
  'c-boost': cap('c-boost', 'C2 22uF', 'Capacitor 22 uF (boost out)', 'Stores a little energy right after the boost step.', 0, '2.0 x 1.25 x 1.25 mm (0805)', 'CL21A226MQQNNNE', 'Samsung, 22 uF 6.3 V X5R 0805; CBOOST needs 10 uF or more, typical 22; stock not read'),
  'c-buck': cap('c-buck', 'C3 10uF', 'Capacitor 10 uF 6.3 V (buck out)', 'Smooths the steady low voltage.', 0, '1.6 x 0.8 x 0.8 mm (0603)', 'GRM188R60J106ME47D', 'Murata 10 uF 6.3 V X5R 0603; 843,830 in stock, EUR 0.11 ex VAT; CBUCK needs 8 uF or more'),
  'c-hv': cap('c-hv', 'C4 10uF', 'Capacitor 10 uF 6.3 V (high-voltage out)', 'Keeps the output that feeds the brain steady (the datasheet needs 8 to 14 uF here).', 0, '1.6 x 0.8 x 0.8 mm (0603)', 'GRM188R60J106ME47D', 'same part as C3; 843,830 in stock, EUR 0.11 ex VAT'),
  'c-lv': cap('c-lv', 'C5 10uF', 'Capacitor 10 uF 6.3 V (low-voltage out)', 'Keeps the second (unused) low-voltage output steady. The datasheet still asks for a capacitor.', 0, '1.6 x 0.8 x 0.8 mm (0603)', 'GRM188R60J106ME47D', 'same part as C3; CLV needs 8 uF or more'),
  'r-cfg': { group: G_POWER, name: 'Setting resistors R1-R6 (7 small resistors)', short: 'R1-R6', minor: true,
    role: 'They tell the harvester when the battery is full or empty. R4 is two resistors in a row.',
    build: { kind: 'rcfg', n: 7, pitch: 1.3 }, dimText: 'each 1.0 x 0.5 x 0.35 mm (0402)',
    source: SRC_AEM + '. Values: R1 6.2M, R2 1.2M (Vishay CRCW04021M20FKED), R3 1.0M, R4 6.2M + 4.7M in series, R5 5.1M, R6 4.7M, all 1% 0402 (Yageo RC0402FR-07..L series). Result: battery full at 3.11 V, battery empty at 2.30 V, output about 1.92 V. DigiKey.es; 1.2M price EUR 0.09 ex VAT; other stock not read; lifecycle: active.' },
  'r-audio': { group: G_BRAIN, name: 'Resistor 4.7 kOhm (sound)', short: 'R7 4.7k', minor: true,
    role: 'Keeps the sound signal small and safe for the earbuds.',
    build: { kind: 'smd', color: '#27272a', label: '472' }, dimText: '1.0 x 0.5 x 0.35 mm (0402)',
    source: DK('RC0402FR-074K7L') + ' (Yageo RC0402FR-074K7L; 983,617 in stock, EUR 0.09 ex VAT; lifecycle: active).' },
  'c-audio': { group: G_BRAIN, name: 'Capacitor 1 uF (sound)', short: 'C6 1uF', minor: true,
    role: 'Lets the sound pass and blocks DC.',
    build: { kind: 'smd', color: '#a5844f' }, dimText: '1.0 x 0.5 x 0.5 mm (0402)',
    source: DK('CL05A105KA5NQNC') + ' (Samsung CL05A105KA5NQNC, 1 uF 25 V X5R 0402; stock not read; lifecycle: active).' },
  jack: { group: G_BRAIN, name: '3.5 mm 4-pole jack (SMD)', short: 'Audio jack',
    role: 'Your earbud plug goes in here, at the edge of the case.',
    build: { kind: 'smdJack', w: 6.7, l: 17.0, h: 5.0 },
    source: DK('SJ-43514-SMT-TR') + ' (Same Sky SJ-43514-SMT-TR, 17 x 6.7 x 5 mm; 10,933 in stock, EUR 1.35 ex VAT; lifecycle: active; LCSC lists 18 x 6.8 x 5.05).' },
  button: { group: G_BRAIN, name: 'Side push button (SMD)', short: 'Button',
    role: 'The one button. You press it from the side of the case.',
    build: { kind: 'sideButton' }, dimText: '2.5 x 3.0 x 1.2 mm (plunger faces the edge)',
    source: 'https://www.digikey.es/en/products/result?keywords=B3U-3000P-B (Omron/Aratas B3U-3000P-B, side-press, 1.2 x 3 x 2.5 mm from the Omron datasheet; 18,109 in stock, about EUR 0.55; lifecycle: active). Cap and slot design: estimate.' },
  usbc: { group: G_USB, name: 'USB-C socket (GCT USB4105-GF-A)', short: 'USB-C',
    role: 'Plug into your laptop to add songs. Uses no battery when unplugged. USB emergency charging: not designed yet.',
    build: { kind: 'usbc' }, source: SRC_USBC + '.' },
  ch340: { group: G_USB, name: 'USB-to-serial chip WCH CH340E', short: 'CH340E',
    role: 'Lets the laptop talk to the Artemis (add songs, update code). It gets power only from the USB cable, so it uses no battery when unplugged.',
    build: { kind: 'chip', color: '#18181b', label: ['CH340', 'E'], font: 1.0 }, dimText: '4.9 x 3.0 x 1.1 mm (MSOP-10)',
    source: SRC_CH340 },
  'c-usb': { group: G_USB, name: 'Capacitor 100 nF (USB chip power)', short: 'C7 100nF', minor: true,
    role: 'Keeps the power of the USB chip steady.',
    build: { kind: 'smd', color: '#a5844f' }, dimText: '1.0 x 0.5 x 0.5 mm (0402)',
    source: DK('GRM155R61A104KA01D') + ' (Murata GRM155R61A104KA01D, 0.1 uF 10 V 0402; 1,868,230 in stock, EUR 0.10 ex VAT; lifecycle: active).' },
  flash: { group: G_SONG, name: 'Song memory chip (Winbond W25N01GV, 128 MB)', short: 'Song memory',
    role: 'Stores your songs. 128 MB = about 9 hours (150 songs) at phone-call quality. Uses almost no power when idle.',
    build: { kind: 'chip', color: '#18181b', label: ['W25N01GV', 'Winbond', '1 Gbit'], font: 1.0 }, dimText: '8 x 6 x 0.8 mm (WSON-8)',
    source: 'https://www.winbond.com/hq/product/code-storage-flash-memory/qspinand-flash/?__locale=en&partNo=W25N01GV (W25N01GVZEIG: 1 Gbit = 128 MB SLC NAND, SPI, WSON-8 6 x 8 mm, 2.7 to 3.6 V, standby about 10 uA; datasheet text read through search results, the PDF itself NOT opened). Shops: LCSC C907680 (WSON-8-EP 6x8; a search snippet showed 4,220 to 4,740 in stock, USD 7.25 to 11.35) and DigiKey.es W25N01GVZEIG (EUR 13.77; stock and status not shown). Lifecycle: no end-of-life notice found, NOT confirmed on a Winbond page. WARNING: it needs 2.7 V or more, but the harvester output feeds the Artemis with 1.92 V. Its power is not solved yet (the 1.8 V twin W25N01GW needs 1.7 to 1.95 V, DigiKey.es showed it out of stock). Height 0.8 mm and pad layout in 3D: estimate. Which Artemis pins carry SPI: NOT checked.' },
  'c-flash': { group: G_SONG, name: 'Capacitor 100 nF (song memory power)', short: 'C8 100nF', minor: true,
    role: 'Keeps the power of the song memory steady.',
    build: { kind: 'smd', color: '#a5844f' }, dimText: '1.6 x 0.8 x 0.8 mm (0603)',
    source: DK('GRM188R71C104KA01D') + ' (Murata GRM188R71C104KA01D, 0.1 uF 16 V X7R 0603; stock and price not read; lifecycle: active, not re-checked).' },
  'r-cc1': { group: G_USB, name: 'Resistor 5.1 kOhm (USB-C CC1)', short: 'R8 5.1k', minor: true,
    role: 'Tells the laptop "I am a device that wants power". USB-C needs one on each CC pin.',
    build: { kind: 'smd', color: '#27272a', label: '512' }, dimText: '1.0 x 0.5 x 0.35 mm (0402)',
    source: DK('RC0402FR-075K1L') + ' (Yageo RC0402FR-075K1L; USB-C spec asks 5.1 kOhm on CC1 and CC2; stock not read; lifecycle: active).' },
  'r-cc2': { group: G_USB, name: 'Resistor 5.1 kOhm (USB-C CC2)', short: 'R9 5.1k', minor: true,
    role: 'The second CC resistor, for the other way the cable can be plugged in.',
    build: { kind: 'smd', color: '#27272a', label: '512' }, dimText: '1.0 x 0.5 x 0.35 mm (0402)',
    source: DK('RC0402FR-075K1L') + ' (same part as R8).' },
};

// ---- the device factory
function makeDevice(cfg) {
  const DEV = {
    wall: cfg.wall, R: cfg.R, winR: cfg.winR, gapSide: 0.3,
    cell: cfg.cell, pcb: cfg.pcb, lip: 1.2, winMargin: 1.0, space: cfg.space, frontGap: cfg.frontGap, clipT: 1.8,
  };
  DEV.lip = cfg.wall;
  DEV.cavW = Math.max(DEV.cell.w, DEV.pcb.w) + 2 * DEV.gapSide;
  DEV.cavH = Math.max(DEV.cell.h, DEV.pcb.h) + 2 * DEV.gapSide;
  DEV.outW = DEV.cavW + 2 * DEV.wall;
  DEV.outH = DEV.cavH + 2 * DEV.wall;
  DEV.zFloor = DEV.wall;
  DEV.zPcbBack = DEV.zFloor + DEV.space;
  DEV.zPcbFront = DEV.zPcbBack + DEV.pcb.t;
  DEV.zCellBack = DEV.zPcbFront + DEV.frontGap;
  DEV.zCellFront = DEV.zCellBack + DEV.cell.t;
  DEV.outD = DEV.zCellFront + DEV.lip;
  DEV.zSeam = DEV.zPcbFront + 0.1; // the front frame starts just in front of the board
  DEV.totalD = DEV.outD + DEV.clipT;
  DEV.volume = (DEV.outW * DEV.outH * DEV.outD) / 1000; // cm3
  const ZB = DEV.zPcbBack, ZF = DEV.zPcbFront;
  const PCBL = { w: DEV.pcb.w, h: DEV.pcb.h, corner: DEV.pcb.corner, parts: cfg.parts, frontPads: cfg.frontPads, solarNote: cfg.solarNote, vias: cfg.vias, traces: cfg.traces, nets: NETS };
  const PL = Object.fromEntries(PCBL.parts.map((p) => [p.id, p]));
  const onPcb = (p) => {
    const size = [p.lw ?? p.w, p.lh ?? p.h, p.z];
    const zc = p.side === 'f' ? ZF + p.z / 2 : ZB - p.z / 2;
    return { pos: [p.x, p.y, zc], size };
  };
  const parts = [];
  parts.push({
    id: 'case-front', group: G_CASE, name: 'Case front frame', short: 'Front frame',
    role: 'The front of the case. It has a window so light reaches the solar cell.',
    size: [DEV.outW, DEV.outH, DEV.outD - DEV.zSeam], dimOrder: 'xyz', pos: [0, 0, 0], explode: [0, 0, 44], caseShell: true,
    build: { kind: 'caseFront' },
    source: `estimate (my design). Wall ${DEV.wall} mm; window leaves the cell 1 mm covered on each side.`,
  });
  parts.push({
    id: 'solar', group: G_POWER, name: 'Solar cell: ' + DEV.cell.model, short: 'Solar cell',
    role: 'Makes a little power from room light. It is the front face of the device.',
    size: [DEV.cell.w, DEV.cell.h, DEV.cell.t], dimOrder: 'xyz', pos: [0, 0, (DEV.zCellBack + DEV.zCellFront) / 2], explode: [0, 0, 28],
    build: { kind: 'solarCell', w: DEV.cell.w, h: DEV.cell.h, t: DEV.cell.t, tiles: DEV.cell.tiles || 1, label: DEV.cell.label },
    source: DEV.cell.source,
  });
  parts.push({
    id: 'pcb', group: G_PCB, name: 'Custom circuit board (PCB), 2 layers', short: 'Circuit board',
    role: cfg.pcbRole,
    size: [DEV.pcb.w, DEV.pcb.h, DEV.pcb.t], dimOrder: 'xyz', pos: [0, 0, (DEV.zPcbBack + DEV.zPcbFront) / 2], explode: PCB_EXP,
    build: { kind: 'pcb', w: DEV.pcb.w, h: DEV.pcb.h, t: DEV.pcb.t, corner: DEV.pcb.corner },
    source: `estimate (my design): ${DEV.pcb.w} x ${DEV.pcb.h} x ${DEV.pcb.t} mm, rounded corners.`,
  });
  PCBL.parts.forEach((p) => {
    const m = cfg.extra[p.id] || META[p.id];
    parts.push({
      dimOrder: 'xyz', explode: p.explode || PCB_EXP, ...onPcb(p), rot: p.rot || 0, side: p.side || 'b', ...m, id: p.id,
    });
  });
  const cuts = cfg.cuts(PL, ZB);
  parts.push({
    id: 'case-back', group: G_CASE, name: 'Case back shell', short: 'Back shell',
    role: 'The back of the case. It covers the parts. It has holes for the jack and the USB-C plug and a slot for the button.',
    size: [DEV.outW, DEV.outH, DEV.zSeam], dimOrder: 'xyz', pos: [0, 0, 0], explode: [0, 0, -26], caseShell: true,
    build: { kind: 'caseBack', cuts },
    source: `estimate (my design). Wall ${DEV.wall} mm.`,
  });
  parts.push({
    id: 'button-cap', group: G_CASE, name: 'Button cap', short: 'Button cap', minor: true,
    role: 'A small plastic cap in the side slot. It pushes the button inside.',
    size: [1.4, 3.0, 1.8], dimOrder: 'xyz', pos: [DEV.outW / 2 - 0.7, PL.button.y, ZB - 0.6], explode: [0, 0, -26],
    build: { kind: 'box', color: '#d9d9de' }, source: 'estimate (my design).',
  });
  parts.push({
    id: 'clip', group: G_CASE, name: 'Spring clip (like a nano clip)', short: 'Clip',
    role: 'A metal clip on the back to hold the badge on a shirt or bag strap.',
    size: [cfg.clip.w, cfg.clip.len, DEV.clipT], dimOrder: 'xyz', pos: [0, 0, 0], explode: [0, 0, -42],
    build: { kind: 'clip', w: cfg.clip.w, len: cfg.clip.len, t: DEV.clipT, y1: cfg.clip.y1 },
    source: 'estimate (my design; shape like an iPod nano clip).',
  });
  const stage = {
    id: cfg.id, title: cfg.title, intro: cfg.intro, groups: GROUPS, dev: DEV, pcbl: PCBL, compare: cfg.compare,
    camera: cfg.camera, camExploded: cfg.camExploded, camFront: cfg.camFront,
    grid: { y: -DEV.outH / 2 - 4, size: 160, step: 10 },
    parts,
  };
  return { DEV, PCBL, stage };
}

const NETS = {
  solar: { color: '#e8a317', name: 'Solar cell -> harvester input (SRC)' },
  battery: { color: '#2d7de1', name: 'Harvester <-> battery (BATT)' },
  power: { color: '#d63b3b', name: 'Harvester low-voltage out -> chip power' },
  audio: { color: '#1a9a55', name: 'Chip pin -> 4.7k -> 1uF -> jack tip + ring 1' },
  button: { color: '#8a4fd0', name: 'Button -> chip input' },
  usb: { color: '#f2f2f2', name: 'USB-C data (D+, D-) and CC -> USB chip' },
  vbus: { color: '#ff6a2a', name: 'USB 5 V (VBUS) -> USB chip only' },
  uart: { color: '#22c8d8', name: 'USB chip -> Artemis serial (TX, RX)' },
  spi: { color: '#b5e61d', name: 'Song memory (SPI)' },
  reset: { color: '#f060b0', name: 'USB chip -> Artemis reset and boot' },
};

// ---------------------------------------------------------------- shared layout (mini = 41.4 x 30 board; big = same plus a second cell and battery, 41.4 x 52.2)
const AMG = (tiles) => ({ model: tiles > 1 ? '2 x Panasonic Amorton AMG-1401C' : 'Panasonic Amorton AMG-1401C', label: 'AMG-1401C', w: 41.4, h: 26.1 * tiles, t: 1.3, tiles,
  source: 'https://industry.panasonic.eu/products/energy-building/amorphous-solar-cells/amorton-indoor-environment (datasheet: 41.4 x 26.1 x 1.3 mm max; at 200 lux Voc 2.7 V (min 2.3), Isc 43.3 uA, Vpm 2.1 V, Ipm 35.4 uA, Pm 74.3 uW each). Shop: Farnell order code 4531800 (at.farnell.com page: 1,177 in stock, EUR 8.63; Spain page not checked); lifecycle: active.' + (tiles > 1 ? ' Two cells side by side, joined in parallel.' : '') });

const layout = (dy, second) => {
  const Y = (y) => y + dy;
  const parts = [
    { id: 'artemis', x: 5.75, y: Y(-0.5), w: 10.5, h: 15.5, z: 2.3, kind: 'artemis', ref: 'U2 Artemis' },
    { id: 'battery', x: -10.2, y: Y(-3.0), w: 21, h: 21, z: 4.2, kind: 'coin', ref: 'ML2032', explode: [0, 0, -6] },
    { id: 'jack', x: 12.85, y: Y(-11.65), w: 17.0, h: 6.7, z: 5.0, kind: 'jack', rot: 90, lw: 6.7, lh: 17.0, ref: 'J1 jack' },
    { id: 'usbc', x: -9.0, y: Y(11.3), w: 8.94, h: 7.35, z: 3.31, kind: 'usbc', ref: 'J2 USB-C' },
    { id: 'aem', x: 15.5, y: Y(-3.0), w: 5, h: 5, z: 0.85, kind: 'qfn', ref: 'U1' },
    { id: 'l-boost', x: 15.5, y: Y(1.5), w: 2.5, h: 2.0, z: 1.2, kind: 'inductor', ref: 'L1' },
    { id: 'l-buck', x: 15.5, y: Y(4.6), w: 2.5, h: 2.0, z: 1.2, kind: 'inductor', ref: 'L2' },
    { id: 'button', x: 19.2, y: Y(3.0), w: 2.5, h: 3.0, z: 1.2, kind: 'button', ref: 'SW1' },
    // front side (the solar cell sits 1.5 mm in front of the board)
    { id: 'c-src', side: 'f', x: 11.8, y: Y(-2.2), w: 0.8, h: 1.6, z: 0.8, kind: 'p0603', color: '#a5844f', ref: 'C1' },
    { id: 'c-boost', side: 'f', x: 11.8, y: Y(1.0), w: 1.25, h: 2.0, z: 1.25, kind: 'p0603', color: '#a5844f', ref: 'C2' },
    { id: 'c-buck', side: 'f', x: 12.0, y: Y(5.0), w: 1.6, h: 0.8, z: 0.8, kind: 'p0603', color: '#a5844f', ref: 'C3' },
    { id: 'c-hv', side: 'f', x: 12.0, y: Y(-7.0), w: 1.6, h: 0.8, z: 0.8, kind: 'p0603', color: '#a5844f', ref: 'C4' },
    { id: 'c-lv', side: 'f', x: 14.4, y: Y(-7.3), w: 1.6, h: 0.8, z: 0.8, kind: 'p0603', color: '#a5844f', ref: 'C5' },
    { id: 'r-cfg', side: 'f', x: 4.0, y: Y(-12.6), w: 9.6, h: 0.5, z: 0.35, kind: 'rcfg', n: 7, pitch: 1.3, ref: 'R1-R6' },
    { id: 'r-audio', side: 'f', x: 2.0, y: Y(-10.2), w: 1.0, h: 0.5, z: 0.35, kind: 'p0402', color: '#27272a', label: '472', ref: 'R7' },
    { id: 'c-audio', side: 'f', x: 4.0, y: Y(-10.2), w: 1.0, h: 0.5, z: 0.5, kind: 'p0402', color: '#a5844f', ref: 'C6' },
    { id: 'ch340', side: 'f', x: -2.5, y: Y(11.0), w: 4.9, h: 3.0, z: 1.1, kind: 'msop', ref: 'U3 CH340E' },
    { id: 'flash', side: 'f', x: -11.5, y: Y(-1.0), w: 6, h: 8, z: 0.8, kind: 'wson', ref: 'U4 memory' },
    { id: 'c-flash', side: 'f', x: -17.0, y: Y(0.9), w: 1.6, h: 0.8, z: 0.8, kind: 'p0603', color: '#a5844f', ref: 'C8' },
    { id: 'c-usb', side: 'f', x: -1.2, y: Y(13.6), w: 1.0, h: 0.5, z: 0.5, kind: 'p0402', color: '#a5844f', ref: 'C7' },
    { id: 'r-cc1', side: 'f', x: -12.5, y: Y(8.5), w: 1.0, h: 0.5, z: 0.35, kind: 'p0402', color: '#27272a', label: '512', ref: 'R8' },
    { id: 'r-cc2', side: 'f', x: -5.1, y: Y(7.4), w: 1.0, h: 0.5, z: 0.35, kind: 'p0402', color: '#27272a', label: '512', ref: 'R9' },
  ];
  const T = (net, layer, ...pts) => ({ net, layer, pts: pts.map(([x, y]) => [x, Y(y)]) });
  const traces = [
    T('solar', 'f', [17.5, -11.5], [17.5, -9.2], [11.6, -9.2], [11.6, -2.2], [11.4, -2.2]),
    T('solar', 'b', [11.6, -2.2], [11.6, -3.0], [13.15, -3.0]),
    T('battery', 'b', [17.85, -2.0], [18.7, -2.0]),
    T('battery', 'f', [18.7, -2.0], [18.7, -5.6], [-0.2, -5.6]),
    T('battery', 'b', [-0.2, -5.6], [-0.2, -3.0], [-0.7, -3.0]),
    T('power', 'b', [13.15, -1.5], [11.55, -1.5], [11.55, -1.135], [10.9, -1.135]),
    T('audio', 'b', [1.94, -7.75], [1.94, -9.3]),
    T('audio', 'f', [1.94, -9.3], [1.94, -10.2], [1.5, -10.2]),
    T('audio', 'f', [2.5, -10.2], [3.5, -10.2]),
    T('audio', 'f', [4.5, -10.2], [5.0, -10.2]),
    T('audio', 'b', [5.0, -10.2], [5.0, -9.45], [5.65, -9.45]),
    T('audio', 'b', [5.0, -10.2], [5.0, -13.85], [5.65, -13.85]),
    T('button', 'b', [18.2, 3.0], [18.2, 6.485], [10.9, 6.485]),
    T('reset', 'f', [-0.3, 10.0], [0.6, 10.0], [0.6, 5.215]),
    T('reset', 'b', [0.6, 5.215], [1.0, 5.215]),
    T('uart', 'f', [-0.3, 10.5], [0.0, 10.5], [0.0, 3.945]),
    T('uart', 'b', [0.0, 3.945], [1.0, 3.945]),
    T('usb', 'b', [-7.2, 9.3], [-7.2, 8.4]),
    T('usb', 'f', [-7.2, 8.4], [-5.2, 8.4], [-5.2, 10.5], [-4.7, 10.5]),
    T('usb', 'b', [-8.8, 9.3], [-8.8, 8.8]),
    T('usb', 'f', [-8.8, 8.8], [-5.6, 8.8], [-5.6, 11.0], [-4.7, 11.0]),
    T('usb', 'b', [-11.2, 9.3], [-11.2, 8.5]),
    T('usb', 'f', [-11.2, 8.5], [-12.05, 8.5]),
    T('usb', 'b', [-6.0, 9.3], [-6.0, 7.4]),
    T('usb', 'f', [-6.0, 7.4], [-5.55, 7.4]),
    T('vbus', 'b', [-4.8, 9.3], [-3.8, 9.3], [-3.8, 13.0]),
    T('spi', 'b', [1.0, 2.675], [0, 2.675]),
    T('spi', 'b', [1.0, 1.405], [0, 1.405]),
    T('spi', 'b', [1.0, 0.135], [0, 0.135]),
    T('spi', 'b', [1.0, -1.135], [0.4, -0.8], [-0.9, -0.8]),
    T('spi', 'f', [0, 2.675], [-6.5, 2.675], [-6.5, 0.905], [-8.9, 0.905]),
    T('spi', 'f', [0, 1.405], [-5.9, 1.405], [-5.9, -0.365], [-8.9, -0.365]),
    T('spi', 'f', [0, 0.135], [-4.7, 0.135], [-4.7, -5.8], [-15.4, -5.8], [-15.4, -2.905], [-14.1, -2.905]),
    T('spi', 'f', [-0.9, -0.8], [-3.9, -0.8], [-3.9, -6.6], [-16.2, -6.6], [-16.2, -1.635], [-14.1, -1.635]),
    T('spi', 'f', [-16.2, 0.905], [-14.1, 0.905]),
    T('vbus', 'f', [-3.8, 13.0], [-1.65, 13.0], [-1.65, 13.6]),
  ];
  const vias = [[11.6, -2.2], [18.7, -2.0], [-0.2, -5.6], [1.94, -9.3], [5.0, -10.2], [0.6, 5.215], [0.0, 3.945], [-7.2, 8.4], [-8.8, 8.8], [-11.2, 8.5], [-6.0, 7.4], [-3.8, 13.0], [0, 2.675], [0, 1.405], [0, 0.135], [-0.9, -0.8]].map(([x, y]) => [x, Y(y)]);
  const frontPads = [{ id: '+', x: 17.5, y: Y(-11.5), w: 1.6, h: 1.6 }, { id: '-', x: 19.5, y: Y(-11.5), w: 1.6, h: 1.6 }];
  if (second) {
    parts.push({ id: 'battery2', x: -10.2, y: -15.0, w: 21, h: 21, z: 4.2, kind: 'coin', ref: 'ML2032 #2', explode: [0, 0, -6] });
    traces.push({ net: 'battery', layer: 'b', pts: [[-0.7, -15.0], [-0.2, -15.0], [-0.2, Y(-5.6)]] });
    frontPads.push({ id: '2+', x: 17.5, y: 2.0, w: 1.6, h: 1.6 }, { id: '2-', x: 19.5, y: 2.0, w: 1.6, h: 1.6 });
    traces.push({ net: 'solar', layer: 'f', pts: [[17.5, 2.0], [17.5, Y(-11.5)]] }, { net: 'solar', layer: 'f', pts: [[19.5, 2.0], [19.5, Y(-11.5)]] });
  }
  return { parts, traces, vias, frontPads };
};
const battExtra = (n) => ({ group: G_POWER, name: 'Rechargeable coin cell ML2032' + (n ? ' (second one)' : '') + ' with holder', short: n ? 'Coin cell 2' : 'Coin cell',
  role: 'Stores the energy so the player works in the dark. It loses very little energy when it just sits and needs no protection board. Charge limit 3.2 V; the harvester stops at 3.11 V.',
  build: { kind: 'coin' }, dimText: 'cell 20.0 mm round x 3.2 mm; holder about 21 x 21 mm (outline estimated); 4.2 mm in total',
  source: 'https://www.digikey.es/en/products/result?keywords=ML2032 (Jauch/Maxell ML2032, 3 V, 65 mAh, 20.0 mm x 3.2 mm; 2,000 in stock, EUR 1.45 ex VAT; lifecycle: active) in a Keystone 3034 SMD holder (https://www.digikey.es/en/products/result?keywords=3034TR; 44,448 in stock, EUR 0.53; lifecycle: active). Holder outline not checked.' });
const L_MINI = layout(0, false), L_BIG = layout(11.1, true);
const COMMON_CUTS = (PL, ZB) => [
  { id: 'jack', side: 'x+', at: PL.jack.y, z: ZB - 2.5, a: 5.0, b: 4.2 },
  { id: 'usbc', side: 'y+', at: PL.usbc.x, z: ZB - 1.655, a: 9.4, b: 3.7 },
  { id: 'button', side: 'x+', at: PL.button.y, z: ZB - 0.6, a: 3.2, b: 1.8 },
];

const big = makeDevice({
  id: 4, title: 'Step 4: big',
  intro: 'A clip-on badge that charges itself from room light. Two solar cells make the front. Two coin cells store the energy. All other parts are on the back of one small circuit board. A USB-C socket lets you add songs from your laptop. A song memory chip keeps about 9 hours of your real songs. Real songs are the main mode. Chiptune is the backup when the battery is low.',
  pcbRole: 'Holds and connects all the small parts. Tall parts are on the back; small parts are on both sides; the solar cells sit 1.5 mm in front of the board.',
  wall: 1.2, R: 5, winR: 2.5, cell: AMG(2), pcb: { w: 41.4, h: 52.2, t: 0.8, corner: 4 }, space: 5.2, frontGap: 1.5,
  parts: L_BIG.parts, extra: { battery: battExtra(0), battery2: battExtra(1) },
  frontPads: L_BIG.frontPads, solarNote: [-11, -6], vias: L_BIG.vias, traces: L_BIG.traces,
  clip: { w: 12, len: 40, y1: 24 }, cuts: COMMON_CUTS,
  camera: { pos: [-62, 38, -88], target: [0, 0, 5] },
  camExploded: { pos: [-120, 70, -150], target: [0, 0, 8] },
  camFront: { pos: [60, 30, 90], target: [0, 0, 5] },
});

const mini = makeDevice({
  id: 5, title: 'Step 4: mini',
  intro: 'The same circuit, packed small. One solar cell on the front, one coin cell, and small parts on both sides of the board. A USB-C socket lets you add songs from your laptop. A song memory chip keeps about 9 hours of your real songs. Real songs are the main mode. Chiptune is the backup when the battery is low.',
  pcbRole: 'Holds and connects all the small parts. Tall parts are on the back; small parts are on both sides; the solar cell sits 1.5 mm in front of the board.',
  wall: 1.0, R: 3.5, winR: 2.0, cell: AMG(1), pcb: { w: 41.4, h: 30.0, t: 0.8, corner: 1.5 }, space: 5.2, frontGap: 1.5,
  parts: L_MINI.parts, extra: { battery: battExtra(0) },
  frontPads: L_MINI.frontPads, solarNote: [-12, 5], vias: L_MINI.vias, traces: L_MINI.traces,
  clip: { w: 10, len: 24, y1: 12 }, cuts: COMMON_CUTS,
  camera: { pos: [-50, 32, -70], target: [0, 0, 5] },
  camExploded: { pos: [-95, 55, -120], target: [0, 0, 8] },
  camFront: { pos: [36, 20, 56], target: [0, 0, 5] },
});

// comparison numbers (big vs mini)
const cmp = (d, cellArea, uW, mwh, bat, songMem, songDay) => ({ songMem, songDay, outW: d.outW, outH: d.outH, outD: d.outD, totalD: d.totalD, volume: d.volume, cellArea, uW, mwh, bat });
export const COMPARE = {
  big: cmp(big.DEV, (41.4 * 52.2) / 100, 2 * 74.3, 3 * 130, '2 x ML2032, 65 mAh each, 3 V', '128 MB, about 9 h', 'about 3 h'),
  mini: cmp(mini.DEV, (41.4 * 26.1) / 100, 74.3, 3 * 65, 'ML2032, 65 mAh, 3 V', '128 MB, about 9 h', 'about 1.5 h'),
};

export const DEV = big.DEV;
export const PCBL = big.PCBL;
export const stage4 = big.stage;
export const stage5 = mini.stage;

// Shorthands for size text
export const sizeText = (p) => {
  if (p.dimText) return p.dimText;
  const s = p.size;
  const o = p.dimOrder === 'xzy' ? [s[0], s[2], s[1]] : s;
  const f = (n) => String(Math.round(n * 100) / 100);
  return o.map(f).join(' x ') + ' mm';
};
