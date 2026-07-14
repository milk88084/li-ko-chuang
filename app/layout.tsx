import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { LanguageProvider } from "@/providers/LanguageProvider";
import { siteConfig } from "@/lib/site-config";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const ogDescription =
  "Front-end Engineer & Podcaster bridging logic and emotion. Specializing in React, Next.js, and user-centric interfaces.";

export const metadata: Metadata = {
  // Lets every child route use a relative `alternates.canonical` / OG image
  // path instead of hard-coding the domain everywhere.
  metadataBase: new URL(siteConfig.siteUrl),
  title: {
    default: siteConfig.title,
    // Child routes only need to set `title: "Engineer"` and this renders
    // "Engineer | Li Ko Chuang".
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: "/favicon.ico",
  },
  keywords: [
    "React",
    "Next.js",
    "Marketing Strategy",
    "UI/UX",
    "Rust",
    "Frontend Engineer",
    "Podcast",
  ],
  authors: [{ name: siteConfig.name }],
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
    },
  },
  openGraph: {
    title: "Logic meets Emotion | Portfolio",
    description: ogDescription,
    type: "website",
    url: siteConfig.siteUrl,
    siteName: siteConfig.name,
    images: [{ url: siteConfig.ogImage, width: 1024, height: 926 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Logic meets Emotion | Portfolio",
    description: ogDescription,
    images: [siteConfig.ogImage],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <head>
        {/* Remote hosts used for CreatorView images — warms the connection
            (DNS + TLS) before the browser discovers the <img> tag. */}
        <link rel="preconnect" href="https://images.unsplash.com" />
        <link rel="preconnect" href="https://magazine.feg.com.tw" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              name: siteConfig.name,
              jobTitle: "Front-end Engineer",
              knowsAbout: [
                "React",
                "Next.js",
                "Marketing Strategy",
                "UI/UX",
                "Rust",
                "Podcast",
              ],
              url: siteConfig.siteUrl,
              sameAs: [siteConfig.social.linkedin, siteConfig.social.github],
            }),
          }}
        />
      </head>
      <body
        className={`${inter.variable} font-sans bg-[#FBFBFD] text-[#1D1D1F] dark:bg-black dark:text-[#F5F5F7] transition-colors duration-300 antialiased relative`}
        suppressHydrationWarning
      >
        <ThemeProvider>
          <LanguageProvider>{children}</LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
