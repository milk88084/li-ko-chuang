import content from "@/data/content.json";
import type { Locale } from "@/lib/locale";
import { getProjects } from "@/lib/projects";
import { PageShell } from "@/components/layout/PageShell";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { WorkGrid } from "@/components/work/WorkGrid";
import { WorkHero } from "@/components/work/WorkHero";

export function WorkPage({ locale }: { locale: Locale }) {
  const t = content[locale].work;

  return (
    <PageShell footer={<SiteFooter locale={locale} />}>
      <WorkHero locale={locale} />
      <div className="mx-auto max-w-[1440px] px-4 pt-16 pb-24 md:px-8 md:pt-24 md:pb-32">
        <WorkGrid
          projects={getProjects(locale)}
          locale={locale}
          filters={t.filters}
          types={t.types}
        />
      </div>
    </PageShell>
  );
}
