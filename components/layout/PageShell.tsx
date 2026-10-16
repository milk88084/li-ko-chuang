"use client";

import { useRef, type ReactNode } from "react";
import { useScrollReveal } from "@/hooks/useScrollReveal";

// The page's <main> (which scopes the .reveal entrances) and, passed in from
// the server page, the footer. The header lives in RootShell so it survives
// navigation.
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
      <main ref={mainRef} id="top">
        {children}
      </main>
      {footer}
    </>
  );
}
