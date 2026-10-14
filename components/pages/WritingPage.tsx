import { ArrowUpRight } from "lucide-react";
import content from "@/data/content.json";
import type { Locale } from "@/lib/locale";
import { getMediumArticles } from "@/lib/medium";
import { PageShell } from "@/components/layout/PageShell";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { PageIntro } from "@/components/layout/PageIntro";
import { ArticleList } from "@/components/writing/ArticleList";

export async function WritingPage({ locale }: { locale: Locale }) {
  const t = content[locale].writing;
  const articles = await getMediumArticles(10);

  return (
    <PageShell footer={<SiteFooter locale={locale} />}>
      <PageIntro label={t.label} title={t.title} intro={t.intro} />
      <div className="mx-auto max-w-[1440px] px-4 pb-24 md:px-8 md:pb-32">
        <ArticleList
          articles={articles}
          locale={locale}
          readMore={t.readMore}
          empty={t.noArticles}
        />
        <a
          href={t.mediumUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="group mt-12 inline-flex items-center gap-2 text-[15px] text-accent"
        >
          {t.viewAll}
          <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </a>
      </div>
    </PageShell>
  );
}
