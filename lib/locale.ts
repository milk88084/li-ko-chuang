// Locale routing. English is unprefixed and Chinese lives under /zh, so the
// URLs that are already indexed (/engineer, /marketer, …) keep working and the
// Chinese pages become real, crawlable pages instead of a client-side toggle
// that search engines and AI crawlers never see.
//
// Pure functions only — the provider, the layouts and the sitemap all derive
// their paths from here so the two locales cannot drift apart.

export const LOCALES = ["en", "zh"] as const;
export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "en";
export const ZH_PREFIX = "/zh";

/** Routes that exist in both languages. /studio is an internal tool, English only. */
export const LOCALIZED_ROUTES = [
  "",
  "/engineer",
  "/marketer",
  "/creator",
] as const;
export type LocalizedRoute = (typeof LOCALIZED_ROUTES)[number];

/** BCP 47 tags for <html lang> and hreflang. "zh" alone would not say which script. */
const HTML_LANG: Record<Locale, string> = { en: "en", zh: "zh-Hant" };

export const htmlLang = (locale: Locale) => HTML_LANG[locale];

export const otherLocale = (locale: Locale): Locale =>
  locale === "en" ? "zh" : "en";

/** Strips a query string, hash and any trailing slash so paths compare cleanly. */
const normalize = (pathname: string) => {
  const path = pathname.split(/[?#]/)[0];
  return path.length > 1 ? path.replace(/\/+$/, "") : path;
};

export function localeFromPathname(pathname: string): Locale {
  const path = normalize(pathname);
  // `startsWith("/zh")` alone would also match /zhuangzi.
  return path === ZH_PREFIX || path.startsWith(`${ZH_PREFIX}/`) ? "zh" : "en";
}

/** The URL path for `route` in `locale`. `""` is the homepage. */
export function localePath(locale: Locale, route: string): string {
  const base = locale === "zh" ? ZH_PREFIX : "";
  return `${base}${route}` || "/";
}

/** The route part of a path, with the locale prefix removed. */
export function routeFromPathname(pathname: string): string {
  const path = normalize(pathname);
  if (localeFromPathname(path) === "zh") {
    return path.slice(ZH_PREFIX.length);
  }
  return path === "/" ? "" : path;
}

/**
 * The same page in the other language — what the language toggle links to.
 * Routes with no counterpart fall back to the other locale's homepage rather
 * than sending someone to a 404.
 */
export function otherLocalePath(pathname: string): string {
  const target = otherLocale(localeFromPathname(pathname));
  const route = routeFromPathname(pathname);
  const isTranslated = (LOCALIZED_ROUTES as readonly string[]).includes(route);
  return localePath(target, isTranslated ? route : "");
}
