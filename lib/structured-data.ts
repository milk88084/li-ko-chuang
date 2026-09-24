import content from "@/data/content.json";
import { siteConfig } from "@/lib/site-config";

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
  jobTitle: "Front-end Engineer",
  email: `mailto:${siteConfig.social.email}`,
  description: content.en.engineer.hero.descriptionSub,
  knowsAbout: [
    "React",
    "Next.js",
    "TypeScript",
    "React Native",
    "Expo",
    "Marketing Strategy",
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
  sameAs: [siteConfig.social.linkedin, siteConfig.social.github],
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

/** The two iOS apps, described as products rather than as portfolio prose. */
const apps = content.en.engineer.shipped.apps.map((app) => ({
  "@type": "SoftwareApplication",
  name: app.name,
  description: app.caption,
  url: app.href,
  applicationCategory: "MobileApplication",
  operatingSystem: "iOS",
  author: { "@id": PERSON_ID },
  image: `${siteConfig.siteUrl}${app.icon}`,
}));

/**
 * A trail from the homepage down to `path`, so a result can show where the
 * page sits instead of a bare URL. Omitted on the homepage, which is the root
 * of its own trail and so says nothing.
 */
const breadcrumb = (path: string, name: string) => ({
  "@type": "BreadcrumbList",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      name: "Home",
      item: siteConfig.siteUrl,
    },
    {
      "@type": "ListItem",
      position: 2,
      name,
      item: `${siteConfig.siteUrl}${path}`,
    },
  ],
});

/**
 * Builds the graph for one page. `page` names the route so the right extras
 * ride along: the apps belong to the engineer page, not to every page.
 */
export function structuredData(
  page: "home" | "engineer" | "marketer" | "creator",
) {
  const graph: object[] = [person, website];

  if (page !== "home") {
    const label = page.charAt(0).toUpperCase() + page.slice(1);
    graph.push(breadcrumb(`/${page}`, label));
  }

  if (page === "engineer") graph.push(...apps);

  return { "@context": "https://schema.org", "@graph": graph };
}
