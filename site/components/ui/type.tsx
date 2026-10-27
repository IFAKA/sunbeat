import type { ElementType, ReactNode } from "react";

export type Tone = "default" | "sun" | "ice" | "mute" | "soft";
export type Gap = 0 | 1 | 2 | 3 | 4 | 5;
const cx = (...a: (string | false | undefined)[]) => a.filter(Boolean).join(" ");
const toneClass = (t: Tone) => (t === "default" ? "" : `ui-t--${t}`);
const mt = (g?: Gap) => (g === undefined ? "" : `ui-mt-${g}`);
export { cx, mt, toneClass };

/** Headings. level: display (hero), statement (big reading lines), title (section), beat (film), doc (page title), sub (card title). */
export function Heading({ level = "title", as, tone = "default", glow, rule, mt: gap, className, children }: {
  level?: "display" | "statement" | "title" | "beat" | "doc" | "sub"; as?: ElementType; tone?: "default" | "sun" | "ice";
  glow?: "sun" | "ice"; rule?: boolean; mt?: Gap; className?: string; children: ReactNode;
}) {
  const Tag = as ?? (level === "display" || level === "doc" ? "h1" : level === "sub" ? "h3" : "h2");
  return <Tag className={cx("ui-h", `ui-h--${level}`, tone !== "default" && `ui-h--tone-${tone}`, glow && `ui-glow-${glow}`, (rule ?? level === "title") && "ui-rule", mt(gap), className)}>{children}</Tag>;
}

/** Small label above a heading. Inter semibold, normal case. */
export function Kicker({ tone = "sun", size, mt: gap, as: Tag = "p", className, children }: { tone?: Tone; size?: "small"; mt?: Gap; as?: ElementType; className?: string; children: ReactNode }) {
  return <Tag className={cx("ui-kicker", size === "small" && "ui-kicker--small", toneClass(tone), mt(gap), className)}>{children}</Tag>;
}

/** Body text. size: lead, body, small, fine, label. measure limits the line length. */
export function Text({ size = "body", tone = "default", strong, measure, mt: gap, as: Tag = "p", className, children }: {
  size?: "lead" | "body" | "small" | "fine" | "label"; tone?: Tone; strong?: boolean; measure?: boolean; mt?: Gap; as?: ElementType; className?: string; children: ReactNode;
}) {
  return <Tag className={cx("ui-t", size !== "body" && `ui-t--${size}`, toneClass(tone), strong && "ui-t--strong", measure && "ui-measure", mt(gap), className)}>{children}</Tag>;
}

/** Inline coloured (and glowing) words inside a heading or text. */
export function Accent({ tone = "sun", glow, children }: { tone?: "sun" | "ice"; glow?: boolean; children: ReactNode }) {
  return <span className={cx(`ui-t--${tone}`, glow && `ui-glow-${tone}`)}>{children}</span>;
}
