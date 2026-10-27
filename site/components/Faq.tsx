"use client";
import { useState } from "react";
const QA = [
  ["Can I buy one?", "No. Sunbeat is a concept: a real 3D model, a parts list with prices, and test code. Nothing is for sale yet."],
  ["Do I ever have to charge it?", "That is the goal. In normal room light it makes about as much energy as 3 hours of music a day uses. This is calculated, not measured yet."],
  ["What if it sits in the dark?", "The battery holds about 490 hours of music (best case, estimate). At 3 hours a day that is over 5 months."],
  ["What about a long trip or a long day?", "The 3 hours is an average, not a limit. The battery is the buffer: a 10 hour day uses about 1.3% of it, and 14 days at 10 hours a day uses about 30% (estimates). Light then refills it. Clip it on the outside of a bag in daylight, which is about 100 times brighter than a room. If someone plays 10 hours every day for ever, it will need a USB-C charge after about 3 months."],
  ["Who is it for?", "People who listen a lot and are on the move, and hate charging things. People aged 16 to 64 listen about 3 hours a day on average (IFPI, 2023), and a Spanish commute is about 25 minutes one way (Eurostat, 2019). This is our guess from public numbers. We have not interviewed buyers yet."],
  ["Why not bone conduction?", "Bone conduction sets run about 50 to 75 mW (our calculation from the battery size and hours of Shokz sets). Our player uses about 0.5 mW, an estimate. That is roughly 100 times less, so ordinary earbuds are the only option that room light can feed."],
  ["Why does it sound like an old phone call?", "Better sound needs more energy and more memory. We chose never-charge over hi-fi, so songs are stored small (8 kHz)."],
  ["Which earbuds work?", "Any wired earbuds with a round 3.5 mm plug. The design assumes ordinary 16 Ω ones."],
  ["Why not Bluetooth?", "A Bluetooth radio uses much more energy than a wire. We do not think a cell this size can feed it."],
] as const;

export default function Faq() {
  const [open, setOpen] = useState<boolean[]>(QA.map(() => false));
  const all = (v: boolean) => setOpen(QA.map(() => v));
  return (
    <div className="w-full">
      <div className="kicker mb-3 flex justify-end gap-4 text-[11px] text-mute">
        <button onClick={() => all(true)} className="hover:text-sun">Expand all</button><span aria-hidden>/</span><button onClick={() => all(false)} className="hover:text-sun">Collapse all</button>
      </div>
      <div className="panel w-full divide-y divide-white/10 px-5">
        {QA.map(([q, a], i) => (
          <details key={q} open={open[i]} onToggle={(e) => { const v = e.currentTarget.open; setOpen((o) => (o[i] === v ? o : o.map((x, j) => (j === i ? v : x)))); }} className="group py-3">
            <summary className="flex cursor-pointer list-none items-center justify-between text-[17px] font-medium">{q}<span className="text-sun transition-transform duration-200 group-open:rotate-45">+</span></summary>
            <p className="pt-2 text-[15px] leading-snug text-mute">{a}</p>
          </details>
        ))}
      </div>
    </div>
  );
}
