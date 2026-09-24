import type { Metadata } from "next";
import { HomeView } from "@/components/HomeView";
import { StructuredData } from "@/components/StructuredData";
import { homeMetadata } from "@/lib/page-metadata";

export const metadata: Metadata = homeMetadata("zh");

export default function ZhHomePage() {
  return (
    <>
      <StructuredData page="home" />
      <HomeView />
    </>
  );
}
