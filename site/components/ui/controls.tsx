import type { ReactNode } from "react";
import { cx, mt, type Gap } from "./type";

type BtnProps = { variant?: "primary" | "ghost" | "text"; size?: "md" | "sm"; href?: string; onClick?: () => void; mt?: Gap; className?: string; children: ReactNode };
/** Button. primary = filled sun pill. ghost = neon outline. text = quiet text button. Renders a link when it has href. */
export function Button({ variant = "primary", size = "md", href, onClick, mt: gap, className, children }: BtnProps) {
  const c = cx("ui-btn", `ui-btn--${variant}`, size === "sm" && "ui-btn--sm", mt(gap), className);
  return href ? <a href={href} className={c}>{children}</a> : <button type="button" onClick={onClick} className={c}>{children}</button>;
}

/** Text link. accent = sun with underline on hover. nav = small nav link. quiet = inherits colour. */
export function Link({ href, variant = "accent", size, mt: gap, className, children }: { href: string; variant?: "accent" | "nav" | "quiet"; size?: "lead"; mt?: Gap; className?: string; children: ReactNode }) {
  return <a href={href} className={cx("ui-link", variant !== "accent" && `ui-link--${variant}`, size === "lead" && "ui-link--lead", mt(gap), className)}>{children}</a>;
}

/** One chip: a small toggle button. */
export function Chip({ on, onClick, children }: { on?: boolean; onClick?: () => void; children: ReactNode }) {
  return <button type="button" aria-pressed={!!on} onClick={onClick} className="ui-chip">{children}</button>;
}

/** A row of chips where one is selected. */
export function Tabs({ items, value, onChange, mt: gap }: { items: string[]; value: number; onChange: (i: number) => void; mt?: Gap }) {
  return <div className={cx("ui-chips", mt(gap))}>{items.map((n, i) => <Chip key={n} on={value === i} onClick={() => onChange(i)}>{n}</Chip>)}</div>;
}

/** Range slider with a word at each end. */
export function Slider({ value, onChange, label, start, end, mt: gap }: { value: number; onChange: (v: number) => void; label: string; start: string; end: string; mt?: Gap }) {
  return (
    <label className={cx("ui-slider", mt(gap))}>
      <span className="ui-t--label">{start}</span>
      <input type="range" min={0} max={100} value={value} aria-label={label} onChange={(e) => onChange(Number(e.target.value))} />
      <span className="ui-t--label">{end}</span>
    </label>
  );
}
