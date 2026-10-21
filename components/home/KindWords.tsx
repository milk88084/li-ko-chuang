import Image from "next/image";
import content from "@/data/content.json";
import testimonials from "@/data/testimonials.json";
import type { Locale } from "@/lib/locale";
import { Section } from "@/components/layout/Section";

// Quotes from people Max has worked with. The whole section stays out of the
// page while data/testimonials.json is empty.
//
// Entry shape (every text field in both languages):
//   {
//     "name":  { "en": "Ming Wang", "zh": "王小明" },
//     "title": { "en": "PM, …",     "zh": "專案經理，…" },
//     "quote": { "en": "…",         "zh": "…" },
//     "photo": "/testimonials/ming.webp"   ← optional; initials until then
//   }

interface Testimonial {
  name: Record<Locale, string>;
  title: Record<Locale, string>;
  quote: Record<Locale, string>;
  photo?: string;
}

const ENTRIES = testimonials as unknown as Testimonial[];

// Entry i goes to column i % 3, keeping its index for the narrow-screen order.
const COLUMNS = [0, 1, 2].map((c) =>
  ENTRIES.map((entry, index) => ({ entry, index })).filter(
    ({ index }) => index % 3 === c,
  ),
);

/**
 * "Ming Wang" → "MW", "Wen Cheng Wong" → "WW" (first and last name),
 * "王小明" → "小明" (given name, as it is said aloud).
 */
function initials(name: string) {
  if (/[㐀-鿿]/.test(name)) return name.length > 2 ? name.slice(-2) : name;
  const parts = name.trim().split(/\s+/);
  const first = parts[0]?.[0] ?? "";
  const last = parts.length > 1 ? parts[parts.length - 1][0] : "";
  return (first + last).toUpperCase();
}

function Avatar({ name, photo }: { name: string; photo?: string }) {
  if (photo) {
    return (
      <Image
        src={photo}
        alt=""
        width={44}
        height={44}
        className="size-11 shrink-0 rounded-full object-cover"
      />
    );
  }
  return (
    <span
      aria-hidden
      className="flex size-11 shrink-0 items-center justify-center rounded-full bg-accent/12 text-[13px] text-accent"
    >
      {initials(name)}
    </span>
  );
}

export function KindWords({ locale }: { locale: Locale }) {
  if (ENTRIES.length === 0) return null;
  const t = content[locale].home.words;
  // Chinese text takes corner brackets, English takes curly quotes.
  const [open, close] = locale === "zh" ? ["「", "」"] : ["“", "”"];

  return (
    <Section label={t.label} title={t.title}>
      {/* Entries are dealt across three columns in turn, so the first three
          head the row on wide screens. Narrower, the columns dissolve
          (display: contents) and `order` puts the cards back in file order. */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 lg:items-start">
        {COLUMNS.map((column, c) => (
          <ul key={c} className="contents lg:flex lg:flex-col lg:gap-6">
            {column.map(({ entry, index }) => (
              <li
                key={entry.name.en}
                style={{ order: index }}
                className="reveal rounded-[10px] bg-surface p-6 md:p-7"
              >
                <figure>
                  <blockquote className="text-[17px] leading-relaxed">
                    {open}
                    {entry.quote[locale]}
                    {close}
                  </blockquote>
                  <figcaption className="mt-6 flex items-center gap-3">
                    <Avatar name={entry.name[locale]} photo={entry.photo} />
                    <span>
                      <span className="block text-[15px] text-accent">
                        {entry.name[locale]}
                      </span>
                      <span className="block text-[13px] text-muted">
                        {entry.title[locale]}
                      </span>
                    </span>
                  </figcaption>
                </figure>
              </li>
            ))}
          </ul>
        ))}
      </div>
    </Section>
  );
}
