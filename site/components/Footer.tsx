import { REPO } from "./Nav";
export default function Footer() {
  return (
    <footer className="mx-auto max-w-[1080px] border-t border-line px-5 py-8 text-xs leading-relaxed text-mute">
      <p>Sunbeat is a working name for a concept. It is not for sale. Hours and light numbers are estimates until measured.</p>
      <p className="mt-2"><a href="/build" className="hover:text-paper">3D model</a> · <a href="/docs" className="hover:text-paper">Docs</a> · <a href={REPO} className="hover:text-paper">GitHub</a> · MIT</p>
    </footer>
  );
}
