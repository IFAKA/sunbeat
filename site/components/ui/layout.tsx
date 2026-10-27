import type { ReactNode } from "react";
import { cx } from "./type";

/** A page section. variant: full (one screen, centred), intro (short lead-in), page / doc (reading column), bar (footer). grid adds the solar-grid floor. */
export function Section({ id, label, variant = "full", grid, as: Tag = "section", className, children }: {
  id?: string; label?: string; variant?: "full" | "intro" | "page" | "doc" | "bar"; grid?: boolean; as?: "section" | "main" | "footer"; className?: string; children: ReactNode;
}) {
  return (
    <Tag id={id} aria-label={label} className={cx("ui-section", `ui-section--${variant}`, variant === "bar" && "ui-footer", className)}>
      {grid && <SolarGrid />}
      {children}
    </Tag>
  );
}

/** Faint perspective grid floor that fades into a sun-lit horizon. CSS only. */
export function SolarGrid({ flat }: { flat?: boolean }) { return <div aria-hidden className={cx("ui-grid-floor", flat && "ui-grid-floor--flat")} />; }

/** Fixed top bar: brand left, links centre, actions right. */
export function NavBar({ brand, links, actions }: { brand: ReactNode; links: ReactNode; actions: ReactNode }) {
  return (
    <header className="ui-bar">
      <div className="ui-bar__in"><a href="/" className="ui-brand">{brand}</a><nav>{links}</nav><div className="ui-bar__end">{actions}</div></div>
    </header>
  );
}

/** Wrap a column that is narrower than the section. */
export function Narrow({ className, children }: { className?: string; children: ReactNode }) { return <div className={cx("ui-narrow", className)}>{children}</div>; }
export function Column({ children }: { children: ReactNode }) { return <div className="ui-column">{children}</div>; }
