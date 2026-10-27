// One font, one kit. Fails when a file outside components/ui and globals.css styles things by hand.
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const root = new URL("..", import.meta.url).pathname;
const SCAN = ["app", "components", "lib"];
const SKIP = [join(root, "components/ui"), join(root, "app/globals.css")];
const EXT = /\.(tsx?|jsx?|css|mdx?)$/;

const RULES = [
  [/font-family|font-mono|ui-monospace|monospace|font-\[/, "font: Inter only, set in globals.css"],
  [/#[0-9a-fA-F]{3,8}\b|\brgba?\(|\bhsla?\(|\boklch\(/, "hard-coded colour: use a token (text-sun, text-mute ...) through a kit prop"],
  [/\b(?:text|bg|border|shadow|rounded|leading|tracking|ring|fill|stroke|accent|outline|divide|from|via|to)-\[/, "arbitrary Tailwind value: add it to the kit or to a token"],
  [/\b(?:text|bg|border|ring|fill|stroke|divide|accent|shadow|decoration)-(?:sun|mute|paper|ink|card|line|white|black|ice|(?:slate|gray|zinc|neutral|red|blue|green|orange|yellow|amber|cyan|sky|teal|blue|indigo|violet)-\d+)\b/, "colour utility: use a kit prop (tone)"],
  [/\b(?:text-(?:xs|sm|base|lg|xl|[2-9]xl)|font-(?:thin|light|normal|medium|semibold|bold|extrabold|black)|tracking-(?:tighter|tight|normal|wide|wider|widest)|leading-(?:none|tight|snug|normal|relaxed|loose)|uppercase|lowercase|capitalize|italic)\b/, "type utility: use Heading / Text / Kicker"],
  [/\b(?:rounded(?:-[a-z0-9]+)?|shadow(?:-[a-z0-9]+)?|backdrop-blur(?:-[a-z0-9]+)?|blur(?:-[a-z0-9]+)?)\b(?=[ "'`])/, "radius/shadow utility: use Panel / Button / Chip"],
  [/style=\{\{[^}]*(?:color|background|font|fill|shadow|filter|mask)/i, "inline style for look"],
];

const bad = [];

function walk(dir) {
  for (const n of readdirSync(dir)) {
    const p = join(dir, n);
    if (SKIP.includes(p)) continue;
    if (statSync(p).isDirectory()) walk(p);
    else if (EXT.test(n)) scan(p);
  }
}
function scan(file) {
  readFileSync(file, "utf8").split("\n").forEach((line, i) => {
    const code = line.replace(/^\s*\/\/.*$/, "");
    for (const [re, why] of RULES) if (re.test(code)) bad.push(`${relative(root, file)}:${i + 1}  ${why}\n    ${line.trim().slice(0, 140)}`);
  });
}
for (const d of SCAN) walk(join(root, d));

// The 3D viewer is a separate page: it may only use the one Inter stack.
for (const f of ["public/viewer/index.html", "public/viewer/parts.js"]) {
  readFileSync(join(root, f), "utf8").split("\n").forEach((line, i) => {
    const m = line.match(/font-family\s*[:=]\s*"?([^;"]+)/g) || [];
    for (const x of m) if (!/Inter, system-ui, sans-serif|^font-family:Inter;/.test(x.replace(/\s+/g, " ").replace("font-family:", "font-family: ").replace(/font-family: +/, "")) && !/Inter/.test(x)) bad.push(`${f}:${i + 1}  font-family must be Inter\n    ${x}`);
    if (/monospace|Arial|Helvetica|Roboto|Segoe|\bserif\b(?!.*sans)/.test(line) && !/system-ui, sans-serif/.test(line)) bad.push(`${f}:${i + 1}  other font\n    ${line.trim().slice(0, 140)}`);
    if (/px sans-serif/.test(line)) bad.push(`${f}:${i + 1}  canvas font must be Inter\n    ${line.trim().slice(0, 140)}`);
  });
}

// One colour: orange only. No cyan/ice anywhere in the kit, tokens, pages or the 3D viewer.
for (const f of ["app/globals.css", "public/viewer/index.html", ...["controls", "layout", "stage", "surfaces", "type"].map((n) => `components/ui/${n}.tsx`)]) {
  readFileSync(join(root, f), "utf8").split("\n").forEach((line, i) => {
    if (/\bice\b|cyan|--color-ice|ui-callout|0x35e6ff|#5ce1ff/i.test(line)) bad.push(`${f}:${i + 1}  one colour (orange): no ice/cyan\n    ${line.trim().slice(0, 140)}`);
  });
}

if (bad.length) { console.error(`check:ui found ${bad.length} problem(s). One font, one kit: add to components/ui instead.\n`); console.error(bad.join("\n")); process.exit(1); }
console.log("check:ui ok");
