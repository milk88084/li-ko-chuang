import type { Metadata } from "next";
import { MarketerContent } from "@/components/MarketerContent";
import { StructuredData } from "@/components/StructuredData";
import { sectionMetadata } from "@/lib/page-metadata";

export const metadata: Metadata = sectionMetadata("zh", "marketer");

export default function ZhMarketerPage() {
  return (
    <>
      <StructuredData page="marketer" />
      <MarketerContent />
    </>
  );
}
