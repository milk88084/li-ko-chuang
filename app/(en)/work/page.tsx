import type { Metadata } from "next";
import { WorkPage } from "@/components/pages/WorkPage";
import { StructuredData } from "@/components/StructuredData";
import { pageMetadata } from "@/lib/page-metadata";

export const metadata: Metadata = pageMetadata("en", "work");

export default function EnWorkPage() {
  return (
    <>
      <StructuredData locale="en" page="work" />
      <WorkPage locale="en" />
    </>
  );
}
