import content from "@/data/content.json";
import type { Locale } from "@/lib/locale";
import { GridLines } from "@/components/canvas/GridLines";
import { FigmaFrame } from "@/components/canvas/FigmaFrame";
import { CursorTag } from "@/components/canvas/CursorTag";
import { SplitReveal, splitCount } from "@/components/motion/SplitReveal";
import { ClientMarquee } from "./ClientMarquee";
import { PortraitFrame } from "./PortraitFrame";

// The opening screen: a two-line headline (sans, then the accent line in
// serif) set over a column grid, with the portrait held in a selection frame
// as if it were being laid out in a design tool, and the "worked with" strip
// along the bottom.
//
// Exactly one viewport tall. The frame takes whatever height the grid row has
// left (its width follows from the 4:5 ratio) and the headline is sized from
// the viewport's height as well as its width, so a short laptop screen
// shrinks the composition instead of pushing it below the fold.

export function HomeHero({ locale }: { locale: Locale }) {
  const t = content[locale].home.hero;

  return (
    <section className="relative flex h-svh min-h-[560px] flex-col overflow-hidden pt-(--header-h)">
      <GridLines />

      <div className="relative mx-auto grid min-h-0 w-full max-w-[1440px] flex-1 grid-cols-4 grid-rows-[minmax(0,1fr)_auto_auto] gap-x-4 px-4 pt-4 pb-6 md:grid-cols-12 md:grid-rows-[minmax(0,1fr)_auto] md:gap-x-6 md:px-8 md:pt-6 md:pb-10">
        {/* py leaves room for the frame's name above it and size tag below. */}
        <div className="col-span-4 row-start-1 flex min-h-0 justify-center py-8 md:col-span-4 md:col-start-9 md:justify-start md:pt-10">
          <FigmaFrame
            label={t.frameLabel}
            className="aspect-[4/5] h-full max-h-[440px] max-w-full"
          >
            <PortraitFrame alt={t.imageAlt} />
            <CursorTag
              name="Max"
              className="absolute -right-6 -bottom-14 z-20 md:-right-10"
            />
          </FigmaFrame>
        </div>

        <div className="col-span-4 row-start-2 flex flex-col justify-end md:col-span-8 md:row-span-2 md:row-start-1">
          <h1
            className={
              locale === "zh"
                ? "text-[clamp(34px,min(6.6vw,10svh),100px)] leading-[1.12] tracking-[-0.02em]"
                : "text-[clamp(40px,min(9.2vw,14svh),132px)] leading-[0.95] tracking-[-0.045em]"
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

        <p className="col-span-4 row-start-3 mt-5 max-w-md text-[15px] leading-relaxed text-muted md:col-span-4 md:col-start-9 md:row-start-2 md:mt-6 md:self-end md:text-[17px]">
          {t.intro}
        </p>
      </div>

      <ClientMarquee locale={locale} />
    </section>
  );
}
