import type { Metadata } from "next";
import { EngineerContent } from "@/components/EngineerContent";
import { StructuredData } from "@/components/StructuredData";
import { sectionMetadata } from "@/lib/page-metadata";

export const metadata: Metadata = sectionMetadata("en", "engineer");

export default function EngineerPage() {
  return (
    <>
      <StructuredData page="engineer" />
      <EngineerContent />
    </>
  );
}
