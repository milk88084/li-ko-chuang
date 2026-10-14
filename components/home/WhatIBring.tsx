"use client";

import { useRef, type CSSProperties, type ReactNode } from "react";
import content from "@/data/content.json";
import type { Locale } from "@/lib/locale";
import { useInView } from "@/hooks/useInView";
import { Section } from "@/components/layout/Section";

// Three columns — engineering, marketing, events — each opened by a small line
// drawing that traces itself in when the row scrolls into view. Every stroke
// carries pathLength="1" so the .draw-path dash trick works on any shape.

type Key = "engineering" | "marketing" | "events";

const Stroke = ({ i, children }: { i: number; children: ReactNode }) => (
  <g style={{ "--i": i } as CSSProperties}>{children}</g>
);

const P = (props: React.SVGProps<SVGPathElement>) => (
  <path pathLength={1} className="draw-path" {...props} />
);

const ILLUSTRATIONS: Record<Key, ReactNode> = {
  // A browser window with a phone in front of it; </> on the screen.
  engineering: (
    <>
      <Stroke i={0}>
        <P d="M20 24 H170 V112 H20 Z" />
        <P d="M20 40 H170" />
      </Stroke>
      <Stroke i={1}>
        <P d="M62 66 L50 76 L62 86" />
        <P d="M88 66 L100 76 L88 86" />
        <P d="M80 62 L70 90" />
      </Stroke>
      <Stroke i={2}>
        <P d="M134 58 H178 Q184 58 184 64 V126 Q184 132 178 132 H134 Q128 132 128 126 V64 Q128 58 134 58 Z" />
        <P d="M150 66 H162" />
      </Stroke>
    </>
  ),
  // A rising line over a baseline, ending in a target ring.
  marketing: (
    <>
      <Stroke i={0}>
        <P d="M20 124 H184" />
        <P d="M20 124 V20" />
      </Stroke>
      <Stroke i={1}>
        <P d="M28 108 L66 92 L94 100 L130 62 L160 48" />
      </Stroke>
      <Stroke i={2}>
        <P d="M160 48 m-12 0 a12 12 0 1 0 24 0 a12 12 0 1 0 -24 0" />
        <P d="M160 48 m-4 0 a4 4 0 1 0 8 0 a4 4 0 1 0 -8 0" />
      </Stroke>
    </>
  ),
  // A stage edge, an audience in rows, and a spotlight cone.
  events: (
    <>
      <Stroke i={0}>
        <P d="M30 60 H174" />
        <P d="M102 16 L74 60 M102 16 L130 60" />
      </Stroke>
      <Stroke i={1}>
        <P d="M44 88 m-7 0 a7 7 0 1 0 14 0 a7 7 0 1 0 -14 0" />
        <P d="M80 88 m-7 0 a7 7 0 1 0 14 0 a7 7 0 1 0 -14 0" />
        <P d="M116 88 m-7 0 a7 7 0 1 0 14 0 a7 7 0 1 0 -14 0" />
        <P d="M152 88 m-7 0 a7 7 0 1 0 14 0 a7 7 0 1 0 -14 0" />
      </Stroke>
      <Stroke i={2}>
        <P d="M62 118 m-7 0 a7 7 0 1 0 14 0 a7 7 0 1 0 -14 0" />
        <P d="M98 118 m-7 0 a7 7 0 1 0 14 0 a7 7 0 1 0 -14 0" />
        <P d="M134 118 m-7 0 a7 7 0 1 0 14 0 a7 7 0 1 0 -14 0" />
      </Stroke>
    </>
  ),
};

export function WhatIBring({ locale }: { locale: Locale }) {
  const t = content[locale].home.bring;
  const rowRef = useRef<HTMLDivElement>(null);
  const inView = useInView(rowRef);

  return (
    <Section label={t.label} title={t.title}>
      <div
        ref={rowRef}
        className={`grid gap-6 md:grid-cols-3 ${inView ? "is-visible" : ""}`}
      >
        {t.items.map((item, index) => (
          <article
            key={item.key}
            className="flex flex-col rounded-[10px] bg-surface p-6 md:p-8"
          >
            <svg
              viewBox="0 0 204 144"
              aria-hidden
              className="mb-10 h-auto w-full max-w-[240px] text-accent"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.5}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {ILLUSTRATIONS[item.key as Key]}
            </svg>
            <p className="font-mono text-[11px] text-muted">
              {String(index + 1).padStart(2, "0")}
            </p>
            <h3 className="mt-2 text-[28px] tracking-[-0.02em]">{item.title}</h3>
            <p className="mt-3 text-[15px] leading-relaxed text-muted">
              {item.body}
            </p>
          </article>
        ))}
      </div>
    </Section>
  );
}
