import { GridLines } from "@/components/canvas/GridLines";
import { SectionLabel } from "@/components/canvas/SectionLabel";
import { SplitReveal } from "@/components/motion/SplitReveal";

// The opening block of every inner page: the grid, a "/ Label", a very large
// title and a line of intro.
export function PageIntro({
  label,
  title,
  intro,
}: {
  label: string;
  title: string;
  intro?: string;
}) {
  return (
    <section className="relative overflow-hidden pt-(--header-h)">
      <GridLines />
      <div className="relative mx-auto max-w-[1440px] px-4 pt-20 pb-16 md:px-8 md:pt-32 md:pb-24">
        <SectionLabel>{label}</SectionLabel>
        <h1 className="mt-6 text-[clamp(56px,11vw,168px)] leading-[0.9] tracking-[-0.05em]">
          <SplitReveal text={title} />
        </h1>
        {intro && (
          <p className="mt-8 max-w-xl text-[19px] leading-relaxed text-muted">
            {intro}
          </p>
        )}
      </div>
    </section>
  );
}
