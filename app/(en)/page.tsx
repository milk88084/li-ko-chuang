import type { Metadata } from "next";
import { HomePage } from "@/components/home/HomePage";
import { StructuredData } from "@/components/StructuredData";
import { homeMetadata } from "@/lib/page-metadata";

export const metadata: Metadata = homeMetadata("en");

// Re-fetches the latest Medium posts at most once an hour.
export const revalidate = 3600;

export default function EnHome() {
  return (
    <>
      <StructuredData locale="en" page="home" />
      <HomePage locale="en" />
    </>
  );
}
