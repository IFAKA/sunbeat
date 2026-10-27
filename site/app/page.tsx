import { Battery, Cable, ClipboardCheck, Headphones, MousePointerClick, Music } from "lucide-react";
import Smooth from "@/components/Smooth";
import Nav, { REPO } from "@/components/Nav";
import Hero from "@/components/Hero";
import Story from "@/components/Story";
import Reading from "@/components/Reading";
import Faq from "@/components/Faq";
import Reveal from "@/components/Reveal";
import Footer from "@/components/Footer";

const sec = "mx-auto flex min-h-svh max-w-[1080px] flex-col items-center justify-center px-5 pb-8 pt-20 text-center";
const h2 = "text-[clamp(32px,7svh,64px)] font-semibold leading-[1.06] tracking-[-0.035em] [text-wrap:balance]";

const HIGHLIGHTS = [
  [Battery, "Solar, indoors", "10.8 cm² cell made for room light. No cable, ever."],
  [Music, "Your real songs", "About 150 songs, 9 hours, stored on the clip."],
  [Headphones, "Your earbuds", "Any wired earbuds. A round 3.5 mm plug."],
  [MousePointerClick, "Your earbud button", "Click, two, three, hold. No screen."],
  [Cable, "USB-C to add songs", "Drag songs in on a laptop. That is the only cable."],
  [ClipboardCheck, "Open and honest", "Every number is labelled: measured or estimate."],
] as const;

const NUMBERS = [
  ["149 µW", "from room light", "Two solar cells at 200 lux. Datasheet: 74 µW each."],
  ["3 h", "of songs a day", "Kept up for ever on 8 hours of room light. Estimate."],
  ["490 h", "with no light", "A full coin cell, songs only. Best case. Estimate."],
  ["150", "songs on board", "128 MB, 8 kHz, about 9 hours."],
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
      <main>
        <Hero />
        <Story />

        <section id="highlights" className={sec}>
          <Reveal><h2 className={h2}>Get the highlights.</h2></Reveal>
          <div className="mt-[4svh] grid w-full grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-3 md:grid-cols-3 md:gap-4">
            {HIGHLIGHTS.map(([Icon, t, d], i) => (
              <Reveal key={t} delay={i * 0.06}>
                <div className="flex h-full items-start gap-3 rounded-[22px] bg-card p-[clamp(14px,2.6svh,28px)] text-left sm:block">
                  <Icon className="size-[clamp(22px,3.6svh,32px)] shrink-0 text-sun" strokeWidth={1.8} />
                  <div><h3 className="text-[clamp(16px,2.8svh,24px)] font-semibold tracking-[-0.02em] sm:mt-[1.6svh]">{t}</h3>
                  <p className="mt-2 text-[clamp(13px,1.9svh,16px)] leading-snug text-mute">{d}</p></div>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        <Reading />

        <section id="numbers" className={sec}>
          <Reveal><p className="mb-[1.4svh] text-[clamp(17px,2.6svh,22px)] font-semibold text-sun">The numbers</p></Reveal>
          <Reveal delay={0.05}><h2 className={h2}>Honest about every one.</h2></Reveal>
          <div className="mt-[4svh] grid w-full grid-cols-2 gap-3 md:grid-cols-4">
            {NUMBERS.map(([n, u, d], i) => (
              <Reveal key={n} delay={i * 0.07}>
                <div className="h-full rounded-[22px] bg-card p-5 text-left">
                  <p className="text-[clamp(32px,6svh,52px)] font-semibold leading-none tracking-[-0.04em] text-sun">{n}</p>
                  <p className="mt-2 text-[17px] font-semibold">{u}</p>
                  <p className="mt-2 text-[13px] leading-snug text-mute">{d}</p>
                </div>
              </Reveal>
            ))}
          </div>
          <p className="mt-[3svh] max-w-[34em] text-sm text-mute">Nothing here is measured on the finished clip, because it is not built. Step 3 of the plan measures the real chip power.</p>
        </section>

        <section id="inside" className={sec}>
          <Reveal><h2 className={h2}>See every part.<br />At real size.</h2></Reveal>
          <Reveal delay={0.1} className="mt-[3svh] w-full">
            <a href="/build" className="group block overflow-hidden rounded-[22px] border border-line bg-black">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/inside.png" alt="The Sunbeat clip pulled apart: case, solar cell, circuit board, coin cell and clip" className="w-full transition-transform duration-700 group-hover:scale-[1.015]" />
            </a>
          </Reveal>
          <Reveal delay={0.2}><a href="/build" className="mt-[3svh] inline-block rounded-full bg-sun px-6 py-3 text-[17px] font-semibold text-black hover:brightness-110">Open the 3D model</a></Reveal>
          <p className="mt-3 text-sm text-mute">Pull it apart, hide any part, see the board and the wiring.</p>
        </section>

        <section id="specs" className={sec}>
          <Reveal><h2 className={h2}>Tech specs.</h2></Reveal>
          <Reveal delay={0.1} className="w-full max-w-[720px]">
            <dl className="mt-[4svh] divide-y divide-line border-y border-line text-left">
              {SPECS.map(([k, v]) => (
                <div key={k} className="grid grid-cols-[7em_1fr] gap-4 py-[1.4svh] text-[clamp(14px,2.1svh,18px)]"><dt className="text-mute">{k}</dt><dd className="font-medium">{v}</dd></div>
              ))}
            </dl>
          </Reveal>
        </section>

        <section id="status" className={sec}>
          <Reveal><h2 className={h2}>Where it really is.</h2></Reveal>
          <Reveal delay={0.1} className="w-full max-w-[720px]">
            <dl className="mt-[4svh] divide-y divide-line border-y border-line text-left">
              {STATUS.map(([k, v]) => (
                <div key={k} className="grid grid-cols-1 gap-1 py-[1.4svh] text-[clamp(14px,2.1svh,17px)] sm:grid-cols-[15em_1fr] sm:gap-4"><dt className="font-medium">{k}</dt><dd className="text-mute">{v}</dd></div>
              ))}
            </dl>
          </Reveal>
          <Reveal delay={0.2}><a href="/docs" className="mt-[3svh] inline-block text-[17px] text-sun hover:underline">Read the desk test and the parts list ›</a></Reveal>
        </section>

        <section id="faq" className={sec}>
          <Reveal><h2 className={h2}>Open plan.<br />Built in public.</h2></Reveal>
          <Reveal delay={0.1}><a href={REPO} className="mt-[3svh] inline-block rounded-full bg-sun px-6 py-3 text-[17px] font-semibold text-black hover:brightness-110">Follow it on GitHub</a></Reveal>
          <Reveal delay={0.2} className="mt-[4svh] w-full max-w-[680px] text-left"><Faq /></Reveal>
        </section>
      </main>
      <Footer />
    </Smooth>
  );
}
