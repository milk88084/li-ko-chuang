import content from "@/data/content.json";
import type { Locale } from "@/lib/locale";
import { getProjects } from "@/lib/projects";
import { PageShell } from "@/components/layout/PageShell";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { PageIntro } from "@/components/layout/PageIntro";
import { WorkGrid } from "@/components/work/WorkGrid";

export function WorkPage({ locale }: { locale: Locale }) {
  const t = content[locale].work;

  return (
    <PageShell footer={<SiteFooter locale={locale} />}>
      <PageIntro label={t.label} title={t.title} intro={t.intro} />
      <div className="mx-auto max-w-[1440px] px-4 pb-24 md:px-8 md:pb-32">
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
