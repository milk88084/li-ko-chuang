import {
  PROJECT_FIGURES,
  PROJECT_SLUGS,
  getFeaturedProjects,
  getNextProject,
  getProject,
  getProjects,
  isProjectType,
} from "@/lib/projects";
import { LOCALES } from "@/lib/locale";

describe("project data", () => {
  it("gives every project a unique, URL-safe slug", () => {
    expect(new Set(PROJECT_SLUGS).size).toBe(PROJECT_SLUGS.length);
    for (const slug of PROJECT_SLUGS) {
      expect(slug).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
    }
  });

  it("has copy in both languages for every project", () => {
    for (const locale of LOCALES) {
      for (const project of getProjects(locale)) {
        expect(project.title.trim()).not.toBe("");
        expect(project.summary.trim()).not.toBe("");
        expect(project.problem.trim()).not.toBe("");
        expect(project.outcome.trim()).not.toBe("");
      }
    }
  });

  it("gives every project a known figure, each used once", () => {
    const figures = getProjects("en").map((p) => p.figure);
    for (const figure of figures) expect(PROJECT_FIGURES).toContain(figure);
    expect(new Set(figures).size).toBe(figures.length);
  });
});

describe("getProjects", () => {
  it("returns every project when no type is given", () => {
    expect(getProjects("en")).toHaveLength(PROJECT_SLUGS.length);
  });

  it("filters by type", () => {
    const engineering = getProjects("en", "engineering");
    const marketing = getProjects("en", "marketing");
    expect(engineering.length).toBeGreaterThan(0);
    expect(marketing.length).toBeGreaterThan(0);
    expect(engineering.every((p) => p.type === "engineering")).toBe(true);
    expect(marketing.every((p) => p.type === "marketing")).toBe(true);
    expect(engineering.length + marketing.length).toBe(PROJECT_SLUGS.length);
  });

  it("returns the requested language", () => {
    expect(getProject("campus-gender-equality", "zh")?.title).toBe(
      "校園性別平權宣講計畫",
    );
    expect(getProject("campus-gender-equality", "en")?.title).toBe(
      "Campus Gender Equality Program",
    );
  });
});

describe("getProject", () => {
  it("returns undefined for an unknown slug", () => {
    expect(getProject("nope", "en")).toBeUndefined();
  });
});

describe("getFeaturedProjects", () => {
  it("mixes engineering and marketing work", () => {
    const featured = getFeaturedProjects("en");
    expect(featured.length).toBeGreaterThanOrEqual(4);
    expect(featured.some((p) => p.type === "engineering")).toBe(true);
    expect(featured.some((p) => p.type === "marketing")).toBe(true);
  });
});

describe("getNextProject", () => {
  it("steps to the following project", () => {
    expect(getNextProject(PROJECT_SLUGS[0], "en").slug).toBe(PROJECT_SLUGS[1]);
  });

  it("wraps around from the last project to the first", () => {
    const last = PROJECT_SLUGS[PROJECT_SLUGS.length - 1];
    expect(getNextProject(last, "en").slug).toBe(PROJECT_SLUGS[0]);
  });
});

describe("isProjectType", () => {
  it("accepts only the two known types", () => {
    expect(isProjectType("engineering")).toBe(true);
    expect(isProjectType("marketing")).toBe(true);
    expect(isProjectType("creator")).toBe(false);
    expect(isProjectType(null)).toBe(false);
  });
});
