"use client";

import { useRef, type ReactNode } from "react";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { SiteHeader } from "./SiteHeader";

// Header, the page's <main> (which scopes the .reveal entrances) and, passed
// in from the server page, the footer.
export function PageShell({
  children,
  footer,
}: {
  children: ReactNode;
  footer: ReactNode;
}) {
  const mainRef = useRef<HTMLElement>(null);
  useScrollReveal(mainRef);

  return (
    <>
      <SiteHeader />
      <main ref={mainRef} id="top">
        {children}
      </main>
      {footer}
    </>
  );
}
