const QA = [
  ["Can I buy one?", "No. Sunbeat is a concept: a real 3D model, a parts list with prices, and test code. Nothing is for sale yet."],
  ["Do I ever have to charge it?", "That is the goal. In normal room light it makes about as much energy as 1.5 hours of music a day uses. This is calculated, not measured yet."],
  ["What if it sits in the dark?", "The battery holds about 490 hours of music (best case, estimate). At 3 hours a day that is over 5 months."],
  ["Why does it sound like an old phone call?", "Better sound needs more energy and more memory. We chose never-charge over hi-fi, so songs are stored small (8 kHz)."],
  ["Which earbuds work?", "Any wired earbuds with a round 3.5 mm plug. The design assumes ordinary 16 Ω ones."],
  ["Why not Bluetooth?", "A Bluetooth radio uses much more energy than a wire. We do not think a cell this size can feed it."],
] as const;

export default function Faq() {
  return (
    <div className="w-full divide-y divide-line border-y border-line">
      {QA.map(([q, a]) => (
        <details key={q} className="group py-3">
          <summary className="flex cursor-pointer list-none items-center justify-between text-[17px] font-medium">{q}<span className="text-mute transition-transform duration-200 group-open:rotate-45">+</span></summary>
          <p className="pt-2 text-[15px] leading-snug text-mute">{a}</p>
        </details>
      ))}
    </div>
  );
}
