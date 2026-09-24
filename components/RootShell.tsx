import { Bodoni_Moda, Inter, JetBrains_Mono } from "next/font/google";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { LanguageProvider } from "@/providers/LanguageProvider";
import { FaviconSync } from "@/components/FaviconSync";
import { htmlLang, type Locale } from "@/lib/locale";

// The <html>/<body> shell, shared by both locale route groups.
//
// Each locale needs its OWN root layout, because `lang` sits on <html> and a
// nested layout cannot change it — a Chinese page served as lang="en" tells
// screen readers to pronounce it as English and gives search engines a signal
// that contradicts its own hreflang. Route groups are how App Router allows
// two root layouts, and this component keeps the duplication down to the
// locale itself.

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

// Used only by the engineer page's scroll-portrait hero: Bodoni for the
// italic accent letter, JetBrains Mono for the code chips and spec labels.
const bodoni = Bodoni_Moda({
  subsets: ["latin"],
  style: ["italic"],
  weight: ["400"],
  display: "swap",
  variable: "--font-bodoni",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
  variable: "--font-jetbrains-mono",
});

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
      {/* Remote hosts used for CreatorView images — warms the connection
          (DNS + TLS) before the browser discovers the <img> tag. React
          hoists these into <head> on its own, so no <head> wrapper: an
          explicit one here trips the Pages-Router-era no-head-element
          lint rule, which cannot tell this file is part of a layout. */}
      <link rel="preconnect" href="https://images.unsplash.com" />
      <link rel="preconnect" href="https://magazine.feg.com.tw" />
      <body
        className={`${inter.variable} ${bodoni.variable} ${jetbrainsMono.variable} font-sans bg-[#FBFBFD] text-[#1D1D1F] dark:bg-black dark:text-[#F5F5F7] transition-colors duration-300 antialiased relative`}
        suppressHydrationWarning
      >
        <ThemeProvider>
          <FaviconSync />
          <LanguageProvider language={locale}>{children}</LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
