import Image from "next/image";
import content from "@/data/content.json";
import type { Locale } from "@/lib/locale";
import { isVideo, type ProjectMedia } from "@/lib/projects";
import { LoopVideo } from "./LoopVideo";

// Every piece of a project's media, laid out as a loose collage rather than
// one full-bleed banner: the lead shot (a device mockup, a browser window or a
// photo) on one side, phone screens beside it and dropped lower, the app icon
// overlapping the lead's corner. Nothing is ever drawn wider than its real
// pixel size, and phone recordings sit in a phone-sized frame, since they are
// portrait captures and blur badly when stretched to fill a landscape box.
// Images go out as they are: they are already small, compressed WebP, and
// re-encoding a UI screenshot only softens its text.

type Labels = (typeof content)["en"]["work"]["detail"]["media"];

function Caption({ index, label, media }: { index: number; label: string; media: ProjectMedia }) {
  return (
    <figcaption className="mt-3 flex justify-between gap-4 font-mono text-[11px] text-muted">
      <span>
        <span className="text-accent">{String(index + 1).padStart(2, "0")}</span> · {label}
      </span>
      <span>
        {media.width} × {media.height}
      </span>
    </figcaption>
  );
}

function Still({ media, alt, sizes }: { media: ProjectMedia; alt: string; sizes: string }) {
  return (
    <Image
      src={media.src}
      alt={alt}
      width={media.width}
      height={media.height}
      sizes={sizes}
      unoptimized
      className="block h-auto w-full"
    />
  );
}

function Lead({ media, alt, label, index, icon }: {
  media: ProjectMedia;
  alt: string;
  label: string;
  index: number;
  icon?: ProjectMedia;
}) {
  const still = <Still media={media} alt={alt} sizes="(min-width: 768px) 66vw, 100vw" />;
  return (
    <figure className="reveal relative w-full min-w-0 md:flex-1" style={{ maxWidth: media.width }}>
      <div className="relative">
        {media.kind === "browser" ? (
          <div className="overflow-hidden rounded-[10px] border border-line bg-surface">
            <div aria-hidden className="flex h-8 items-center gap-1.5 border-b border-line px-3">
              {[0, 1, 2].map((dot) => (
                <span key={dot} className="size-2.5 rounded-full bg-line" />
              ))}
            </div>
            {still}
          </div>
        ) : (
          <div className="overflow-hidden rounded-[10px] bg-surface">{still}</div>
        )}
        {icon && (
          <Image
            src={icon.src}
            alt=""
            width={icon.width}
            height={icon.height}
            unoptimized
            className="absolute -top-6 left-5 size-16 rounded-[22%] shadow-[0_12px_30px_-10px_rgb(0_0_0/0.45)] ring-1 ring-black/5 md:-top-8 md:-left-8 md:size-24"
          />
        )}
      </div>
      <Caption index={index} label={label} media={media} />
    </figure>
  );
}

function Phone({ media, alt, label, index, offset }: {
  media: ProjectMedia;
  alt: string;
  label: string;
  index: number;
  offset: string;
}) {
  return (
    <figure
      className={`reveal w-[min(68vw,280px)] shrink-0 md:w-[clamp(200px,21vw,290px)] ${offset}`}
      style={{ maxWidth: media.width }}
    >
      <div className="rounded-[2.2rem] bg-neutral-900 p-2 ring-1 ring-white/10 shadow-[0_30px_60px_-30px_rgb(0_0_0/0.5)]">
        <div className="overflow-hidden rounded-[1.75rem] bg-black">
          {isVideo(media) ? (
            <LoopVideo src={media.src} width={media.width} height={media.height} label={alt} />
          ) : (
            <Still media={media} alt={alt} sizes="290px" />
          )}
        </div>
      </div>
      <Caption index={index} label={label} media={media} />
    </figure>
  );
}

export function ProjectGallery({
  media,
  title,
  locale,
}: {
  media: ProjectMedia[];
  title: string;
  locale: Locale;
}) {
  const labels: Labels = content[locale].work.detail.media;
  const label = (m: ProjectMedia) =>
    m.kind === "phone" && isVideo(m) ? labels.recording : labels[m.kind];

  const [lead, ...rest] = media;
  const icon = rest.find((m) => m.kind === "icon");
  const phones = rest.filter((m) => m.kind === "phone");
  const order = [lead, ...phones, ...(icon ? [icon] : [])];
  const indexOf = (m: ProjectMedia) => order.indexOf(m);

  // A lone photo is set off-centre, not stretched across the page.
  if (phones.length === 0 && !icon && lead.kind === "photo") {
    return (
      <div className="flex md:justify-end md:pr-[8%]">
        <figure className="reveal w-full md:w-[72%]" style={{ maxWidth: lead.width }}>
          <div className="overflow-hidden rounded-[10px] bg-surface">
            <Still media={lead} alt={title} sizes="(min-width: 768px) 72vw, 100vw" />
          </div>
          <Caption index={0} label={label(lead)} media={lead} />
        </figure>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-14 md:flex-row md:items-start md:justify-center md:gap-[5%]">
      <Lead
        media={lead}
        alt={title}
        label={label(lead)}
        index={0}
        icon={icon}
      />
      {phones.map((phone, i) => (
        <Phone
          key={phone.src}
          media={phone}
          alt={`${title} — ${label(phone)}`}
          label={label(phone)}
          index={indexOf(phone)}
          offset={i % 2 === 0 ? "md:mt-[12%]" : "md:-mt-[4%]"}
        />
      ))}
    </div>
  );
}
