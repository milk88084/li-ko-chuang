"use client";

import { createContext, useContext, ReactNode, useCallback } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  type Locale,
  localePath,
  otherLocalePath,
} from "@/lib/locale";

// The language used to be React state backed by localStorage, which meant the
// Chinese copy existed only after hydration: every crawler, and every AI
// assistant that does not run JavaScript, saw the English page and nothing
// else. It now comes from the URL (/engineer vs /zh/engineer), so both
// languages are real pages that can be indexed, linked and cited.
//
// `language` is passed in by the route group's layout, which knows the locale
// at render time on the server — so the first HTML is already correct.

export type Language = Locale;

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined,
);

export function LanguageProvider({
  language,
  children,
}: {
  language: Language;
  children: ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  // Switching language is navigation now, not a state change: it has to change
  // the URL or the new language would not be shareable or indexable.
  const toggleLanguage = useCallback(() => {
    router.push(otherLocalePath(pathname ?? "/"));
  }, [pathname, router]);

  const setLanguage = useCallback(
    (lang: Language) => {
      if (lang === language) return;
      router.push(otherLocalePath(pathname ?? localePath(language, "")));
    },
    [language, pathname, router],
  );

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
