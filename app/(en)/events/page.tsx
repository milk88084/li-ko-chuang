import type { Metadata } from "next";
import { EventsPage } from "@/components/pages/EventsPage";
import { StructuredData } from "@/components/StructuredData";
import { pageMetadata } from "@/lib/page-metadata";

export const metadata: Metadata = pageMetadata("en", "events");

export default function EnEventsPage() {
  return (
    <>
      <StructuredData locale="en" page="events" />
      <EventsPage locale="en" />
    </>
  );
}
