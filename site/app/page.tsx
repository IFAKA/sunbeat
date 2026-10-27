import Smooth from "@/components/Smooth";
import Nav, { REPO } from "@/components/Nav";
import Hero from "@/components/Hero";
import Film from "@/components/Film";
import Closer from "@/components/Closer";
import Reading from "@/components/Reading";
import Faq from "@/components/Faq";
import Footer from "@/components/Footer";
import { Section, Heading, Kicker, Text, Button, Link, Stat, StatGrid, DefList, CompareGrid, CompareCard, Reveal, Column } from "@/components/ui";


const NUMBERS = [
  ["149 µW", "from room light", "Two solar cells at 200 lux. Datasheet: 74 µW each.", "sun"],
  ["3 h", "of songs a day", "Kept up for ever on 8 hours of room light. Estimate.", "sun"],
  ["490 h", "with no light", "A full coin cell, songs only. Best case. Estimate.", "sun"],
  ["150", "songs on board", "128 MB, 8 kHz, about 9 hours.", "sun"],
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
      <main>
        <Hero />
        <Section label="Highlights" variant="intro">
          <Reveal><Kicker>Highlights</Kicker></Reveal>
          <Reveal delay={0.05}><Heading mt={1}>Get the highlights.</Heading></Reveal>
        </Section>
        <Film />

        <Reading />

        <Section id="numbers" grid>
          <Reveal><Kicker>The numbers</Kicker></Reveal>
          <Reveal delay={0.05}><Heading mt={1}>Honest about every one.</Heading></Reveal>
          <StatGrid mt={5}>
            {NUMBERS.map(([n, u, d], i) => (
              <Reveal key={n} delay={i * 0.07} className="h-full"><Stat value={n} label={u} note={d} /></Reveal>
            ))}
          </StatGrid>
          <Text size="small" tone="mute" measure mt={4}>Nothing here is measured on the finished clip, because it is not built. Step 3 of the plan measures the real chip power.</Text>
        </Section>

        <Section id="inside">
          <Reveal><Kicker>Closer look</Kicker></Reveal>
          <Reveal delay={0.05}><Heading mt={1}>Take a closer look.</Heading></Reveal>
          <Reveal delay={0.1}><Text size="lead" tone="mute" measure mt={2}>The real parts of the clip, from the open design. Turn it. Pull it apart.</Text></Reveal>
          <Reveal delay={0.15} className="mt-[3svh] w-full"><Closer /></Reveal>
          <Reveal delay={0.2}><Button href="/build" mt={5}>Open the full 3D model</Button></Reveal>
          <Text size="small" tone="mute" mt={2}>Hide any part, see the board and the wiring.</Text>
        </Section>

        <Section id="compare">
          <Reveal><Kicker>Keep exploring</Kicker></Reveal>
          <Reveal delay={0.05}><Heading mt={1}>Not a better player.<br />A player you stop thinking about.</Heading></Reveal>
          <CompareGrid mt={5}>
            <Reveal delay={0.05} className="h-full"><CompareCard title="Sunbeat" tone="sun" rows={COMPARE.map((r) => [r[0], r[1]] as const)} /></Reveal>
            <Reveal delay={0.12} className="h-full"><CompareCard title="A typical rechargeable player" tone="mute" rows={COMPARE.map((r) => [r[0], r[2]] as const)} /></Reveal>
          </CompareGrid>
          <Text size="small" tone="mute" measure mt={4}>The right column is a general picture of rechargeable players, not one product. Sunbeat numbers are estimates until the clip is built and measured.</Text>
        </Section>

        <Section id="specs">
          <Reveal><Kicker>Tech Specs</Kicker></Reveal>
          <Reveal delay={0.05}><Heading mt={1}>Tech specs.</Heading></Reveal>
          <Reveal delay={0.1} className="w-full max-w-[720px]"><DefList rows={SPECS} variant="spec" mt={5} /></Reveal>
        </Section>

        <Section id="status">
          <Reveal><Kicker>Status</Kicker></Reveal>
          <Reveal delay={0.05}><Heading mt={1}>Where it really is.</Heading></Reveal>
          <Reveal delay={0.1} className="w-full max-w-[720px]"><DefList rows={STATUS} variant="status" mt={5} /></Reveal>
          <Reveal delay={0.2}><Link href="/docs" size="lead">Read the desk test and the parts list ›</Link></Reveal>
        </Section>

        <Section id="faq" grid>
          <Reveal><Kicker>Open plan</Kicker></Reveal>
          <Reveal delay={0.05}><Heading mt={1}>Built in public.</Heading></Reveal>
          <Reveal delay={0.1}><Button href={REPO} mt={4}>Follow it on GitHub</Button></Reveal>
          <Reveal delay={0.2} className="mt-[4svh] w-full"><Column><Faq /></Column></Reveal>
        </Section>
      </main>
      <Footer />
    </Smooth>
  );
}
