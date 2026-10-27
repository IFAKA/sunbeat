"use client";
import { useRef, useState } from "react";
import Stage3D, { type Pose, type Stage3DHandle } from "./Stage3D";

const CHIPS: [string, string, Pose][] = [
  ["Closed", "The clip as you wear it.", { t: 0, focus: null, yaw: 25, pitch: 12 }],
  ["Exploded", "Every part, apart. Light travels in orange, songs and sound in cyan.", { t: 1, focus: null, yaw: 210, pitch: 18 }],
  ["Light", "The front is the solar cell. It turns room light into power.", { t: 0.35, focus: "solar", yaw: 20, pitch: 10 }],
  ["Store", "Two coin cells keep the power. The harvester chip moves it in.", { t: 0.5, focus: ["battery", "battery2", "aem", "l-boost", "l-buck"], yaw: 195, pitch: 14 }],
  ["Songs", "An Artemis chip plays songs kept in 128 MB of memory.", { t: 0.5, focus: ["artemis", "flash"], yaw: 150, pitch: 26 }],
  ["Sound", "A 3.5 mm jack feeds your wired earbuds.", { t: 0.5, focus: ["artemis", "jack"], yaw: 125, pitch: 22 }],
  ["Case", "Front frame, back shell and spring clip.", { t: 1, focus: ["case-front", "case-back", "clip"], yaw: 160, pitch: 18 }],
];

/** The device you can turn with your finger, with an Assemble/Exploded slider. */
export default function Closer() {
  const stage = useRef<Stage3DHandle>(null);
  const [t, setT] = useState(0);
  const [chip, setChip] = useState(0);
  return (
    <div className="w-full">
      <div className="panel relative bg-black">
        <Stage3D ref={stage} initial={{ t: 0, yaw: 25, pitch: 12, spin: true, snap: true }} className="relative h-[min(72svh,640px)] min-h-[360px] w-full" />
        <p className="kicker pointer-events-none absolute left-4 top-3 text-[11px] text-mute">Drag to turn / any way</p>
      </div>
      <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
        {CHIPS.map(([name, , pose], i) => (
          <button key={name} onClick={() => { setChip(i); setT(pose.t ?? 0); stage.current?.send({ ...pose, spin: false, reset: true }); }}
            className={`kicker rounded-sm border px-3.5 py-2 text-[12px] transition ${chip === i ? "border-sun bg-sun/15 text-sun shadow-[0_0_14px_rgba(255,138,0,0.35)]" : "border-white/15 text-paper/80 hover:border-sun/60"}`}>{name}</button>
        ))}
      </div>
      <p className="mx-auto mt-4 min-h-[2.6em] max-w-[34em] text-[clamp(14px,2svh,17px)] text-paper/85">{CHIPS[chip][1]}</p>
      <label className="mx-auto mt-3 flex max-w-[460px] items-center gap-3 text-[15px] text-mute">
        <span className="kicker text-[11px]">Closed</span>
        <input type="range" min={0} max={100} value={Math.round(t * 100)} aria-label="Assemble or exploded" className="h-1 flex-1 accent-[#ffb340]"
          onChange={(e) => { const v = Number(e.target.value) / 100; setT(v); stage.current?.send({ t: v }); }} />
        <span className="kicker text-[11px]">Open</span>
      </label>
      <p className="kicker mt-2 text-center text-[11px] text-mute">Move slider to open and close.</p>
    </div>
  );
}
