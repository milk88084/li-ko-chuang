import type { Metadata } from "next";
import { AboutPage } from "@/components/pages/AboutPage";
import { StructuredData } from "@/components/StructuredData";
import { pageMetadata } from "@/lib/page-metadata";

export const metadata: Metadata = pageMetadata("zh", "about");

export default function ZhAboutPage() {
  return (
    <>
      <StructuredData page="about" />
      <AboutPage locale="zh" />
    </>
  );
}
