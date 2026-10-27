"use client";
import { motion } from "motion/react";
import Stage3D from "./Stage3D";
import { REPO } from "./Nav";

export default function Hero() {
  return (
    <section id="overview" className="relative mx-auto flex h-svh max-w-[1080px] flex-col items-center justify-center overflow-x-clip px-5 pb-8 pt-[calc(48px+4svh)] text-center">
      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }} className="mb-[1.4svh] text-[clamp(15px,2.2svh,20px)] font-semibold text-sun">Sunbeat</motion.p>
      <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 0.61, 0.36, 1] }} className="text-[clamp(30px,min(8.4vw,10vh),96px)] font-semibold leading-[1.04] tracking-[-0.035em] [text-wrap:balance]">
        Music that<br />never needs charging.
      </motion.h1>
      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.5 }} className="mt-[2vh] max-w-[28em] text-[clamp(17px,2.6vh,24px)] leading-snug text-mute">
        A clip with a solar cell. Your own songs. Your own wired earbuds.
      </motion.p>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.7 }} className="mt-[3vh] flex items-center gap-6 text-[17px]">
        <a href="/build" className="rounded-full bg-sun px-5 py-2.5 font-semibold text-black hover:brightness-110">See inside in 3D</a>
        <a href="#story" className="text-sun hover:underline">How it works ›</a>
      </motion.div>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.2, delay: 0.6 }} className="relative mt-[2svh] min-h-0 w-full flex-1"><Stage3D initial={{ t: 0, zoom: 1.2, yaw: 25, pitch: 12, spin: true, snap: true }} className="absolute inset-0" /></motion.div>
      <a href={REPO} className="sr-only">Source on GitHub</a>
    </section>
  );
}
