import { structuredData } from "@/lib/structured-data";
import { siteConfig } from "@/lib/site-config";
import { PROJECT_SLUGS, getProject } from "@/lib/projects";
import { LOCALES } from "@/lib/locale";

type Node = Record<string, unknown> & { "@type": string };

const nodes = (graph: ReturnType<typeof structuredData>) =>
  graph["@graph"] as Node[];
const ofType = (graph: ReturnType<typeof structuredData>, type: string) =>
  nodes(graph).filter((n) => n["@type"] === type);
const crumbs = (graph: ReturnType<typeof structuredData>) =>
  (ofType(graph, "BreadcrumbList")[0].itemListElement as Node[]).map((c) => ({
    name: c.name,
    item: c.item,
  }));

describe("structuredData", () => {
  it("walks the Chinese breadcrumb in Chinese, to Chinese URLs", () => {
    const project = getProject("nivorae", "zh")!;
    expect(crumbs(structuredData({ page: "project", slug: "nivorae", locale: "zh" }))).toEqual([
      { name: "首頁", item: `${siteConfig.siteUrl}/zh` },
      { name: "作品", item: `${siteConfig.siteUrl}/zh/work` },
      { name: project.title, item: `${siteConfig.siteUrl}/zh/work/nivorae` },
    ]);
  });

  it("keeps the English breadcrumb on English URLs", () => {
    expect(crumbs(structuredData({ page: "about", locale: "en" }))).toEqual([
      { name: "Home", item: `${siteConfig.siteUrl}/` },
      { name: "About", item: `${siteConfig.siteUrl}/about` },
    ]);
  });

  it("describes every project page as a work by the person, in its language", () => {
    for (const locale of LOCALES) {
      for (const slug of PROJECT_SLUGS) {
        const project = getProject(slug, locale)!;
        const graph = structuredData({ page: "project", slug, locale });
        const work = nodes(graph).find(
          (n) => n["@type"] === "CreativeWork" || n["@type"] === "SoftwareApplication",
        )!;
        expect(work.name).toBe(project.title);
        expect(work.description).toBe(project.summary);
        expect(work.author).toEqual({ "@id": `${siteConfig.siteUrl}/#person` });
        if (project.link) expect(work.url).toBe(project.link);
      }
    }
  });

  it("gives a work with screenshots an absolute image, never a video", () => {
    const work = ofType(
      structuredData({ page: "project", slug: "little-daily-site", locale: "en" }),
      "CreativeWork",
    )[0];
    expect(work.image).toBe(`${siteConfig.siteUrl}/07_Little_Daily_about.webp`);
    const app = ofType(
      structuredData({ page: "project", slug: "u-turn", locale: "en" }),
      "CreativeWork",
    )[0];
    expect(String(app.image)).not.toMatch(/\.mp4$/);
  });

  it("names the person a member of Nivorae", () => {
    const person = ofType(structuredData({ page: "home", locale: "en" }), "Person")[0];
    expect(person.memberOf).toMatchObject({ name: "Nivorae", url: "https://nivorae.net" });
    expect(person.knowsAbout).toEqual(expect.arrayContaining(["Claude Code", "UI/UX Design"]));
  });
});
