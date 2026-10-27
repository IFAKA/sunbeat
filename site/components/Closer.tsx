"use client";
import { useRef, useState } from "react";
import Stage3D, { type Pose, type Stage3DHandle } from "./Stage3D";

const CHIPS: [string, Pose][] = [
  ["All", { focus: null, yaw: 25, pitch: 12 }],
  ["Solar cell", { focus: "solar", yaw: 20, pitch: 10 }],
  ["Battery", { focus: ["battery", "battery2"], yaw: 195, pitch: 14 }],
  ["Board", { focus: "pcb", yaw: 195, pitch: 14 }],
  ["Case", { focus: ["case-front", "case-back", "clip"], yaw: 160, pitch: 18 }],
];

/** The device you can turn with your finger, an Assemble/Exploded slider, and a true-size check. */
export default function Closer() {
  const stage = useRef<Stage3DHandle>(null);
  const [t, setT] = useState(0);
  const [chip, setChip] = useState(0);
  return (
    <div className="w-full">
      <div className="relative overflow-hidden rounded-[22px] border border-line bg-black">
        <Stage3D ref={stage} drag initial={{ t: 0, zoom: 1.2, yaw: 25, pitch: 12, spin: true, snap: true }} className="relative h-[min(64svh,560px)] min-h-[320px] w-full" />
        <p className="pointer-events-none absolute left-4 top-3 text-xs text-mute">Drag to turn.</p>
      </div>
      <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
        {CHIPS.map(([name, pose], i) => (
          <button key={name} onClick={() => { setChip(i); stage.current?.send({ ...pose, spin: false }); }}
            className={`rounded-full px-4 py-2 text-[15px] ${chip === i ? "bg-sun font-semibold text-black" : "bg-card text-paper hover:bg-white/10"}`}>{name}</button>
        ))}
      </div>
      <label className="mx-auto mt-5 flex max-w-[460px] items-center gap-3 text-[15px] text-mute">
        <span>Assemble</span>
        <input type="range" min={0} max={100} value={Math.round(t * 100)} aria-label="Assemble or exploded" className="h-1 flex-1 accent-[#ffb340]"
          onChange={(e) => { const v = Number(e.target.value) / 100; setT(v); stage.current?.send({ t: v }); }} />
        <span>Exploded</span>
      </label>
      <ActualSize />
    </div>
  );
}

/** True size on your screen. CSS mm are about right on most screens, not exact. */
function ActualSize() {
  return (
    <div className="mt-10 flex flex-col items-center">
      <p className="text-[17px] font-semibold">Actual size</p>
      <div className="mt-4 flex flex-wrap items-end justify-center gap-6">
        <figure className="text-center">
          <div style={{ width: "44.4mm", height: "55.2mm" }} className="rounded-[4mm] border-2 border-sun bg-sun/10" />
          <figcaption className="mt-2 text-sm text-mute">Sunbeat<br />44.4 × 55.2 mm</figcaption>
        </figure>
        <figure className="text-center">
          <div style={{ width: "85.6mm", height: "54mm" }} className="rounded-[3mm] border border-paper/40" />
          <figcaption className="mt-2 text-sm text-mute">Credit card<br />85.6 × 54 mm</figcaption>
        </figure>
      </div>
      <p className="mt-3 max-w-[30em] text-xs text-mute">Screens differ, so this is close, not exact. Hold a real card to your screen to check.</p>
    </div>
  );
}
