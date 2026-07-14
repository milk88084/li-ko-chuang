import type { Metadata } from "next";
import content from "@/data/content.json";
import { CreatorContent } from "@/components/CreatorContent";

const hero = content.en.creator.hero;

export const metadata: Metadata = {
  title: "Creator",
  description: hero.descriptionSub,
  alternates: { canonical: "/creator" },
  openGraph: {
    title: `${hero.title} ${hero.titleHighlight}`,
    description: hero.descriptionSub,
    url: "/creator",
  },
};

export default function CreatorPage() {
  return <CreatorContent />;
}
