import type { Metadata } from "next";
import "../globals.css";
import { RootShell } from "@/components/RootShell";
import { homeMetadata } from "@/lib/page-metadata";
import { siteConfig } from "@/lib/site-config";

// Chinese root layout. Its counterpart is app/(en)/layout.tsx — see
// components/RootShell for why each locale needs a root layout of its own.

export const metadata: Metadata = {
  // Lets every child route use a relative `alternates.canonical` / OG image
  // path instead of hard-coding the domain everywhere.
  metadataBase: new URL(siteConfig.siteUrl),
  title: {
    default: siteConfig.title,
    // Child routes only need to set `title: "Engineer"` and this renders
    // "Engineer | Li Ko Chuan"; the Chinese pages set their own.
    template: `%s | ${siteConfig.name}`,
  },
  // Day-mode default; FaviconSync swaps to the white icon at night.
  icons: { icon: "/favicon_black.ico" },
  keywords: ["React", "Next.js", "前端工程師", "UI/UX", "行銷企劃", "Podcast"],
  authors: [{ name: siteConfig.name }],
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  ...homeMetadata("zh"),
};

export default function ZhLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <RootShell locale="zh">{children}</RootShell>;
}
