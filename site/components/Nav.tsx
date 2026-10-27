import { NavBar, Link, Button } from "./ui";

const LINKS = [["/#film", "Highlights"], ["/#inside", "Closer look"], ["/#numbers", "Numbers"], ["/#compare", "Compare"], ["/#specs", "Specs"], ["/#faq", "FAQ"], ["/docs", "Docs"]] as const;
export const REPO = "https://github.com/IFAKA/sunbeat";

/** One bar only: name left, section jumps centre, two buttons right. */
export default function Nav() {
  return (
    <NavBar
      brand={<>Sun<span>beat</span></>}
      links={LINKS.map(([h, t]) => <Link key={h} href={h} variant="nav">{t}</Link>)}
      actions={<><Button variant="ghost" href="/build">See inside</Button><Button size="sm" href={REPO}>GitHub</Button></>}
    />
  );
}
