"use client";

import { useLayoutEffect } from "react";
import { usePathname } from "next/navigation";

// Where each page opens. Next.js scrolls a new page to the top only some of
// the time — not when just a dynamic param changes (/work/aras → /work/retep),
// and GSAP ScrollTrigger's refreshes could then drag the reader back down —
// and it never restores the position on Back/Forward, because the browser
// restores it at popstate, before the previous page has rendered. So this
// takes it over: a link opens a page at the top, Back/Forward return to
// where the reader left it.

const saved = new Map<string, number>();
let shownPath: string | null = null;
let lastPopState = 0;

// Note the position of the page being left before anything scrolls it: on a
// click (any link) and on Back/Forward. Registered as the module loads, so it
// runs ahead of the router's own popstate handler, which renders the other
// page straight away.
if (typeof window !== "undefined") {
  history.scrollRestoration = "manual";
  const remember = () => {
    if (shownPath !== null) saved.set(shownPath, window.scrollY);
  };
  document.addEventListener("click", remember, true);
  window.addEventListener("popstate", () => {
    remember();
    lastPopState = Date.now();
  });
}

export function ScrollManager() {
  const pathname = usePathname();

  useLayoutEffect(() => {
    const first = shownPath === null;
    if (shownPath === pathname) return;
    shownPath = pathname;
    if (first) return;

    if (Date.now() - lastPopState > 1000) {
      window.scrollTo({ top: 0, behavior: "instant" });
      return;
    }

    // Back/Forward: the page may still be growing (images, late sections),
    // so keep trying until it is tall enough, for up to a second.
    const target = saved.get(pathname) ?? 0;
    const start = performance.now();
    let raf = 0;
    const restore = () => {
      window.scrollTo({ top: target, behavior: "instant" });
      if (
        Math.abs(window.scrollY - target) >= 1 &&
        performance.now() - start < 1000
      ) {
        raf = requestAnimationFrame(restore);
      }
    };
    restore();
    return () => cancelAnimationFrame(raf);
  }, [pathname]);

  return null;
}
