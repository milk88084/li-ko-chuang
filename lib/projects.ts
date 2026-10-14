import projectData from "@/data/projects.json";
import type { Locale } from "@/lib/locale";

// Every piece of work on the site — engineering products and marketing
// campaigns alike — lives in data/projects.json as one list, so the homepage,
// /work, /work/[slug], the sitemap and the structured data all read the same
// slugs and cannot disagree about what exists.

export const PROJECT_TYPES = ["engineering", "marketing"] as const;
export type ProjectType = (typeof PROJECT_TYPES)[number];

type RawProject = (typeof projectData)[number];

/** A project with its copy resolved to one language. */
export interface Project {
  slug: string;
  type: ProjectType;
  featured: boolean;
  cover: string;
  video: string | null;
  link: string | null;
  title: string;
  summary: string;
  /** Marketing projects carry a category ("Gov Bid"); engineering ones don't. */
  category: string | null;
  problem: string;
  outcome: string;
  highlights: string[];
  tech: string[];
}

const RAW = projectData as RawProject[];

export const PROJECT_SLUGS: string[] = RAW.map((p) => p.slug);

export const isProjectType = (value: unknown): value is ProjectType =>
  (PROJECT_TYPES as readonly unknown[]).includes(value);

function resolve(raw: RawProject, locale: Locale): Project {
  const copy = raw[locale];
  return {
    slug: raw.slug,
    type: raw.type as ProjectType,
    featured: raw.featured,
    cover: raw.cover,
    video: raw.video,
    link: raw.link,
    title: copy.title,
    summary: copy.summary,
    category: copy.category,
    problem: copy.problem,
    outcome: copy.outcome,
    highlights: copy.highlights,
    tech: copy.tech,
  };
}

export function getProjects(locale: Locale, type?: ProjectType): Project[] {
  return RAW.filter((p) => !type || p.type === type).map((p) =>
    resolve(p, locale),
  );
}

export function getProject(slug: string, locale: Locale): Project | undefined {
  const raw = RAW.find((p) => p.slug === slug);
  return raw && resolve(raw, locale);
}

export function getFeaturedProjects(locale: Locale): Project[] {
  return getProjects(locale).filter((p) => p.featured);
}

/** The project after `slug`, wrapping round to the first. */
export function getNextProject(slug: string, locale: Locale): Project {
  const index = RAW.findIndex((p) => p.slug === slug);
  return resolve(RAW[(index + 1) % RAW.length], locale);
}
