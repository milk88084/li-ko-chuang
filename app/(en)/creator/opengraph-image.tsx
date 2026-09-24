import { ImageResponse } from "next/og";
import content from "@/data/content.json";
import { OgCard, OG_SIZE } from "@/lib/og-template";

// Own image because this route declares its own `openGraph`, which replaces
// the parent's wholesale — without this the page has no preview image at all.

const hero = content.en.creator.hero;

export const alt = `${hero.title} ${hero.titleHighlight}`;
export const size = OG_SIZE;
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    <OgCard
      title={`${hero.title} ${hero.titleHighlight}`}
      subtitle={hero.descriptionSub}
    />,
    size,
  );
}
