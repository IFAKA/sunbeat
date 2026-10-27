# UI kit rules

1. **One font.** Inter (SIL OFL), loaded by `next/font` in `app/layout.tsx`. Never write `font-family`, `font-mono` or another typeface anywhere. The 3D viewer (`public/viewer`) uses the same Inter file from `/fonts/Inter.woff2`.
2. **One kit.** Every page and component is built from `components/ui`. Colours, type sizes, spacing and radii are tokens in `app/globals.css` (`@theme`). Kit styles are `.ui-*` classes there.
3. **Add to the kit instead of styling in a page.** If you need a new look, make a kit component (or a prop) first. Pages may only use layout utilities (grid placement, `absolute`, `h-svh`), never colour, font, size, radius or shadow utilities.
4. ONE colour: orange (`sun`). No cyan or blue, no gradient washes or glow bands. Everything else is white or grey. Component names appear on screen only while the text is talking about that part.

`npm run check:ui` enforces this and runs before every build.
