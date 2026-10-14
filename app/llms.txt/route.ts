import content from "@/data/content.json";
import { siteConfig } from "@/lib/site-config";
import { getProjects } from "@/lib/projects";

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

const projectLines = (type: "engineering" | "marketing") =>
  getProjects("en", type)
    .map((p) => link(p.title, `/work/${p.slug}`, p.summary))
    .join("\n");

export function GET() {
  const body = `# ${siteConfig.name}

> Frontend engineer in Taipei building interfaces in React, Next.js and
> TypeScript, with eight years in marketing, campaigns and event planning
> before that. Designs, builds and ships his own iOS apps alone.

This site is a personal portfolio, published in English at the URLs below and
in Traditional Chinese under ${siteConfig.siteUrl}/zh (the same pages, e.g.
${siteConfig.siteUrl}/zh/work).

## Pages

${link("Home", "/", "Positioning, selected work and the three disciplines: engineering, marketing, events")}
${link("Work", "/work", en.work.intro)}
${link("About", "/about", "Background, full work history, current focus and toolkit")}
${link("Events", "/events", en.events.intro)}
${link("Writing", "/writing", en.writing.intro)}

## Engineering projects

${projectLines("engineering")}

## Marketing projects

${projectLines("marketing")}

## Background

- Frontend engineer at the Institute for Information Industry's Digital
  Transformation Division since 2024.
- Over eight years in marketing, fundraising campaigns, event planning and
  government-funded programme management before moving into engineering.
- Works in React, Next.js, TypeScript, React Native and Expo.

## Elsewhere

- [LinkedIn](${siteConfig.social.linkedin})
- [GitHub](${siteConfig.social.github})
- [Medium](${siteConfig.social.medium})
- Email: ${siteConfig.social.email}
`;

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  });
}
