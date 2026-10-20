import type { Flow, FlowNode } from "@/lib/flows";
import { FLOW_ICONS } from "./flow-icons";

// A project's flow as a journey diagram, after the user-journey maps service
// designers draw: labelled lanes, unlabelled shared rows with a dashed axis
// through them, round icon stations, and arrows that turn at right angles in
// the gap before the station they reach. It is plain SVG in the site's own
// colour tokens, so it follows the theme and needs no script. Narrow screens
// scroll it sideways rather than shrink the text past reading.

const COL_W = 188;
const LANE_H = 176;
const PAD_X = 24;
const R = 28; // station radius
const CY = 72; // station centre, from the top of its lane
const BEND = 10; // corner radius where an arrow turns

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

export function ProjectFlow({
  flow,
  id,
  title,
  labels,
}: {
  flow: Flow;
  /** Unique per page; namespaces the arrowhead markers. */
  id: string;
  title: string;
  labels: { dashed: string; scroll: string };
}) {
  const width = PAD_X * 2 + flow.cols * COL_W;
  const height = flow.lanes.length * LANE_H;
  const byId = new Map(flow.nodes.map((n) => [n.id, n]));
  const steps = [...flow.nodes].sort((a, b) => a.col - b.col || a.lane - b.lane);
  const halo = { stroke: "var(--bg)", strokeWidth: 5, paintOrder: "stroke" as const };

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
        <span className="md:hidden">{labels.scroll} →</span>
      </div>

      <div className="mt-6 -mx-4 overflow-x-auto px-4 md:mx-0 md:px-0">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          role="img"
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
            return (
              <g key={`${edge.from}-${edge.to}`}>
                <path
                  d={d}
                  fill="none"
                  stroke="var(--muted)"
                  strokeWidth={1.25}
                  strokeDasharray={edge.dashed ? "4 4" : undefined}
                  markerEnd={`url(#${id}-arrow)`}
                />
                {edge.label && (
                  <text
                    x={lx}
                    y={ly}
                    textAnchor="middle"
                    className="font-mono text-[10.5px]"
                    fill="var(--muted)"
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
              <g key={node.id}>
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
            {node.label.replace(/\n/g, " ")}
            {node.note && ` — ${node.note.replace(/\n/g, " ")}`}
          </li>
        ))}
      </ol>
    </div>
  );
}
