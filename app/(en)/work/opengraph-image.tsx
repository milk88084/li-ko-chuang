import { ImageResponse } from "next/og";
import content from "@/data/content.json";
import { OgCard, OG_SIZE } from "@/lib/og-template";

// Its own image because the route declares its own `openGraph`, which
// replaces the parent's wholesale — without this it has no preview at all.

const title = content.en.nav.work;
const subtitle = content.en.work.intro;

export const alt = title;
export const size = OG_SIZE;
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(<OgCard title={title} subtitle={subtitle} />, size);
}
