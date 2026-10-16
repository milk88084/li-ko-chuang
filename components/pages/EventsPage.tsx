import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import content from "@/data/content.json";
import events from "@/data/events.json";
import { localePath, type Locale } from "@/lib/locale";
import { PageShell } from "@/components/layout/PageShell";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { PageIntro } from "@/components/layout/PageIntro";
import { Section } from "@/components/layout/Section";

// Events in two halves: the ones Max planned and ran as a marketer, and the
// tech meetups Max attends now. An organised event that is also a project
// links through to its project page.

export function EventsPage({ locale }: { locale: Locale }) {
  const t = content[locale].events;

  return (
    <PageShell footer={<SiteFooter locale={locale} />}>
      <PageIntro label={t.label} title={t.title} intro={t.intro} />

      <Section label={t.organized.label} title={t.organized.title} className="md:pt-16">
        <ul className="grid gap-x-6 gap-y-14 md:grid-cols-2">
          {events.organized.map((event) => {
            const copy = event[locale];
            return (
              <li key={copy.name} className="reveal flex flex-col">
                <div className="relative aspect-[16/10] overflow-hidden rounded-[10px] bg-surface">
                  {event.image ? (
                    <Image
                      src={event.image}
                      alt={copy.name}
                      fill
                      sizes="(min-width: 768px) 50vw, 100vw"
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center font-serif text-[clamp(28px,4vw,48px)] text-accent italic">
                      {copy.org}
                    </div>
                  )}
                </div>
                <p className="mt-4 font-mono text-[11px] text-muted uppercase">
                  {[copy.org, copy.period].filter(Boolean).join(" · ")}
                </p>
                <h3 className="mt-1.5 text-[22px] tracking-[-0.015em]">{copy.name}</h3>
                <p className="mt-2 max-w-xl text-[15px] leading-relaxed text-muted">
                  {copy.description}
                </p>
                {event.slug && (
                  <Link
                    href={localePath(locale, `/work/${event.slug}`)}
                    className="group mt-4 inline-flex items-center gap-2 self-start text-[14px] text-accent"
                  >
                    {t.viewProject}
                    <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                )}
              </li>
            );
          })}
        </ul>
      </Section>

      <Section label={t.attended.label} title={t.attended.title}>
        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {events.attended.map((event) => (
            <li key={event.name} className="reveal">
              <div className="relative aspect-square overflow-hidden rounded-[10px] bg-surface">
                <Image
                  src={event.image}
                  alt={event.name}
                  fill
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  className="object-cover"
                />
              </div>
              <p className="mt-4 font-mono text-[11px] text-muted">{event.date}</p>
              <h3 className="mt-1.5 text-[19px] tracking-[-0.01em]">{event.name}</h3>
            </li>
          ))}
        </ul>
      </Section>
    </PageShell>
  );
}
