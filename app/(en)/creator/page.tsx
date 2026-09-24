import type { Metadata } from "next";
import { CreatorContent } from "@/components/CreatorContent";
import { StructuredData } from "@/components/StructuredData";
import { sectionMetadata } from "@/lib/page-metadata";

export const metadata: Metadata = sectionMetadata("en", "creator");

export default function CreatorPage() {
  return (
    <>
      <StructuredData page="creator" />
      <CreatorContent />
    </>
  );
}
