"use client";

import {
  createContext,
  useContext,
  ReactNode,
  useState,
  useSyncExternalStore,
  useEffect,
} from "react";

export type Language = "en" | "zh";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined,
);

interface LanguageProviderProps {
  children: ReactNode;
}

function getStoredLanguage(): Language {
  if (typeof window === "undefined") return "en";
  const savedLanguage = localStorage.getItem("language");
  return savedLanguage === "zh" ? "zh" : "en";
}

function subscribeToLanguage(callback: () => void) {
  if (typeof window === "undefined") return () => {};
  window.addEventListener("storage", callback);
  return () => window.removeEventListener("storage", callback);
}

export function LanguageProvider({ children }: LanguageProviderProps) {
  const storedLanguage = useSyncExternalStore(
    subscribeToLanguage,
    getStoredLanguage,
    () => "en" as Language,
  );

  const [language, setLanguageState] = useState<Language>(storedLanguage);

  useEffect(() => {
    setLanguageState(storedLanguage);
  }, [storedLanguage]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    if (typeof window !== "undefined") {
      localStorage.setItem("language", lang);
    }
  };

  const toggleLanguage = () => {
    const newLang = language === "en" ? "zh" : "en";
    setLanguage(newLang);
  };

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
