"use client";

import { useRef } from "react";
import content from "@/data/content.json";
import type { Locale } from "@/lib/locale";
import { useInView } from "@/hooks/useInView";
import { Section } from "@/components/layout/Section";
import { BringIllustration } from "./bring-illustrations";

// The strengths section: one wide card for the headline claim — an engineer
// who works through AI — then three cards for what that covers: frontend and
// apps, translating needs, and AI automation. Illustrations assemble themselves once the block
// scrolls into view.

type CardKey = "build" | "translate" | "automate";

export function WhatIBring({ locale }: { locale: Locale }) {
  const t = content[locale].home.bring;
  const blockRef = useRef<HTMLDivElement>(null);
  const inView = useInView(blockRef);

  return (
    <Section label={t.label} title={t.title}>
      <div
        ref={blockRef}
        className={`grid gap-6 md:grid-cols-3 ${inView ? "is-visible" : ""}`}
      >
        <article className="grid items-center gap-8 rounded-[10px] bg-surface p-6 md:col-span-3 md:grid-cols-2 md:gap-12 md:p-12">
          <div>
            <p className="font-mono text-[11px] text-muted">01</p>
            <h3 className="mt-2 text-[clamp(30px,3.6vw,48px)] leading-[1.05] tracking-[-0.03em]">
              {t.featured.title}
            </h3>
            <p className="mt-5 max-w-xl text-[17px] leading-relaxed text-muted">
              {t.featured.body}
            </p>
            <ul className="mt-8 flex flex-wrap gap-2">
              {t.featured.tags.map((tag) => (
                <li
                  key={tag}
                  className="rounded-full border border-line px-3.5 py-1.5 text-[13px]"
                >
                  {tag}
                </li>
              ))}
            </ul>
          </div>
          <BringIllustration
            kind="hybrid"
            className="order-first mx-auto w-full max-w-[460px] text-ink md:order-none"
          />
        </article>

        {t.items.map((item, index) => (
          <article
            key={item.key}
            className="flex flex-col rounded-[10px] bg-surface p-6 md:p-8"
          >
            <BringIllustration
              kind={item.key as CardKey}
              className="mx-auto mb-8 h-auto w-full max-w-[240px] text-ink"
            />
            <p className="font-mono text-[11px] text-muted">
              {String(index + 2).padStart(2, "0")}
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
