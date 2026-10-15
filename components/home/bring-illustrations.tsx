"use client";

import { useId, type CSSProperties, type ReactNode, type SVGProps } from "react";

// Line-and-glass illustrations for the "What I Bring" cards. Each is built
// from the same four layers, back to front:
//
//   1. a soft accent shadow on the ground
//   2. a faint grey "ghost" panel
//   3. dark line art (drawn in with the .draw-path dash trick)
//   4. a translucent accent-gradient panel with small white details
//
// Line art uses currentColor and the panels read --accent, so both themes
// work without a second set of drawings. Layers rise in one after another
// once the card row gains .is-visible (see .bring-layer in globals.css), then
// keep moving: each layer drifts on the same slow cycle by its own distance —
// further for the layers in front — and the ground shadow breathes in step,
// so the stack reads as floating with depth.

type Key = "hybrid" | "engineering" | "marketing" | "pm";

/**
 * One layer of a drawing. The outer group plays the entrance; the inner one
 * the endless drift (`drift` px of travel), or, for the shadow, `breathe`.
 * Two groups because both animations move the same `translate` property.
 */
const Layer = ({
  i,
  drift = 0,
  breathe = false,
  children,
}: {
  i: number;
  drift?: number;
  breathe?: boolean;
  children: ReactNode;
}) => (
  <g className="bring-layer" style={{ "--i": i } as CSSProperties}>
    <g
      className={breathe ? "bring-breathe" : drift ? "bring-drift" : undefined}
      style={{ "--i": i, "--drift": `${drift}px` } as CSSProperties}
    >
      {children}
    </g>
  </g>
);

/** A dark outline stroke that draws itself in. */
const Line = (props: SVGProps<SVGPathElement>) => (
  <path
    pathLength={1}
    className="draw-path"
    fill="none"
    stroke="currentColor"
    strokeOpacity={0.72}
    strokeWidth={3}
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  />
);

/** Shared gradient, blur and the glass panel's white rim. */
function Defs({ id }: { id: string }) {
  return (
    <defs>
      <linearGradient id={`${id}-glass`} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="var(--accent)" stopOpacity={0.92} />
        <stop offset="1" stopColor="var(--accent)" stopOpacity={0.28} />
      </linearGradient>
      <filter id={`${id}-blur`} x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="7" />
      </filter>
    </defs>
  );
}

const glass = (id: string) => ({
  fill: `url(#${id}-glass)`,
  stroke: "white",
  strokeOpacity: 0.45,
  strokeWidth: 1,
});

const ghost = { fill: "currentColor", fillOpacity: 0.07 };

const Shadow = ({ id, cx, cy, rx }: { id: string; cx: number; cy: number; rx: number }) => (
  <ellipse
    cx={cx}
    cy={cy}
    rx={rx}
    ry={rx * 0.14}
    fill="var(--accent)"
    opacity={0.22}
    filter={`url(#${id}-blur)`}
  />
);

const DRAWINGS: Record<Key, (id: string) => ReactNode> = {
  // Everything at once: a browser window with a growth line, a phone, an
  // event card with a tick, and a pencil.
  hybrid: (id) => (
    <>
      <Layer i={0} breathe>
        <Shadow id={id} cx={170} cy={176} rx={120} />
      </Layer>
      <Layer i={1} drift={3}>
        <rect x={52} y={44} width={150} height={100} rx={12} {...ghost} />
      </Layer>
      <Layer i={2} drift={5}>
        <Line d="M84 26 H230 Q242 26 242 38 V124 Q242 136 230 136 H84 Q72 136 72 124 V38 Q72 26 84 26 Z" />
        <Line d="M72 46 H242" />
        <Line d="M100 112 L128 92 L150 100 L182 70 L206 62" />
      </Layer>
      <Layer i={3} drift={8}>
        <rect x={218} y={64} width={66} height={112} rx={14} {...glass(id)} />
        <rect x={240} y={74} width={22} height={4} rx={2} fill="white" opacity={0.85} />
        <circle cx={251} cy={162} r={5} fill="white" opacity={0.85} />
      </Layer>
      <Layer i={4} drift={9}>
        <g transform="rotate(-8 80 132)">
          <rect x={36} y={102} width={88} height={62} rx={10} {...glass(id)} />
          <path
            d="M54 134 l10 10 l20 -22"
            fill="none"
            stroke="white"
            strokeWidth={4}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <rect x={92} y={118} width={20} height={4} rx={2} fill="white" opacity={0.8} />
          <rect x={92} y={130} width={14} height={4} rx={2} fill="white" opacity={0.8} />
        </g>
      </Layer>
      <Layer i={5} drift={6}>
        <Line d="M262 20 L274 8 L300 34 L288 46 Z" />
        <Line d="M288 46 L304 52 L300 34" />
        <Line d="M268 26 L280 14" />
      </Layer>
    </>
  ),

  // A code window with a phone sliding in front of it.
  engineering: (id) => (
    <>
      <Layer i={0} breathe>
        <Shadow id={id} cx={112} cy={136} rx={70} />
      </Layer>
      <Layer i={1} drift={3}>
        <rect x={26} y={40} width={100} height={70} rx={10} {...ghost} />
      </Layer>
      <Layer i={2} drift={5}>
        <Line d="M54 22 H140 Q150 22 150 32 V88 Q150 98 140 98 H54 Q44 98 44 88 V32 Q44 22 54 22 Z" />
        <Line d="M44 38 H150" />
        <Line d="M76 56 L66 64 L76 72" />
        <Line d="M102 56 L112 64 L102 72" />
        <Line d="M94 52 L84 76" />
      </Layer>
      <Layer i={3} drift={8}>
        <g transform="rotate(-6 136 96)">
          <rect x={110} y={50} width={58} height={88} rx={12} {...glass(id)} />
          <circle cx={156} cy={62} r={3.5} fill="white" opacity={0.9} />
          <rect x={122} y={84} width={30} height={4} rx={2} fill="white" opacity={0.75} />
          <rect x={122} y={96} width={20} height={4} rx={2} fill="white" opacity={0.75} />
        </g>
      </Layer>
    </>
  ),

  // A tilted brief with a rising campaign line, and a pencil across it.
  marketing: (id) => (
    <>
      <Layer i={0} breathe>
        <Shadow id={id} cx={108} cy={138} rx={64} />
      </Layer>
      <Layer i={1} drift={3}>
        <rect x={54} y={36} width={74} height={92} rx={8} transform="rotate(-8 91 82)" {...ghost} />
      </Layer>
      <Layer i={2} drift={8}>
        <g transform="rotate(7 112 76)">
          <rect x={76} y={26} width={74} height={96} rx={8} {...glass(id)} />
          <path
            d="M88 102 L104 88 L116 94 L136 70"
            fill="none"
            stroke="white"
            strokeWidth={3.5}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx={136} cy={70} r={4} fill="white" />
          <rect x={88} y={40} width={34} height={4} rx={2} fill="white" opacity={0.8} />
        </g>
      </Layer>
      <Layer i={3} drift={5}>
        <Line d="M34 46 L44 36 L98 90 L88 100 Z" />
        <Line d="M88 100 L104 106 L98 90" />
        <Line d="M40 52 L50 42" />
      </Layer>
    </>
  ),

  // A timeline board (Gantt bars) with a completed-tick badge in front.
  pm: (id) => (
    <>
      <Layer i={0} breathe>
        <Shadow id={id} cx={110} cy={136} rx={70} />
      </Layer>
      <Layer i={1} drift={3}>
        <rect x={30} y={42} width={110} height={78} rx={10} {...ghost} />
      </Layer>
      <Layer i={2} drift={8}>
        <rect x={56} y={24} width={112} height={84} rx={10} {...glass(id)} />
        <rect x={68} y={40} width={44} height={7} rx={3.5} fill="white" opacity={0.9} />
        <rect x={84} y={57} width={56} height={7} rx={3.5} fill="white" opacity={0.75} />
        <rect x={104} y={74} width={50} height={7} rx={3.5} fill="white" opacity={0.6} />
        <rect x={68} y={91} width={30} height={7} rx={3.5} fill="white" opacity={0.45} />
      </Layer>
      <Layer i={3} drift={5}>
        <Line d="M60 104 m-20 0 a20 20 0 1 0 40 0 a20 20 0 1 0 -40 0" />
        <Line d="M50 104 L57 111 L71 96" />
      </Layer>
    </>
  ),
};

const VIEWBOX: Record<Key, string> = {
  hybrid: "0 0 320 196",
  engineering: "0 0 200 150",
  marketing: "0 0 200 150",
  pm: "0 0 200 150",
};

export function BringIllustration({
  kind,
  className = "",
}: {
  kind: Key;
  className?: string;
}) {
  // Gradient and filter ids must be unique per instance on the page.
  const id = useId().replace(/:/g, "");
  return (
    <svg viewBox={VIEWBOX[kind]} aria-hidden className={className} fill="none">
      <Defs id={id} />
      {DRAWINGS[kind](id)}
    </svg>
  );
}
