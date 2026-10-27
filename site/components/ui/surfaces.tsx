import type { ElementType, ReactNode, Ref } from "react";
import { cx, mt, Text, Heading, type Gap, type Tone } from "./type";

/** The neon-bracket card. tone: sun (default) or ice. pad adds inner space. */
export function Panel({ tone = "sun", pad, black, fill, href, as: Tag = "div", mt: gap, className, children }: {
  tone?: "sun" | "ice"; pad?: "md" | "lg" | "x"; black?: boolean; fill?: boolean; href?: string; as?: ElementType; mt?: Gap; className?: string; children: ReactNode;
}) {
  const c = cx("ui-panel", tone === "ice" && "ui-panel--ice", pad && `ui-panel--pad${pad === "md" ? "" : pad}`, black && "ui-panel--black", fill && "ui-panel--fill", href && "ui-panel--link", mt(gap), className);
  return href ? <a href={href} className={c}>{children}</a> : <Tag className={c}>{children}</Tag>;
}

/** A big number with a label and a note. */
export function Stat({ value, label, note, tone = "sun" }: { value: string; label: string; note: string; tone?: "sun" | "ice" }) {
  return (
    <Panel tone={tone} pad="md" fill className="ui-stat">
      <p className={cx("ui-stat__value", `ui-t--${tone}`, `ui-glow-${tone}`)}>{value}</p>
      <Text size="body" strong mt={1}>{label}</Text>
      <Text size="fine" tone="mute" mt={1}>{note}</Text>
    </Panel>
  );
}
export function StatGrid({ mt: gap, children }: { mt?: Gap; children: ReactNode }) { return <div className={cx("ui-stat-grid", mt(gap))}>{children}</div>; }

/** Key and value rows inside a panel. spec: small key left. status: bold key, muted value. */
export function DefList({ rows, variant = "spec", mt: gap }: { rows: readonly (readonly [string, string])[]; variant?: "spec" | "status"; mt?: Gap }) {
  return (
    <Panel as="dl" pad="x" mt={gap} className={cx("ui-rows ui-narrow")}>
      {rows.map(([k, v]) => <div key={k} className={cx("ui-row", `ui-row--${variant}`)}><dt>{k}</dt><dd>{v}</dd></div>)}
    </Panel>
  );
}

/** Two cards side by side, for the comparison. */
export function CompareGrid({ mt: gap, children }: { mt?: Gap; children: ReactNode }) { return <div className={cx("ui-compare", mt(gap))}>{children}</div>; }
export function CompareCard({ title, tone, rows }: { title: string; tone: "sun" | "ice"; rows: readonly (readonly [string, string])[] }) {
  return (
    <Panel tone={tone} pad="lg" fill>
      <Heading level="sub" as="h3" tone={tone} className="ui-kicker">{title}</Heading>
      <ul className="ui-list">{rows.map(([k, v]) => <li key={k}><b>{k}</b>{v}</li>)}</ul>
    </Panel>
  );
}

/** One question and answer that opens and closes. */
export function Disclosure({ summary, open, onToggle, children }: { summary: string; open: boolean; onToggle: (open: boolean) => void; children: ReactNode }) {
  return (
    <details open={open} onToggle={(e) => onToggle(e.currentTarget.open)} className="ui-disclosure">
      <summary>{summary}<i>+</i></summary>
      <p>{children}</p>
    </details>
  );
}
export function DisclosureList({ children }: { children: ReactNode }) { return <Panel pad="x" className="ui-rows">{children}</Panel>; }
export function Toolbar({ children }: { children: ReactNode }) { return <div className="ui-toolbar">{children}</div>; }

/** Dot, thin line and label that point at a part. Placed by script through its ref. */
export function CalloutLabel({ tone = "sun", label, refCb }: { tone?: "sun" | "ice"; label: string; refCb: Ref<HTMLDivElement> }) {
  return <div ref={refCb} style={{ opacity: 0 }} className={cx("ui-callout", tone === "ice" && "ui-callout--ice")}><i /><b /><span>{label}</span></div>;
}

/** Progress dots of the film. Mark the active one with the "on" class from script. */
export function Dots({ count, refCb }: { count: number; refCb: (i: number, el: HTMLElement | null) => void }) {
  return <div aria-hidden className="ui-dots">{Array.from({ length: count }, (_, i) => <i key={i} ref={(el) => refCb(i, el)} />)}</div>;
}

/** Page-title link card (docs index). */
export function LinkCard({ href, title, blurb, cta }: { href: string; title: string; blurb: string; cta: string }) {
  return (
    <a href={href} className="ui-card">
      <Heading level="sub" as="h2">{title}</Heading>
      <Text tone="mute" mt={1}>{blurb}</Text>
      <Text tone="sun" mt={2}>{cta}</Text>
    </a>
  );
}

/** Styles for rendered markdown. */
export function Prose({ children }: { children: ReactNode }) { return <article className="ui-prose">{children}</article>; }
export type { Tone };
