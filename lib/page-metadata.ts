import type { Metadata } from "next";
import content from "@/data/content.json";
import { siteConfig } from "@/lib/site-config";
import {
  LOCALES,
  htmlLang,
  localePath,
  type Locale,
  type LocalizedRoute,
} from "@/lib/locale";

// Metadata for a localized page, built in one place so the canonical URL and
// the hreflang pairs can never disagree with the routes that actually exist.
//
// hreflang is what tells a search engine that /engineer and /zh/engineer are
// the same page in two languages rather than duplicates competing with each
// other. It has to be reciprocal — each page pointing at both — plus an
// x-default naming the version to serve when no language matches.

/** `languages` for `alternates`: every locale, plus x-default on English. */
function languageAlternates(route: LocalizedRoute) {
  const languages: Record<string, string> = {};
  for (const locale of LOCALES) {
    languages[htmlLang(locale)] = localePath(locale, route);
  }
  languages["x-default"] = localePath("en", route);
  return languages;
}

type Section = "engineer" | "marketer" | "creator";

export function localeMetadata(
  locale: Locale,
  route: LocalizedRoute,
  page: { title?: string; description: string; ogTitle: string },
): Metadata {
  const canonical = localePath(locale, route);
  return {
    ...(page.title ? { title: page.title } : {}),
    description: page.description,
    alternates: { canonical, languages: languageAlternates(route) },
    // Spelled out in full rather than inherited: a child segment's openGraph
    // REPLACES the parent's instead of merging, so anything left out here is
    // simply absent from the page.
    openGraph: {
      type: "website",
      url: canonical,
      siteName: siteConfig.name,
      locale: htmlLang(locale),
      title: page.ogTitle,
      description: page.description,
    },
  };
}

/** Title/description for a section page, in the requested language. */
export function sectionMetadata(locale: Locale, section: Section): Metadata {
  const hero = content[locale][section].hero;
  return localeMetadata(locale, `/${section}`, {
    // The nav label, not a capitalised route name: the Chinese page's tab
    // should read "工程師 | Li Ko Chuan", not "Engineer | Li Ko Chuan".
    title: content[locale].nav[section],
    description: hero.descriptionSub,
    ogTitle: `${hero.title} ${hero.titleHighlight}`,
  });
}

/** The homepage, which has no section content to draw on. */
export function homeMetadata(locale: Locale): Metadata {
  return localeMetadata(locale, "", {
    description: siteConfig.description,
    ogTitle: siteConfig.title,
  });
}
