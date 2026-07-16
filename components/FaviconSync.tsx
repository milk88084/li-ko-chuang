"use client";

import { useEffect } from "react";
import { useTheme } from "next-themes";

/**
 * Keeps the browser-tab favicon in step with the site's light/dark toggle:
 * black icon in day mode, white icon at night. The static `<link rel="icon">`
 * that Next renders from metadata can't react to the runtime theme, so this
 * rewrites its href whenever `resolvedTheme` changes. Renders nothing.
 */
export function FaviconSync() {
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    const href =
      resolvedTheme === "dark" ? "/favicon_white.ico" : "/favicon_black.ico";

    let link = document.querySelector<HTMLLinkElement>('link[rel="icon"]');
    if (!link) {
      link = document.createElement("link");
      link.rel = "icon";
      document.head.appendChild(link);
    }
    link.href = href;
  }, [resolvedTheme]);

  return null;
}
