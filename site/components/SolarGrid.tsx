/** Faint perspective grid floor that fades into a sun-lit horizon. CSS only, no JavaScript. */
export default function SolarGrid({ className = "" }: { className?: string }) {
  return <div aria-hidden className={`solar-grid pointer-events-none absolute inset-y-0 left-1/2 -z-10 w-screen -translate-x-1/2 overflow-hidden ${className}`} />;
}
