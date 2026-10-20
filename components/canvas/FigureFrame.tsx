import type { CSSProperties } from "react";
import {
  Cabinet,
  Dish,
  Drawer,
  Exploded,
  Format,
  Hub,
  Lockers,
  Loupe,
  Phone,
  Rebuild,
  Relay,
  Riffle,
  Router,
  Settle,
  Sieve,
  Slow,
  Stack,
  Terminal,
  Terrain,
  Turntable,
} from "@lucasmarkes/hairline/react";

// A Hairline isometric line figure (github.com/lucasmarkes/hairline, MIT) on
// a sheet of isometric grid paper. Project cards use one in place of a
// screenshot, and the About page's focus cards use one each; no figure is
// used twice on the site. The figure walks through its own loop while idle
// and answers the pointer.

const FIGURES = {
  // Projects (data/projects.json)
  riffle: Riffle,
  loupe: Loupe,
  rebuild: Rebuild,
  format: Format,
  terminal: Terminal,
  cabinet: Cabinet,
  relay: Relay,
  lockers: Lockers,
  hub: Hub,
  dish: Dish,
  slow: Slow,
  stack: Stack,
  sieve: Sieve,
  router: Router,
  turntable: Turntable,
  terrain: Terrain,
  // About › Current focus (data/content.json)
  exploded: Exploded,
  phone: Phone,
  settle: Settle,
  drawer: Drawer,
};

export type FigureName = keyof typeof FIGURES;

// Drawn in the site's own palette: plates take the card's surface so they
// hide what is behind them, what is lit takes the accent.
const PALETTE = {
  "--hairline-plate": "var(--surface)",
  "--hairline-hi": "var(--accent)",
  "--hairline-edge": "var(--ink)",
  "--hairline-mid": "var(--muted)",
  "--hairline-lo": "var(--line)",
} as CSSProperties;

// The paper: an isometric grid at the figures' own 30° angles, fading out
// toward the edges, with crop marks in the corners. The figure's plates are
// filled, so the grid never shows through them.
const GRID_LINE = "var(--line) 0 1px, transparent 1px 26px";
const ISO_GRID: CSSProperties = {
  backgroundImage: [30, -30, 90]
    .map((deg) => `repeating-linear-gradient(${deg}deg, ${GRID_LINE})`)
    .join(", "),
  backgroundPosition: "center",
  maskImage: "radial-gradient(ellipse at center, #000 25%, transparent 72%)",
};

const CORNERS = [
  "top-3 left-3 border-t border-l",
  "top-3 right-3 border-t border-r",
  "bottom-3 left-3 border-b border-l",
  "bottom-3 right-3 border-b border-r",
];

/** The frame takes its size from `className` (an aspect ratio, a radius). */
export function FigureFrame({
  name,
  className = "",
}: {
  name: FigureName;
  className?: string;
}) {
  const Figure = FIGURES[name];
  return (
    <div
      aria-hidden
      className={`relative flex items-center justify-center overflow-hidden bg-surface ${className}`}
    >
      <div className="absolute inset-0" style={ISO_GRID} />
      {CORNERS.map((corner) => (
        <span key={corner} className={`absolute size-2.5 border-ink/25 ${corner}`} />
      ))}
      {/* The figure keeps its own 5:4 shape; the frame sets its height. It
          never takes focus (Riffle would otherwise add a tab stop for its
          arrow keys), since it is decoration inside a link or a card. */}
      <div className="relative aspect-[5/4] h-[86%]">
        <Figure play intensity={0.6} tabIndex={-1} style={PALETTE} />
      </div>
    </div>
  );
}
