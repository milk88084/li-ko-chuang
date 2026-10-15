import type { CSSProperties } from "react";
import {
  Cabinet,
  Dish,
  Format,
  Hub,
  Lockers,
  Loupe,
  Rebuild,
  Relay,
  Riffle,
  Slow,
  Terminal,
} from "@lucasmarkes/hairline/react";
import type { ProjectFigureName } from "@/lib/projects";

// A project's preview, drawn as a Hairline isometric line figure
// (github.com/lucasmarkes/hairline, MIT) instead of a screenshot. Each figure
// is picked for what the project is about, and answers the pointer while it
// sits idle in its own loop. The real screenshots stay on the project page.

const FIGURES = {
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
} satisfies Record<ProjectFigureName, unknown>;

// Drawn in the site's own palette: plates take the card's surface so they
// hide what is behind them, what is lit takes the accent.
const PALETTE = {
  "--hairline-plate": "var(--surface)",
  "--hairline-hi": "var(--accent)",
  "--hairline-edge": "var(--ink)",
  "--hairline-mid": "var(--muted)",
  "--hairline-lo": "var(--line)",
} as CSSProperties;

export function ProjectFigure({ name }: { name: ProjectFigureName }) {
  const Figure = FIGURES[name];
  // The card around it is the link, so the figure never takes focus itself
  // (Riffle would otherwise add a tab stop for its arrow keys).
  return <Figure play intensity={0.6} tabIndex={-1} style={PALETTE} />;
}
