"use client";
import { useRef, useState } from "react";
import Stage3D, { type Pose, type Stage3DHandle } from "./Stage3D";
import { Panel, Tabs, Text, Slider, Kicker } from "./ui";
const CHIPS: [string, string, Pose][] = [
  ["Closed", "The clip as you wear it.", { t: 0, focus: null, yaw: 25, pitch: 12 }],
  ["Exploded", "Every part, apart.", { t: 1, focus: null, yaw: 210, pitch: 18 }],
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
  const pick = (i: number) => { const pose = CHIPS[i][2]; setChip(i); setT(pose.t ?? 0); stage.current?.send({ ...pose, spin: false, reset: true }); };
  return (
    <div className="w-full">
      <Panel black className="relative">
        <Stage3D ref={stage} initial={{ t: 0, yaw: 25, pitch: 12, spin: true, snap: true }} className="relative h-[min(72svh,640px)] min-h-[360px] w-full" />
        <Kicker tone="mute" size="small" className="pointer-events-none absolute left-4 top-3">Drag to turn / any way</Kicker>
      </Panel>
      <Tabs mt={2} items={CHIPS.map((c) => c[0])} value={chip} onChange={pick} />
      <Text size="lead" tone="soft" measure mt={2} className="mx-auto min-h-[2.6em]">{CHIPS[chip][1]}</Text>
      <Slider mt={1} value={Math.round(t * 100)} label="Assemble or exploded" start="Closed" end="Open" onChange={(v) => { setT(v / 100); stage.current?.send({ t: v / 100 }); }} />
      <Text size="label" tone="mute" mt={1} className="text-center">Move slider to open and close.</Text>
    </div>
  );
}
