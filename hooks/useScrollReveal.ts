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

// Wires one element with an entrance and (optionally) a matching exit. The
// element slides in from `enter`, rests fully visible while it's on screen,
// then continues on through — sliding out in the opposite direction as it
// leaves the top. Every trigger reverses, so scrolling back up replays both
// phases in reverse. No blur anywhere — motion + opacity only.
//
// `withExit` defaults on, but the final section on the page passes false: it
// can never scroll past the top, so an exit would just leave it faded out at
// the bottom of the page with no way to scroll it back.
function wire(el: HTMLElement, enter: Offset, withExit = true) {
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

  if (!withExit) return;

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
      // `.reveal-in-section` is only ever the last section on the page, which
      // gets an entry but NO exit — nothing scrolls past it, so an exit would
      // strand it faded out at the bottom.
      const groups = scope.querySelectorAll(
        ".reveal-stagger, .reveal-in-section",
      );
      groups.forEach((group) => {
        const withExit = !group.classList.contains("reveal-in-section");
        gsap.utils.toArray<HTMLElement>(group.children).forEach((child, i) => {
          const explicit = child.getAttribute("data-reveal");
          const enter = explicit
            ? offsetFor(child)
            : i % 2 === 0
              ? { x: -SHIFT, y: 0 }
              : { x: SHIFT, y: 0 };
          wire(child, enter, withExit);
        });
      });
    }, scope);

    // Trigger start/end positions are captured from the layout as it stands
    // right now — but Next/Image lazy-loads the photos further down the page
    // and MediumArticles streams in async, and every one of those shifts
    // everything below it. Without a recompute the exits fire early and
    // content vanishes while still fully on screen. A ResizeObserver on the
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
    // yet they still move trigger start/end points. A section whose entry
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
