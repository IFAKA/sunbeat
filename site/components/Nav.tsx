const LINKS = [["/#film", "Highlights"], ["/#inside", "Closer look"], ["/#numbers", "Numbers"], ["/#compare", "Compare"], ["/#specs", "Specs"], ["/#faq", "FAQ"], ["/docs", "Docs"]] as const;
export const REPO = "https://github.com/IFAKA/sunbeat";

/** One bar only: name left, section jumps centre, two buttons right. */
export default function Nav() {
  return (
    <header className="fixed inset-x-0 top-0 z-30 border-b border-white/10 bg-black/70 backdrop-blur-xl">
      <div className="mx-auto flex h-12 max-w-[1080px] items-center justify-between gap-4 px-5 text-xs">
        <a href="/" className="text-[17px] font-semibold tracking-tight">Sun<span className="text-sun">beat</span></a>
        <nav className="kicker hidden gap-6 text-[11px] text-paper/70 lg:flex">
          {LINKS.map(([h, t]) => <a key={h} href={h} className="hover:text-sun">{t}</a>)}
        </nav>
        <div className="flex items-center gap-2">
          <a href="/build" className="kicker hidden rounded-sm border border-sun/70 px-3 py-1.5 text-[11px] text-sun shadow-[0_0_12px_rgba(255,138,0,0.3)] hover:bg-sun/10 sm:block">See inside</a>
          <a href={REPO} className="rounded-full bg-sun px-3.5 py-1.5 font-semibold text-black hover:brightness-110">GitHub</a>
        </div>
      </div>
    </header>
  );
}
