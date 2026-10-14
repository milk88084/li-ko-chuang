import { useEffect, type RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Distance (px) elements travel while sliding in.
const SHIFT = 32;
const DURATION = 0.8;

type Offset = { x: number; y: number };

// Resolves the offset an element enters from, based on an optional
// `data-reveal` direction ("up" | "down" | "left" | "right"). Anything
// unspecified falls back to rising from below.
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

// Wires one element to fade and slide in as it scrolls into view. It plays
// once and stays: content that disappears again as you read past it makes a
// page harder to scan, not easier.
function wire(el: HTMLElement, enter: Offset, delay = 0) {
  gsap.from(el, {
    opacity: 0,
    x: enter.x,
    y: enter.y,
    duration: DURATION,
    delay,
    ease: "power3.out",
    scrollTrigger: {
      trigger: el,
      start: "top 90%",
      once: true,
    },
  });
}

/**
 * Drives every `.reveal` element, and the children of every `.reveal-stagger`
 * group, inside `scopeRef` with a one-time GSAP ScrollTrigger entrance.
 */
export function useScrollReveal(scopeRef: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const scope = scopeRef.current;
    if (!scope) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      gsap.utils
        .toArray<HTMLElement>(scope.querySelectorAll(".reveal"))
        .forEach((el) => wire(el, offsetFor(el)));

      // Groups: direct children rise in one after another.
      scope.querySelectorAll(".reveal-stagger").forEach((group) => {
        gsap.utils
          .toArray<HTMLElement>(group.children)
          .forEach((child, i) => wire(child, offsetFor(child), i * 0.08));
      });
    }, scope);

    // Trigger positions are captured from the layout as it stands right now —
    // but Next/Image lazy-loads the photos further down the page and every one
    // of them shifts everything below it. Without a recompute an entrance can
    // fire late or, near the bottom, never. A ResizeObserver on the
    // page catches every such height change (images, async content, fonts)
    // and re-measures; the rAF debounce collapses bursts into one refresh.
    let raf = 0;
    const refresh = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => ScrollTrigger.refresh());
    };

    // Observe the scope element itself (the <main> wrapping every section):
    // its height grows as content below loads, whereas <html>/<body> stay
    // pinned to the viewport and wouldn't fire.
    const ro = new ResizeObserver(refresh);
    ro.observe(scope);

    window.addEventListener("load", refresh);
    document.fonts?.ready.then(refresh).catch(() => {});

    // Belt-and-suspenders: web-font reflow and other post-mount settling don't
    // always change the scope's measured height (so the observer stays quiet),
    // yet they still move trigger points. A section whose entry
    // start ends up just past the page's max scroll — the final one especially
    // — would then never fire and sit invisible. These staggered refreshes
    // guarantee a recompute once the layout has stopped moving.
    const timers = [200, 600, 1200, 2500].map((ms) =>
      window.setTimeout(refresh, ms),
    );

    return () => {
      cancelAnimationFrame(raf);
      timers.forEach(clearTimeout);
      ro.disconnect();
      window.removeEventListener("load", refresh);
      ctx.revert();
    };
  }, [scopeRef]);
}
