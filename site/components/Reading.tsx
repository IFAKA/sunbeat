"use client";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { useRef } from "react";
import { Heading, Kicker, Text, SolarGrid } from "./ui";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/** Two-tone reading: lines wake one by one as you scroll. The unread ones stay readable. */
export default function Reading() {
  const root = useRef<HTMLElement>(null);
  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.set(".pl", { opacity: 0.35 }); gsap.set(".pl-lead", { opacity: 0.2 });
      const tl = gsap.timeline({ defaults: { ease: "none" }, scrollTrigger: { trigger: root.current, start: "top top", end: "bottom bottom", scrub: 0.4 } });
      gsap.utils.toArray<HTMLElement>(".pl").forEach((l, i) => tl.to(l, { opacity: 1, duration: 0.6 }, i * 0.8));
      tl.to(".pl-lead", { opacity: 1, duration: 0.6 }, 3.4);
      tl.set({}, {}, 4.4);
    });
  }, { scope: root });
  return (
    <section ref={root} id="never" className="relative h-[240svh]">
      <div className="sticky top-0 h-svh"><SolarGrid flat /></div>
      <div className="sticky top-0 mx-auto -mt-[100svh] flex h-svh max-w-[1080px] flex-col items-center justify-center px-5 py-[56px] text-center">
        <Kicker>Nothing to remember</Kicker>
        {["charger.", "cable.", "reminder."].map((w, i) => <Heading key={w} level="statement" as="p" mt={i === 0 ? 3 : undefined} className="pl">No {w}</Heading>)}
        <Text size="lead" tone="mute" measure mt={4} className="pl-lead">Wear it. Light fills the battery while you do. In a drawer it sleeps and uses almost nothing.</Text>
      </div>
    </section>
  );
}
