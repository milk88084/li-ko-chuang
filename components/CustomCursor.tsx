"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { usePathname } from "next/navigation";
import content from "@/data/content.json";
import { useLanguage } from "@/providers/LanguageProvider";

// A blue dot that replaces the system pointer and changes shape with what is
// under it: a ring over links, a labelled disc over project cards ("View")
// and physics tags ("Drag"), a thin bar over running text.
//
// Opt-in from markup: any element can set `data-cursor="view" | "drag" |
// "text" | "none"`; otherwise links and buttons get the ring and text blocks
// the bar. Only mounted on a fine pointer — on touch there is no pointer to
// replace — and never on /studio, which is a working tool, not a showcase.

type CursorState = "default" | "link" | "view" | "drag" | "text" | "hidden";

const FINE_POINTER = "(pointer: fine)";
const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";

const LINK_SELECTOR = "a, button, [role='button'], label, summary, select";
const TEXT_SELECTOR = "p, h1, h2, h3, h4, h5, h6, li, blockquote, dd, dt";
const FIELD_SELECTOR = "input, textarea, select, [contenteditable='true']";

function stateFor(target: Element | null): CursorState {
  if (!target) return "default";
  if (target.closest(FIELD_SELECTOR)) return "hidden";

  const explicit = target.closest<HTMLElement>("[data-cursor]");
  if (explicit) {
    const value = explicit.dataset.cursor;
    if (value === "view" || value === "drag" || value === "text") return value;
    if (value === "none") return "hidden";
  }

  if (target.closest(LINK_SELECTOR)) return "link";
  if (target.closest(TEXT_SELECTOR)) return "text";
  return "default";
}

const subscribeToPointer = (onChange: () => void) => {
  const query = window.matchMedia(FINE_POINTER);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
};

function useFinePointer() {
  return useSyncExternalStore(
    subscribeToPointer,
    () => window.matchMedia(FINE_POINTER).matches,
    () => false,
  );
}

const SIZE: Record<CursorState, { w: number; h: number }> = {
  default: { w: 12, h: 12 },
  link: { w: 44, h: 44 },
  view: { w: 84, h: 84 },
  drag: { w: 64, h: 64 },
  text: { w: 2, h: 26 },
  hidden: { w: 12, h: 12 },
};

export function CustomCursor() {
  const pathname = usePathname();
  const finePointer = useFinePointer();
  const enabled = finePointer && !pathname?.startsWith("/studio");

  if (!enabled) return null;
  return <Cursor />;
}

function Cursor() {
  const { language } = useLanguage();
  const labels = content[language].cursor;
  const pathname = usePathname();
  const outerRef = useRef<HTMLDivElement>(null);
  // The state is only re-read on pointer moves, so a page swapped in under a
  // resting pointer would keep the old card's "View" disc. Each state remembers
  // the page it was read on and falls back to the plain dot on any other.
  const [reading, setReading] = useState<{ state: CursorState; on: string | null }>({
    state: "hidden",
    on: null,
  });
  const state: CursorState =
    reading.on === pathname || reading.state === "hidden" ? reading.state : "default";
  const setState = (next: CursorState) =>
    setReading({ state: next, on: window.location.pathname });

  useEffect(() => {
    const root = document.documentElement;
    root.classList.add("has-custom-cursor");

    const reduceMotion = window.matchMedia(REDUCED_MOTION).matches;
    // How far the dot closes on the pointer each frame. 1 = pinned to it.
    const follow = reduceMotion ? 1 : 0.28;

    const target = { x: -100, y: -100 };
    const current = { x: -100, y: -100 };
    let seen = false;
    let frame = 0;

    const tick = () => {
      current.x += (target.x - current.x) * follow;
      current.y += (target.y - current.y) * follow;
      const el = outerRef.current;
      if (el) {
        el.style.transform = `translate3d(${current.x}px, ${current.y}px, 0)`;
      }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);

    const onMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      target.x = event.clientX;
      target.y = event.clientY;
      if (!seen) {
        // Jump straight to the first position instead of sliding in from
        // the corner.
        current.x = target.x;
        current.y = target.y;
        seen = true;
      }
      setState(stateFor(event.target as Element));
    };

    const onLeave = () => setState("hidden");

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    window.addEventListener("blur", onLeave);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("blur", onLeave);
      root.classList.remove("has-custom-cursor");
    };
  }, []);

  const size = SIZE[state];
  const filled = state === "default" || state === "view" || state === "drag";
  const label =
    state === "view" ? labels.view : state === "drag" ? labels.drag : "";

  return (
    <div
      ref={outerRef}
      aria-hidden
      className="pointer-events-none fixed top-0 left-0 z-[100]"
      style={{ transform: "translate3d(-100px, -100px, 0)" }}
    >
      <div
        className={`flex -translate-x-1/2 -translate-y-1/2 items-center justify-center font-mono text-[11px] tracking-wide text-accent-ink uppercase transition-[width,height,opacity,background-color,border-color,border-radius] duration-300 ease-out motion-reduce:transition-none ${
          state === "text" ? "rounded-[1px]" : "rounded-full"
        } ${filled || state === "text" ? "bg-accent" : "bg-transparent"} ${
          state === "link" ? "border-[1.5px] border-accent" : "border-0"
        } ${state === "hidden" ? "opacity-0" : "opacity-100"}`}
        style={{ width: size.w, height: size.h }}
      >
        {label}
      </div>
    </div>
  );
}
