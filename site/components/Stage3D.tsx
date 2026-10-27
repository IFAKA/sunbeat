"use client";
import { StageFrame, StagePoster } from "./ui";
import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from "react";

/** What the viewer understands (see public/viewer/index.html, "embed mode"). */
export type Pose = {
  /** seconds for the user's own turn to ease back (0 = stays) */ ret?: number; paused?: boolean; reset?: boolean;
  t?: number; yaw?: number; pitch?: number; dist?: number | "fit"; zoom?: number; focus?: string | string[] | null; spin?: boolean; speed?: number; snap?: boolean };
export type Stage3DHandle = { send: (p: Pose) => void };

/**
 * The real 3D device in an iframe. It loads only when near the screen, and is removed when far away,
 * so only one or two WebGL pages live at once. Until the viewer says "ready" we show a dark poster.
 */
const Stage3D = forwardRef<Stage3DHandle, { drag?: boolean; keepSpin?: boolean; marks?: string[]; onMarks?: (m: Record<string, number[]>) => void; ret?: number; initial?: Pose; className?: string; title?: string }>(function Stage3D({ drag = true, keepSpin, marks, onMarks, ret = 0, initial, className = "", title = "Sunbeat 3D model" }, ref) {
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
    // near: load the page. seen: really on screen, so draw frames (otherwise the viewer sleeps).
    const io = new IntersectionObserver(([e]) => setNear(e.isIntersecting), { rootMargin: "35% 0px" });
    const io2 = new IntersectionObserver(([e]) => { state.current.paused = !e.isIntersecting; post(); }, { rootMargin: "5% 0px" });
    if (box.current) { io.observe(box.current); io2.observe(box.current); }
    return () => { io.disconnect(); io2.disconnect(); };
  }, [post]);

  useEffect(() => {
    if (!near) { ready.current = false; setOk(false); return; }
    const on = (e: MessageEvent) => {
      if (e.source !== frame.current?.contentWindow || !e.data?.sunbeat) return;
      if (e.data.marks) { onMarks?.(e.data.marks); return; }
      if (!e.data.ready) return;
      ready.current = true; post(); setOk(true);
    };
    window.addEventListener("message", on);
    return () => window.removeEventListener("message", on);
  }, [near, post, onMarks]);

  const src = `/viewer/index.html?embed=1${drag ? "&drag=1" : ""}${keepSpin ? "&keepspin=1" : ""}${ret ? `&ret=${ret}` : ""}${marks ? `&marks=${marks.join(",")}` : ""}#stage=4`;
  return (
    <div ref={box} className={className}>
      <StagePoster hide={ok} />
      {near && <StageFrame frameRef={frame} src={src} title={title} ok={ok} drag={drag} />}
    </div>
  );
});
export default Stage3D;
