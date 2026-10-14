"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

// A thin accent bar across the top of the window from the moment an internal
// link is clicked until the new page's URL is in place. loading.tsx only
// appears once the router knows what it is waiting for (after a round trip,
// longer in dev), so this is what makes the click itself feel answered.
//
// The bar records the path it started from; reaching any other path ends it,
// so arriving needs no effect to reset it.

function isInternalNavigation(event: MouseEvent, current: string) {
  if (event.defaultPrevented || event.button !== 0) return false;
  if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return false;

  const anchor = (event.target as Element | null)?.closest("a");
  if (!anchor || !anchor.href || anchor.target === "_blank" || anchor.hasAttribute("download")) {
    return false;
  }

  const url = new URL(anchor.href, location.href);
  if (url.origin !== location.origin) return false;
  // Same page, or only the hash changes (e.g. "#contact"): nothing to wait for.
  return url.pathname !== current;
}

export function NavigationProgress() {
  const pathname = usePathname() ?? "/";
  const [startedOn, setStartedOn] = useState<string | null>(null);
  const active = startedOn === pathname;

  useEffect(() => {
    let timeout = 0;
    const onClick = (event: MouseEvent) => {
      if (!isInternalNavigation(event, location.pathname)) return;
      setStartedOn(location.pathname);
      // A navigation that never lands (offline, aborted) must not leave the
      // bar up forever.
      clearTimeout(timeout);
      timeout = window.setTimeout(() => setStartedOn(null), 15000);
    };
    // Back/forward lands on a page without a click; returning to the page a
    // bar started from must not revive it.
    const onPopState = () => setStartedOn(null);

    // Capture phase, so it runs before Next's Link handler navigates.
    document.addEventListener("click", onClick, true);
    window.addEventListener("popstate", onPopState);
    return () => {
      clearTimeout(timeout);
      document.removeEventListener("click", onClick, true);
      window.removeEventListener("popstate", onPopState);
    };
  }, []);

  if (!active) return null;

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-[2px]"
    >
      <div className="h-full w-[85%] origin-left bg-accent motion-safe:animate-[nav-progress_6s_cubic-bezier(0.1,0.7,0.2,1)_forwards]" />
    </div>
  );
}
