'use client';

import Link from 'next/link';
import { useTheme } from 'next-themes';
import { Sun, Moon, Globe } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useLanguage } from '@/providers/LanguageProvider';
import content from '@/data/content.json';

interface NavigationProps {
  currentPage: 'engineer' | 'marketer' | 'creator';
}

type ContentType = typeof content;
type LanguageKey = keyof ContentType;

export function Navigation({ currentPage }: NavigationProps) {
  const { resolvedTheme, setTheme } = useTheme();
  const { language, toggleLanguage } = useLanguage();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleThemeToggle = () => {
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
  };

  const t = content[language as LanguageKey];

  const navItems = [
    { id: 'engineer', label: t.nav.engineer, href: '/engineer' },
    { id: 'marketer', label: t.nav.marketer, href: '/marketer' },
    { id: 'creator', label: t.nav.creator, href: '/creator' },
  ];

  return (
    <nav className="fixed w-full top-0 z-50 bg-[#FBFBFD]/80 dark:bg-black/80 backdrop-blur-md border-b border-gray-100/50 dark:border-white/10 transition-all duration-300">
      <div className=" mx-auto px-6 h-16 flex items-center justify-between">
        <Link 
          href="/" 
          className="font-semibold text-sm tracking-tight text-gray-900 dark:text-white hover:opacity-70 transition-opacity"
        >
          {t.common.portfolio}
        </Link>

        <div className="flex items-center gap-2 md:gap-4">
          {/* Page Switcher */}
          <div className="flex items-center bg-gray-100 dark:bg-white/10 p-1 rounded-lg">
            {navItems.map((item) => (
              <Link
                key={item.id}
                href={item.href}
                className={`px-2 md:px-3 py-1.5 text-xs font-medium rounded-md transition-all duration-200 ${
                  currentPage === item.id
                    ? 'bg-white dark:bg-gray-700 shadow-sm text-gray-900 dark:text-white'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Language Toggle */}
          <button
            onClick={toggleLanguage}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 transition-colors text-xs font-medium text-gray-600 dark:text-gray-300"
            aria-label="Toggle Language"
          >
            <Globe className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{language === 'en' ? 'EN' : '中'}</span>
          </button>

          {/* Theme Toggle */}
          <button
            onClick={handleThemeToggle}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
            aria-label="Toggle Dark Mode"
          >
            {mounted && resolvedTheme === 'dark' ? (
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
