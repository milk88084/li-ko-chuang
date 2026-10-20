import type { Metadata } from "next";
import { EventsPage } from "@/components/pages/EventsPage";
import { StructuredData } from "@/components/StructuredData";
import { pageMetadata } from "@/lib/page-metadata";

export const metadata: Metadata = pageMetadata("zh", "events");

export default function ZhEventsPage() {
  return (
    <>
      <StructuredData locale="zh" page="events" />
      <EventsPage locale="zh" />
    </>
  );
}
