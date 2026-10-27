"use client";
import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from "react";

/** What the viewer understands (see public/viewer/index.html, "embed mode"). */
export type Pose = { t?: number; yaw?: number; pitch?: number; dist?: number | "fit"; zoom?: number; focus?: string | string[] | null; spin?: boolean; speed?: number; snap?: boolean };
export type Stage3DHandle = { send: (p: Pose) => void };

/**
 * The real 3D device in an iframe. It loads only when near the screen, and is removed when far away,
 * so only one or two WebGL pages live at once. Until the viewer says "ready" we show a dark poster.
 */
const Stage3D = forwardRef<Stage3DHandle, { drag?: boolean; initial?: Pose; className?: string; title?: string }>(function Stage3D({ drag, initial, className = "", title = "Sunbeat 3D model" }, ref) {
  const box = useRef<HTMLDivElement>(null);
  const frame = useRef<HTMLIFrameElement>(null);
  const ready = useRef(false);
  const state = useRef<Pose>({ ...initial });
  useEffect(() => { if (matchMedia("(prefers-reduced-motion: reduce)").matches) state.current.spin = false; }, []);
  const [near, setNear] = useState(false);
  const [ok, setOk] = useState(false);

  const post = useCallback(() => {
    if (!ready.current) return;
    frame.current?.contentWindow?.postMessage({ sunbeat: 1, ...state.current }, "*");
    delete state.current.snap; // jump to the start pose only once
  }, []);
  useImperativeHandle(ref, () => ({ send: (p) => { Object.assign(state.current, p); post(); } }), [post]);

  useEffect(() => {
    const io = new IntersectionObserver(([e]) => setNear(e.isIntersecting), { rootMargin: "60% 0px" });
    if (box.current) io.observe(box.current);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!near) { ready.current = false; setOk(false); return; }
    const on = (e: MessageEvent) => {
      if (e.source !== frame.current?.contentWindow || !e.data?.sunbeat || !e.data.ready) return;
      ready.current = true; post(); setOk(true);
    };
    window.addEventListener("message", on);
    return () => window.removeEventListener("message", on);
  }, [near, post]);

  return (
    <div ref={box} className={className}>
      <Poster hide={ok} />
      {near && (
        <iframe ref={frame} title={title} src={`/viewer/index.html?embed=1${drag ? "&drag=1" : ""}#stage=4`} loading="lazy" tabIndex={-1}
          className={`absolute inset-0 size-full border-0 transition-opacity duration-700 ${ok ? "opacity-100" : "opacity-0"} ${drag ? "" : "pointer-events-none"}`} />
      )}
    </div>
  );
});
export default Stage3D;

/** Shown while the 3D page loads: a faint outline of the device (44.4 x 55.2 mm). */
function Poster({ hide }: { hide: boolean }) {
  return (
    <div aria-hidden className={`absolute inset-0 grid place-items-center transition-opacity duration-700 ${hide ? "opacity-0" : "opacity-100"}`}>
      <div className="aspect-[44.4/55.2] h-[min(60%,320px)] rounded-[12%] border border-white/15 bg-[radial-gradient(closest-side,rgba(255,179,64,0.12),transparent)]" />
    </div>
  );
}
