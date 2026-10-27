"use client";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { useEffect, useRef, useState } from "react";
import Stage3D, { type Pose, type Stage3DHandle } from "./Stage3D";

gsap.registerPlugin(ScrollTrigger, useGSAP);

// Each beat: kicker, caption, and the camera pose. yaw 0 = solar side, 180 = back. tone: sun = energy, ice = data.
type Beat = { k: string; tone: "sun" | "ice"; h: string; d: string; pose: Pose };
const BEATS: Beat[] = [
  { k: "00 / The problem", tone: "sun", h: "Chargers get forgotten.", d: "You reach for your music, and the battery is empty. Again.", pose: { t: 0, yaw: 21, pitch: 10 } },
  { k: "01 / Solar front", tone: "sun", h: "So give it a sun.", d: "The whole front of the clip is solar cells made for indoor light. Eight hours of room light keeps about 3 hours of songs a day. Estimate.", pose: { t: 0.3, yaw: 25, pitch: 8, focus: "solar" } },
  { k: "02 / Two coin cells", tone: "sun", h: "Room light is enough.", d: "It makes more energy than the music uses. Two coin cells hold 390 mWh. With no light at all: 490 hours of songs, best case. Estimate.", pose: { t: 0.5, yaw: 195, pitch: 14, focus: ["battery", "battery2", "aem", "l-boost", "l-buck"] } },
  { k: "03 / Artemis chip", tone: "ice", h: "Your songs. Not beeps.", d: "An Artemis chip plays your own songs. If the battery runs low, it switches to a simple chiptune version, then back when light returns.", pose: { t: 0.5, yaw: 150, pitch: 28, focus: ["artemis"] } },
  { k: "04 / 128 MB of songs", tone: "ice", h: "About 150 songs.", d: "128 MB of memory, 8 kHz, about 9 hours stored on the clip.", pose: { t: 0.5, yaw: 160, pitch: 24, focus: ["flash", "artemis"] } },
  { k: "05 / Your earbuds", tone: "ice", h: "Sound out.", d: "A 3.5 mm jack feeds any wired earbuds. Your earbud button controls it: click, two, three, hold. No screen.", pose: { t: 0.5, yaw: 125, pitch: 22, focus: ["artemis", "jack"] } },
  { k: "06 / USB-C", tone: "ice", h: "One cable. Songs only.", d: "Drag songs in on a laptop with USB-C. That is the only cable.", pose: { t: 0.5, yaw: 235, pitch: 18, focus: ["usbc", "ch340"] } },
  { k: "07 / Every part", tone: "sun", h: "Every part. Apart.", d: "Case, solar cells, board, coin cells, clip. Every number is labelled: measured or estimate.", pose: { t: 1, yaw: 215, pitch: 18 } },
  { k: "08 / Size", tone: "sun", h: "Clip it on.", d: "44.4 \u00d7 55.2 \u00d7 11.2 mm. 13.0 mm with the clip.", pose: { t: 0, yaw: 165, pitch: 8 } },
];
const N = BEATS.length;
const smooth = (x: number) => x * x * (3 - 2 * x);

/** The pose for scroll progress p: the explode amount and turn glide between beats. */
function poseAt(p: number): Pose {
  const i = Math.min(N - 1, Math.floor(p * N));
  const b = BEATS[i], prev = BEATS[Math.max(0, i - 1)].pose;
  const k = i === 0 ? 1 : smooth(Math.min(1, (p * N - i) / 0.55)); // glide in the first half of each beat
  const lerp = (a = 0, c = 0) => a + (c - a) * k;
  const turn = i === 0 ? (p - 1 / N) * 300 : 0; // beat 1: a slow turn that ends at the next pose
  return { t: lerp(prev.t, b.pose.t), yaw: lerp(prev.yaw, b.pose.yaw) + turn, pitch: lerp(prev.pitch, b.pose.pitch), zoom: 1, focus: b.pose.focus ?? null };
}
const TONE = { sun: "text-sun", ice: "text-ice" } as const;

/** One pinned screen, nine screens tall. Scroll drives the real 3D model; you can still turn it by hand. */
export default function Film() {
  const root = useRef<HTMLElement>(null);
  const stage = useRef<Stage3DHandle>(null);
  const caps = useRef<(HTMLDivElement | null)[]>([]);
  const dots = useRef<(HTMLSpanElement | null)[]>([]);
  const [still, setStill] = useState(false);
  useEffect(() => setStill(matchMedia("(prefers-reduced-motion: reduce)").matches), []);

  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      ScrollTrigger.create({
        trigger: root.current, start: "top top", end: "bottom bottom",
        onUpdate: (st) => {
          const p = st.progress;
          stage.current?.send(poseAt(p));
          BEATS.forEach((_, i) => {
            const a = i / N, z = (i + 1) / N, edge = 0.18 / N;
            const v = Math.max(0, Math.min(i === 0 ? 1 : (p - a) / edge, i === N - 1 ? 1 : (z - p) / edge, 1));
            const el = caps.current[i];
            if (el) { el.style.opacity = String(v); el.style.transform = `translateY(${(1 - v) * 14}px)`; }
            dots.current[i]?.classList.toggle("on", p >= a && p < z);
          });
        },
      });
    });
  }, { scope: root });

  if (still) return (
    <section id="film" className="mx-auto max-w-[900px] px-5 py-24 text-center">
      <Stage3D ret={0} initial={{ t: 1, yaw: 215, pitch: 18, snap: true }} className="relative h-[60svh] w-full" />
      <div className="mt-10 space-y-10">
        {BEATS.map((b) => <div key={b.h}><p className={`kicker ${TONE[b.tone]}`}>{b.k}</p><h2 className="mt-2 text-4xl font-semibold tracking-[-0.03em]">{b.h}</h2><p className="mx-auto mt-3 max-w-[30em] text-lg text-mute">{b.d}</p></div>)}
      </div>
    </section>
  );

  return (
    <section ref={root} id="film" className="relative" style={{ height: `${N * 100}svh` }}>
      <div className="sticky top-0 h-svh">
        <Stage3D ref={stage} ret={2.5} initial={{ ...poseAt(0), snap: true }} className="absolute inset-x-0 bottom-0 top-[34%] md:bottom-0 md:left-[26%] md:right-0 md:top-[48px]" />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-[36%] md:inset-y-0 md:right-auto md:h-full md:w-[40%]">
          <div className="relative h-full">
            {BEATS.map((b, i) => (
              <div key={b.h} ref={(el) => { caps.current[i] = el; }} style={{ opacity: i === 0 ? 1 : 0 }} className="absolute inset-x-5 top-[calc(48px+3svh)] md:left-[max(20px,calc((100vw-1080px)/2+20px))] md:right-4 md:top-1/2 md:-translate-y-1/2">
                <p className={`kicker ${TONE[b.tone]}`}>{b.k}</p>
                <h2 className={`mt-[1.2svh] text-[clamp(30px,min(9vw,6.2svh),64px)] font-semibold leading-[1.05] tracking-[-0.035em] md:text-[clamp(36px,4.4vw,62px)] ${b.tone === "ice" ? "glow-ice" : "glow-sun"}`}>{b.h}</h2>
                <p className="mt-[1.4svh] max-w-[26em] text-[clamp(14px,2.1svh,19px)] leading-snug text-mute">{b.d}</p>
              </div>
            ))}
          </div>
        </div>
        <div aria-hidden className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
          {BEATS.map((_, i) => <span key={i} ref={(el) => { dots.current[i] = el; }} className="block h-1 w-1.5 rounded-full bg-paper/30 transition-all duration-300 [&.on]:w-6 [&.on]:bg-sun [&.on]:shadow-[0_0_8px_var(--color-sun)]" />)}
        </div>
      </div>
    </section>
  );
}
