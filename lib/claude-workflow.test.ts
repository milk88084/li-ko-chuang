import data from "@/data/claude-workflow.json";
import { getWorkflow } from "./claude-workflow";

const OFFICIAL = /^https:\/\/code\.claude\.com\/docs\/en\//;

describe("claude workflow data", () => {
  it.each(["en", "zh"] as const)("has every string in %s", (locale) => {
    const wf = getWorkflow(locale);
    expect(wf.steps.length).toBeGreaterThan(0);
    for (const step of wf.steps) {
      expect(step.title).toBeTruthy();
      expect(step.summary).toBeTruthy();
      expect(step.items.length).toBeGreaterThan(0);
      for (const item of step.items) {
        expect(item.body).toBeTruthy();
        expect(item.code).toBeTruthy();
      }
    }
    expect(wf.premise.title).toBeTruthy();
    for (const item of wf.premise.items) expect(item.body).toBeTruthy();
  });

  it("cites only official Claude Code docs", () => {
    const wf = getWorkflow("en");
    for (const s of wf.sources) expect(s.url).toMatch(OFFICIAL);
    for (const step of wf.steps) expect(step.source.url).toMatch(OFFICIAL);
  });

  it("has unique ids and loops back only to an earlier step", () => {
    const ids = data.steps.map((s) => s.id);
    expect(new Set(ids).size).toBe(ids.length);
    data.steps.forEach((s, i) => {
      if (!("loopBackTo" in s) || !s.loopBackTo) return;
      const target = ids.indexOf(s.loopBackTo);
      expect(target).toBeGreaterThanOrEqual(0);
      expect(target).toBeLessThan(i);
    });
  });

  it("starts with the one-time setup", () => {
    expect(getWorkflow("en").steps[0].kind).toBe("setup");
  });
});
