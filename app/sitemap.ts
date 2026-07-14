import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site-config";

// Compiles to /sitemap.xml at build time. Add a route here whenever a new
// page is added under app/ that should be publicly indexed.
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  const routes: Array<{
    path: string;
    changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
    priority: number;
  }> = [
    { path: "", changeFrequency: "monthly", priority: 1 },
    { path: "/engineer", changeFrequency: "weekly", priority: 0.9 },
    { path: "/marketer", changeFrequency: "weekly", priority: 0.8 },
    { path: "/creator", changeFrequency: "weekly", priority: 0.8 },
  ];

  return routes.map(({ path, changeFrequency, priority }) => ({
    url: `${siteConfig.siteUrl}${path}`,
    lastModified,
    changeFrequency,
    priority,
  }));
}
