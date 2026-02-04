import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { LanguageProvider } from "@/providers/LanguageProvider";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Li Ko Chuang | Portfolio",
  description: "Building Interfaces, Telling Stories.",
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
  authors: [{ name: "Li Ko Chuang" }],
  openGraph: {
    title: "Logic meets Emotion | Portfolio",
    description:
      "Front-end Engineer & Podcaster bridging logic and emotion. Specializing in React, Next.js, and user-centric interfaces.",
    type: "website",
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              name: "Li Ko Chuang",
              jobTitle: "Front-end Engineer",
              knowsAbout: [
                "React",
                "Next.js",
                "Marketing Strategy",
                "UI/UX",
                "Rust",
                "Podcast",
              ],
              url: "https://yourportfolio.com",
              sameAs: [
                "https://www.linkedin.com/in/yourprofile",
                "https://github.com/yourusername",
              ],
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
