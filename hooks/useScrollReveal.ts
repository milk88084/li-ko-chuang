import { useEffect, type RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Distance (px) elements travel while sliding in / out.
const SHIFT = 64;
const DURATION = 0.7;

type Offset = { x: number; y: number };

// Resolves the offset an element enters from, based on an optional
// `data-reveal` direction ("up" | "down" | "left" | "right"). Anything
// unspecified falls back to sliding up from below.
function offsetFor(el: Element): Offset {
  switch (el.getAttribute("data-reveal")) {
    case "down":
      return { x: 0, y: -SHIFT };
    case "left":
      return { x: -SHIFT, y: 0 };
    case "right":
      return { x: SHIFT, y: 0 };
    case "up":
    default:
      return { x: 0, y: SHIFT };
  }
}

// Wires one element with an entrance and a matching exit. The element slides
// in from `enter`, rests fully visible while it's on screen, then continues on
// through — sliding out in the opposite direction as it leaves the top. Every
// trigger reverses, so scrolling back up replays both phases in reverse. No
// blur anywhere — motion + opacity only.
function wire(el: HTMLElement, enter: Offset) {
  // Entry: hidden below the fold, plays as the element scrolls into view,
  // reverses back to hidden if it scrolls off the bottom again.
  gsap.from(el, {
    opacity: 0,
    x: enter.x,
    y: enter.y,
    duration: DURATION,
    ease: "power3.out",
    scrollTrigger: {
      trigger: el,
      start: "top 85%",
      toggleActions: "play none none reverse",
    },
  });

  // Exit: begins only once the element is nearly off the top, so it stays
  // fully settled for the whole middle of its pass. Travels on in the same
  // direction it arrived (opposite sign), fading out.
  gsap.to(el, {
    opacity: 0,
    x: -enter.x,
    y: -enter.y,
    duration: DURATION,
    ease: "power3.in",
    immediateRender: false,
    scrollTrigger: {
      trigger: el,
      start: "bottom 22%",
      toggleActions: "play none none reverse",
    },
  });
}

/**
 * Drives every `.reveal`, `.reveal-stagger` and `.reveal-in-section` element
 * inside `scopeRef` with GSAP ScrollTriggers — a directional slide-in on the
 * way in and a slide-out on the way out (no blur). Replaces the CSS
 * scroll-timeline reveal, which kept content blurred well past the middle of
 * the screen.
 */
export function useScrollReveal(scopeRef: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const scope = scopeRef.current;
    if (!scope) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      // Single elements: slide up in, slide up out.
      gsap.utils
        .toArray<HTMLElement>(scope.querySelectorAll(".reveal"))
        .forEach((el) => wire(el, offsetFor(el)));

      // Staggered groups: direct children alternate left / right so the list
      // unfolds with clear lateral motion, and leaves the same way.
      const groups = scope.querySelectorAll(
        ".reveal-stagger, .reveal-in-section",
      );
      groups.forEach((group) => {
        gsap.utils.toArray<HTMLElement>(group.children).forEach((child, i) => {
          const explicit = child.getAttribute("data-reveal");
          const enter = explicit
            ? offsetFor(child)
            : i % 2 === 0
              ? { x: -SHIFT, y: 0 }
              : { x: SHIFT, y: 0 };
          wire(child, enter);
        });
      });

      // Layout settles as fonts/images load; make sure triggers use final
      // positions.
      ScrollTrigger.refresh();
    }, scope);

    return () => ctx.revert();
  }, [scopeRef]);
}
