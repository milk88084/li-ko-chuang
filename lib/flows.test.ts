import { FLOW_ICONS } from "@/components/work/flow-icons";
import { FLOW_MAX_COLS, FLOW_SLUGS, getFlow } from "@/lib/flows";
import { PROJECT_SLUGS } from "@/lib/projects";
import { LOCALES } from "@/lib/locale";

describe("project flows", () => {
  it("belong to projects that exist", () => {
    for (const slug of FLOW_SLUGS) expect(PROJECT_SLUGS).toContain(slug);
  });

  it("have copy in both languages", () => {
    for (const slug of FLOW_SLUGS) {
      for (const locale of LOCALES) {
        const flow = getFlow(slug, locale)!;
        expect(flow.legend.trim()).not.toBe("");
        for (const node of flow.nodes) expect(node.label.trim()).not.toBe("");
      }
    }
  });

  it("place every station on a free cell inside the grid, with a known icon", () => {
    for (const slug of FLOW_SLUGS) {
      const flow = getFlow(slug, "en")!;
      const cells = new Set<string>();
      expect(new Set(flow.nodes.map((n) => n.id)).size).toBe(flow.nodes.length);
      expect(flow.cols).toBeLessThanOrEqual(FLOW_MAX_COLS);
      for (const node of flow.nodes) {
        expect(Number.isInteger(node.lane) && Number.isInteger(node.col)).toBe(true);
        expect(node.lane).toBeGreaterThanOrEqual(0);
        expect(node.lane).toBeLessThan(flow.lanes.length);
        expect(node.col).toBeGreaterThanOrEqual(0);
        expect(Object.keys(FLOW_ICONS)).toContain(node.icon);
        const cell = `${node.lane}:${node.col}`;
        expect(cells.has(cell)).toBe(false);
        cells.add(cell);
      }
    }
  });

  // Arrows run along the source's row and turn in the gap before the target,
  // so they must point rightwards and nothing may sit on that stretch of row.
  it("draws arrows that run left to right without crossing a station", () => {
    for (const slug of FLOW_SLUGS) {
      const flow = getFlow(slug, "en")!;
      const byId = new Map(flow.nodes.map((n) => [n.id, n]));
      for (const edge of flow.edges) {
        const from = byId.get(edge.from);
        const to = byId.get(edge.to);
        expect(from && to).toBeTruthy();
        expect(to!.col).toBeGreaterThan(from!.col);
        const blocked = flow.nodes.filter(
          (n) => n.lane === from!.lane && n.col > from!.col && n.col < to!.col,
        );
        expect(blocked.map((n) => `${slug}: ${edge.from}→${edge.to} crosses ${n.id}`)).toEqual([]);
      }
    }
  });
});
