import Link from "next/link";
import { ArrowUpRight, Github, Linkedin, Mail } from "lucide-react";
import content from "@/data/content.json";
import { siteConfig } from "@/lib/site-config";
import { localePath, type Locale } from "@/lib/locale";

// The page's last screen and the target of every "Contact" link (#contact):
// who this is, where everything is, and a single clear way to get in touch.

const MediumIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
    <ellipse cx="6.5" cy="12" rx="5.5" ry="6" />
    <ellipse cx="16.5" cy="12" rx="2.75" ry="5.6" />
    <ellipse cx="21.5" cy="12" rx="1" ry="5.1" />
  </svg>
);

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
    { href: social.linkedin, label: "LinkedIn", Icon: Linkedin },
    { href: social.github, label: "GitHub", Icon: Github },
    { href: social.medium, label: "Medium", Icon: MediumIcon },
  ];

  return (
    <footer
      id="contact"
      className="relative z-10 scroll-mt-(--header-h) border-t border-line bg-bg"
    >
      <div className="mx-auto grid max-w-[1440px] gap-12 px-4 py-16 md:grid-cols-12 md:gap-6 md:px-8 md:py-20">
        <div className="md:col-span-4">
          <p className="font-serif text-[28px] leading-none">Max</p>
          <p className="mt-5 max-w-sm text-[15px] leading-relaxed text-muted">
            {f.blurb}
          </p>
          <a
            href={`mailto:${social.email}`}
            className="mt-6 inline-block text-[15px] underline decoration-line underline-offset-4 transition-colors hover:text-accent hover:decoration-accent"
          >
            {social.email}
          </a>
          <ul className="mt-5 flex gap-2">
            {elsewhere.map(({ href, label, Icon }) => (
              <li key={label}>
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="flex size-9 items-center justify-center rounded-full border border-line text-muted transition-colors hover:border-accent hover:text-accent"
                >
                  <Icon className="size-4" />
                </a>
              </li>
            ))}
          </ul>
        </div>

        <nav aria-label={f.sitemap} className="md:col-span-2 md:col-start-6">
          <p className="section-label mb-4">{f.sitemap}</p>
          <ul className="space-y-2 text-[15px]">
            {sitemap.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="text-muted transition-colors hover:text-ink">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="md:col-span-4 md:col-start-9">
          <div className="flex h-full flex-col justify-between gap-10 rounded-[10px] bg-surface p-6 md:p-8">
            <div>
              <h2 className="text-[28px] leading-[1.15] tracking-[-0.02em]">
                {f.ctaTitle}
              </h2>
              <p className="mt-4 text-[15px] leading-relaxed text-muted">
                {f.ctaBody}
              </p>
            </div>
            <a
              href={`mailto:${social.email}`}
              className="inline-flex items-center gap-2 self-end rounded-full bg-accent px-5 py-2.5 text-[15px] text-accent-ink transition-transform hover:-translate-y-0.5"
            >
              <Mail className="size-4" />
              {f.ctaButton}
              <ArrowUpRight className="size-4" />
            </a>
          </div>
        </div>
      </div>

      <div className="mx-auto flex max-w-[1440px] flex-col gap-2 border-t border-line px-4 py-6 font-mono text-[11px] text-muted md:flex-row md:justify-between md:px-8">
        <p>
          © {new Date().getFullYear()} {siteConfig.name}. {f.rights}
        </p>
        <p>{t.common.location}</p>
      </div>
    </footer>
  );
}
