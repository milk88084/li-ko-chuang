"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent,
} from "react";
import gsap from "gsap";
import { ArrowUpRight, Plus } from "lucide-react";
import content from "@/data/content.json";
import type { Locale } from "@/lib/locale";
import { getWorkflow } from "@/lib/claude-workflow";
import { useInView } from "@/hooks/useInView";
import { Section } from "@/components/layout/Section";

// The Claude Code workflow as a flow of cards: an S on wide screens (rows of
// four, every other row running right to left), a single column on phones.
// The steps come from data/claude-workflow.json; nothing here knows how many
// there are. Connectors are measured from the rendered cards, so the same code
// draws the S and the vertical timeline. The "keep the context clean" premise
// frames the whole flow instead of sitting in it as a step.
//
// Motion: once the block scrolls into view, cards rise in one by one and each
// connector draws itself after the card it leaves. The HTML is already the
// finished state; GSAP only sets the starting state when motion is allowed,
// so reduced motion (and no JavaScript) simply shows everything.

const ROW = 4;
const GAP = 6; // space between a connector's end and the card it touches
const LOOP_DROP = 44; // how far the "fails → fix again" arc swings out

type Rect = { left: number; right: number; top: number; bottom: number; cx: number; cy: number };
type Arrow = { x: number; y: number; angle: number };
type Edge = { d: string; arrow: Arrow };
type Loop = Edge & { label: { x: number; y: number; rotate: number } };
type Geometry = { width: number; height: number; edges: Edge[]; loops: Loop[] };

const deg = (dx: number, dy: number) => (Math.atan2(dy, dx) * 180) / Math.PI;

// Layout offsets rather than getBoundingClientRect, so the entrance
// transform on a card never bends the line drawn to it.
function rectOf(el: HTMLElement, root: HTMLElement): Rect {
  let left = 0;
  let top = 0;
  for (let n: HTMLElement | null = el; n && n !== root; n = n.offsetParent as HTMLElement | null) {
    left += n.offsetLeft;
    top += n.offsetTop;
  }
  const w = el.offsetWidth;
  const h = el.offsetHeight;
  return { left, top, right: left + w, bottom: top + h, cx: left + w / 2, cy: top + h / 2 };
}

/** Next step in the flow: sideways within a row, straight down between rows. */
function connect(head: Rect, cell: Rect, nextHead: Rect): Edge {
  if (head.right <= nextHead.left) {
    const sx = head.right + GAP;
    const tx = nextHead.left - GAP;
    return { d: `M${sx} ${head.cy}H${tx}`, arrow: { x: tx, y: head.cy, angle: 0 } };
  }
  if (nextHead.right <= head.left) {
    const sx = head.left - GAP;
    const tx = nextHead.right + GAP;
    return { d: `M${sx} ${head.cy}H${tx}`, arrow: { x: tx, y: head.cy, angle: 180 } };
  }
  const sy = cell.bottom + GAP;
  const ty = nextHead.top - GAP;
  return { d: `M${head.cx} ${sy}V${ty}`, arrow: { x: head.cx, y: ty, angle: 90 } };
}

/** A failed check back to an earlier step: under the row, or out to the left. */
function loopBack(from: Rect, fromCell: Rect, to: Rect, toCell: Rect): Loop {
  const sideBySide = from.right <= to.left || to.right <= from.left;
  if (sideBySide) {
    const sy = fromCell.bottom + GAP;
    const ty = toCell.bottom + GAP;
    const low = Math.max(sy, ty) + LOOP_DROP;
    const d = `M${from.cx} ${sy}C${from.cx} ${low} ${to.cx} ${low} ${to.cx} ${ty}`;
    return {
      d,
      arrow: { x: to.cx, y: ty, angle: deg(0, ty - low) },
      label: { x: (from.cx + to.cx) / 2, y: low - 2, rotate: 0 },
    };
  }
  const sx = from.left - GAP;
  const tx = to.left - GAP;
  const out = Math.min(sx, tx) - LOOP_DROP / 2;
  const d = `M${sx} ${from.cy}C${out} ${from.cy} ${out} ${to.cy} ${tx} ${to.cy}`;
  return {
    d,
    arrow: { x: tx, y: to.cy, angle: deg(tx - out, 0) },
    label: { x: out + 4, y: (from.cy + to.cy) / 2, rotate: -90 },
  };
}

export function ClaudeWorkflow({ locale }: { locale: Locale }) {
  const t = content[locale].about.workflow;
  const { premise, steps, sources } = useMemo(() => getWorkflow(locale), [locale]);

  const blockRef = useRef<HTMLDivElement>(null);
  const flowRef = useRef<HTMLOListElement>(null);
  const premiseRef = useRef<HTMLDivElement>(null);
  const cellRefs = useRef<(HTMLLIElement | null)[]>([]);
  const headRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const svgRef = useRef<SVGSVGElement>(null);
  const played = useRef(false);
  const timeline = useRef<gsap.core.Timeline | null>(null);

  const inView = useInView(blockRef);
  const [geo, setGeo] = useState<Geometry | null>(null);
  const [pinned, setPinned] = useState<string | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);
  const open = hovered ?? pinned;

  const loops = useMemo(
    () =>
      steps
        .map((s, i) => ({ from: i, to: steps.findIndex((x) => x.id === s.loopBackTo) }))
        .filter((l) => l.to >= 0),
    [steps],
  );

  const measure = useCallback(() => {
    const flow = flowRef.current;
    if (!flow) return;
    const heads = headRefs.current.map((el) => el && rectOf(el, flow));
    const cells = cellRefs.current.map((el) => el && rectOf(el, flow));
    const edges: Edge[] = [];
    for (let i = 0; i < steps.length - 1; i++) {
      const [h, c, n] = [heads[i], cells[i], heads[i + 1]];
      if (h && c && n) edges.push(connect(h, c, n));
    }
    const loopGeo: Loop[] = [];
    for (const l of loops) {
      const [f, fc, to, tc] = [heads[l.from], cells[l.from], heads[l.to], cells[l.to]];
      if (f && fc && to && tc) loopGeo.push(loopBack(f, fc, to, tc));
    }
    setGeo({ width: flow.offsetWidth, height: flow.offsetHeight, edges, loops: loopGeo });
  }, [steps, loops]);

  // Re-measure whenever the flow's box changes: a breakpoint, a font swap,
  // or a card opening inline on a phone.
  useLayoutEffect(() => {
    measure();
    const flow = flowRef.current;
    if (!flow) return;
    const ro = new ResizeObserver(() => measure());
    ro.observe(flow);
    cellRefs.current.forEach((el) => el && ro.observe(el));
    return () => ro.disconnect();
  }, [measure]);

  // Starting state, set before paint and only when the entrance will play.
  useLayoutEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      played.current = true;
      return;
    }
    gsap.set([premiseRef.current, ...headRefs.current], { opacity: 0, y: 16 });
  }, []);

  // Connectors render finished; while the entrance is still pending, each
  // freshly measured one is wound back to undrawn before it is painted.
  useLayoutEffect(() => {
    const svg = svgRef.current;
    if (!svg || !geo || played.current) return;
    gsap.set(svg.querySelectorAll("[data-edge], [data-loop]"), { strokeDashoffset: 1 });
    gsap.set(svg.querySelectorAll("[data-edge-arrow], [data-loop-after]"), { opacity: 0 });
  }, [geo]);

  useEffect(() => {
    if (!inView || !geo || played.current) return;
    played.current = true;
    const svg = svgRef.current;
    const pick = (sel: string) => (svg ? Array.from(svg.querySelectorAll(sel)) : []);
    const edgePaths = pick("[data-edge]");
    const edgeArrows = pick("[data-edge-arrow]");

    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
    timeline.current = tl;
    // Each card rises, then the line to the next one draws while it settles;
    // the next card starts just before that line lands. ~3.5s for eight.
    tl.to(premiseRef.current, { opacity: 1, y: 0, duration: 0.4 });
    headRefs.current.forEach((head, i) => {
      tl.to(head, { opacity: 1, y: 0, duration: 0.3 }, i === 0 ? ">-0.15" : ">-0.05");
      if (edgePaths[i]) {
        tl.to(edgePaths[i], { strokeDashoffset: 0, duration: 0.2, ease: "power1.inOut" }, ">-0.1");
        tl.to(edgeArrows[i], { opacity: 1, duration: 0.06 }, ">-0.03");
      }
    });
    tl.to(pick("[data-loop]"), { strokeDashoffset: 0, duration: 0.45, ease: "power1.inOut" });
    tl.to(pick("[data-loop-after]"), { opacity: 1, duration: 0.2 });
    // No cleanup here: a re-measure mid-entrance must not cut it short.
  }, [inView, geo]);

  useEffect(() => () => void timeline.current?.kill(), []);

  // Escape closes the open card; a click elsewhere un-pins it.
  useEffect(() => {
    if (!pinned) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setPinned(null);
        setHovered(null);
      }
    };
    const onDown = (e: globalThis.PointerEvent) => {
      if (!blockRef.current?.contains(e.target as Node)) setPinned(null);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onDown);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onDown);
    };
  }, [pinned]);

  // Hover previews a card only with a mouse on the wide layout, where the
  // details float over the flow; on the phone layout they open inline.
  const canHover = (e: PointerEvent) =>
    e.pointerType === "mouse" && window.matchMedia("(min-width: 768px)").matches;


  return (
    <Section id="about-workflow" label={t.label} title={t.title} intro={t.intro}>
      <div ref={blockRef} className="rounded-[10px] border border-line">
        {/* The premise wraps the flow as its header band, not as a step. */}
        <div
          ref={premiseRef}
          className="grid gap-5 border-b border-line p-6 md:grid-cols-12 md:gap-6 md:p-8"
        >
          <div className="md:col-span-4">
            <h3 className="text-[22px] tracking-[-0.015em]">{premise.title}</h3>
            <p className="mt-2 text-[15px] leading-relaxed text-muted">{premise.body}</p>
          </div>
          <ul className="grid gap-3 sm:grid-cols-2 md:col-span-8">
            {premise.items.map((item) => (
              <li
                key={item.body}
                className="flex flex-col gap-2 rounded-[10px] bg-surface p-4"
              >
                <code className="self-start rounded-md border border-line bg-bg px-2 py-0.5 font-mono text-[12px] text-accent">
                  {item.code}
                </code>
                <span className="text-[14px] leading-snug">{item.body}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="p-6 md:p-8">
          <p className="mb-8 font-mono text-[11px] text-muted">{t.hint}</p>

          <div className="relative">
            <svg
              ref={svgRef}
              aria-hidden
              className="pointer-events-none absolute inset-0 overflow-visible"
              width={geo?.width ?? 0}
              height={geo?.height ?? 0}
            >
              {geo?.edges.map((edge, i) => (
                <g key={`edge-${i}`}>
                  <path
                    data-edge
                    d={edge.d}
                    pathLength={1}
                    fill="none"
                    stroke="var(--muted)"
                    strokeWidth={1.25}
                    strokeDasharray={1}
                  />
                  <path
                    data-edge-arrow
                    d="M0 0L-7 -4L-7 4Z"
                    fill="var(--muted)"
                    transform={`translate(${edge.arrow.x} ${edge.arrow.y}) rotate(${edge.arrow.angle})`}
                  />
                </g>
              ))}
              {geo?.loops.map((loop, i) => (
                <g key={`loop-${i}`}>
                  <path
                    data-loop
                    d={loop.d}
                    pathLength={1}
                    fill="none"
                    stroke="var(--accent)"
                    strokeWidth={1.25}
                    strokeDasharray={1}
                  />
                  <path
                    data-loop-after
                    d="M0 0L-7 -4L-7 4Z"
                    fill="var(--accent)"
                    transform={`translate(${loop.arrow.x} ${loop.arrow.y}) rotate(${loop.arrow.angle})`}
                  />
                  <text
                    data-loop-after
                    x={loop.label.x}
                    y={loop.label.y}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    transform={loop.label.rotate ? `rotate(${loop.label.rotate} ${loop.label.x} ${loop.label.y})` : undefined}
                    className="font-mono text-[11px]"
                    fill="var(--accent)"
                    style={{ stroke: "var(--bg)", strokeWidth: 5, paintOrder: "stroke" }}
                  >
                    {t.loop}
                  </text>
                </g>
              ))}
            </svg>

            <ol
              ref={flowRef}
              className="relative grid items-start gap-8 pl-9 md:grid-cols-4 md:gap-x-10 md:gap-y-16 md:pb-16 md:pl-0"
            >
              {steps.map((step, i) => {
                const row = Math.floor(i / ROW);
                const pos = i % ROW;
                const col = row % 2 === 0 ? pos + 1 : ROW - pos;
                const isOpen = open === step.id;
                const panelId = `workflow-${step.id}-panel`;
                const isSetup = step.kind === "setup";
                return (
                  <li
                    key={step.id}
                    ref={(el) => {
                      cellRefs.current[i] = el;
                    }}
                    className="relative md:[grid-column:var(--col)] md:[grid-row:var(--row)]"
                    style={{ "--col": col, "--row": row + 1 } as CSSProperties}
                    onPointerEnter={(e) => canHover(e) && setHovered(step.id)}
                    onPointerLeave={(e) => canHover(e) && setHovered(null)}
                  >
                    <button
                      ref={(el) => {
                        headRefs.current[i] = el;
                      }}
                      type="button"
                      aria-expanded={isOpen}
                      aria-controls={panelId}
                      onClick={() => {
                        setHovered(null);
                        setPinned(pinned === step.id ? null : step.id);
                      }}
                      className={`group relative z-10 flex w-full items-start justify-between gap-4 rounded-[10px] p-5 text-left transition-colors motion-reduce:transition-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
                        isSetup
                          ? "border border-dashed border-muted bg-bg"
                          : "bg-surface"
                      } ${isOpen ? "ring-1 ring-accent" : ""}`}
                    >
                      <span>
                        <span className="flex items-center gap-2 font-mono text-[11px] text-muted">
                          {String(i).padStart(2, "0")}
                          {isSetup && (
                            <span className="rounded-full border border-line px-2 py-px text-accent">
                              {t.once}
                            </span>
                          )}
                        </span>
                        <span className="mt-2 block text-[19px] leading-tight tracking-[-0.015em] md:text-[20px]">
                          {step.title}
                        </span>
                      </span>
                      <Plus
                        aria-hidden
                        className={`mt-0.5 size-4 shrink-0 text-muted transition-transform duration-300 motion-reduce:transition-none ${
                          isOpen ? "rotate-45 text-accent" : ""
                        }`}
                      />
                    </button>

                    <div
                      id={panelId}
                      role="region"
                      aria-label={step.title}
                      hidden={!isOpen}
                      className={`mt-3 rounded-[10px] border border-line bg-bg p-5 md:absolute md:top-full md:z-20 md:mt-2 md:w-[min(22rem,calc(100vw-4rem))] md:shadow-[0_12px_32px_-12px_rgb(0_0_0/0.25)] ${
                        col >= 3 ? "md:right-0" : "md:left-0"
                      }`}
                    >
                      <p className="text-[15px] leading-relaxed">{step.summary}</p>
                      <ul className="mt-4 space-y-3">
                        {step.items.map((item) => (
                          <li key={item.code} className="text-[14px] leading-snug text-muted">
                            {item.label && (
                              <span className="font-medium text-ink">{item.label} · </span>
                            )}
                            {item.body}
                            <code className="mt-1.5 block w-fit max-w-full rounded-md border border-line bg-surface px-2 py-0.5 font-mono text-[12px] break-words text-accent">
                              {item.code}
                            </code>
                          </li>
                        ))}
                      </ul>
                      <a
                        href={step.source.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-4 inline-flex items-center gap-1 font-mono text-[11px] text-muted hover:text-accent"
                      >
                        {t.source} · {step.source.title}
                        <ArrowUpRight aria-hidden className="size-3" />
                      </a>
                    </div>
                  </li>
                );
              })}
            </ol>
          </div>
        </div>

        <div className="border-t border-line px-6 py-5 md:px-8">
          <p className="font-mono text-[11px] text-muted">{t.sourcesLabel}</p>
          <ul className="mt-2 flex flex-wrap gap-x-6 gap-y-1">
            {sources.map((s) => (
              <li key={s.url}>
                <a
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[14px] text-accent hover:underline"
                >
                  {s.title}
                  <ArrowUpRight aria-hidden className="size-3.5" />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Section>
  );
}
