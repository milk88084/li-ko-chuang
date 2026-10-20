import projectData from "@/data/projects.json";
import type { Locale } from "@/lib/locale";

// Every piece of work on the site — engineering products, UI/UX design, AI
// applications and marketing campaigns alike — lives in data/projects.json as
// one list, so the homepage, /work, /work/[slug], the sitemap and the
// structured data all read the same slugs and cannot disagree about what exists.

export const PROJECT_TYPES = ["engineering", "design", "ai", "marketing"] as const;
export type ProjectType = (typeof PROJECT_TYPES)[number];

/** The Hairline figures a project card can show (see components/canvas/FigureFrame). */
export const PROJECT_FIGURES = [
  "riffle",
  "loupe",
  "rebuild",
  "format",
  "terminal",
  "cabinet",
  "relay",
  "lockers",
  "hub",
  "dish",
  "slow",
  "stack",
  "sieve",
  "router",
  "turntable",
  "terrain",
] as const;
export type ProjectFigureName = (typeof PROJECT_FIGURES)[number];

type RawProject = (typeof projectData)[number];

/**
 * One piece of a project's media, at its intrinsic pixel size so the page can
 * reserve its box and never draw it larger than it really is.
 *
 * - `mockup`  a composed shot (devices on a backdrop), shown as is
 * - `browser` a desktop screenshot, framed as a browser window
 * - `phone`   a portrait screen (still or .mp4 recording), framed as a phone
 * - `icon`    the app icon
 * - `photo`   a photograph from a campaign or event
 */
export type ProjectMediaKind = "mockup" | "browser" | "phone" | "icon" | "photo";
export interface ProjectMedia {
  src: string;
  kind: ProjectMediaKind;
  width: number;
  height: number;
  /** Which page or screen it shows ("Portfolio page"); design work names its shots. */
  caption?: string;
}

type RawMedia = Omit<ProjectMedia, "caption"> & {
  caption?: Record<Locale, string>;
};

export const isVideo = (media: ProjectMedia) => media.src.endsWith(".mp4");

/** A project with its copy resolved to one language. */
export interface Project {
  slug: string;
  type: ProjectType;
  featured: boolean;
  /**
   * The Hairline line figure that stands for the project on cards, or null
   * when the card shows the lead screenshot instead (design work, where the
   * site itself is the thing to see).
   */
  figure: ProjectFigureName | null;
  /**
   * Everything shown on the project page, lead piece first. Empty for work
   * with nothing to screenshot (AI workflows); the page shows its figure.
   */
  media: ProjectMedia[];
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
    figure: raw.figure as ProjectFigureName | null,
    media: (raw.media as RawMedia[]).map(({ caption, ...m }) => ({
      ...m,
      ...(caption && { caption: caption[locale] }),
    })),
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
