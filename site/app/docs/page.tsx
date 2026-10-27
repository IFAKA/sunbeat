import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { DOCS } from "@/lib/docs";
import { Section, Heading, Text, LinkCard } from "@/components/ui";

export const metadata = { title: "Docs · Sunbeat" };

export default function Docs() {
  return (
    <>
      <Nav />
      <Section as="main" variant="page">
        <Heading level="doc">Docs.</Heading>
        <Text size="lead" tone="mute" mt={2}>The plan, in the open. Start with the desk test: it needs only a Raspberry Pi Pico.</Text>
        <div className="mt-10 grid gap-3">
          {DOCS.map((d) => <LinkCard key={d.slug} href={`/docs/${d.slug}`} title={d.title} blurb={d.blurb} cta="Read ›" />)}
        </div>
      </Section>
      <Footer />
    </>
  );
}
