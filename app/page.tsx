"use client";

import Link from "next/link";
import Image from "next/image";
import { useTheme } from "next-themes";
import { Sun, Moon, Globe, ArrowDown } from "lucide-react";
import dynamic from "next/dynamic";
import { useSyncExternalStore, useState, useEffect, useCallback } from "react";
import { useLanguage } from "@/providers/LanguageProvider";
import content from "@/data/content.json";

// 動態載入物理背景，徹底將 Matter.js 移出初始渲染執行緒
const PhysicsBackground = dynamic(
  () => import("@/components/PhysicsBackground"),
  {
    ssr: false,
  },
);

type ContentType = typeof content;
type LanguageKey = keyof ContentType;

const emptySubscribe = () => () => {};
function useIsMounted() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );
}

// Full-screen brand loading screen shown until the physics background starts
// animating. `fadingOut` drives the exit fade; theme comes from the `.dark`
// class (CSS) so it renders correctly even before next-themes has resolved.
function LoadingScreen({ fadingOut = false }: { fadingOut?: boolean }) {
  return (
    <div
      aria-hidden={fadingOut}
      className={`fixed inset-0 z-[60] flex items-center justify-center bg-[#FBFBFD] transition-opacity duration-700 ease-out dark:bg-black ${
        fadingOut ? "pointer-events-none opacity-0" : "opacity-100"
      }`}
    >
      <div className="px-4 text-center">
        {/* Triple-outlined text. Three stacked copies in the same grid cell,
            each stroke narrower than the last and alternating blue / paper /
            blue, so each layer carves or repaints the middle of the one below —
            leaving three concentric blue lines (outer, middle, inner) with a
            hollow centre. Text-stroke has no Tailwind utility, so widths/colours
            are inline; --paper flips with the theme so the carved gaps always
            match the loading background. */}
        <div className="grid [--paper:#FBFBFD] dark:[--paper:#000000]">
          <h1
            className="col-start-1 row-start-1 text-[13vw] font-black leading-[0.85] tracking-[-0.04em] text-transparent md:text-[12vw] lg:text-[11vw]"
            style={{ WebkitTextStroke: "12px #3250FE" }}
          >
            LOADING
          </h1>
          <h1
            aria-hidden
            className="col-start-1 row-start-1 text-[13vw] font-black leading-[0.85] tracking-[-0.04em] text-transparent md:text-[12vw] lg:text-[11vw]"
            style={{ WebkitTextStroke: "8px var(--paper)" }}
          >
            LOADING
          </h1>
          <h1
            aria-hidden
            className="col-start-1 row-start-1 text-[13vw] font-black leading-[0.85] tracking-[-0.04em] text-transparent md:text-[12vw] lg:text-[11vw]"
            style={{ WebkitTextStroke: "4px #3250FE" }}
          >
            LOADING
          </h1>
        </div>
        <div
          className="mt-8 flex items-center justify-center gap-2"
          role="status"
          aria-label="Loading"
        >
          <span className="h-2.5 w-2.5 animate-bounce rounded-full bg-[#3250FE] [animation-delay:-0.3s]" />
          <span className="h-2.5 w-2.5 animate-bounce rounded-full bg-[#3250FE] [animation-delay:-0.15s]" />
          <span className="h-2.5 w-2.5 animate-bounce rounded-full bg-[#3250FE]" />
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const mounted = useIsMounted();
  const { resolvedTheme, setTheme } = useTheme();
  const { language, toggleLanguage } = useLanguage();

  const isDark = mounted ? resolvedTheme === "dark" : false;
  const t = content[language as LanguageKey];

  // Keep the loading screen up until the physics tags start falling.
  const [physicsReady, setPhysicsReady] = useState(false);
  const handlePhysicsReady = useCallback(() => setPhysicsReady(true), []);

  // Safety net: never trap the user behind the loader if onReady never fires
  // (e.g. the physics init throws). Drops it after a hard ceiling.
  useEffect(() => {
    const fallback = setTimeout(() => setPhysicsReady(true), 5000);
    return () => clearTimeout(fallback);
  }, []);

  const navItems = [
    { id: "engineer", label: t.nav.engineer, href: "/engineer" },
    { id: "marketer", label: t.nav.marketer, href: "/marketer" },
    // { id: "creator", label: t.nav.creator, href: "/creator" },
  ];

  if (!mounted) {
    return <LoadingScreen />;
  }

  return (
    <main
      className={`h-screen md:max-h-screen md:overflow-hidden relative overflow-hidden transition-colors duration-300 ${
        isDark ? "bg-black" : "bg-[#FBFBFD]"
      }`}
    >
      <nav
        className={`fixed w-full top-0 z-50 backdrop-blur-md border-b transition-all duration-300 ${
          isDark
            ? "bg-black/80 border-white/10"
            : "bg-[#FBFBFD]/80 border-gray-100/50"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between gap-2 overflow-hidden">
          <Link
            href="/"
            className={`font-bold text-sm tracking-tight transition-opacity cursor-pointer hover:opacity-70 shrink-0 ${
              isDark ? "text-white" : "text-gray-900"
            }`}
          >
            {/* Black logo by day, white by night (toggled via `.dark`). */}
            <Image
              src="/favicon_black.ico"
              alt="Logo"
              width={28}
              height={28}
              className="rounded-md shadow-sm dark:hidden"
              priority
            />
            <Image
              src="/favicon_white.ico"
              alt="Logo"
              width={28}
              height={28}
              className="hidden rounded-md shadow-sm dark:block"
              priority
            />
          </Link>
          <div className="flex items-center gap-1.5 md:gap-4 min-w-0">
            <div
              className={`flex items-center p-0.5 md:p-1 rounded-lg shrink-0 scale-90 sm:scale-100 origin-right ${
                isDark ? "bg-white/10" : "bg-gray-100"
              }`}
            >
              {navItems.map((item) => (
                <Link
                  key={item.id}
                  href={item.href}
                  className={`px-1.5 md:px-3 py-1 md:py-1.5 text-[10px] md:text-xs font-medium rounded-md transition-all duration-200 cursor-pointer ${
                    isDark
                      ? "text-gray-400 hover:text-white"
                      : "text-gray-500 hover:text-gray-900"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
            <button
              onClick={toggleLanguage}
              className={`flex items-center gap-1 px-2 py-1.5 rounded-full transition-colors cursor-pointer text-[10px] md:text-xs font-medium shrink-0 ${
                isDark
                  ? "text-gray-300 hover:bg-white/10"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
              aria-label="Toggle Language"
            >
              <Globe className="w-3 md:w-3.5 h-3 md:h-3.5" />
              <span className="hidden xs:inline">
                {language === "en" ? "EN" : "中"}
              </span>
            </button>
            <button
              onClick={() => setTheme(isDark ? "light" : "dark")}
              className={`p-1.5 md:p-2 rounded-full transition-colors cursor-pointer shrink-0 ${
                isDark ? "hover:bg-white/10" : "hover:bg-gray-100"
              }`}
              aria-label="Toggle Dark Mode"
            >
              {isDark ? (
                <Sun className="w-3.5 md:w-4 h-3.5 md:h-4 text-white" />
              ) : (
                <Moon className="w-3.5 md:w-4 h-3.5 md:h-4 text-gray-900" />
              )}
            </button>
          </div>
        </div>
      </nav>

      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-30">
        <div className="text-center px-4">
          <h1 className="text-[13vw] md:text-[12vw] lg:text-[11vw] font-black leading-[0.85] tracking-[-0.04em] transition-opacity duration-300 opacity-100 text-[#3250FE]">
            LI KO
          </h1>
          <h1 className="text-[13vw] md:text-[12vw] lg:text-[11vw] font-black leading-[0.85] tracking-[-0.04em] transition-opacity duration-300 delay-75 opacity-100 text-[#3250FE]">
            CHUANG
          </h1>
          <p
            className={`text-sm font-medium tracking-wider mt-4 ${isDark ? "text-gray-400" : "text-gray-600"}`}
          >
            {t.common.description}
          </p>
          <Link
            href="/engineer"
            className={`mt-6 inline-flex flex-col items-center gap-2 cursor-pointer transition-all hover:scale-110 pointer-events-auto relative z-30 ${
              isDark ? "text-white" : "text-gray-900"
            }`}
          >
            <span className="text-xs font-medium tracking-wider">
              {t.common.explore}
            </span>
            <ArrowDown className="w-5 h-5 animate-bounce" />
          </Link>
        </div>
      </div>

      <PhysicsBackground
        language={language}
        isDark={isDark}
        onReady={handlePhysicsReady}
      />

      {/* Loading screen sits on top of the (already-mounted) content and the
          physics scene, fading out once the tags begin to fall. */}
      <LoadingScreen fadingOut={physicsReady} />
    </main>
  );
}
