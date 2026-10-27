"use client";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { BatteryLow, Ear, Music, Sun as SunIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Clip } from "./Sun";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const BEATS = [
  { h: "Chargers get forgotten.", d: "You reach for your music, and the battery is empty. Again." },
  { h: "So give it a sun.", d: "The whole front of the clip is a solar cell made for indoor light." },
  { h: "Room light is enough.", d: "It makes more energy than the music uses. The battery stays full." },
  { h: "Your songs. Not beeps.", d: "Put your own songs on it with USB-C. About 9 hours fit." },
  { h: "Low battery? It keeps singing.", d: "It switches to a simple chiptune version, then back when light returns." },
] as const;
const LEVEL = [8, 8, 100, 100, 100];

/** One tall section, one pinned screen. Scroll is the clock; the text changes one beat at a time. */
export default function Story() {
  const root = useRef<HTMLElement>(null);
  const [still, setStill] = useState(false);
  const [beat, setBeat] = useState(0);
  const last = useRef(0);
  useEffect(() => setStill(matchMedia("(prefers-reduced-motion: reduce)").matches), []);

  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const beats = gsap.utils.toArray<HTMLElement>(".beat");
      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: root.current, start: "top top", end: "bottom bottom", scrub: 0.4,
          onUpdate: (st) => { const b = Math.min(4, Math.floor(st.progress * 5)); if (b !== last.current) { last.current = b; setBeat(b); } },
        },
      });
      beats.forEach((b, i) => {
        if (i > 0) tl.fromTo(b, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.12, ease: "power2.out" }, i + 0.02);
        if (i < beats.length - 1) tl.to(b, { opacity: 0, y: -12, duration: 0.1, ease: "power2.in" }, i + 0.88);
      });
      tl.set({}, {}, 5);
    });
  }, { scope: root });

  if (still) return (
    <section id="story" className="mx-auto max-w-[760px] space-y-14 px-5 py-24 text-center">
      {BEATS.map((b) => <div key={b.h}><h2 className="text-4xl font-semibold tracking-[-0.03em]">{b.h}</h2><p className="mt-3 text-lg text-mute">{b.d}</p></div>)}
    </section>
  );

  const lvl = LEVEL[beat];
  return (
    <section ref={root} id="story" className="relative h-[560svh]">
      <div className="sticky top-0 flex h-svh flex-col items-center justify-center overflow-hidden px-5 pb-[56px] pt-[56px] text-center">
        <div className="relative h-[27svh] w-full max-w-[760px] shrink-0">
          {BEATS.map((b, i) => (
            <div key={b.h} className="beat absolute inset-0 flex flex-col items-center justify-center" style={{ opacity: i === 0 ? 1 : 0 }}>
              <h2 className="text-[clamp(26px,min(6.2svh,8.4vw),60px)] font-semibold leading-[1.07] tracking-[-0.03em] [text-wrap:balance]">{b.h}</h2>
              <p className="mt-[1.6svh] max-w-[30em] text-[clamp(16px,2.4svh,21px)] leading-snug text-mute [text-wrap:balance]">{b.d}</p>
            </div>
          ))}
        </div>

        <div aria-hidden className="grid h-[min(44svh,400px)] w-full max-w-[860px] shrink-0 grid-cols-[1fr_auto_1fr_auto_1fr] items-center gap-1 sm:gap-4">
          <Node label="Light" on={beat >= 1}>
            <div className="relative grid size-[min(17vw,16svh,140px)] place-items-center rounded-full border border-line bg-card">
              {beat >= 1 && <span className="ring absolute inset-0 rounded-full border border-sun" />}
              <SunIcon className={`size-[44%] transition-colors duration-500 ${beat >= 1 ? "text-sun" : "text-paper/30"}`} strokeWidth={1.6} />
            </div>
          </Node>
          <Arrow show={beat >= 1} />
          <Node label={beat === 0 ? "Empty battery" : "Clip and battery"} on pad>
            <div className="w-[clamp(90px,24vw,190px)]">
              <Clip className={`w-full transition-shadow duration-700 ${beat >= 2 ? "shadow-[0_0_60px_rgba(255,179,64,0.4)]" : ""}`} />
              <div className="mt-3 h-3 overflow-hidden rounded-full border border-line bg-card">
                <div className={`h-full rounded-full transition-all duration-1000 ${lvl < 20 ? "bg-red-500" : "bg-sun"}`} style={{ width: `${lvl}%` }} />
              </div>
              <p className="mt-1 text-[clamp(11px,1.8svh,14px)] text-mute">{lvl < 20 ? "8%" : "Full"}</p>
            </div>
          </Node>
          <Arrow show={beat >= 3 || beat === 0} />
          <Node label={beat === 4 ? "Chiptune backup" : beat >= 3 ? "Your songs" : "Silence"} on={beat >= 3 || beat === 0}>
            <div className="relative grid size-[min(17vw,16svh,140px)] place-items-center rounded-full border border-line bg-card">
              {beat >= 3 && <span className="ring absolute inset-0 rounded-full border border-paper/60" />}
              {beat === 0 ? <BatteryLow className="size-[44%] text-red-500" strokeWidth={1.6} /> : beat === 4 ? <Music className="size-[44%] text-sun" strokeWidth={1.6} /> : <Ear className="size-[44%] text-paper" strokeWidth={1.6} />}
            </div>
          </Node>
        </div>

        <div aria-hidden className="absolute bottom-2 left-1/2 flex -translate-x-1/2 gap-1.5">
          {BEATS.map((_, i) => <span key={i} className={`block h-1 rounded-full transition-all duration-300 ${beat === i ? "w-6 bg-paper" : "w-1.5 bg-paper/30"}`} />)}
        </div>
      </div>
    </section>
  );
}

function Node({ label, on, pad, children }: { label: string; on: boolean; pad?: boolean; children: React.ReactNode }) {
  return (
    <div className={`flex min-w-0 flex-col items-center transition-opacity duration-500 ${pad ? "pb-6" : ""} ${on ? "opacity-100" : "opacity-25"}`}>
      {children}
      <p className="mt-3 text-[clamp(11px,1.9svh,15px)] leading-tight text-mute">{label}</p>
    </div>
  );
}
function Arrow({ show }: { show: boolean }) {
  return <span className={`text-[clamp(14px,3svh,28px)] text-mute transition-opacity duration-500 ${show ? "opacity-100" : "opacity-0"}`}>→</span>;
}
