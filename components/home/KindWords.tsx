import content from "@/data/content.json";
import testimonials from "@/data/testimonials.json";
import type { Locale } from "@/lib/locale";
import { Section } from "@/components/layout/Section";

// Quotes from people Max has worked with. data/testimonials.json starts empty
// and the whole section stays out of the page until it has something in it.
//
// Entry shape:
//   { "name": "…", "quote": { "en": "…", "zh": "…" }, "title": { "en": "…", "zh": "…" } }

interface Testimonial {
  name: string;
  quote: Record<Locale, string>;
  title: Record<Locale, string>;
}

const ENTRIES = testimonials as Testimonial[];

export function KindWords({ locale }: { locale: Locale }) {
  if (ENTRIES.length === 0) return null;
  const t = content[locale].home.words;

  return (
    <Section label={t.label} title={t.title}>
      <ul className="columns-1 gap-6 md:columns-2 lg:columns-3">
        {ENTRIES.map((entry) => (
          <li
            key={entry.name}
            className="reveal mb-6 break-inside-avoid rounded-[10px] bg-surface p-6"
          >
            <blockquote className="text-[17px] leading-relaxed">
              “{entry.quote[locale]}”
            </blockquote>
            <p className="mt-6 text-[15px] text-accent">{entry.name}</p>
            <p className="text-[13px] text-muted">{entry.title[locale]}</p>
          </li>
        ))}
      </ul>
    </Section>
  );
}
