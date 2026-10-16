import { ImageResponse } from "next/og";
import { OgCard, OG_SIZE } from "@/lib/og-template";
import { PROJECT_SLUGS, getProject } from "@/lib/projects";

// One preview per project, titled with the project rather than the site.

export const alt = "Project";
export const size = OG_SIZE;
export const contentType = "image/png";

export function generateStaticParams() {
  return PROJECT_SLUGS.map((slug) => ({ slug }));
}

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProject(slug, "zh");
  return new ImageResponse(
    <OgCard title={project?.title ?? ""} subtitle={project?.summary ?? ""} />,
    size,
  );
}
