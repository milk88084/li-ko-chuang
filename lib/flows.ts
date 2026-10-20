import flowData from "@/data/flows.json";
import type { Locale } from "@/lib/locale";

// How a project works, drawn on its page as a journey diagram: horizontal
// lanes (who or where a step happens), columns (the order things happen in),
// and arrows that only ever run left to right. data/flows.json holds one flow
// per project slug; a project without one simply shows no diagram.

/** Columns a flow may use — seven fit the 1440px page without scaling. */
export const FLOW_MAX_COLS = 7;

type Text = { en: string; zh: string };

interface RawNode {
  id: string;
  /** [lane, column], both from 0. */
  at: number[];
  icon: string;
  label: Text;
  note?: Text;
  /** Drawn filled in the accent colour; the legend says what that means. */
  accent?: boolean;
}

interface RawEdge {
  from: string;
  to: string;
  label?: Text;
  dashed?: boolean;
}

interface RawFlow {
  legend: Text;
  /** A lane's heading, or null for an unlabelled lane (shared middle row). */
  lanes: (Text | null)[];
  nodes: RawNode[];
  edges: RawEdge[];
}

export interface FlowNode {
  id: string;
  lane: number;
  col: number;
  icon: string;
  label: string;
  note: string | null;
  accent: boolean;
}

export interface FlowEdge {
  from: string;
  to: string;
  label: string | null;
  dashed: boolean;
}

export interface Flow {
  legend: string;
  lanes: (string | null)[];
  cols: number;
  nodes: FlowNode[];
  edges: FlowEdge[];
}

const RAW = flowData as unknown as Record<string, RawFlow>;

export const FLOW_SLUGS = Object.keys(RAW);

export function getFlow(slug: string, locale: Locale): Flow | undefined {
  const raw = RAW[slug];
  if (!raw) return undefined;
  const nodes = raw.nodes.map((n) => ({
    id: n.id,
    lane: n.at[0],
    col: n.at[1],
    icon: n.icon,
    label: n.label[locale],
    note: n.note?.[locale] ?? null,
    accent: n.accent ?? false,
  }));
  return {
    legend: raw.legend[locale],
    lanes: raw.lanes.map((lane) => lane?.[locale] ?? null),
    cols: Math.max(...nodes.map((n) => n.col)) + 1,
    nodes,
    edges: raw.edges.map((e) => ({
      from: e.from,
      to: e.to,
      label: e.label?.[locale] ?? null,
      dashed: e.dashed ?? false,
    })),
  };
}
