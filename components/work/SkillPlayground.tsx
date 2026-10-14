"use client";

import dynamic from "next/dynamic";
import { useRef, useSyncExternalStore } from "react";
import type { Locale } from "@/lib/locale";
import { useInView } from "@/hooks/useInView";
import { FigmaFrame } from "@/components/canvas/FigmaFrame";
import { SKILL_TAGS } from "./skill-tags";

// The skill tags inside a selection frame: a physics toy once the frame is on
// screen, a plain list before that, on the server, and for reduced motion.
// Matter.js is only fetched when the toy actually starts.
const PhysicsPlayground = dynamic(() => import("./PhysicsPlayground"), {
  ssr: false,
});

const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";
const subscribe = (onChange: () => void) => {
  const query = window.matchMedia(REDUCED_MOTION);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
};

export function useReducedMotion() {
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(REDUCED_MOTION).matches,
    // On the server, and for anyone without JS, the static list is the page.
    () => true,
  );
}

export function SkillPlayground({
  locale,
  frameLabel,
  className = "",
}: {
  locale: Locale;
  frameLabel: string;
  className?: string;
}) {
  const boxRef = useRef<HTMLDivElement>(null);
  const inView = useInView(boxRef, { rootMargin: "0px" });
  const reduceMotion = useReducedMotion();
  const playing = inView && !reduceMotion;

  return (
    <FigmaFrame label={frameLabel} className={className}>
      <div ref={boxRef} className="absolute inset-0">
        {playing ? (
          <PhysicsPlayground locale={locale} />
        ) : (
          <ul
            className={`flex h-full flex-wrap content-end items-end justify-center gap-2 p-6 transition-opacity ${
              reduceMotion ? "" : "opacity-0"
            }`}
          >
            {SKILL_TAGS.map((tag) => (
              <li
                key={tag.id}
                className={`rounded-full border-[1.5px] border-accent px-4 py-2 text-[13px] ${
                  tag.variant === "filled" ? "bg-accent text-accent-ink" : "text-accent"
                }`}
              >
                {tag[locale]}
              </li>
            ))}
          </ul>
        )}
      </div>
    </FigmaFrame>
  );
}
