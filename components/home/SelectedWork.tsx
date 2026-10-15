import Link from "next/link";
import { ArrowRight } from "lucide-react";
import content from "@/data/content.json";
import { getFeaturedProjects } from "@/lib/projects";
import { localePath, type Locale } from "@/lib/locale";
import { Section } from "@/components/layout/Section";
import { ProjectCard } from "@/components/work/ProjectCard";

// Two large cards, then two small ones beside a "view all" tile — a mix of
// engineering and marketing, so the range shows before anyone clicks.

export function SelectedWork({ locale }: { locale: Locale }) {
  const t = content[locale];
  const [first, second, ...rest] = getFeaturedProjects(locale);
  const href = (slug: string) => localePath(locale, `/work/${slug}`);
  const typeLabel = (type: keyof typeof t.work.types) => t.work.types[type];

  return (
    <Section label={t.home.work.label} title={t.home.work.title}>
      <div className="grid gap-x-6 gap-y-12 md:grid-cols-12">
        {[first, second].map((project) => (
          <div key={project.slug} className="reveal md:col-span-6">
            <ProjectCard
              project={project}
              href={href(project.slug)}
              typeLabel={typeLabel(project.type)}
            />
          </div>
        ))}

        {rest.slice(0, 2).map((project) => (
          <div key={project.slug} className="reveal md:col-span-4">
            <ProjectCard
              project={project}
              href={href(project.slug)}
              typeLabel={typeLabel(project.type)}
              aspect="aspect-[4/3]"
            />
          </div>
        ))}

        <Link
          href={localePath(locale, "/work")}
          className="reveal group flex min-h-48 items-center justify-center gap-3 rounded-[10px] bg-surface text-[19px] text-accent md:col-span-4"
        >
          {t.home.work.viewAll}
          <span className="flex size-9 items-center justify-center rounded-full bg-accent text-accent-ink transition-transform group-hover:translate-x-1">
            <ArrowRight className="size-4" />
          </span>
        </Link>
      </div>
    </Section>
  );
}
