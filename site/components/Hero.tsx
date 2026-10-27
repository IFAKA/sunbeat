"use client";
import { motion } from "motion/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { useRef } from "react";
import Stage3D, { type Stage3DHandle } from "./Stage3D";
import { REPO } from "./Nav";
import { Heading, Text, Button, Link, Kicker, Accent } from "./ui";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export default function Hero() {
  const root = useRef<HTMLElement>(null);
  const stage = useRef<Stage3DHandle>(null);
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
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.2, delay: 0.4 }} className="absolute inset-x-0 bottom-0 top-[44%] [container-type:size] md:top-[36%]">
        <Stage3D ref={stage} keepSpin initial={{ t: 0, yaw: 38, pitch: 14, spin: true, snap: true }} className="absolute inset-0" />
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
