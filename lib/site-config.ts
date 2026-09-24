// Central place for site-wide SEO constants. Every metadata export, the
// JSON-LD block, robots.ts and sitemap.ts read from here so there is a single
// source of truth for the production domain and social links.
//
// Resolving the production origin, most-explicit first:
//   1. NEXT_PUBLIC_SITE_URL — set this in .env.local / your host to pin the
//      canonical domain (e.g. https://likochuang.com once DNS is live). Must be
//      NEXT_PUBLIC_ so client components (Navigation, Footer) can read it too,
//      not only server-side generateMetadata / route handlers.
//   2. Vercel's auto-injected production domain — a working fallback so a
//      forgotten env var still ships real, resolvable absolute URLs instead of
//      a placeholder that 404s every og:image, canonical and sitemap <loc>.
//   3. localhost for `next dev`. Deliberately NOT a plausible-looking public
//      domain: if 1 and 2 are both missing in production we WANT the audit to
//      surface an obviously-wrong origin rather than hide the misconfiguration.
const vercelProdUrl = process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL;
const rawSiteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (vercelProdUrl ? `https://${vercelProdUrl}` : "http://localhost:3000");

export const siteConfig = {
  name: "Li Ko Chuan",
  title: "Li Ko Chuan | Portfolio",
  description: "Building Interfaces, Telling Stories.",
  // Strip any trailing slash so `${siteUrl}${path}` never double-slashes.
  siteUrl: rawSiteUrl.replace(/\/$/, ""),
  // No ogImage here on purpose: app/opengraph-image.tsx generates it at
  // 1200x630 and Next.js wires it up by filename, so there is nothing to
  // keep in sync. /engineer_hero.png is still used as a page image.
  social: {
    linkedin: "https://www.linkedin.com/in/kochuang/",
    github: "https://github.com/milk88084",
    email: "milk88084@gmail.com",
  },
} as const;
