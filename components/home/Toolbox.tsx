"use client";

import dynamic from "next/dynamic";
import { useRef, useSyncExternalStore } from "react";
import content from "@/data/content.json";
import type { Locale } from "@/lib/locale";
import { useInView } from "@/hooks/useInView";
import { Section } from "@/components/layout/Section";
import { FigmaFrame } from "@/components/canvas/FigmaFrame";
import { SKILL_TAGS } from "./skill-tags";

// Matter.js only loads once the box is about to scroll into view, so it never
// costs the homepage's first paint.
const PhysicsPlayground = dynamic(() => import("./PhysicsPlayground"), {
  ssr: false,
});

const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";
const subscribe = (onChange: () => void) => {
  const query = window.matchMedia(REDUCED_MOTION);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
};

export function Toolbox({ locale }: { locale: Locale }) {
  const t = content[locale].home.toolbox;
  const boxRef = useRef<HTMLDivElement>(null);
  const inView = useInView(boxRef, { rootMargin: "0px 0px -25% 0px" });
  const reduceMotion = useSyncExternalStore(
    subscribe,
    () => window.matchMedia(REDUCED_MOTION).matches,
    // On the server, and for anyone without JS, the static list is the page.
    () => true,
  );

  const playing = inView && !reduceMotion;

  return (
    <Section
      label={t.label}
      title={t.title}
      aside={
        !reduceMotion && (
          <p className="font-mono text-[11px] text-muted uppercase">{t.hint}</p>
        )
      }
    >
      <FigmaFrame label={t.frameLabel} className="h-[58svh] min-h-[380px] md:h-[520px]">
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
                    tag.variant === "filled"
                      ? "bg-accent text-accent-ink"
                      : "text-accent"
                  }`}
                >
                  {tag[locale]}
                </li>
              ))}
            </ul>
          )}
        </div>
      </FigmaFrame>
    </Section>
  );
}
