import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { DOCS, readDoc } from "@/lib/docs";

export function generateStaticParams() { return DOCS.map((d) => ({ slug: d.slug })); }

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return { title: `${DOCS.find((d) => d.slug === slug)?.title ?? "Doc"} · Sunbeat` };
}

export default async function Doc({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!DOCS.some((d) => d.slug === slug)) notFound();
  return (
    <>
      <Nav />
      <main className="mx-auto max-w-[820px] px-5 pb-16 pt-28">
        <a href="/docs" className="text-sm text-sun hover:underline">‹ Docs</a>
        <article className="mt-4 text-[17px] leading-relaxed text-paper/90 [&_a]:text-sun [&_a:hover]:underline [&_blockquote]:border-l-2 [&_blockquote]:border-line [&_blockquote]:pl-4 [&_blockquote]:text-mute [&_code]:rounded [&_code]:bg-card [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:text-[0.9em] [&_h1]:text-[clamp(32px,6vw,52px)] [&_h1]:font-semibold [&_h1]:leading-[1.08] [&_h1]:tracking-[-0.035em] [&_h2]:mt-12 [&_h2]:text-[28px] [&_h2]:font-semibold [&_h2]:tracking-[-0.025em] [&_h3]:mt-8 [&_h3]:text-xl [&_h3]:font-semibold [&_li]:mt-1.5 [&_ol]:ml-6 [&_ol]:list-decimal [&_p]:mt-4 [&_pre]:mt-4 [&_pre]:overflow-x-auto [&_pre]:rounded-xl [&_pre]:bg-card [&_pre]:p-4 [&_strong]:text-paper [&_ul]:ml-6 [&_ul]:list-disc">
          <ReactMarkdown remarkPlugins={[remarkGfm]} components={{
            table: ({ children }) => <div className="mt-4 overflow-x-auto rounded-xl border border-line"><table className="w-full border-collapse text-left text-[15px]">{children}</table></div>,
            th: ({ children }) => <th className="border-b border-line bg-card px-3 py-2 font-semibold">{children}</th>,
            td: ({ children }) => <td className="border-b border-line px-3 py-2 align-top">{children}</td>,
          }}>{readDoc(slug)}</ReactMarkdown>
        </article>
      </main>
      <Footer />
    </>
  );
}
