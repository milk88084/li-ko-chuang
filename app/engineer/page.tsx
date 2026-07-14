import type { Metadata } from "next";
import content from "@/data/content.json";
import { EngineerContent } from "@/components/EngineerContent";

const hero = content.en.engineer.hero;

export const metadata: Metadata = {
  title: "Engineer",
  description: hero.descriptionSub,
  alternates: { canonical: "/engineer" },
  openGraph: {
    title: `${hero.title} ${hero.titleHighlight}`,
    description: hero.descriptionSub,
    url: "/engineer",
  },
};

export default function EngineerPage() {
  return <EngineerContent />;
}
