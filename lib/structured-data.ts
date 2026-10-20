import content from "@/data/content.json";
import { siteConfig } from "@/lib/site-config";
import { getProject, isVideo, type Project } from "@/lib/projects";
import { htmlLang, localePath, type Locale } from "@/lib/locale";

// JSON-LD for the whole site, in one place so the same Person is described
// identically everywhere. Search engines and AI assistants use this to decide
// that "Li Ko Chuan" is one entity rather than a string that happens to recur,
// which is what `sameAs` and a stable `@id` are for.
//
// Everything is emitted as one @graph per page: a single script tag whose
// nodes cross-reference each other by @id, rather than several disconnected
// blocks that have to be matched up by guesswork.

const PERSON_ID = `${siteConfig.siteUrl}/#person`;
const SITE_ID = `${siteConfig.siteUrl}/#website`;

const person = {
  "@type": "Person",
  "@id": PERSON_ID,
  name: siteConfig.name,
  url: siteConfig.siteUrl,
  jobTitle: "AI Engineer",
  email: `mailto:${siteConfig.social.email}`,
  description: siteConfig.description,
  knowsAbout: [
    "AI Automation",
    "AI Agents",
    "n8n",
    "React",
    "Next.js",
    "TypeScript",
    "React Native",
    "Expo",
    "Marketing Strategy",
    "Event Planning",
    "Project Management",
    "UI/UX Design",
    "Claude Code",
    "Agent Skills",
  ],
  knowsLanguage: ["en", "zh-Hant"],
  worksFor: {
    "@type": "Organization",
    name: "Institute for Information Industry",
    department: { "@type": "Organization", name: "Digital Transformation" },
  },
  // The three-engineer studio Max is part of; its own JSON-LD lists Max as
  // a member and links back here, so the two sites confirm each other.
  memberOf: {
    "@type": "Organization",
    name: "Nivorae",
    url: "https://nivorae.net",
  },
  address: {
    "@type": "PostalAddress",
    addressLocality: "Taipei",
    addressCountry: "TW",
  },
  sameAs: [
    siteConfig.social.linkedin,
    siteConfig.social.github,
    siteConfig.social.medium,
  ],
};

const website = {
  "@type": "WebSite",
  "@id": SITE_ID,
  url: siteConfig.siteUrl,
  name: siteConfig.title,
  description: siteConfig.description,
  inLanguage: ["en", "zh-Hant"],
  publisher: { "@id": PERSON_ID },
};

/** The two shipped iOS apps, described as products rather than as prose. */
const APP_ICONS: Record<string, string> = {
  aras: "/icon-araS.webp",
  retep: "/icon-reteP.webp",
};

const absolute = (path: string) => `${siteConfig.siteUrl}${path}`;

/**
 * A project as a node of its own: the shipped apps as SoftwareApplication,
 * everything else as a CreativeWork by the person, with its live link, lead
 * screenshot and stack, so an assistant can tie the work to its author.
 */
function projectNode(project: Project, locale: Locale) {
  const icon = APP_ICONS[project.slug];
  if (icon) {
    return {
      "@type": "SoftwareApplication",
      name: project.title,
      description: project.summary,
      url: project.link,
      applicationCategory: "MobileApplication",
      operatingSystem: "iOS",
      inLanguage: htmlLang(locale),
      author: { "@id": PERSON_ID },
      image: absolute(icon),
    };
  }
  const still = project.media.find((m) => !isVideo(m) && m.kind !== "icon");
  return {
    "@type": "CreativeWork",
    "@id": `${absolute(localePath(locale, `/work/${project.slug}`))}#work`,
    name: project.title,
    description: project.summary,
    ...(project.link && { url: project.link }),
    genre: content[locale].work.types[project.type],
    inLanguage: htmlLang(locale),
    author: { "@id": PERSON_ID },
    ...(still && { image: absolute(still.src) }),
    ...(project.tech.length > 0 && { keywords: project.tech.join(", ") }),
  };
}

/**
 * A trail from the homepage through `trail`, in the page's own language and
 * to its own URLs, so a result can show where the page sits instead of a bare
 * URL. Omitted on the homepage, which is the root of its own trail.
 */
const breadcrumb = (locale: Locale, trail: { name: string; route: string }[]) => ({
  "@type": "BreadcrumbList",
  itemListElement: [{ name: content[locale].nav.home, route: "" }, ...trail].map(
    (crumb, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: crumb.name,
      item: absolute(localePath(locale, crumb.route)),
    }),
  ),
});

export type StructuredDataPage = { locale: Locale } & (
  | { page: "home" }
  | { page: "work" | "about" | "events" | "writing" }
  | { page: "project"; slug: string }
);

/**
 * Builds the graph for one page. The apps ride along on /work, and each
 * project page describes its own work.
 */
export function structuredData(target: StructuredDataPage) {
  const { locale } = target;
  const nav = content[locale].nav;
  const graph: object[] = [person, website];

  if (target.page === "project") {
    const project = getProject(target.slug, locale);
    if (project) {
      graph.push(
        breadcrumb(locale, [
          { name: nav.work, route: "/work" },
          { name: project.title, route: `/work/${project.slug}` },
        ]),
        projectNode(project, locale),
      );
    }
  } else if (target.page !== "home") {
    graph.push(breadcrumb(locale, [{ name: nav[target.page], route: `/${target.page}` }]));
    if (target.page === "work") {
      for (const slug of Object.keys(APP_ICONS)) {
        graph.push(projectNode(getProject(slug, locale)!, locale));
      }
    }
  }

  return { "@context": "https://schema.org", "@graph": graph };
}
