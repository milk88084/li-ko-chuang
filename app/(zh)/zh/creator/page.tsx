import type { Metadata } from "next";
import { CreatorContent } from "@/components/CreatorContent";
import { StructuredData } from "@/components/StructuredData";
import { sectionMetadata } from "@/lib/page-metadata";

export const metadata: Metadata = sectionMetadata("zh", "creator");

export default function ZhCreatorPage() {
  return (
    <>
      <StructuredData page="creator" />
      <CreatorContent />
    </>
  );
}
