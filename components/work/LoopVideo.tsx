"use client";

import { useEffect, useRef } from "react";

// A silent screen recording that plays on a loop while it is on screen and
// pauses when it scrolls away, so a page of recordings never decodes them all
// at once. With reduced motion it stays on its first frame, with controls to
// play it by hand.

export function LoopVideo({
  src,
  width,
  height,
  label,
}: {
  src: string;
  width: number;
  height: number;
  label: string;
}) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      video.controls = true;
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) video.play().catch(() => {});
        else video.pause();
      },
      { threshold: 0.25 },
    );
    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  return (
    <video
      ref={ref}
      src={src}
      width={width}
      height={height}
      muted
      loop
      playsInline
      preload="metadata"
      aria-label={label}
      className="block h-auto w-full"
    />
  );
}
