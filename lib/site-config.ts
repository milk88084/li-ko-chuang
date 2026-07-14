// Central place for site-wide SEO constants. Every metadata export, the
// JSON-LD block, robots.ts and sitemap.ts read from here so there is a single
// source of truth for the production domain and social links.
//
// Set NEXT_PUBLIC_SITE_URL in .env.local / your hosting provider once the
// real domain is live. It must be prefixed with NEXT_PUBLIC_ to be readable
// from client components (e.g. Navigation, Footer), not just from
// generateMetadata / route handlers, which only run on the server.
const rawSiteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://yourportfolio.com";

export const siteConfig = {
  name: "Li Ko Chuang",
  title: "Li Ko Chuang | Portfolio",
  description: "Building Interfaces, Telling Stories.",
  // Strip any trailing slash so `${siteUrl}${path}` never double-slashes.
  siteUrl: rawSiteUrl.replace(/\/$/, ""),
  ogImage: "/engineer_hero.png",
  social: {
    linkedin: "https://www.linkedin.com/in/kochuang/",
    github: "https://github.com/milk88084",
    email: "milk88084@gmail.com",
  },
} as const;
