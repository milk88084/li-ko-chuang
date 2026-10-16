"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

// A selection box as a design tool draws one: a hairline in the accent colour,
// square handles on the corners, the frame's name above and its live pixel
// size below. The size is measured, not typed, so it is always true.
export function FigmaFrame({
  label,
  children,
  className = "",
  showSize = true,
}: {
  label: string;
  children?: ReactNode;
  className?: string;
  showSize?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState<{ w: number; h: number } | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || !showSize) return;
    const observer = new ResizeObserver(([entry]) => {
      const box = entry.contentRect;
      setSize({ w: Math.round(box.width), h: Math.round(box.height) });
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, [showSize]);

  return (
    <div ref={ref} className={`relative border border-accent ${className}`}>
      <span className="absolute -top-6 left-0 font-mono text-[11px] whitespace-nowrap text-accent">
        {label}
      </span>

      {(["-top-1 -left-1", "-top-1 -right-1", "-bottom-1 -left-1", "-bottom-1 -right-1"] as const).map(
        (pos) => (
          <span
            key={pos}
            aria-hidden
            className={`absolute z-10 size-2 border border-accent bg-bg ${pos}`}
          />
        ),
      )}

      {children}

      {showSize && size && (
        <span
          aria-hidden
          className="absolute -bottom-7 left-1/2 -translate-x-1/2 rounded-[3px] bg-accent px-1.5 py-0.5 font-mono text-[11px] whitespace-nowrap text-accent-ink"
        >
          {size.w} × {size.h}
        </span>
      )}
    </div>
  );
}
