import type { Metadata } from "next";
import content from "@/data/content.json";
import { MarketerContent } from "@/components/MarketerContent";

const hero = content.en.marketer.hero;

export const metadata: Metadata = {
  title: "Marketer",
  description: hero.descriptionSub,
  alternates: { canonical: "/marketer" },
  openGraph: {
    title: `${hero.title} ${hero.titleHighlight}`,
    description: hero.descriptionSub,
    url: "/marketer",
  },
};

export default function MarketerPage() {
  return <MarketerContent />;
}
