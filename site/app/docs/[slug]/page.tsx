import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { DOCS, readDoc } from "@/lib/docs";
import { Section, Link, Prose } from "@/components/ui";

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
      <Section as="main" variant="doc">
        <Link href="/docs">‹ Docs</Link>
        <Prose><ReactMarkdown remarkPlugins={[remarkGfm]}>{readDoc(slug)}</ReactMarkdown></Prose>
      </Section>
      <Footer />
    </>
  );
}
