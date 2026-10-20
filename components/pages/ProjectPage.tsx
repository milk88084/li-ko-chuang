import Link from "next/link";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import content from "@/data/content.json";
import { localePath, type Locale } from "@/lib/locale";
import { getFlow } from "@/lib/flows";
import { getNextProject, type Project } from "@/lib/projects";
import { PageShell } from "@/components/layout/PageShell";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SectionLabel } from "@/components/canvas/SectionLabel";
import { SplitReveal } from "@/components/motion/SplitReveal";
import { ProjectFlow } from "@/components/work/ProjectFlow";
import { ProjectCover } from "@/components/work/ProjectCover";
import { DesignGallery } from "@/components/work/DesignGallery";
import { ProjectGallery } from "@/components/work/ProjectGallery";

// One project: title and summary, a facts row, all of its media as a loose
// collage, then problem → outcome → how it works → highlights → stack, and a large link
// on to the next project so the work reads as a sequence.

export function ProjectPage({
  project,
  locale,
}: {
  project: Project;
  locale: Locale;
}) {
  const t = content[locale].work;
  const d = t.detail;
  const next = getNextProject(project.slug, locale);
  const flow = getFlow(project.slug, locale);
  const Gallery = project.type === "design" ? DesignGallery : ProjectGallery;

  const facts = [
    { label: d.type, value: t.types[project.type] },
    project.category && { label: d.category, value: project.category },
    project.tech.length > 0 && {
      label: d.stack,
      value: project.tech.slice(0, 4).join(" · "),
    },
  ].filter(Boolean) as { label: string; value: string }[];

  return (
    <PageShell footer={<SiteFooter locale={locale} />}>
      <article>
        <header className="mx-auto max-w-[1440px] px-4 pt-[calc(var(--header-h)+48px)] md:px-8 md:pt-[calc(var(--header-h)+80px)]">
          <Link
            href={localePath(locale, "/work")}
            className="group inline-flex items-center gap-2 font-mono text-[12px] text-muted uppercase transition-colors hover:text-accent"
          >
            <ArrowLeft className="size-3.5 transition-transform group-hover:-translate-x-0.5" />
            {d.back}
          </Link>

          <h1
            className={`mt-10 max-w-5xl text-balance ${
              locale === "zh"
                ? "text-[clamp(36px,5.6vw,84px)] leading-[1.15] tracking-[-0.01em]"
                : "text-[clamp(44px,8vw,120px)] leading-[0.95] tracking-[-0.045em]"
            }`}
          >
            <SplitReveal text={project.title} />
          </h1>
          <p className="mt-8 max-w-2xl text-[clamp(19px,1.8vw,24px)] leading-snug text-muted">
            {project.summary}
          </p>

          <dl className="mt-12 grid gap-6 border-t border-line pt-6 sm:grid-cols-2 md:grid-cols-4">
            {facts.map((fact) => (
              <div key={fact.label}>
                <dt className="font-mono text-[11px] text-muted uppercase">
                  {fact.label}
                </dt>
                <dd className="mt-2 text-[15px]">{fact.value}</dd>
              </div>
            ))}
            {project.link && (
              <div>
                <dt className="font-mono text-[11px] text-muted uppercase">
                  {d.link}
                </dt>
                <dd className="mt-2">
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex items-center gap-1 text-[15px] text-accent"
                  >
                    {d.visit}
                    <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </a>
                </dd>
              </div>
            )}
          </dl>
        </header>

        <div className="mx-auto mt-12 max-w-[1440px] px-4 md:mt-20 md:px-8">
          {project.media.length > 0 ? (
            <Gallery
              media={project.media}
              title={project.title}
              locale={locale}
            />
          ) : (
            // Nothing to screenshot (an AI workflow): the card's figure, large.
            <ProjectCover
              project={project}
              className="reveal aspect-[4/3] rounded-[10px] md:aspect-[21/9]"
            />
          )}
        </div>

        <div className="mx-auto grid max-w-[1440px] gap-16 px-4 py-20 md:grid-cols-12 md:gap-6 md:px-8 md:py-32">
          <section className="reveal md:col-span-5">
            <SectionLabel>{d.problem}</SectionLabel>
            <p className="mt-6 text-[clamp(20px,1.9vw,26px)] leading-[1.4] tracking-[-0.01em]">
              {project.problem}
            </p>
          </section>
          <section className="reveal md:col-span-6 md:col-start-7">
            <SectionLabel>{d.outcome}</SectionLabel>
            <p className="mt-6 text-[clamp(20px,1.9vw,26px)] leading-[1.4] tracking-[-0.01em]">
              {project.outcome}
            </p>
          </section>

          {flow && (
            // min-w-0: the grid cell must not grow to the diagram's width,
            // or the page scrolls sideways instead of the diagram.
            <section className="reveal min-w-0 md:col-span-12">
              <SectionLabel>{d.flow}</SectionLabel>
              <div className="mt-6">
                <ProjectFlow
                  flow={flow}
                  id={`flow-${project.slug}`}
                  title={`${project.title} — ${d.flow}`}
                  labels={{ dashed: d.flowDashed, scroll: d.flowScroll }}
                />
              </div>
            </section>
          )}

          {project.highlights.length > 0 && (
            <section className="reveal md:col-span-12">
              <SectionLabel>{d.highlights}</SectionLabel>
              <ul className="mt-6 grid gap-px overflow-hidden rounded-[10px] bg-line sm:grid-cols-2 lg:grid-cols-5">
                {project.highlights.map((item, i) => (
                  <li key={item} className="bg-bg p-6">
                    <span className="font-mono text-[11px] text-accent">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <p className="mt-6 text-[17px]">{item}</p>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {project.tech.length > 0 && (
            <section className="reveal md:col-span-12">
              <SectionLabel>{d.tech}</SectionLabel>
              <ul className="mt-6 flex flex-wrap gap-2">
                {project.tech.map((item) => (
                  <li
                    key={item}
                    className="rounded-full border border-line px-4 py-2 text-[14px]"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>
      </article>

      <Link
        href={localePath(locale, `/work/${next.slug}`)}
        data-cursor="view"
        className="group block border-t border-line"
      >
        <div className="mx-auto flex max-w-[1440px] items-end justify-between gap-6 px-4 py-16 md:px-8 md:py-24">
          <div>
            <SectionLabel>{d.next}</SectionLabel>
            <div className="mt-5 flex flex-col items-start gap-4 md:flex-row md:items-center md:gap-6">
              <ProjectCover
                project={next}
                sizes="120px"
                className="size-[clamp(72px,8vw,120px)] shrink-0 rounded-[10px]"
              />
              <p className="text-[clamp(32px,5vw,80px)] leading-[1.05] tracking-[-0.035em] text-balance transition-colors group-hover:text-accent">
                {next.title}
              </p>
            </div>
          </div>
          <span className="flex size-14 shrink-0 items-center justify-center rounded-full bg-accent text-accent-ink transition-transform group-hover:translate-x-1 md:size-20">
            <ArrowRight className="size-6" />
          </span>
        </div>
      </Link>
    </PageShell>
  );
}
