import { ImageResponse } from "next/og";
import { OgCard, OG_SIZE } from "@/lib/og-template";
import { siteConfig } from "@/lib/site-config";

// Generated rather than shipped as a file. The old OG image was a screenshot
// at 824x926 — nearly square, and declared in metadata as 1024x926, so both
// the ratio and the numbers were wrong.
//
// It also only ever reached the homepage: /engineer, /marketer and /creator
// each declare their own `openGraph` block, and a child segment's openGraph
// REPLACES the parent's rather than merging, which dropped `images` entirely.
// Hence one of these files per route.

export const alt = `${siteConfig.name} — ${siteConfig.description}`;
export const size = OG_SIZE;
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    <OgCard title="Li Ko Chuan" subtitle={siteConfig.description} />,
    size,
  );
}
