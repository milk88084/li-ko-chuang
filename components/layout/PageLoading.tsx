import { GridLines } from "@/components/canvas/GridLines";

// Shown by loading.tsx while the next page is on its way. It covers the
// viewport below the (persistent) header rather than flowing in the page, so
// it sits in the middle of the screen whatever the previous page was scrolled
// to. The frame, mono label and sliding bar borrow the design-tool look of the
// rest of the site.

const CORNERS = [
  "-top-1 -left-1",
  "-top-1 -right-1",
  "-bottom-1 -left-1",
  "-bottom-1 -right-1",
] as const;

export function PageLoading() {
  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed inset-x-0 top-(--header-h) bottom-0 z-40 flex items-center justify-center bg-bg"
    >
      <GridLines />
      <div className="relative w-[min(72vw,280px)] border border-accent px-6 pt-8 pb-6">
        {CORNERS.map((pos) => (
          <span
            key={pos}
            aria-hidden
            className={`absolute size-2 border border-accent bg-bg ${pos}`}
          />
        ))}
        <span className="absolute -top-6 left-0 font-mono text-[11px] text-accent">
          Frame · Loading
        </span>
        <p className="font-mono text-[12px] tracking-[0.08em] text-muted uppercase">
          Loading
          <span className="motion-safe:animate-pulse">…</span>
        </p>
        <div className="mt-4 h-[2px] overflow-hidden bg-line">
          <div className="h-full w-1/3 bg-accent motion-safe:animate-[loading-bar_1.1s_ease-in-out_infinite] motion-reduce:w-full" />
        </div>
      </div>
    </div>
  );
}
