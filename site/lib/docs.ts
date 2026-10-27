import { readFileSync } from "node:fs";
import { join } from "node:path";

export const DOCS = [
  { slug: "desk-test", title: "Desk test", blurb: "Hear your real songs on a Raspberry Pi Pico today. Wiring, code, what to check." },
  { slug: "cell-test", title: "Solar cell test", blurb: "Buy and measure test cells to find a second source for the solar cell." },
  { slug: "bom", title: "Parts list", blurb: "Every part, part number, shop in Spain, price and stock for each build." },
] as const;

export const readDoc = (slug: string) => readFileSync(join(process.cwd(), "content", `${slug}.md`), "utf8");
