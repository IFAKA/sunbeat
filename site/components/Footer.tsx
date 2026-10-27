import { REPO } from "./Nav";
import { Section, Text, Link } from "./ui";

export default function Footer() {
  return (
    <Section as="footer" variant="bar">
      <Text size="fine">Sunbeat is a working name for a concept. It is not for sale. Hours and light numbers are estimates until measured.</Text>
      <Text size="fine" mt={1}><Link variant="quiet" href="/build">3D model</Link> · <Link variant="quiet" href="/docs">Docs</Link> · <Link variant="quiet" href={REPO}>GitHub</Link> · MIT</Text>
    </Section>
  );
}
