"use client";
import { motion } from "motion/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { useCallback, useRef } from "react";
import Stage3D, { type Stage3DHandle } from "./Stage3D";
import { REPO } from "./Nav";
import { Heading, Text, Button, Link, Kicker, Accent, CalloutLabel } from "./ui";

gsap.registerPlugin(ScrollTrigger, useGSAP);

// Leader-line callouts. tone: sun = energy, ice = data.
const MARKS: [string, string, "sun" | "ice"][] = [
  ["solar", "Solar cell", "sun"], ["aem", "Harvester", "sun"], ["battery", "Coin cells", "sun"], ["artemis", "Artemis", "ice"], ["jack", "Jack", "ice"],
];

export default function Hero() {
  const root = useRef<HTMLElement>(null);
  const stage = useRef<Stage3DHandle>(null);
  const tags = useRef<Record<string, HTMLDivElement | null>>({});
  const place = useCallback((m: Record<string, number[]>) => {
    const box = tags.current[MARKS[0][0]]?.parentElement;
    const H = box?.clientHeight ?? 600, W = box?.clientWidth ?? 1000;
    const GAP = 26; // min px between labels on one side
    const COL = H * 0.23 + 48; // labels sit in two columns just outside the device, so they never cover it
    const items: { id: string; x: number; y: number; ny: number; side: "l" | "r" }[] = [];
    for (const [id] of MARKS) {
      const el = tags.current[id], p = m[id];
      if (!el) continue;
      if (!p || !p[2]) { el.style.opacity = "0"; continue; }
      el.style.opacity = "1";
      items.push({ id, x: p[0], y: p[1] * H, ny: p[1] * H, side: p[0] < 0.5 ? "l" : "r" });
    }
    // Collision avoidance: per side, sort by height and push labels apart. Then re-centre each pushed run on its points.
    for (const side of ["l", "r"] as const) {
      const g = items.filter((i) => i.side === side).sort((a, b) => a.y - b.y);
      for (let k = 1; k < g.length; k++) g[k].ny = Math.max(g[k].ny, g[k - 1].ny + GAP);
      const shift = g.length ? g.reduce((t, i) => t + (i.ny - i.y), 0) / g.length : 0;
      for (const i of g) i.ny = Math.min(H - 12, Math.max(12, i.ny - shift));
      for (let k = 1; k < g.length; k++) g[k].ny = Math.max(g[k].ny, g[k - 1].ny + GAP);
    }
    for (const i of items) {
      const el = tags.current[i.id]!, dy = i.ny - i.y, px = i.x * W;
      const run = Math.max(28, i.side === "l" ? px - (W / 2 - COL) : W / 2 + COL - px);
      el.style.transform = `translate(${px}px, ${i.y}px)`;
      el.dataset.side = i.side;
      el.style.setProperty("--dy", `${dy}px`);
      el.style.setProperty("--run", `${run}px`);
      el.style.setProperty("--len", `${Math.hypot(run, dy)}px`);
      el.style.setProperty("--ang", `${Math.atan2(dy, run)}rad`);
    }
  }, []);

  // Scrub: the device turns and starts to open as you scroll out of the hero, and meets the first beat of the film.
  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      ScrollTrigger.create({
        trigger: root.current, start: "top top", end: "bottom top",
        onUpdate: (st) => { const p = st.progress; stage.current?.send({ yaw: 38 - p * 54, pitch: 14 - p * 4, t: 0 }); },
      });
    });
  }, { scope: root });

  return (
    <section ref={root} id="overview" className="relative h-svh min-h-[620px] overflow-x-clip text-center">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.2, delay: 0.4 }} className="absolute inset-x-0 bottom-0 top-[30%] [container-type:size] md:-bottom-[6%] md:top-[18%]">
        <Stage3D ref={stage} keepSpin marks={MARKS.map((m) => m[0])} onMarks={place} initial={{ t: 0, yaw: 38, pitch: 14, spin: true, snap: true }} className="absolute inset-0" />
        <div aria-hidden className="pointer-events-none absolute inset-0 hidden md:block">
          {MARKS.map(([id, label, tone]) => <CalloutLabel key={id} tone={tone} label={label} refCb={(el) => { tags.current[id] = el; }} />)}
        </div>
      </motion.div>
      <div className="pointer-events-none relative z-10 mx-auto flex max-w-[1080px] flex-col items-center px-5 pt-[calc(56px+3svh)]">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 0.61, 0.36, 1] }}>
          <Heading level="display">Never <Accent glow>charge.</Accent></Heading>
        </motion.div>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.5 }}>
          <Text size="lead" tone="mute" measure mt={2} className="max-w-[36em]">A clip with a solar cell. Your own songs. Your own wired earbuds.</Text>
        </motion.div>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.7 }} className="pointer-events-auto mt-[2.4vh] flex items-center gap-6">
          <Button href="/build">See inside in 3D</Button>
          <Link href="#film" size="lead">Get the highlights ›</Link>
        </motion.div>
      </div>
      <Kicker tone="mute" size="small" className="absolute bottom-3 left-1/2 -translate-x-1/2">Drag to turn it</Kicker>
      <a href={REPO} className="sr-only">Source on GitHub</a>
    </section>
  );
}
