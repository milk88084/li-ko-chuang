import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site-config";
import { LOCALES, LOCALIZED_ROUTES, htmlLang, localePath } from "@/lib/locale";
import { PROJECT_SLUGS } from "@/lib/projects";

// Compiles to /sitemap.xml at build time. Routes come from lib/locale so the
// sitemap cannot list a page that does not exist, or miss one that does.
//
// Each entry carries the other language as an alternate, which is the
// sitemap-side half of hreflang: the <link> tags in the page head and these
// entries have to agree, or a search engine ignores both.

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  type Frequency = MetadataRoute.Sitemap[number]["changeFrequency"];
  const meta: Record<string, { changeFrequency: Frequency; priority: number }> = {
    "": { changeFrequency: "monthly", priority: 1 },
    "/work": { changeFrequency: "monthly", priority: 0.9 },
    "/about": { changeFrequency: "monthly", priority: 0.8 },
    "/events": { changeFrequency: "monthly", priority: 0.7 },
    "/writing": { changeFrequency: "weekly", priority: 0.7 },
  };
  const projectMeta = { changeFrequency: "yearly" as Frequency, priority: 0.7 };

  const routes = [
    ...LOCALIZED_ROUTES,
    ...PROJECT_SLUGS.map((slug) => `/work/${slug}`),
  ];

  const languages = (route: string) =>
    Object.fromEntries(
      LOCALES.map((locale) => [
        htmlLang(locale),
        `${siteConfig.siteUrl}${localePath(locale, route)}`,
      ]),
    );

  return LOCALES.flatMap((locale) =>
    routes.map((route) => {
      const { changeFrequency, priority } = meta[route] ?? projectMeta;
      return {
        url: `${siteConfig.siteUrl}${localePath(locale, route)}`,
        lastModified,
        changeFrequency,
        // The Chinese mirror of a page is worth slightly less than the
        // English original it was translated from, not the same.
        priority: locale === "en" ? priority : Math.round((priority - 0.1) * 10) / 10,
        alternates: { languages: languages(route) },
      };
    }),
  );
}
