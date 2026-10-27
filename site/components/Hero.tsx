"use client";
import { motion } from "motion/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { useCallback, useRef } from "react";
import Stage3D, { type Stage3DHandle } from "./Stage3D";
import { REPO } from "./Nav";

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
    for (const [id] of MARKS) {
      const el = tags.current[id], p = m[id];
      if (!el) continue;
      if (!p || !p[2]) { el.style.opacity = "0"; continue; }
      el.style.opacity = "1";
      el.style.transform = `translate(${p[0] * 100}cqw, ${p[1] * 100}cqh)`;
      el.dataset.side = p[0] < 0.5 ? "l" : "r";
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
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.2, delay: 0.4 }} className="absolute inset-x-0 bottom-0 top-[34%] md:top-[28%]" style={{ containerType: "size" }}>
        <Stage3D ref={stage} keepSpin marks={MARKS.map((m) => m[0])} onMarks={place} initial={{ t: 0, yaw: 38, pitch: 14, spin: true, snap: true }} className="absolute inset-0" />
        <div aria-hidden className="pointer-events-none absolute inset-0 hidden md:block">
          {MARKS.map(([id, label, tone]) => (
            <div key={id} ref={(el) => { tags.current[id] = el; }} style={{ opacity: 0 }} className={`callout ${tone}`}><i /><b /><span className="kicker">{label}</span></div>
          ))}
        </div>
      </motion.div>
      <div className="pointer-events-none relative z-10 mx-auto flex max-w-[1080px] flex-col items-center px-5 pt-[calc(56px+3svh)]">
        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 0.61, 0.36, 1] }} className="text-[clamp(34px,min(10vw,10.5vh),104px)] font-semibold leading-[1.02] tracking-[-0.04em] [text-wrap:balance]">
          Never <span className="glow-sun text-sun">charge.</span>
        </motion.h1>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.5 }} className="mt-[1.6vh] max-w-[36em] text-[clamp(16px,2.4vh,23px)] leading-snug text-mute">
          A clip with a solar cell. Your own songs. Your own wired earbuds.
        </motion.p>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.7 }} className="pointer-events-auto mt-[2.4vh] flex items-center gap-6 text-[17px]">
          <a href="/build" className="btn-neon">See inside in 3D</a>
          <a href="#film" className="text-sun hover:underline">Get the highlights ›</a>
        </motion.div>
      </div>
      <p aria-hidden className="kicker absolute bottom-3 left-1/2 -translate-x-1/2 text-mute/70">Drag to turn it</p>
      <a href={REPO} className="sr-only">Source on GitHub</a>
    </section>
  );
}
