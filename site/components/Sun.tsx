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
