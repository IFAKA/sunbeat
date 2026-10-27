import type { Ref } from "react";
import { cx } from "./type";

/** The iframe that holds the 3D viewer. */
export function StageFrame({ frameRef, src, title, ok, drag }: { frameRef: Ref<HTMLIFrameElement>; src: string; title: string; ok: boolean; drag: boolean }) {
  return <iframe ref={frameRef} title={title} src={src} loading="lazy" tabIndex={-1} className={cx("ui-stage-frame", ok ? "opacity-100" : "opacity-0", !drag && "pointer-events-none")} />;
}
/** Plain black while the 3D page loads (nothing to see). */
export function StagePoster({ hide }: { hide: boolean }) {
  return <div aria-hidden className={cx("absolute inset-0 bg-ink transition-opacity duration-700", hide ? "opacity-0" : "opacity-100")} />;
}
