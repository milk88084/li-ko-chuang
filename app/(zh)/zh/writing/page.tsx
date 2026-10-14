import type { Metadata } from "next";
import { WritingPage } from "@/components/pages/WritingPage";
import { StructuredData } from "@/components/StructuredData";
import { pageMetadata } from "@/lib/page-metadata";

export const metadata: Metadata = pageMetadata("zh", "writing");

// Re-fetches the latest Medium posts at most once an hour.
export const revalidate = 3600;

export default function ZhWritingPage() {
  return (
    <>
      <StructuredData page="writing" />
      <WritingPage locale="zh" />
    </>
  );
}
