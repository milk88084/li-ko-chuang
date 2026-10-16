import content from "@/data/content.json";
import type { Locale } from "@/lib/locale";
import { PageShell } from "@/components/layout/PageShell";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { Section } from "@/components/layout/Section";
import { ScrollPortraitHero } from "@/components/ScrollPortraitHero";
import { FigureFrame, type FigureName } from "@/components/canvas/FigureFrame";

// The person: the scroll-driven portrait turn, then the story, the full work
// history (engineering and marketing in one timeline), what Max is focused on
// now, and the two toolkits.

export function AboutPage({ locale }: { locale: Locale }) {
  const t = content[locale].about;

  return (
    <PageShell footer={<SiteFooter locale={locale} />}>
      <ScrollPortraitHero />

      {/* Heading and quote share the left column, so the story starts level
          with the heading instead of below an empty band. */}
      <Section id="about-story" label={t.story.label}>
        <div className="-mt-7 grid gap-10 md:-mt-11 md:grid-cols-12 md:gap-6">
          <div className="reveal md:col-span-5">
            <h2 className="text-[clamp(34px,4.4vw,64px)] leading-[1.08] tracking-[-0.04em] text-balance">
              {t.story.title}
            </h2>
            <blockquote className="mt-10 font-serif text-[clamp(26px,2.8vw,40px)] leading-[1.15] text-accent italic md:mt-14">
              “{t.story.quote}”
            </blockquote>
          </div>
          <div className="reveal space-y-6 text-[17px] leading-relaxed text-muted md:col-span-6 md:col-start-7 md:pt-3">
            {t.story.body.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </div>
      </Section>

      <Section label={t.experience.label} title={t.experience.title}>
        <ol className="border-t border-line">
          {t.experience.items.map((item) => (
            <li
              key={`${item.period}-${item.company}`}
              className="reveal grid gap-3 border-b border-line py-8 md:grid-cols-12 md:gap-6"
            >
              <p className="font-mono text-[12px] text-muted md:col-span-3">
                {item.period}
              </p>
              <div className="md:col-span-4">
                <h3 className="text-[22px] tracking-[-0.015em]">{item.role}</h3>
                <p className="mt-1 text-[15px] text-accent">{item.company}</p>
              </div>
              <p className="text-[15px] leading-relaxed text-muted md:col-span-5">
                {item.description}
              </p>
            </li>
          ))}
        </ol>
      </Section>

      <Section label={t.now.label} title={t.now.title} intro={t.now.subtitle}>
        <ul className="reveal-stagger grid gap-6 md:grid-cols-2">
          {t.now.items.map((item, i) => (
            <li
              key={item.title}
              className="grid overflow-hidden rounded-[10px] bg-surface sm:grid-cols-[minmax(0,5fr)_minmax(0,6fr)]"
            >
              <FigureFrame
                name={item.figure as FigureName}
                className="aspect-[4/3] border-b border-line sm:aspect-auto sm:min-h-56 sm:border-r sm:border-b-0"
              />
              <div className="flex flex-col justify-center p-6 md:p-7">
                <span className="font-mono text-[11px] text-accent">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-3 text-[22px] tracking-[-0.015em]">
                  {item.title}
                </h3>
                <p className="mt-3 text-[15px] leading-relaxed text-muted">
                  {item.description}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </Section>

      <Section label={t.skills.label} title={t.skills.title}>
        <div className="grid gap-12 md:grid-cols-2 md:gap-6">
          {[
            { heading: t.skills.engineering, items: t.skills.engineeringItems },
            { heading: t.skills.marketing, items: t.skills.marketingItems },
          ].map((group) => (
            <div key={group.heading} className="reveal">
              <h3 className="border-b border-line pb-4 text-[22px] tracking-[-0.015em]">
                {group.heading}
              </h3>
              <ul className="mt-6 flex flex-wrap gap-2">
                {group.items.map((item) => (
                  <li
                    key={item}
                    className="rounded-full border border-line px-4 py-2 text-[14px]"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Section>
    </PageShell>
  );
}
