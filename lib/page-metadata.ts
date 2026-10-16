import type { Metadata } from "next";
import content from "@/data/content.json";
import { siteConfig } from "@/lib/site-config";
import { getProject } from "@/lib/projects";
import { LOCALES, htmlLang, localePath, type Locale } from "@/lib/locale";

// Metadata for a localized page, built in one place so the canonical URL and
// the hreflang pairs can never disagree with the routes that actually exist.
//
// hreflang is what tells a search engine that /work and /zh/work are
// the same page in two languages rather than duplicates competing with each
// other. It has to be reciprocal — each page pointing at both — plus an
// x-default naming the version to serve when no language matches.

/** `languages` for `alternates`: every locale, plus x-default on English. */
function languageAlternates(route: string) {
  const languages: Record<string, string> = {};
  for (const locale of LOCALES) {
    languages[htmlLang(locale)] = localePath(locale, route);
  }
  languages["x-default"] = localePath("en", route);
  return languages;
}

export function localeMetadata(
  locale: Locale,
  route: string,
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

type Page = "work" | "about" | "events" | "writing";

/** Where each page's description comes from in content.json. */
const DESCRIPTION: Record<Page, (locale: Locale) => string> = {
  work: (l) => content[l].work.intro,
  about: (l) => content[l].footer.blurb,
  events: (l) => content[l].events.intro,
  writing: (l) => content[l].writing.intro,
};

/** Title/description for a top-level page, in the requested language. */
export function pageMetadata(locale: Locale, page: Page): Metadata {
  // The nav label, not a capitalised route name: the Chinese page's tab
  // should read "作品 | Li Ko Chuan", not "Work | Li Ko Chuan".
  const title = content[locale].nav[page];
  return localeMetadata(locale, `/${page}`, {
    title,
    description: DESCRIPTION[page](locale),
    ogTitle: `${title} — ${siteConfig.name}`,
  });
}

/** A project page; empty for a slug that does not exist (the page 404s). */
export function projectMetadata(locale: Locale, slug: string): Metadata {
  const project = getProject(slug, locale);
  if (!project) return {};
  return localeMetadata(locale, `/work/${slug}`, {
    title: project.title,
    description: project.summary,
    ogTitle: `${project.title} — ${siteConfig.name}`,
  });
}

/** The homepage, which has no section content to draw on. */
export function homeMetadata(locale: Locale): Metadata {
  return localeMetadata(locale, "", {
    description: siteConfig.description,
    ogTitle: siteConfig.title,
  });
}
