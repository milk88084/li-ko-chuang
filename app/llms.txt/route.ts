import content from "@/data/content.json";
import { siteConfig } from "@/lib/site-config";

// Serves /llms.txt — the convention for telling AI assistants what a site is
// and which pages are worth reading, in the plain Markdown they parse best.
// Built here rather than dropped in public/ for the same reason robots.ts and
// sitemap.ts are: the origin comes from siteConfig, so it is never hard-coded
// and never goes stale when the domain changes.
//
// Content is pulled from data/content.json so this file cannot drift away from
// what the pages actually say.

export const dynamic = "force-static";

const en = content.en;

/** `- [Title](url): what a reader will find there` — the format the spec uses. */
const link = (title: string, path: string, description: string) =>
  `- [${title}](${siteConfig.siteUrl}${path}): ${description}`;

export function GET() {
  const body = `# ${siteConfig.name}

> Frontend engineer in Taipei building interfaces in React, Next.js and
> TypeScript, with eight years in marketing and project management before that.
> Designs, builds and ships his own iOS apps alone.

${en.engineer.hero.descriptionSub}

This site is a personal portfolio, published in English at the URLs below and
in Traditional Chinese under ${siteConfig.siteUrl}/zh (the same pages, e.g.
${siteConfig.siteUrl}/zh/engineer).

## Pages

${link("Home", "/", "Name, positioning and the three areas of work")}
${link("Engineer", "/engineer", en.engineer.hero.descriptionSub)}
${link("Marketer", "/marketer", en.marketer.hero.descriptionSub)}
${link("Creator", "/creator", "Podcast, writing and personal projects outside engineering")}

## Shipped products

- **araS Asset** — personal finance app for iOS, built with React Native and
  Expo. Designed, developed and submitted to the App Store by one person.
- **reteP** — per-meal calorie tracking app for iOS, React Native and Expo.
  Same: one person, every layer.

${en.engineer.shipped.description}

## Background

- Frontend engineer at the Institute for Information Industry's Digital
  Transformation Division since 2024.
- Over eight years in marketing, campaign planning and government-funded
  programme management before moving into engineering.
- Works in React, Next.js, TypeScript, React Native and Expo.

## Elsewhere

- [LinkedIn](${siteConfig.social.linkedin})
- [GitHub](${siteConfig.social.github})
- Email: ${siteConfig.social.email}
`;

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  });
}
