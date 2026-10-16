import content from "@/data/content.json";
import clients from "@/data/clients.json";
import type { Locale } from "@/lib/locale";

// "Worked with" strip. Names from data/clients.json are set as type until
// there is logo artwork to replace them with. The list is
// rendered twice so the -50% marquee loops without a seam; the copy is hidden
// from assistive tech so the names are read once.

export function ClientMarquee({ locale }: { locale: Locale }) {
  const label = content[locale].home.clients.label;
  const names = clients.map((c) => c[locale]);

  const row = (hidden: boolean) => (
    <ul
      aria-hidden={hidden || undefined}
      className="flex shrink-0 items-center gap-14 pr-14"
    >
      {names.map((name) => (
        <li
          key={name}
          className="font-mono text-[13px] tracking-[0.08em] whitespace-nowrap text-muted uppercase"
        >
          {name}
        </li>
      ))}
    </ul>
  );

  return (
    <section
      aria-label={label}
      className="relative flex shrink-0 items-center gap-8 border-t border-line bg-bg py-5 md:py-7"
    >
      <p className="shrink-0 pl-4 font-mono text-[11px] tracking-[0.06em] text-muted uppercase md:pl-8">
        {label}
      </p>
      <div className="relative min-w-0 flex-1 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
        <div className="animate-marquee flex w-max">
          {row(false)}
          {row(true)}
        </div>
      </div>
    </section>
  );
}
