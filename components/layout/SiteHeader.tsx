"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, useSyncExternalStore } from "react";
import { useTheme } from "next-themes";
import { Menu, Moon, Sun, X } from "lucide-react";
import content from "@/data/content.json";
import { useLanguage } from "@/providers/LanguageProvider";
import { localePath, otherLocalePath, routeFromPathname } from "@/lib/locale";

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

export function SiteHeader() {
  const pathname = usePathname() ?? "/";
  const { language } = useLanguage();
  const { resolvedTheme, setTheme } = useTheme();
  const mounted = useIsMounted();
  const t = content[language].nav;
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

  const links = ROUTES.map((r) => ({
    href: localePath(language, r),
    label: t[LABEL_KEY[r]],
    active: isActive(r),
  }));

  const isDark = mounted && resolvedTheme === "dark";

  return (
    <header className="fixed inset-x-0 top-0 z-50 h-(--header-h) border-b border-line/70 bg-bg/80 backdrop-blur-md">
      <div className="mx-auto flex h-full max-w-[1440px] items-center justify-between gap-4 px-4 md:px-8">
        <div className="flex items-center gap-8">
          <Link
            href={localePath(language, "")}
            className="font-serif text-[28px] leading-none tracking-tight"
          >
            Max
          </Link>
          <nav aria-label="Primary" className="hidden md:block">
            <ul className="flex items-center gap-6 text-[15px]">
              {links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    aria-current={link.active ? "page" : undefined}
                    className={`transition-colors ${
                      link.active ? "text-accent" : "text-muted hover:text-ink"
                    }`}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="flex items-center gap-1 md:gap-2">
          <Link
            href={otherLocalePath(pathname)}
            hrefLang={language === "en" ? "zh-Hant" : "en"}
            aria-label={t.languageLabel}
            className="rounded-full px-3 py-1.5 font-mono text-xs text-muted transition-colors hover:text-ink"
          >
            {t.language}
          </Link>
          <button
            type="button"
            onClick={() => setTheme(isDark ? "light" : "dark")}
            aria-label={t.themeLabel}
            className="rounded-full p-2 text-muted transition-colors hover:text-ink"
          >
            {isDark ? <Sun className="size-4" /> : <Moon className="size-4" />}
          </button>
          <a
            href="#contact"
            className="ml-2 hidden text-[15px] text-accent transition-opacity hover:opacity-70 md:inline"
          >
            {t.contact}
          </a>
          <button
            type="button"
            onClick={() => setOpen(!open)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? t.close : t.menu}
            className="rounded-full p-2 md:hidden"
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {open && (
        <nav
          id="mobile-nav"
          aria-label="Primary"
          className="fixed inset-x-0 top-(--header-h) bottom-0 bg-bg px-4 pt-8 md:hidden"
        >
          <ul className="space-y-2">
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  aria-current={link.active ? "page" : undefined}
                  className={`block py-2 text-4xl tracking-tight ${
                    link.active ? "text-accent" : ""
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li>
              <a
                href="#contact"
                onClick={() => setOpen(false)}
                className="block py-2 font-serif text-4xl text-accent italic"
              >
                {t.contact}
              </a>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}
