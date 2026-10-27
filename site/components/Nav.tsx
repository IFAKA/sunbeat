const LINKS = [["/#film", "How it works"], ["/#numbers", "Numbers"], ["/build", "3D model"], ["/#specs", "Specs"], ["/docs", "Docs"]] as const;
const LOCAL = [["#film", "Highlights"], ["#inside", "Closer look"], ["#numbers", "Numbers"], ["#compare", "Compare"], ["#faq", "FAQ"]] as const;
export const REPO = "https://github.com/IFAKA/sunbeat";

/** Apple's local bar: name left, jumps right, one button. */
export default function Nav() {
  return (
    <header className="fixed inset-x-0 top-0 z-30 border-b border-white/10 bg-black/70 backdrop-blur-xl">
      <div className="mx-auto flex h-12 max-w-[1080px] items-center justify-between px-5 text-xs">
        <a href="/" className="text-[17px] font-semibold tracking-tight">Sun<span className="text-sun">beat</span></a>
        <nav className="hidden gap-7 text-paper/80 md:flex">
          {LINKS.map(([h, t]) => <a key={h} href={h} className="hover:text-paper">{t}</a>)}
        </nav>
        <a href={REPO} className="rounded-full bg-sun px-3.5 py-1.5 font-semibold text-black hover:brightness-110">GitHub</a>
      </div>
    </header>
  );
}

/** Apple's local bar under the nav: "Overview", jump links, Tech Specs and one button. */
export function LocalBar() {
  return (
    <div className="fixed inset-x-0 top-12 z-20 border-b border-white/5 bg-black/55 backdrop-blur-xl">
      <div className="mx-auto flex h-11 max-w-[1080px] items-center justify-between gap-4 px-5">
        <a href="#overview" className="text-[17px] font-semibold tracking-tight">Overview</a>
        <nav className="kicker hidden gap-6 text-[11px] text-paper/70 md:flex">
          {LOCAL.map(([h, t]) => <a key={h} href={h} className="hover:text-sun">{t}</a>)}
          <a href="#specs" className="hover:text-sun">Tech Specs</a>
        </nav>
        <a href="/build" className="kicker rounded-sm border border-sun/70 px-3 py-1.5 text-[11px] text-sun shadow-[0_0_12px_rgba(255,138,0,0.3)] hover:bg-sun/10">See inside</a>
      </div>
    </div>
  );
}
