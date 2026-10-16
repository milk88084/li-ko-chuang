import type { Metadata } from "next";
import { WorkPage } from "@/components/pages/WorkPage";
import { StructuredData } from "@/components/StructuredData";
import { pageMetadata } from "@/lib/page-metadata";

export const metadata: Metadata = pageMetadata("zh", "work");

export default function ZhWorkPage() {
  return (
    <>
      <StructuredData page="work" />
      <WorkPage locale="zh" />
    </>
  );
}
