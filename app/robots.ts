import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site-config";

// Next.js compiles this to /robots.txt at build time — no need for a static
// file under public/. Runs as a server-only module, so siteConfig.siteUrl
// only ever needs to be correct at build/deploy time.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // Keep the internal AI content-generator tool and its backend
        // proxy routes out of the crawl budget — it's not public content.
        disallow: ["/studio", "/api/"],
      },
    ],
    sitemap: `${siteConfig.siteUrl}/sitemap.xml`,
  };
}
