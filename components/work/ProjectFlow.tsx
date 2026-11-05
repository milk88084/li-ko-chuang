"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { KeyboardEvent, PointerEvent as ReactPointerEvent } from "react";
import { X } from "lucide-react";
import type { Flow, FlowNode } from "@/lib/flows";
import type { Locale } from "@/lib/locale";
import { FLOW_ICONS } from "./flow-icons";

// A project's flow as a journey diagram, after the user-journey maps service
// designers draw: labelled lanes, unlabelled shared rows with a dashed axis
// through them, round icon stations, and arrows that turn at right angles in
// the gap before the station they reach. It is SVG in the site's own colour
// tokens, so it follows the theme. Dashed arrows march and solid ones carry a
// travelling pulse (CSS, off under reduced motion). Hovering a station with a
// mouse, or tapping / pressing Enter on it, opens a small card with what the
// step does and what it connects to. Narrow screens scroll the diagram
// sideways rather than shrink the text past reading.

const COL_W = 188;
const LANE_H = 176;
const PAD_X = 24;
const R = 28; // station radius
const CY = 72; // station centre, from the top of its lane
const BEND = 10; // corner radius where an arrow turns
const CLOSE_DELAY = 140; // ms, time to move the mouse from station to card
const CARD_GAP = 10;
const VIEW_PAD = 12;

const cx = (col: number) => PAD_X + col * COL_W + COL_W / 2;
const cy = (lane: number) => lane * LANE_H + CY;

function edgePath(from: FlowNode, to: FlowNode) {
  const sx = cx(from.col) + R + 4;
  const sy = cy(from.lane);
  const tx = cx(to.col) - R - 8;
  const ty = cy(to.lane);
  if (sy === ty) return { d: `M${sx} ${sy}H${tx}`, lx: (sx + tx) / 2, ly: sy - 8 };

  // Run along the source's row, turn in the gap before the target's column.
  const ex = cx(to.col) - COL_W / 2;
  const dir = ty > sy ? 1 : -1;
  const d = [
    `M${sx} ${sy}`,
    `H${ex - BEND}`,
    `Q${ex} ${sy} ${ex} ${sy + BEND * dir}`,
    `V${ty - BEND * dir}`,
    `Q${ex} ${ty} ${ex + BEND} ${ty}`,
    `H${tx}`,
  ].join("");
  return { d, lx: ex, ly: (sy + ty) / 2 + 4 };
}

function Lines({
  text,
  x,
  y,
  lineHeight,
  className,
  fill,
}: {
  text: string;
  x: number;
  y: number;
  lineHeight: number;
  className: string;
  fill: string;
}) {
  return (
    <text x={x} y={y} textAnchor="middle" className={className} fill={fill}>
      {text.split("\n").map((line, i) => (
        <tspan key={i} x={x} dy={i === 0 ? 0 : lineHeight}>
          {line}
        </tspan>
      ))}
    </text>
  );
}

const oneLine = (text: string) => text.replace(/\n/g, " ");

export function ProjectFlow({
  flow,
  id,
  title,
  labels,
  locale,
}: {
  flow: Flow;
  /** Unique per page; namespaces the arrowhead markers and the card. */
  id: string;
  title: string;
  labels: { dashed: string; scroll: string; hint: string; from: string; to: string; close: string };
  locale: Locale;
}) {
  const list = (ids: string[]) =>
    ids.map((nid) => oneLine(byId.get(nid)?.label ?? nid)).join(locale === "zh" ? "、" : ", ");
  const width = PAD_X * 2 + flow.cols * COL_W;
  const height = flow.lanes.length * LANE_H;
  const byId = new Map(flow.nodes.map((n) => [n.id, n]));
  const steps = [...flow.nodes].sort((a, b) => a.col - b.col || a.lane - b.lane);
  const halo = { stroke: "var(--bg)", strokeWidth: 5, paintOrder: "stroke" as const };

  // The open station, and whether it was opened on purpose (click, tap, key)
  // rather than by a passing mouse — a pinned card stays until dismissed.
  const [active, setActive] = useState<string | null>(null);
  const [pinned, setPinned] = useState(false);
  const stations = useRef(new Map<string, SVGGElement>());
  const cardRef = useRef<HTMLDivElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  const cancelClose = () => clearTimeout(closeTimer.current);
  const close = () => {
    clearTimeout(closeTimer.current);
    setActive(null);
    setPinned(false);
  };
  const closeSoon = () => {
    cancelClose();
    closeTimer.current = setTimeout(close, CLOSE_DELAY);
  };
  const toggle = (nodeId: string) => {
    cancelClose();
    if (active === nodeId && pinned) return close();
    setActive(nodeId);
    setPinned(true);
  };

  // The card lives in a portal (the page's scroll-reveal transforms would
  // otherwise carry a fixed box along), so place it against the station's
  // on-screen box: below it, or above when there is no room, kept on screen.
  useLayoutEffect(() => {
    if (!active) return;
    const place = () => {
      // Below the station's label and note, so the card never hides its own name.
      const station = stations.current.get(active);
      const card = cardRef.current;
      if (!station || !card) return;
      const box = station.getBoundingClientRect();
      const vw = document.documentElement.clientWidth;
      const { offsetWidth: w, offsetHeight: h } = card;
      const left = Math.max(VIEW_PAD, Math.min(box.left + box.width / 2 - w / 2, vw - w - VIEW_PAD));
      const fitsBelow = box.bottom + CARD_GAP + h <= window.innerHeight - VIEW_PAD;
      const fitsAbove = box.top - CARD_GAP - h >= VIEW_PAD;
      const top = fitsBelow || !fitsAbove ? box.bottom + CARD_GAP : box.top - CARD_GAP - h;
      card.style.transform = `translate(${Math.round(left)}px, ${Math.round(top)}px)`;
      card.style.visibility = "visible";
    };
    place();
    window.addEventListener("scroll", place, true);
    window.addEventListener("resize", place);
    return () => {
      window.removeEventListener("scroll", place, true);
      window.removeEventListener("resize", place);
    };
  }, [active]);

  // Dismiss with Escape (focus back on the station) or a press elsewhere.
  useEffect(() => {
    if (!active) return;
    const dismiss = () => {
      clearTimeout(closeTimer.current);
      setActive(null);
      setPinned(false);
    };
    const onKey = (e: globalThis.KeyboardEvent) => {
      if (e.key !== "Escape") return;
      const station = stations.current.get(active);
      dismiss();
      station?.focus();
    };
    const onDown = (e: PointerEvent) => {
      const target = e.target as Node;
      if (cardRef.current?.contains(target)) return;
      for (const station of stations.current.values()) if (station.contains(target)) return;
      dismiss();
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onDown);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onDown);
    };
  }, [active]);

  useEffect(() => () => clearTimeout(closeTimer.current), []);

  const activeNode = active ? byId.get(active) : undefined;
  const incoming = active ? flow.edges.filter((e) => e.to === active) : [];
  const outgoing = active ? flow.edges.filter((e) => e.from === active) : [];
  const related = new Set([active, ...incoming.map((e) => e.from), ...outgoing.map((e) => e.to)]);
  const dim = (on: boolean) => ({
    opacity: active && !on ? 0.25 : 1,
    transition: "opacity 0.2s",
  });

  const onEnter = (nodeId: string) => (e: ReactPointerEvent) => {
    if (e.pointerType !== "mouse" || pinned) return;
    cancelClose();
    setActive(nodeId);
  };
  const onLeave = (e: ReactPointerEvent) => {
    if (e.pointerType === "mouse" && !pinned) closeSoon();
  };
  const onKeyDown = (nodeId: string) => (e: KeyboardEvent) => {
    if (e.key !== "Enter" && e.key !== " ") return;
    e.preventDefault();
    toggle(nodeId);
  };

  return (
    <div>
      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 font-mono text-[11px] text-muted">
        <span className="inline-flex items-center gap-2">
          <span className="size-2.5 rounded-full bg-accent" />
          {flow.legend}
        </span>
        {flow.edges.some((e) => e.dashed) && (
          <span className="inline-flex items-center gap-2">
            <span className="w-6 border-t border-dashed border-muted" />
            {labels.dashed}
          </span>
        )}
        <span>{labels.hint}</span>
        <span className="md:hidden">{labels.scroll} →</span>
      </div>

      <div className="mt-6 -mx-4 overflow-x-auto px-4 md:mx-0 md:px-0">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          role="group"
          aria-labelledby={`${id}-title`}
          className="block h-auto"
          style={{ width: "100%", minWidth: width * 0.8, maxWidth: width }}
        >
          <title id={`${id}-title`}>{title}</title>
          <defs>
            <marker
              id={`${id}-arrow`}
              viewBox="0 0 10 10"
              refX="2"
              refY="5"
              markerWidth="7"
              markerHeight="7"
              orient="auto"
            >
              <path d="M0 0L10 5L0 10z" fill="var(--muted)" />
            </marker>
            <marker
              id={`${id}-arrow-on`}
              viewBox="0 0 10 10"
              refX="2"
              refY="5"
              markerWidth="7"
              markerHeight="7"
              orient="auto"
            >
              <path d="M0 0L10 5L0 10z" fill="var(--accent)" />
            </marker>
          </defs>

          {/* Lanes: a heading for named ones, a dashed axis through shared ones. */}
          {flow.lanes.map((lane, i) =>
            lane ? (
              <text
                key={i}
                x={PAD_X}
                y={i * LANE_H + 20}
                className="font-mono text-[12px] tracking-[0.04em]"
                fill="var(--accent)"
              >
                {lane}
              </text>
            ) : (
              <line
                key={i}
                x1={0}
                x2={width}
                y1={cy(i)}
                y2={cy(i)}
                stroke="var(--line)"
                strokeDasharray="6 6"
              />
            ),
          )}

          {flow.edges.map((edge) => {
            const from = byId.get(edge.from);
            const to = byId.get(edge.to);
            if (!from || !to) return null;
            const { d, lx, ly } = edgePath(from, to);
            const on = active === edge.from || active === edge.to;
            return (
              <g key={`${edge.from}-${edge.to}`} style={dim(on)} aria-hidden>
                <path
                  d={d}
                  fill="none"
                  stroke={on ? "var(--accent)" : "var(--muted)"}
                  strokeWidth={on ? 1.75 : 1.25}
                  strokeDasharray={edge.dashed ? "4 4" : undefined}
                  className={edge.dashed ? "flow-dash" : undefined}
                  markerEnd={`url(#${id}-arrow${on ? "-on" : ""})`}
                />
                {!edge.dashed && (
                  <path
                    d={d}
                    pathLength={100}
                    fill="none"
                    stroke="var(--accent)"
                    strokeWidth={2.5}
                    strokeLinecap="round"
                    className="flow-pulse"
                    // Pulses set off column by column, so they read as a flow.
                    style={{ animationDelay: `${from.col * 0.45}s` }}
                  />
                )}
                {edge.label && (
                  <text
                    x={lx}
                    y={ly}
                    textAnchor="middle"
                    className="font-mono text-[10.5px]"
                    fill={on ? "var(--accent)" : "var(--muted)"}
                    style={halo}
                  >
                    {edge.label}
                  </text>
                )}
              </g>
            );
          })}

          {flow.nodes.map((node) => {
            const Icon = FLOW_ICONS[node.icon];
            const x = cx(node.col);
            const y = cy(node.lane);
            const labelLines = node.label.split("\n").length;
            return (
              <g
                key={node.id}
                ref={(el) => {
                  if (el) stations.current.set(node.id, el);
                  else stations.current.delete(node.id);
                }}
                className="flow-node"
                role="button"
                tabIndex={0}
                aria-label={`${oneLine(node.label)}${node.note ? ` — ${oneLine(node.note)}` : ""}`}
                aria-expanded={active === node.id}
                aria-controls={active === node.id ? `${id}-card` : undefined}
                style={dim(related.has(node.id))}
                onPointerEnter={onEnter(node.id)}
                onPointerLeave={onLeave}
                onClick={() => toggle(node.id)}
                onKeyDown={onKeyDown(node.id)}
              >
                <circle
                  className="flow-ring"
                  cx={x}
                  cy={y}
                  r={R + 6}
                  fill="none"
                  stroke="var(--accent)"
                  strokeWidth={1.25}
                  strokeDasharray="3 3"
                />
                <circle
                  cx={x}
                  cy={y}
                  r={R}
                  fill={node.accent ? "var(--accent)" : "var(--bg)"}
                  stroke={node.accent ? "var(--accent)" : "var(--ink)"}
                  strokeWidth={1.25}
                />
                {Icon && (
                  <Icon
                    x={x - 11}
                    y={y - 11}
                    size={22}
                    strokeWidth={1.5}
                    color={node.accent ? "var(--accent-ink)" : "var(--ink)"}
                    aria-hidden
                  />
                )}
                <Lines
                  text={node.label}
                  x={x}
                  y={y + R + 22}
                  lineHeight={17}
                  className="text-[13.5px] font-medium"
                  fill="var(--ink)"
                />
                {node.note && (
                  <Lines
                    text={node.note}
                    x={x}
                    y={y + R + 22 + labelLines * 17 + 1}
                    lineHeight={15}
                    className="text-[11.5px]"
                    fill="var(--muted)"
                  />
                )}
              </g>
            );
          })}
        </svg>
      </div>

      {/* The same steps as text, for screen readers. */}
      <ol className="sr-only">
        {steps.map((node) => (
          <li key={node.id}>
            {oneLine(node.label)}
            {node.note && ` — ${oneLine(node.note)}`}. {node.detail}
          </li>
        ))}
      </ol>

      {activeNode &&
        createPortal(
          <div
            ref={cardRef}
            id={`${id}-card`}
            role="dialog"
            aria-labelledby={`${id}-card-title`}
            className="fixed left-0 top-0 z-50 w-[min(300px,calc(100vw-24px))] rounded-[10px] border border-line bg-bg p-4 text-left shadow-[0_16px_40px_-16px_rgba(0,0,0,0.35)]"
            style={{ visibility: "hidden" }}
            onPointerEnter={cancelClose}
            onPointerLeave={onLeave}
          >
            <div className="flex items-start gap-3">
              <span
                className={`mt-1 size-2.5 shrink-0 rounded-full ${activeNode.accent ? "bg-accent" : "border border-ink"}`}
              />
              <div className="min-w-0 flex-1">
                <p id={`${id}-card-title`} className="text-[15px] font-medium leading-snug text-ink">
                  {oneLine(activeNode.label)}
                </p>
                {activeNode.note && (
                  <p className="mt-0.5 text-[12px] leading-snug text-muted">{oneLine(activeNode.note)}</p>
                )}
              </div>
              {pinned && (
                <button
                  type="button"
                  aria-label={labels.close}
                  onClick={close}
                  className="-mr-1 -mt-1 rounded p-1 text-muted transition-colors hover:text-ink"
                >
                  <X size={14} aria-hidden />
                </button>
              )}
            </div>

            <p className="mt-3 text-[13px] leading-relaxed text-ink">{activeNode.detail}</p>

            {activeNode.tags.length > 0 && (
              <ul className="mt-3 flex flex-wrap gap-1.5">
                {activeNode.tags.map((tag) => (
                  <li
                    key={tag}
                    className="rounded-full border border-line px-2 py-0.5 font-mono text-[10.5px] text-muted"
                  >
                    {tag}
                  </li>
                ))}
              </ul>
            )}

            {(incoming.length > 0 || outgoing.length > 0) && (
              <dl className="mt-3 grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 border-t border-line pt-3 font-mono text-[11px]">
                {incoming.length > 0 && (
                  <>
                    <dt className="text-muted">← {labels.from}</dt>
                    <dd className="text-ink">
                      {list(incoming.map((e) => e.from))}
                    </dd>
                  </>
                )}
                {outgoing.length > 0 && (
                  <>
                    <dt className="text-muted">{labels.to} →</dt>
                    <dd className="text-ink">
                      {list(outgoing.map((e) => e.to))}
                    </dd>
                  </>
                )}
              </dl>
            )}
          </div>,
          document.body,
        )}
    </div>
  );
}
