"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, useSyncExternalStore } from "react";
import { useTheme } from "next-themes";
import { ArrowUpRight, Menu, Moon, Sun, X } from "lucide-react";
import content from "@/data/content.json";
import { useLanguage } from "@/providers/LanguageProvider";
import { localePath, otherLocalePath, routeFromPathname } from "@/lib/locale";

// A floating dock rather than a bar: one rounded capsule centred at the top
// of the window, holding the wordmark, numbered page links, the language and
// theme switches, and a solid "Contact" pill. The current page is a filled
// chip. It tucks away while you scroll down to read and comes back the moment
// you scroll up.
//
// On phones the dock carries only the wordmark and a menu button; the menu
// opens a full-screen sheet of large numbered links.

const emptySubscribe = () => () => {};
const useIsMounted = () =>
  useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );

const ROUTES = ["/work", "/about", "/events", "/writing"] as const;
const LABEL_KEY = {
  "/work": "work",
  "/about": "about",
  "/events": "events",
  "/writing": "writing",
} as const;

/** Scroll distance before the dock may hide, and the jitter it ignores. */
const HIDE_AFTER = 160;
const DEAD_ZONE = 6;

function useHideOnScroll() {
  const [hidden, setHidden] = useState(false);
  useEffect(() => {
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      if (Math.abs(y - last) < DEAD_ZONE) return;
      setHidden(y > last && y > HIDE_AFTER);
      last = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return hidden;
}

export function SiteHeader() {
  const pathname = usePathname() ?? "/";
  const { language } = useLanguage();
  const { resolvedTheme, setTheme } = useTheme();
  const mounted = useIsMounted();
  const t = content[language].nav;
  const scrolledAway = useHideOnScroll();
  // The mobile sheet remembers the page it was opened on, so navigating
  // anywhere closes it without an effect.
  const [openOn, setOpenOn] = useState<string | null>(null);
  const open = openOn === pathname;
  const setOpen = (next: boolean) => setOpenOn(next ? pathname : null);

  const route = routeFromPathname(pathname);
  const isActive = (r: string) => route === r || route.startsWith(`${r}/`);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const links = ROUTES.map((r, i) => ({
    href: localePath(language, r),
    label: t[LABEL_KEY[r]],
    index: String(i + 1).padStart(2, "0"),
    active: isActive(r),
  }));

  // Next.js leaves the scroll position alone when a link points at the page
  // already open, so a click on the current page's own link (or the logo on
  // the home page) scrolls back to the top, and closes the mobile sheet.
  const toTopIfCurrent = (href: string) => () => {
    if (href !== pathname) return;
    setOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const isDark = mounted && resolvedTheme === "dark";
  const hidden = scrolledAway && !open;

  // /studio is an internal tool with its own chrome.
  if (route.startsWith("/studio")) return null;

  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-50">
      {open && (
        <nav
          id="mobile-nav"
          aria-label="Primary"
          className="pointer-events-auto fixed inset-0 bg-bg px-6 pt-28 md:hidden"
        >
          <ul className="border-t border-line">
            {links.map((link) => (
              <li key={link.href} className="border-b border-line">
                <Link
                  href={link.href}
                  onClick={toTopIfCurrent(link.href)}
                  aria-current={link.active ? "page" : undefined}
                  className={`flex items-baseline gap-4 py-5 text-[40px] leading-none tracking-[-0.03em] ${
                    link.active ? "text-accent" : ""
                  }`}
                >
                  <span className="font-mono text-[12px] text-muted">
                    {link.index}
                  </span>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          <a
            href="#contact"
            onClick={() => setOpen(false)}
            className="mt-10 inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-[17px] text-accent-ink"
          >
            {t.contact}
            <ArrowUpRight className="size-4" />
          </a>
        </nav>
      )}

      <div
        className={`flex justify-center px-3 pt-3 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none md:pt-4 ${
          hidden ? "-translate-y-[140%]" : "translate-y-0"
        }`}
      >
        <div className="pointer-events-auto relative flex h-14 w-full items-center justify-between gap-1 rounded-full border border-line bg-bg/75 p-1.5 shadow-[0_10px_30px_-14px_rgb(0_0_0/0.3)] backdrop-blur-xl md:w-auto md:justify-start">
          <Link
            href={localePath(language, "")}
            onClick={toTopIfCurrent(localePath(language, ""))}
            className="flex items-center gap-2 rounded-full px-4 font-serif text-[24px] leading-none tracking-tight"
          >
            <span aria-hidden className="size-2 rounded-full bg-accent" />
            Max
          </Link>

          <span aria-hidden className="mx-1 hidden h-6 w-px bg-line md:block" />

          <nav aria-label="Primary" className="hidden md:block">
            <ul className="flex items-center gap-0.5">
              {links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={toTopIfCurrent(link.href)}
                    aria-current={link.active ? "page" : undefined}
                    className={`flex items-baseline gap-1.5 rounded-full px-3.5 py-2.5 text-[14px] leading-none transition-colors ${
                      link.active
                        ? "bg-ink text-bg"
                        : "text-muted hover:bg-surface hover:text-ink"
                    }`}
                  >
                    <span className="font-mono text-[10px] opacity-60">
                      {link.index}
                    </span>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <span aria-hidden className="mx-1 hidden h-6 w-px bg-line md:block" />

          <div className="flex items-center gap-0.5">
            <Link
              href={otherLocalePath(pathname)}
              hrefLang={language === "en" ? "zh-Hant" : "en"}
              aria-label={t.languageLabel}
              className="flex h-11 items-center rounded-full px-3 font-mono text-[12px] text-muted transition-colors hover:bg-surface hover:text-ink"
            >
              {t.language}
            </Link>
            <button
              type="button"
              onClick={() => setTheme(isDark ? "light" : "dark")}
              aria-label={t.themeLabel}
              className="flex size-11 items-center justify-center rounded-full text-muted transition-colors hover:bg-surface hover:text-ink"
            >
              {isDark ? (
                <Sun className="size-4" />
              ) : (
                <Moon className="size-4" />
              )}
            </button>
            <a
              href="#contact"
              className="ml-1 hidden h-11 items-center gap-1.5 rounded-full bg-accent px-5 text-[14px] text-accent-ink transition-transform hover:-translate-y-px md:inline-flex"
            >
              {t.contact}
              <ArrowUpRight className="size-4" />
            </a>
            <button
              type="button"
              onClick={() => setOpen(!open)}
              aria-expanded={open}
              aria-controls="mobile-nav"
              aria-label={open ? t.close : t.menu}
              className="flex size-11 items-center justify-center rounded-full bg-ink text-bg md:hidden"
            >
              {open ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
