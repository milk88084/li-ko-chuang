import type { CSSProperties } from "react";
import Link from "next/link";
import type { Project } from "@/lib/projects";
import { ProjectFigure } from "./ProjectFigure";

// A project as a figure-led card: a Hairline line figure stands in for the
// cover (the screenshots and recordings live on the project page), the type
// and title sit underneath. The figure moves on its own and answers the
// pointer; the whole card is one link and drives the cursor's "View" state.

// The paper the figure stands on: an isometric grid at the figures' own 30°
// angles, fading out toward the edges, with crop marks in the corners. The
// figure's plates are filled, so the grid never shows through them.
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

export function ProjectCard({
  project,
  href,
  typeLabel,
  aspect = "aspect-[16/10]",
}: {
  project: Project;
  href: string;
  typeLabel: string;
  aspect?: string;
}) {
  return (
    <Link href={href} data-cursor="view" className="group block">
      <div
        aria-hidden
        className={`relative flex items-center justify-center overflow-hidden rounded-[10px] bg-surface ${aspect}`}
      >
        <div className="absolute inset-0" style={ISO_GRID} />
        {CORNERS.map((corner) => (
          <span
            key={corner}
            className={`absolute size-2.5 border-ink/25 ${corner}`}
          />
        ))}
        {/* The figure keeps its own 5:4 shape; the frame sets its height. */}
        <div className="relative aspect-[5/4] h-[86%]">
          <ProjectFigure name={project.figure} />
        </div>
      </div>
      <p className="mt-4 font-mono text-[11px] tracking-[0.04em] text-muted uppercase">
        {typeLabel}
        {project.category && ` · ${project.category}`}
      </p>
      <h3 className="mt-1.5 text-[19px] leading-snug tracking-[-0.01em] transition-colors group-hover:text-accent">
        {project.title}
      </h3>
    </Link>
  );
}
