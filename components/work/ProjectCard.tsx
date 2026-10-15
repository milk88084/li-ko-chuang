import Link from "next/link";
import type { Project } from "@/lib/projects";
import { ProjectFigure } from "./ProjectFigure";

// A project as a figure-led card: a Hairline line figure stands in for the
// cover (the screenshots and recordings live on the project page), the type
// and title sit underneath. The figure moves on its own and answers the
// pointer; the whole card is one link and drives the cursor's "View" state.

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
        className={`flex items-center justify-center overflow-hidden rounded-[10px] bg-surface ${aspect}`}
      >
        {/* The figure keeps its own 5:4 shape; the frame sets its height. */}
        <div className="aspect-[5/4] h-[86%]">
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
