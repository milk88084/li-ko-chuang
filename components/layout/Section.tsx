import type { ReactNode } from "react";
import { SectionLabel } from "@/components/canvas/SectionLabel";

// The standard section frame: a "/ Label" kicker and a large heading on the
// page grid, then whatever the section holds. Keeps every page's rhythm
// (gutters, max width, vertical spacing) in one place.

export function Section({
  id,
  label,
  title,
  intro,
  aside,
  children,
  className = "",
}: {
  id?: string;
  label: string;
  title?: ReactNode;
  intro?: ReactNode;
  /** Sits opposite the heading — usually a "view all" link. */
  aside?: ReactNode;
  children?: ReactNode;
  className?: string;
}) {
  return (
    <section
      id={id}
      className={`mx-auto w-full max-w-[1440px] scroll-mt-(--header-h) px-4 py-20 md:px-8 md:py-32 ${className}`}
    >
      <div className="reveal flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <SectionLabel>{label}</SectionLabel>
          {title && (
            <h2 className="mt-5 max-w-4xl text-[clamp(34px,5vw,64px)] leading-[1.08] tracking-[-0.04em] text-balance">
              {title}
            </h2>
          )}
          {intro && (
            <p className="mt-5 max-w-xl text-[17px] leading-relaxed text-muted">
              {intro}
            </p>
          )}
        </div>
        {aside}
      </div>
      {children && <div className="mt-12 md:mt-16">{children}</div>}
    </section>
  );
}
