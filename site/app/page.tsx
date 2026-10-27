import Smooth from "@/components/Smooth";
import Nav, { LocalBar, REPO } from "@/components/Nav";
import SolarGrid from "@/components/SolarGrid";
import Hero from "@/components/Hero";
import Film from "@/components/Film";
import Closer from "@/components/Closer";
import Reading from "@/components/Reading";
import Faq from "@/components/Faq";
import Reveal from "@/components/Reveal";
import Footer from "@/components/Footer";

const sec = "mx-auto flex min-h-svh max-w-[1080px] flex-col items-center justify-center px-5 pb-8 pt-20 text-center";
const h2 = "sh text-[clamp(34px,7.4svh,72px)] font-semibold leading-[1.04] tracking-[-0.04em] [text-wrap:balance]";
const kick = "kicker mb-[1.6svh] text-sun";

const NUMBERS = [
  ["149 µW", "from room light", "Two solar cells at 200 lux. Datasheet: 74 µW each.", "sun"],
  ["3 h", "of songs a day", "Kept up for ever on 8 hours of room light. Estimate.", "ice"],
  ["490 h", "with no light", "A full coin cell, songs only. Best case. Estimate.", "sun"],
  ["150", "songs on board", "128 MB, 8 kHz, about 9 hours.", "ice"],
] as const;

// Honest, hedged: the right column is a typical rechargeable player, not a named product, so no invented numbers.
const COMPARE = [
  ["Power", "Indoor solar cell, goal and estimate", "A cable and a wall plug"],
  ["Charging", "Never, if it gets room light (estimate)", "Every few uses, you must remember"],
  ["Songs", "Your own, about 150 at 8 kHz", "Your own, often better sound"],
  ["Sound", "Old phone call quality, wired earbuds", "Often Bluetooth, full quality"],
  ["Status", "Concept. Not for sale.", "You can buy one today"],
] as const;

const SPECS = [
  ["Size", "44.4 × 55.2 × 11.2 mm (13.0 mm with the clip)"],
  ["Volume", "27.4 cm³"],
  ["Solar cell", "2 × Panasonic AMG-1401C, 21.6 cm²"],
  ["Battery", "2 × ML2032 coin cell, 65 mAh each, 390 mWh"],
  ["Chip", "Ambiq Apollo3 (Artemis) module"],
  ["Songs", "Winbond 128 MB flash, 8 kHz, about 9 h"],
  ["Sound", "1-bit pin through a resistor and capacitor to a 3.5 mm jack"],
  ["Parts cost", "About 88 € ex VAT, parts only (estimate)"],
] as const;

const STATUS = [
  ["3D model, parts list, prices", "Done"],
  ["Desk test code (Raspberry Pi Pico)", "Written, checked on a Mac. Not run on a Pico yet."],
  ["Solar cell test", "Plan written. Cells not bought."],
  ["Real power use", "Not measured. Every hour above depends on it."],
  ["Song memory voltage", "Open problem: 2.7 V chip on a 1.9 V rail."],
  ["Circuit board", "Concept drawing only."],
  ["Laptop app", "Not built yet."],
] as const;

export default function Home() {
  return (
    <Smooth>
      <Nav />
      <LocalBar />
      <main>
        <Hero />
        <section aria-label="Highlights" className="relative mx-auto flex max-w-[1080px] flex-col items-center px-5 pb-6 pt-[22svh] text-center">
          <Reveal><p className={kick}>Highlights</p></Reveal>
          <Reveal delay={0.05}><h2 className={h2}>Get the highlights.</h2></Reveal>
        </section>
        <Film />

        <Reading />

        <section id="numbers" className={`${sec} relative`}>
          <SolarGrid />
          <Reveal><p className={kick}>The numbers</p></Reveal>
          <Reveal delay={0.05}><h2 className={h2}>Honest about every one.</h2></Reveal>
          <div className="mt-[4svh] grid w-full grid-cols-2 gap-3 md:grid-cols-4">
            {NUMBERS.map(([n, u, d, tone], i) => (
              <Reveal key={n} delay={i * 0.07}>
                <div className={`panel h-full p-5 text-left ${tone === "ice" ? "ice" : ""}`}>
                  <p className={`text-[clamp(32px,6svh,52px)] font-semibold leading-none tracking-[-0.04em] ${tone === "ice" ? "glow-ice text-ice" : "glow-sun text-sun"}`}>{n}</p>
                  <p className="mt-2 text-[17px] font-semibold">{u}</p>
                  <p className="mt-2 text-[13px] leading-snug text-mute">{d}</p>
                </div>
              </Reveal>
            ))}
          </div>
          <p className="mt-[3svh] max-w-[34em] text-sm text-mute">Nothing here is measured on the finished clip, because it is not built. Step 3 of the plan measures the real chip power.</p>
        </section>

        <section id="inside" className={sec}>
          <Reveal><p className={kick}>Closer look</p></Reveal>
          <Reveal delay={0.05}><h2 className={h2}>Take a closer look.</h2></Reveal>
          <Reveal delay={0.1}><p className="mt-3 max-w-[32em] text-[clamp(16px,2.4svh,21px)] text-mute">The real parts of the clip, from the open design. Turn it. Pull it apart.</p></Reveal>
          <Reveal delay={0.15} className="mt-[3svh] w-full"><Closer /></Reveal>
          <Reveal delay={0.2}><a href="/build" className="btn-neon mt-[4svh]">Open the full 3D model</a></Reveal>
          <p className="mt-3 text-sm text-mute">Hide any part, see the board and the wiring.</p>
        </section>

        <section id="compare" className={`${sec} relative`}>
          <Reveal><p className={kick}>Keep exploring</p></Reveal>
          <Reveal delay={0.05}><h2 className={h2}>Not a better player.<br />A player you stop thinking about.</h2></Reveal>
          <div className="mt-[4svh] grid w-full max-w-[880px] grid-cols-1 gap-4 text-left md:grid-cols-2">
            {[["Sunbeat", 1], ["A typical rechargeable player", 2]].map(([name, col]) => (
              <Reveal key={String(name)} delay={col === 1 ? 0.05 : 0.12}>
                <div className={`panel h-full p-6 ${col === 1 ? "" : "ice"}`}>
                  <h3 className={`kicker ${col === 1 ? "text-sun" : "text-ice"}`}>{name}</h3>
                  <ul className="mt-4 space-y-3">
                    {COMPARE.map((r) => <li key={r[0]} className="text-[clamp(14px,2svh,17px)] leading-snug"><span className="kicker mr-2 text-[10px] text-mute">{r[0]}</span>{r[col as 1 | 2]}</li>)}
                  </ul>
                </div>
              </Reveal>
            ))}
          </div>
          <p className="mt-[3svh] max-w-[34em] text-sm text-mute">The right column is a general picture of rechargeable players, not one product. Sunbeat numbers are estimates until the clip is built and measured.</p>
        </section>

        <section id="specs" className={sec}>
          <Reveal><p className={kick}>Tech Specs</p></Reveal>
          <Reveal delay={0.05}><h2 className={h2}>Tech specs.</h2></Reveal>
          <Reveal delay={0.1} className="w-full max-w-[720px]">
            <dl className="mt-[4svh] panel divide-y divide-white/10 px-5 text-left">
              {SPECS.map(([k, v]) => (
                <div key={k} className="grid grid-cols-[7em_1fr] gap-4 py-[1.4svh] text-[clamp(14px,2.1svh,18px)]"><dt className="text-mute">{k}</dt><dd className="font-medium">{v}</dd></div>
              ))}
            </dl>
          </Reveal>
        </section>

        <section id="status" className={sec}>
          <Reveal><p className={kick}>Status</p></Reveal>
          <Reveal delay={0.05}><h2 className={h2}>Where it really is.</h2></Reveal>
          <Reveal delay={0.1} className="w-full max-w-[720px]">
            <dl className="mt-[4svh] panel divide-y divide-white/10 px-5 text-left">
              {STATUS.map(([k, v]) => (
                <div key={k} className="grid grid-cols-1 gap-1 py-[1.4svh] text-[clamp(14px,2.1svh,17px)] sm:grid-cols-[15em_1fr] sm:gap-4"><dt className="font-medium">{k}</dt><dd className="text-mute">{v}</dd></div>
              ))}
            </dl>
          </Reveal>
          <Reveal delay={0.2}><a href="/docs" className="mt-[3svh] inline-block text-[17px] text-sun hover:underline">Read the desk test and the parts list ›</a></Reveal>
        </section>

        <section id="faq" className={`${sec} relative`}>
          <SolarGrid />
          <Reveal><p className={kick}>Open plan</p></Reveal>
          <Reveal delay={0.05}><h2 className={h2}>Built in public.</h2></Reveal>
          <Reveal delay={0.1}><a href={REPO} className="btn-neon mt-[3svh]">Follow it on GitHub</a></Reveal>
          <Reveal delay={0.2} className="mt-[4svh] w-full max-w-[680px] text-left"><Faq /></Reveal>
        </section>
      </main>
      <Footer />
    </Smooth>
  );
}
