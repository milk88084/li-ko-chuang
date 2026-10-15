import Link from "next/link";
import { ArrowUp, ArrowUpRight } from "lucide-react";
import content from "@/data/content.json";
import { siteConfig } from "@/lib/site-config";
import { localePath, type Locale } from "@/lib/locale";
import { GridLines } from "@/components/canvas/GridLines";
import { Caret } from "@/components/motion/Caret";
import { CopyEmailButton, TaipeiClock } from "./footer-parts";

// The last screen of every page and the target of every "Contact" link
// (#contact). The whole block flips to the accent colour so the page ends on
// a single, loud invitation: a two-line prompt still being "typed", the email
// address at display size, and the practical details laid out like a design
// tool's inspect panel. Sitemap and copyright shrink to one line underneath.

export function SiteFooter({ locale }: { locale: Locale }) {
  const t = content[locale];
  const f = t.footer;
  const { social } = siteConfig;

  const sitemap = [
    { href: localePath(locale, ""), label: t.nav.home },
    { href: localePath(locale, "/work"), label: t.nav.work },
    { href: localePath(locale, "/about"), label: t.nav.about },
    { href: localePath(locale, "/events"), label: t.nav.events },
    { href: localePath(locale, "/writing"), label: t.nav.writing },
  ];

  const elsewhere = [
    { href: social.linkedin, label: "LinkedIn" },
    { href: social.github, label: "GitHub" },
    { href: social.medium, label: "Medium" },
  ];

  const inspect = [
    { label: f.localTime, value: <TaipeiClock /> },
    { label: f.basedIn, value: t.common.location },
    {
      label: f.elsewhere,
      value: (
        <span className="flex flex-wrap gap-x-4 gap-y-1">
          {elsewhere.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-0.5 underline decoration-white/30 underline-offset-4 transition-colors hover:decoration-white"
            >
              {link.label}
              <ArrowUpRight className="size-3.5 opacity-70 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          ))}
        </span>
      ),
    },
  ];

  return (
    <footer
      id="contact"
      data-cursor-tone="light"
      className="relative z-10 scroll-mt-(--header-h) overflow-hidden bg-accent text-accent-ink selection:bg-white selection:text-accent"
    >
      <GridLines lineClassName="border-white/10" />

      <div className="relative mx-auto max-w-[1440px] px-4 pt-14 pb-8 md:px-8 md:pt-20">
        <p className="font-mono text-[12px] tracking-[0.04em] text-white/70 uppercase">
          {`/ ${f.label}`}
        </p>

        {/* Prompt on the left, address on the right: side by side on wide
            screens, so the block stays well under a screen tall. */}
        <div className="mt-5 grid gap-10 md:grid-cols-12 md:items-end md:gap-6">
          <h2 className="text-[clamp(40px,6vw,92px)] leading-[0.95] tracking-[-0.045em] text-balance md:col-span-7">
            <span className="block">{f.line1}</span>
            <span className="block font-serif tracking-[-0.02em] italic">
              {f.line2}
              <Caret className="bg-white" />
            </span>
          </h2>

          <div className="md:col-span-5 md:justify-self-end md:pb-2">
            <p className="font-mono text-[11px] tracking-[0.06em] text-white/60 uppercase">
              {f.emailHint}
            </p>
            <a
              href={`mailto:${social.email}`}
              className="mt-2 block text-[clamp(24px,2.9vw,42px)] leading-tight tracking-[-0.03em] break-all underline decoration-white/30 decoration-2 underline-offset-[0.18em] transition-colors hover:decoration-white"
            >
              {social.email}
            </a>
            <div className="mt-5">
              <CopyEmailButton email={social.email} label={f.copy} doneLabel={f.copied} />
            </div>
          </div>
        </div>

        <dl className="mt-12 grid border-t border-white/25 md:mt-16 md:grid-cols-3">
          {inspect.map((row, i) => (
            <div
              key={row.label}
              className={`flex items-baseline justify-between gap-6 border-b border-white/25 py-4 last:border-b-0 md:block md:border-b-0 md:py-5 ${
                i > 0 ? "md:border-l md:pl-6" : ""
              }`}
            >
              <dt className="shrink-0 font-mono text-[11px] tracking-[0.06em] text-white/60 uppercase">
                {row.label}
              </dt>
              <dd className="text-right text-[15px] md:mt-3 md:text-left md:text-[17px]">
                {row.value}
              </dd>
            </div>
          ))}
        </dl>

        <div className="mt-8 flex flex-col gap-5 border-t border-white/25 pt-6 font-mono text-[11px] tracking-[0.04em] text-white/70 uppercase md:flex-row md:items-center md:justify-between">
          <nav aria-label={f.sitemap}>
            <ul className="flex flex-wrap gap-x-5 gap-y-2">
              {sitemap.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="transition-colors hover:text-white">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div className="flex items-center justify-between gap-6 md:justify-end">
            <p>
              © {new Date().getFullYear()} {siteConfig.name}. {f.rights}
            </p>
            <a
              href="#top"
              className="group inline-flex items-center gap-1.5 transition-colors hover:text-white"
            >
              {f.backToTop}
              <ArrowUp className="size-3.5 transition-transform group-hover:-translate-y-0.5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
