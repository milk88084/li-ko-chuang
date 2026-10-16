import {
  Bodoni_Moda,
  Instrument_Serif,
  Inter_Tight,
  JetBrains_Mono,
  Noto_Sans_TC,
  Noto_Serif_TC,
} from "next/font/google";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { LanguageProvider } from "@/providers/LanguageProvider";
import { FaviconSync } from "@/components/FaviconSync";
import { CustomCursor } from "@/components/CustomCursor";
import { NavigationProgress } from "@/components/NavigationProgress";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { ScrollManager } from "@/components/ScrollManager";
import { htmlLang, type Locale } from "@/lib/locale";

// The <html>/<body> shell, shared by both locale route groups.
//
// Each locale needs its OWN root layout, because `lang` sits on <html> and a
// nested layout cannot change it — a Chinese page served as lang="en" tells
// screen readers to pronounce it as English and gives search engines a signal
// that contradicts its own hreflang. Route groups are how App Router allows
// two root layouts, and this component keeps the duplication down to the
// locale itself.

// The type system: a tight sans for everything, a serif for the accent half
// of each headline, and mono for the "/ Label" kickers. globals.css chains
// each Latin face to its Traditional Chinese partner.
const interTight = Inter_Tight({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter-tight",
});

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-instrument-serif",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
  variable: "--font-jetbrains-mono",
});

// The CJK faces are large and split into many unicode-range files by Google,
// so nothing is preloaded: the browser fetches only the slices a page uses.
const notoSansTC = Noto_Sans_TC({
  display: "swap",
  preload: false,
  variable: "--font-noto-sans-tc",
});

const notoSerifTC = Noto_Serif_TC({
  display: "swap",
  preload: false,
  variable: "--font-noto-serif-tc",
});

// Used only by the about page's scroll-portrait hero, for its italic accent.
const bodoni = Bodoni_Moda({
  subsets: ["latin"],
  style: ["italic"],
  weight: ["400"],
  display: "swap",
  variable: "--font-bodoni",
});

const fontVariables = [
  interTight,
  instrumentSerif,
  jetbrainsMono,
  notoSansTC,
  notoSerifTC,
  bodoni,
]
  .map((font) => font.variable)
  .join(" ");

export function RootShell({
  locale,
  children,
}: {
  locale: Locale;
  children: React.ReactNode;
}) {
  return (
    <html
      lang={htmlLang(locale)}
      className="scroll-smooth"
      suppressHydrationWarning
    >
      {/* Remote hosts used for marketing project images — warms the connection
          (DNS + TLS) before the browser discovers the <img> tag. React
          hoists these into <head> on its own, so no <head> wrapper: an
          explicit one here trips the Pages-Router-era no-head-element
          lint rule, which cannot tell this file is part of a layout. */}
      <link rel="preconnect" href="https://images.unsplash.com" />
      <link rel="preconnect" href="https://magazine.feg.com.tw" />
      <body
        className={`${fontVariables} relative bg-bg font-sans text-ink antialiased`}
        suppressHydrationWarning
      >
        <ThemeProvider>
          <FaviconSync />
          <LanguageProvider language={locale}>
            <CustomCursor />
            <NavigationProgress />
            {/* Here rather than in each page so it stays mounted while the
                next page (or its loading state) swaps in beneath it. */}
            <SiteHeader />
            <ScrollManager />
            {children}
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
