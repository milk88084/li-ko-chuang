import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site-config";
import { LOCALES, LOCALIZED_ROUTES, htmlLang, localePath } from "@/lib/locale";

// Compiles to /sitemap.xml at build time. Routes come from lib/locale so the
// sitemap cannot list a page that does not exist, or miss one that does.
//
// Each entry carries the other language as an alternate, which is the
// sitemap-side half of hreflang: the <link> tags in the page head and these
// entries have to agree, or a search engine ignores both.

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  const meta: Record<string, { changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"]; priority: number }> =
    {
      "": { changeFrequency: "monthly", priority: 1 },
      "/engineer": { changeFrequency: "weekly", priority: 0.9 },
      "/marketer": { changeFrequency: "weekly", priority: 0.8 },
      "/creator": { changeFrequency: "weekly", priority: 0.8 },
    };

  const languages = (route: string) =>
    Object.fromEntries(
      LOCALES.map((locale) => [
        htmlLang(locale),
        `${siteConfig.siteUrl}${localePath(locale, route)}`,
      ]),
    );

  return LOCALES.flatMap((locale) =>
    LOCALIZED_ROUTES.map((route) => ({
      url: `${siteConfig.siteUrl}${localePath(locale, route)}`,
      lastModified,
      changeFrequency: meta[route].changeFrequency,
      // The Chinese mirror of a page is worth slightly less than the English
      // original it was translated from, not the same.
      priority:
        locale === "en" ? meta[route].priority : meta[route].priority - 0.1,
      alternates: { languages: languages(route) },
    })),
  );
}
