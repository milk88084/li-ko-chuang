"use client";

import { useRef } from "react";
import { framePath } from "@/lib/scroll-portrait";

// The hero's portrait. At rest it is the front-facing first frame of the
// about page's turn sequence; moving the pointer across it from left to right
// turns it toward a side profile. Frames are fetched on first hover only, so
// the homepage pays for one small image until someone shows interest.

/** Frame 96 of the sequence is a clean side profile. */
const LAST_FRAME = 96;

export function PortraitFrame({ alt }: { alt: string }) {
  const imgRef = useRef<HTMLImageElement>(null);
  const preloaded = useRef(false);
  const shown = useRef(0);

  const show = (index: number) => {
    if (index === shown.current || !imgRef.current) return;
    shown.current = index;
    imgRef.current.src = framePath(index);
  };

  const preload = () => {
    if (preloaded.current) return;
    preloaded.current = true;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    for (let i = 1; i <= LAST_FRAME; i++) {
      const img = new Image();
      img.src = framePath(i);
    }
  };

  return (
    <div
      className="absolute inset-0 overflow-hidden bg-[#ECEDF1]"
      onPointerEnter={preload}
      onPointerMove={(event) => {
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
        const box = event.currentTarget.getBoundingClientRect();
        const x = Math.min(1, Math.max(0, (event.clientX - box.left) / box.width));
        show(Math.round(x * LAST_FRAME));
      }}
      onPointerLeave={() => show(0)}
    >
      {/* eslint-disable-next-line @next/next/no-img-element -- the src is
          swapped by hand on every pointer move; next/image would refetch
          through the optimiser each time. */}
      <img
        ref={imgRef}
        src={framePath(0)}
        alt={alt}
        width={1280}
        height={720}
        fetchPriority="high"
        className="h-full w-full origin-[50%_8%] scale-[1.75] object-cover"
        draggable={false}
      />
    </div>
  );
}
