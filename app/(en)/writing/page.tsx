import type { Metadata } from "next";
import { WritingPage } from "@/components/pages/WritingPage";
import { StructuredData } from "@/components/StructuredData";
import { pageMetadata } from "@/lib/page-metadata";

export const metadata: Metadata = pageMetadata("en", "writing");

// Re-fetches the latest Medium posts at most once an hour.
export const revalidate = 3600;

export default function EnWritingPage() {
  return (
    <>
      <StructuredData locale="en" page="writing" />
      <WritingPage locale="en" />
    </>
  );
}
