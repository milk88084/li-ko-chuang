import Link from "next/link";
import { ArrowRight } from "lucide-react";
import content from "@/data/content.json";
import { localePath, type Locale } from "@/lib/locale";
import { getMediumArticles } from "@/lib/medium";
import { PageShell } from "@/components/layout/PageShell";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { Section } from "@/components/layout/Section";
import { ScrubText } from "@/components/motion/ScrubText";
import { ArticleList } from "@/components/writing/ArticleList";
import { HomeHero } from "./HomeHero";
import { SelectedWork } from "./SelectedWork";
import { WhatIBring } from "./WhatIBring";
import { Toolbox } from "./Toolbox";
import { KindWords } from "./KindWords";

// Shared by / and /zh.
export async function HomePage({ locale }: { locale: Locale }) {
  const t = content[locale];
  const articles = await getMediumArticles(3);

  return (
    <PageShell footer={<SiteFooter locale={locale} />}>
      <HomeHero locale={locale} />

      <Section label={t.home.hello.label}>
        {/* Oversized serif quote marks bracket the paragraph — opening at its
            top-left, closing at its bottom-right — on rows of their own, so
            the text keeps the full width. Decoration only. */}
        <span
          aria-hidden
          className="block h-[0.5em] font-serif text-[clamp(88px,10vw,160px)] leading-none text-accent select-none"
        >
          “
        </span>
        <ScrubText
          text={t.home.hello.text}
          className="text-[clamp(26px,3.4vw,46px)] leading-[1.22] tracking-[-0.025em] text-pretty"
        />
        <span
          aria-hidden
          className="mt-4 block h-[0.5em] text-right font-serif text-[clamp(88px,10vw,160px)] leading-none text-accent select-none"
        >
          ”
        </span>
      </Section>

      <SelectedWork locale={locale} />
      <WhatIBring locale={locale} />
      <Toolbox locale={locale} />
      <KindWords locale={locale} />

      <Section
        label={t.home.writing.label}
        title={t.home.writing.title}
        aside={
          <Link
            href={localePath(locale, "/writing")}
            className="group inline-flex items-center gap-2 text-[15px] text-accent"
          >
            {t.home.writing.viewAll}
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
          </Link>
        }
      >
        <ArticleList
          articles={articles}
          locale={locale}
          readMore={t.writing.readMore}
          empty={t.writing.noArticles}
        />
      </Section>
    </PageShell>
  );
}
