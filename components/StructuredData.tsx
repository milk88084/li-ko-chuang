import {
  structuredData,
  type StructuredDataPage,
} from "@/lib/structured-data";

/**
 * Emits one JSON-LD @graph for the page it sits on. Lives on the page rather
 * than in the root layout because the graph is page-specific — the breadcrumb
 * trail and the two iOS apps only belong on the routes that show them.
 */
export function StructuredData(props: StructuredDataPage) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(structuredData(props)),
      }}
    />
  );
}
