"use client";

import { useEffect, useMemo, useRef } from "react";

// A paragraph whose words darken one after another as it scrolls up through
// the viewport, so the scroll position reads as a reading cursor. The server
// HTML is plain, fully dark text; only after mount are the unread words dimmed,
// and with reduced motion they never are.

const CJK = /[　-〿㐀-鿿＀-￯]/;
const DIM = 0.18;

export function ScrubText({
  text,
  className = "",
}: {
  text: string;
  className?: string;
}) {
  const ref = useRef<HTMLParagraphElement>(null);
  const words = useMemo(
    () =>
      CJK.test(text)
        ? Array.from(text)
        : text.split(/(\s+)/).filter(Boolean),
    [text],
  );

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const spans = Array.from(el.querySelectorAll<HTMLElement>("[data-w]"));
    let frame = 0;

    const update = () => {
      frame = 0;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      // 0 when the paragraph's top reaches 85% of the viewport, 1 when its
      // bottom reaches 45% — fully read a little above the middle.
      const start = vh * 0.85;
      const end = vh * 0.45;
      const total = rect.height + (start - end);
      const progress = Math.min(1, Math.max(0, (start - rect.top) / total));
      const lit = progress * spans.length;
      spans.forEach((span, i) => {
        const amount = Math.min(1, Math.max(0, lit - i));
        span.style.opacity = String(DIM + (1 - DIM) * amount);
      });
    };

    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [words]);

  return (
    <p ref={ref} className={className}>
      {words.map((word, i) =>
        /^\s+$/.test(word) ? (
          <span key={i}>{word}</span>
        ) : (
          <span key={i} data-w className="transition-opacity duration-150">
            {word}
          </span>
        ),
      )}
    </p>
  );
}
