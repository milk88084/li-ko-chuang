import { ImageResponse } from "next/og";
import { OgCard, OG_SIZE } from "@/lib/og-template";
import { siteConfig } from "@/lib/site-config";

// The Chinese homepage is its own route segment, so it needs its own image —
// app/(en)/opengraph-image.tsx only covers "/".

export const alt = `${siteConfig.name} — 建構介面，訴說故事。`;
export const size = OG_SIZE;
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    <OgCard title="李珂荘 / Li Ko Chuan" subtitle="建構介面，訴說故事。" />,
    size,
  );
}
