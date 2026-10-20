import Image from "next/image";
import type { Project } from "@/lib/projects";
import { FigureFrame } from "@/components/canvas/FigureFrame";

// What stands for a project on a card: its Hairline figure, or — for design
// work, which has none — the site's own lead screenshot, cropped from the top
// so the header and hero show. The frame takes its size from `className`.

export function ProjectCover({
  project,
  className = "",
  sizes = "(min-width: 768px) 50vw, 100vw",
}: {
  project: Project;
  className?: string;
  sizes?: string;
}) {
  if (project.figure) {
    return <FigureFrame name={project.figure} className={className} />;
  }
  const lead = project.media[0];
  return (
    <div
      aria-hidden
      className={`relative overflow-hidden border border-line bg-surface ${className}`}
    >
      <Image
        src={lead.src}
        alt=""
        fill
        sizes={sizes}
        unoptimized
        className="object-cover object-top transition-transform duration-500 group-hover:scale-[1.02]"
      />
    </div>
  );
}
