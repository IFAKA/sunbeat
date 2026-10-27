"use client";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { useEffect, useRef, useState } from "react";
import Stage3D, { type Pose, type Stage3DHandle } from "./Stage3D";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const CELLS = ["battery", "battery2"];
// Each beat: caption, scroll range [from, to] (0..1) and the camera pose. yaw 0 = solar side, 180 = back.
const BEATS: { h: string; d: string; at: [number, number]; pose: Pose }[] = [
  { h: "No charger.", d: "One small clip. Turn it around.", at: [0, 0.17], pose: { t: 0, yaw: 21, pitch: 10 } },
  { h: "Light in.", d: "Two solar cells face the room. Eight hours of room light keeps about 3 hours of songs a day. Estimate.", at: [0.17, 0.35], pose: { t: 0.25, yaw: 25, pitch: 8, focus: "solar", zoom: 1.15 } },
  { h: "Power stored.", d: "Two coin cells hold 390 mWh. With no light at all: 490 hours of songs, best case. Estimate.", at: [0.35, 0.53], pose: { t: 0.5, yaw: 195, pitch: 14, focus: CELLS, zoom: 1.25 } },
  { h: "Brain and sound.", d: "An Artemis chip plays your songs. A 3.5 mm jack feeds your earbuds. About 150 songs, 9 hours.", at: [0.53, 0.71], pose: { t: 0.5, yaw: 150, pitch: 28, focus: ["artemis", "jack"], zoom: 1.35 } },
  { h: "Every part. Apart.", d: "Case, solar cells, board, coin cells, clip. All in the open parts list.", at: [0.71, 0.88], pose: { t: 1, yaw: 215, pitch: 18 } },
  { h: "Clip it on.", d: "44.4 × 55.2 × 11.2 mm. 13.0 mm with the clip.", at: [0.88, 1], pose: { t: 0, yaw: 165, pitch: 8, zoom: 1.1 } },
];
const smooth = (x: number) => x * x * (3 - 2 * x);

/** The pose for scroll progress p: the explode amount and turn glide between beats. */
function poseAt(p: number): Pose {
  const found = BEATS.findIndex((b) => p < b.at[1]);
  const i = found < 0 ? BEATS.length - 1 : found;
  const b = BEATS[i], prev = BEATS[Math.max(0, i - 1)].pose;
  const k = i === 0 ? 1 : smooth(Math.min(1, (p - b.at[0]) / 0.08)); // glide in the first part of each beat
  const lerp = (a = 0, c = 0) => a + (c - a) * k;
  const turn = i === 0 ? (p - b.at[1]) * 300 : 0; // beat 1: a slow turn that ends at the next pose
  return { t: lerp(prev.t, b.pose.t), yaw: lerp(prev.yaw, b.pose.yaw) + turn, pitch: lerp(prev.pitch, b.pose.pitch), zoom: lerp(prev.zoom ?? 1, b.pose.zoom ?? 1), focus: b.pose.focus ?? null };
}

/** One pinned screen, about five screens tall. Scroll drives the real 3D model. */
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
          BEATS.forEach((b, i) => {
            const [a, z] = b.at, edge = 0.025;
            const v = Math.max(0, Math.min(i === 0 ? 1 : (p - a) / edge, i === BEATS.length - 1 ? 1 : (z - p) / edge, 1));
            const el = caps.current[i];
            if (el) { el.style.opacity = String(v); el.style.transform = `translateY(${(1 - v) * 14}px)`; }
            dots.current[i]?.classList.toggle("on", p >= a && p < z);
          });
        },
      });
    });
  }, { scope: root });

  if (still) return (
    <section id="story-3d" className="mx-auto max-w-[900px] px-5 py-24 text-center">
      <Stage3D initial={{ t: 1, yaw: 215, pitch: 18, snap: true }} className="relative h-[60svh] w-full" />
      <div className="mt-10 space-y-10">
        {BEATS.map((b) => <div key={b.h}><h2 className="text-4xl font-semibold tracking-[-0.03em]">{b.h}</h2><p className="mx-auto mt-3 max-w-[30em] text-lg text-mute">{b.d}</p></div>)}
      </div>
    </section>
  );

  return (
    <section ref={root} id="film" className="relative h-[500svh]">
      <div className="sticky top-0 h-svh overflow-hidden">
        <Stage3D ref={stage} initial={{ ...poseAt(0), snap: true }} className="absolute inset-x-0 bottom-0 top-[40%] md:inset-y-0 md:left-[34%] md:right-0 md:top-0" />
        <div className="absolute inset-x-0 top-0 h-[40%] md:inset-y-0 md:right-auto md:h-full md:w-[38%]">
          <div className="relative h-full">
            {BEATS.map((b, i) => (
              <div key={b.h} ref={(el) => { caps.current[i] = el; }} style={{ opacity: i === 0 ? 1 : 0 }} className="absolute inset-x-5 top-[calc(48px+3svh)] md:left-[max(20px,calc((100vw-1080px)/2+20px))] md:right-4 md:top-1/2 md:-translate-y-1/2">
                <h2 className="text-[clamp(32px,min(9vw,6.4svh),64px)] font-semibold leading-[1.05] tracking-[-0.035em] md:text-[clamp(36px,4.6vw,64px)]">{b.h}</h2>
                <p className="mt-[1.4svh] max-w-[26em] text-[clamp(15px,2.2svh,20px)] leading-snug text-mute">{b.d}</p>
              </div>
            ))}
          </div>
        </div>
        <div aria-hidden className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
          {BEATS.map((_, i) => <span key={i} ref={(el) => { dots.current[i] = el; }} className="block h-1 w-1.5 rounded-full bg-paper/30 transition-all duration-300 [&.on]:w-6 [&.on]:bg-paper" />)}
        </div>
      </div>
    </section>
  );
}
