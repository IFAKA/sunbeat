/** The hero picture: the clip, lit by a warm glow with slow rings. Rings scale inside the box, so nothing is cut. */
export default function Sun() {
  return (
    <div aria-hidden className="absolute inset-0 grid place-items-center">
      <div className="relative aspect-square h-[min(100%,90vw,440px)]">
        <div className="breathe absolute inset-[-18%] rounded-full bg-[radial-gradient(closest-side,rgba(255,179,64,0.30),rgba(255,138,0,0.07)_62%,transparent)]" />
        {[0, 1.05, 2.1].map((d) => <span key={d} className="ring absolute inset-0 rounded-full border border-sun/70" style={{ animationDelay: `${d}s` }} />)}
        <Clip className="absolute left-1/2 top-1/2 w-[46%] -translate-x-1/2 -translate-y-1/2 shadow-[0_30px_80px_rgba(255,160,40,0.25)]" />
      </div>
    </div>
  );
}

/** A flat drawing of the front: a dark solar cell in a case. Real shape: 44 x 32.6 mm. */
export function Clip({ className = "" }: { className?: string }) {
  return (
    <div className={`aspect-[44/32.6] rounded-[14%/19%] border border-white/10 bg-[#141416] p-[5%] ${className}`}>
      <div className="relative h-full w-full overflow-hidden rounded-[10%/14%] bg-[linear-gradient(135deg,#2b2233,#17121d)] ring-1 ring-white/10">
        <div className="absolute inset-0 bg-[repeating-linear-gradient(90deg,transparent_0_11%,rgba(255,255,255,0.07)_11%_12%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(115deg,rgba(255,200,110,0.35),transparent_45%)]" />
      </div>
    </div>
  );
}
