"use client";

import { useEffect } from "react";

// Next.js scrolls to the top when the route itself changes, but not when only
// a dynamic param does: going from /work/aras to /work/retep through "Next
// project" kept the old scroll position, so the new project opened at its
// footer. Rendered with the param as its key, this puts the new page at the
// top — except after Back/Forward, where the browser restores the position
// the reader left.

let lastPopState = 0;
if (typeof window !== "undefined") {
  window.addEventListener("popstate", () => {
    lastPopState = Date.now();
  });
}

export function ScrollReset() {
  useEffect(() => {
    if (Date.now() - lastPopState < 1000) return;
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);
  return null;
}
