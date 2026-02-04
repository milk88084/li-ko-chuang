"use client";

import Link from "next/link";
import Image from "next/image";
import { useTheme } from "next-themes";
import { Sun, Moon, Globe } from "lucide-react";
import { useSyncExternalStore } from "react";
import { useLanguage } from "@/providers/LanguageProvider";
import content from "@/data/content.json";

const emptySubscribe = () => () => {};
function useIsMounted() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );
}

interface NavigationProps {
  currentPage: "engineer" | "marketer" | "creator";
}

type ContentType = typeof content;
type LanguageKey = keyof ContentType;

export function Navigation({ currentPage }: NavigationProps) {
  const isMounted = useIsMounted();
  const { resolvedTheme, setTheme } = useTheme();
  const { language, toggleLanguage } = useLanguage();

  const handleThemeToggle = () => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  };

  const t = content[language as LanguageKey];

  const navItems = [
    { id: "engineer", label: t.nav.engineer, href: "/engineer" },
    { id: "marketer", label: t.nav.marketer, href: "/marketer" },
    { id: "creator", label: t.nav.creator, href: "/creator" },
  ];

  return (
    <nav className="fixed w-full top-0 z-50 bg-[#FBFBFD]/80 dark:bg-black/80 backdrop-blur-md border-b border-gray-100/50 dark:border-white/10 transition-all duration-300">
      <div className=" mx-auto px-6 h-16 flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center hover:opacity-70 transition-opacity"
        >
          <Image
            src="/favicon.ico"
            alt="Logo"
            width={32}
            height={32}
            className="rounded-lg shadow-sm"
          />
        </Link>

        <div className="flex items-center gap-2 md:gap-4">
          <div className="flex items-center bg-gray-100 dark:bg-white/10 p-1 rounded-lg">
            {navItems.map((item) => (
              <Link
                key={item.id}
                href={item.href}
                className={`px-2 md:px-3 py-1.5 text-xs font-medium rounded-md transition-all duration-200 ${
                  currentPage === item.id
                    ? "bg-white dark:bg-gray-700 shadow-sm text-gray-900 dark:text-white"
                    : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>

          <button
            onClick={toggleLanguage}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 transition-colors text-xs font-medium text-gray-600 dark:text-gray-300"
            aria-label="Toggle Language"
          >
            <Globe className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">
              {language === "en" ? "EN" : "中"}
            </span>
          </button>

          <button
            onClick={handleThemeToggle}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
            aria-label="Toggle Dark Mode"
          >
            {isMounted && resolvedTheme === "dark" ? (
              <Sun className="w-4 h-4 text-white" />
            ) : (
              <Moon className="w-4 h-4 text-gray-900" />
            )}
          </button>
        </div>
      </div>
    </nav>
  );
}
