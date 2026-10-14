import type { Metadata } from "next";
import { AboutPage } from "@/components/pages/AboutPage";
import { StructuredData } from "@/components/StructuredData";
import { pageMetadata } from "@/lib/page-metadata";

export const metadata: Metadata = pageMetadata("en", "about");

export default function EnAboutPage() {
  return (
    <>
      <StructuredData page="about" />
      <AboutPage locale="en" />
    </>
  );
}
