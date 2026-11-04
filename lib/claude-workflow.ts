import data from "@/data/claude-workflow.json";
import type { Locale } from "@/lib/locale";

// The Claude Code workflow drawn on the About page. data/claude-workflow.json
// holds the steps in order, the premise that runs under all of them, and the
// official pages every line is taken from; adding or removing a step is an
// edit to that file only — the component lays out whatever it is given.

type Text = { en: string; zh: string };

export type SourceKey = keyof typeof data.sources;

interface RawItem {
  label?: string;
  body: Text;
  code: string;
}

interface RawStep {
  id: string;
  kind: string;
  title: Text;
  summary: Text;
  source: string;
  loopBackTo?: string;
  items: RawItem[];
}

export interface WorkflowItem {
  label: string | null;
  body: string;
  code: string;
}

export interface WorkflowStep {
  id: string;
  /** "setup" is done once, before the loop; every other step is "step". */
  kind: "setup" | "step";
  title: string;
  summary: string;
  source: { url: string; title: string };
  /** The step a failed check sends the work back to. */
  loopBackTo: string | null;
  items: WorkflowItem[];
}

export interface WorkflowPremise {
  title: string;
  body: string;
  items: { body: string; code: string; source: { url: string; title: string } }[];
}

export interface Workflow {
  premise: WorkflowPremise;
  steps: WorkflowStep[];
  sources: { url: string; title: string }[];
}

const SOURCES = data.sources as Record<string, { url: string; title: Text }>;

function source(key: string, locale: Locale) {
  const s = SOURCES[key];
  if (!s) throw new Error(`claude-workflow: unknown source "${key}"`);
  return { url: s.url, title: s.title[locale] };
}

export function getWorkflow(locale: Locale): Workflow {
  const steps = (data.steps as RawStep[]).map((s) => ({
    id: s.id,
    kind: s.kind === "setup" ? ("setup" as const) : ("step" as const),
    title: s.title[locale],
    summary: s.summary[locale],
    source: source(s.source, locale),
    loopBackTo: s.loopBackTo ?? null,
    items: s.items.map((i) => ({
      label: i.label ?? null,
      body: i.body[locale],
      code: i.code,
    })),
  }));

  const premise = {
    title: data.premise.title[locale],
    body: data.premise.body[locale],
    items: data.premise.items.map((i) => ({
      body: i.body[locale],
      code: i.code,
      source: source(i.source, locale),
    })),
  };

  return {
    premise,
    steps,
    sources: Object.keys(SOURCES).map((k) => source(k, locale)),
  };
}
