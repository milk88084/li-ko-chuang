import content from "@/data/content.json";
import type { Locale } from "@/lib/locale";
import type { ProjectMedia } from "@/lib/projects";
import { Lead, Phone, type Labels } from "./ProjectGallery";

// The gallery for design work, where the screens are the point: the lead page
// across the full width, then the other pages in two staggered columns, with
// the mobile screens set on a tinted band in between, alternately raised and
// dropped so they read as a row of phones on a table rather than a grid.
// Every shot is numbered in reading order and captioned with the page it shows.

/**
 * Two columns, the right-hand shots dropped by a third of their height. They
 * are moved, not reflowed, so on a phone the single column still reads in
 * number order; the padding makes room for the last one's drop.
 */
function Pages({
  pages,
  first,
  label,
  title,
}: {
  pages: ProjectMedia[];
  first: number;
  label: string;
  title: string;
}) {
  return (
    <div className="grid gap-14 md:grid-cols-2 md:gap-x-[4%] md:gap-y-16 md:pb-[12%]">
      {pages.map((media, i) => (
        <div
          key={media.src}
          className={i % 2 === 1 ? "md:translate-y-[33%]" : ""}
        >
          <Lead
            media={media}
            alt={`${title} — ${media.caption ?? label}`}
            label={label}
            index={first + i}
          />
        </div>
      ))}
    </div>
  );
}

export function DesignGallery({
  media,
  title,
  locale,
}: {
  media: ProjectMedia[];
  title: string;
  locale: Locale;
}) {
  const labels: Labels = content[locale].work.detail.media;
  const [lead, ...rest] = media;
  const pages = rest.filter((m) => m.kind !== "phone");
  const phones = rest.filter((m) => m.kind === "phone");
  // Up to four pages before the phones, the rest after, so a long set of
  // desktop shots is broken up by the band instead of running on.
  const before = pages.slice(0, 4);
  const after = pages.slice(4);
  const phonesFrom = 1 + before.length;
  const afterFrom = phonesFrom + phones.length;

  return (
    <div className="flex flex-col gap-20 md:gap-32">
      <div className="mx-auto w-full" style={{ maxWidth: lead.width }}>
        <Lead
          media={lead}
          alt={`${title} — ${lead.caption ?? labels[lead.kind]}`}
          label={labels[lead.kind]}
          index={0}
        />
      </div>

      {before.length > 0 && (
        <Pages
          pages={before}
          first={1}
          label={labels.browser}
          title={title}
        />
      )}

      {phones.length > 0 && (
        // Full-bleed on phones, where the row scrolls sideways; on wider
        // screens it fits and sits centred.
        <div className="-mx-4 rounded-none bg-surface py-14 md:mx-0 md:rounded-[16px] md:py-24">
          <div className="flex snap-x snap-mandatory gap-6 overflow-x-auto px-4 pb-2 md:justify-center md:gap-[3%] md:overflow-visible md:px-[4%]">
            {phones.map((phone, i) => (
              <div
                key={phone.src}
                className={`w-[min(62vw,240px)] shrink-0 snap-center md:w-auto md:max-w-[240px] md:flex-1 ${
                  i % 2 === 1 ? "md:mt-[6%]" : ""
                }`}
              >
                <Phone
                  media={phone}
                  alt={`${title} — ${phone.caption ?? labels.phone}`}
                  label={labels.phone}
                  index={phonesFrom + i}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {after.length > 0 && (
        <Pages
          pages={after}
          first={afterFrom}
          label={labels.browser}
          title={title}
        />
      )}
    </div>
  );
}
