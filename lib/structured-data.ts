import { siteConfig } from "@/lib/site-config";
import { getProject } from "@/lib/projects";

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
    "UI/UX",
  ],
  knowsLanguage: ["en", "zh-Hant"],
  worksFor: {
    "@type": "Organization",
    name: "Institute for Information Industry",
    department: { "@type": "Organization", name: "Digital Transformation" },
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
const APPS = [
  { slug: "aras", icon: "/icon-araS.webp" },
  { slug: "retep", icon: "/icon-reteP.webp" },
].map(({ slug, icon }) => {
  const project = getProject(slug, "en")!;
  return {
    slug,
    node: {
      "@type": "SoftwareApplication",
      name: project.title,
      description: project.summary,
      url: project.link,
      applicationCategory: "MobileApplication",
      operatingSystem: "iOS",
      author: { "@id": PERSON_ID },
      image: `${siteConfig.siteUrl}${icon}`,
    },
  };
});

/**
 * A trail from the homepage through `trail`, so a result can show where the
 * page sits instead of a bare URL. Omitted on the homepage, which is the root
 * of its own trail and so says nothing.
 */
const breadcrumb = (trail: { name: string; path: string }[]) => ({
  "@type": "BreadcrumbList",
  itemListElement: [{ name: "Home", path: "" }, ...trail].map((crumb, i) => ({
    "@type": "ListItem",
    position: i + 1,
    name: crumb.name,
    item: `${siteConfig.siteUrl}${crumb.path}`,
  })),
});

export type StructuredDataPage =
  | { page: "home" }
  | { page: "work" | "about" | "events" | "writing" }
  | { page: "project"; slug: string };

const LABEL = {
  work: "Work",
  about: "About",
  events: "Events",
  writing: "Writing",
} as const;

/**
 * Builds the graph for one page. The apps ride along on /work and on their
 * own project pages, not on every page.
 */
export function structuredData(target: StructuredDataPage) {
  const graph: object[] = [person, website];

  if (target.page === "project") {
    const project = getProject(target.slug, "en");
    if (project) {
      graph.push(
        breadcrumb([
          { name: LABEL.work, path: "/work" },
          { name: project.title, path: `/work/${project.slug}` },
        ]),
      );
    }
    const app = APPS.find((a) => a.slug === target.slug);
    if (app) graph.push(app.node);
  } else if (target.page !== "home") {
    graph.push(breadcrumb([{ name: LABEL[target.page], path: `/${target.page}` }]));
    if (target.page === "work") graph.push(...APPS.map((a) => a.node));
  }

  return { "@context": "https://schema.org", "@graph": graph };
}
