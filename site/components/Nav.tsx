const LINKS = [["/#story", "How it works"], ["/#numbers", "Numbers"], ["/build", "3D model"], ["/#specs", "Specs"], ["/docs", "Docs"]] as const;
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
