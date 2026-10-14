// Twelve faint column guides, like a layout grid left switched on in a design
// tool. Each column is drawn as a pair of lines (its two edges) so the gutters
// read as gutters. Purely decorative and behind everything.
export function GridLines({ className = "" }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute inset-0 px-4 md:px-8 ${className}`}
    >
      <div className="grid h-full grid-cols-4 gap-4 md:grid-cols-12 md:gap-6">
        {Array.from({ length: 12 }, (_, i) => (
          <div
            key={i}
            className={`h-full border-x border-accent/10 ${i >= 4 ? "hidden md:block" : ""}`}
          />
        ))}
      </div>
    </div>
  );
}
