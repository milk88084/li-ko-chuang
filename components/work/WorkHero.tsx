"use client";

import content from "@/data/content.json";
import type { Locale } from "@/lib/locale";
import { GridLines } from "@/components/canvas/GridLines";
import { SectionLabel } from "@/components/canvas/SectionLabel";
import { SplitReveal } from "@/components/motion/SplitReveal";
import { SkillPlayground, useReducedMotion } from "./SkillPlayground";

// /work's opening screen, exactly one viewport tall: the page title and intro
// across the top, and the skill-tag physics toy filling the rest — the tools
// behind the work below, falling into place as the page opens.

export function WorkHero({ locale }: { locale: Locale }) {
  const t = content[locale].work;
  const reduceMotion = useReducedMotion();

  return (
    <section className="relative flex h-svh min-h-[640px] flex-col pt-(--header-h)">
      <GridLines />

      <div className="relative mx-auto flex min-h-0 w-full max-w-[1440px] flex-1 flex-col px-4 pt-8 pb-8 md:px-8 md:pt-12 md:pb-10">
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between md:gap-12">
          <div>
            <SectionLabel>{t.label}</SectionLabel>
            <h1
              className={`mt-4 leading-[0.9] ${
                locale === "zh"
                  ? "text-[clamp(52px,min(9vw,13svh),140px)]"
                  : "text-[clamp(56px,min(11vw,16svh),168px)] tracking-[-0.05em]"
              }`}
            >
              <SplitReveal text={t.title} />
            </h1>
          </div>
          <div className="max-w-md md:pb-3">
            <p className="text-[17px] leading-relaxed text-muted md:text-[19px]">
              {t.intro}
            </p>
            {!reduceMotion && (
              <p className="mt-3 font-mono text-[11px] tracking-[0.04em] text-muted uppercase">
                {t.toolbox.hint}
              </p>
            )}
          </div>
        </div>

        {/* pt/pb leave room for the frame's name above and size tag below. */}
        <div className="mt-6 min-h-0 flex-1 pt-7 pb-8 md:mt-8">
          <SkillPlayground
            locale={locale}
            frameLabel={t.toolbox.frameLabel}
            className="h-full"
          />
        </div>
      </div>
    </section>
  );
}
