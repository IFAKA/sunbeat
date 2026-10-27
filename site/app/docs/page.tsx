import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { DOCS } from "@/lib/docs";

export const metadata = { title: "Docs · Sunbeat" };

export default function Docs() {
  return (
    <>
      <Nav />
      <main className="mx-auto max-w-[760px] px-5 pb-16 pt-28">
        <h1 className="text-[clamp(36px,7vw,64px)] font-semibold leading-[1.05] tracking-[-0.035em]">Docs.</h1>
        <p className="mt-3 text-lg text-mute">The plan, in the open. Start with the desk test: it needs only a Raspberry Pi Pico.</p>
        <div className="mt-10 grid gap-3">
          {DOCS.map((d) => (
            <a key={d.slug} href={`/docs/${d.slug}`} className="rounded-[22px] bg-card p-6 transition-colors hover:bg-[#1c1c1e]">
              <h2 className="text-2xl font-semibold tracking-[-0.02em]">{d.title}</h2>
              <p className="mt-2 text-mute">{d.blurb}</p>
              <p className="mt-3 text-sun">Read ›</p>
            </a>
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
}
