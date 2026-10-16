import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProjectPage } from "@/components/pages/ProjectPage";
import { StructuredData } from "@/components/StructuredData";
import { projectMetadata } from "@/lib/page-metadata";
import { PROJECT_SLUGS, getProject } from "@/lib/projects";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return PROJECT_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  return projectMetadata("en", slug);
}

export default async function EnProject({ params }: Props) {
  const { slug } = await params;
  const project = getProject(slug, "en");
  if (!project) notFound();

  return (
    <>
      <StructuredData page="project" slug={slug} />
      <ProjectPage project={project} locale="en" />
    </>
  );
}
