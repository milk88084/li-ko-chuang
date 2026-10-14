import content from "@/data/content.json";
import type { Locale } from "@/lib/locale";
import { GridLines } from "@/components/canvas/GridLines";
import { FigmaFrame } from "@/components/canvas/FigmaFrame";
import { CursorTag } from "@/components/canvas/CursorTag";
import { SplitReveal, splitCount } from "@/components/motion/SplitReveal";
import { PortraitFrame } from "./PortraitFrame";

// The opening screen: a two-line headline (sans, then the accent line in
// serif) set over a column grid, with the portrait held in a selection frame
// as if it were being laid out in a design tool.

export function HomeHero({ locale }: { locale: Locale }) {
  const t = content[locale].home.hero;

  return (
    <section className="relative flex min-h-svh flex-col overflow-hidden pt-(--header-h)">
      <GridLines />

      <div className="relative mx-auto grid w-full max-w-[1440px] flex-1 grid-cols-4 gap-x-4 px-4 pt-16 pb-10 md:grid-cols-12 md:gap-x-6 md:px-8 md:pt-24">
        <div className="relative col-span-4 flex items-center justify-center pb-12 md:order-2 md:col-span-4 md:col-start-9 md:items-start md:pb-0">
          <FigmaFrame
            label={t.frameLabel}
            className="aspect-[4/5] w-[min(72vw,320px)] md:w-full md:max-w-[340px]"
          >
            <PortraitFrame alt={t.imageAlt} />
          </FigmaFrame>
          <CursorTag
            name="Max"
            className="absolute right-[8%] bottom-6 md:-right-4 md:bottom-[-4.5rem]"
          />
        </div>

        <div className="col-span-4 flex flex-col justify-end md:order-1 md:col-span-8 md:row-span-2">
          <h1
            className={
              locale === "zh"
                ? "text-[clamp(40px,6.6vw,100px)] leading-[1.12] tracking-[-0.02em]"
                : "text-[clamp(44px,9.2vw,132px)] leading-[0.95] tracking-[-0.045em]"
            }
          >
            <SplitReveal text={t.line1} className="block" />
            <SplitReveal
              text={t.line2}
              className="block font-serif text-accent italic"
              startIndex={splitCount(t.line1)}
              delay={120}
            />
          </h1>
        </div>

        <p className="col-span-4 mt-10 max-w-md text-[17px] leading-relaxed text-muted md:order-3 md:col-span-4 md:col-start-9 md:mt-16 md:self-end">
          {t.intro}
        </p>
      </div>
    </section>
  );
}
