"use client";

import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { Project, ProjectType } from "@/lib/projects";
import { PROJECT_TYPES, isProjectType } from "@/lib/projects";
import { localePath, type Locale } from "@/lib/locale";
import { ProjectCard } from "./ProjectCard";

// /work's filter and grid. Every card is in the server HTML; the filter only
// hides cards, and mirrors itself into ?type= so a filtered view can be
// linked — which is also where /engineer and /marketer now redirect to.

type Filter = "all" | ProjectType;

interface GridProps {
  projects: Project[];
  locale: Locale;
  filters: Record<Filter, string>;
  types: Record<ProjectType, string>;
}

// The query string is only known in the browser, so the prerendered HTML is
// the unfiltered grid (the Suspense fallback) and the filter takes over on
// hydration.
export function WorkGrid(props: GridProps) {
  return (
    <Suspense fallback={<GridView {...props} active="all" />}>
      <FilteredGrid {...props} />
    </Suspense>
  );
}

function FilteredGrid(props: GridProps) {
  const router = useRouter();
  const params = useSearchParams();
  const requested = params.get("type");
  const active: Filter = isProjectType(requested) ? requested : "all";

  const select = (filter: Filter) => {
    const base = localePath(props.locale, "/work");
    router.replace(filter === "all" ? base : `${base}?type=${filter}`, {
      scroll: false,
    });
  };

  return <GridView {...props} active={active} onSelect={select} />;
}

function GridView({
  projects,
  locale,
  filters,
  types,
  active,
  onSelect,
}: GridProps & { active: Filter; onSelect?: (filter: Filter) => void }) {
  const count = (filter: Filter) =>
    filter === "all"
      ? projects.length
      : projects.filter((p) => p.type === filter).length;

  return (
    <>
      <div role="group" aria-label="Filter" className="flex flex-wrap gap-2">
        {(["all", ...PROJECT_TYPES] as const).map((filter) => (
          <button
            key={filter}
            type="button"
            aria-pressed={active === filter}
            onClick={() => onSelect?.(filter)}
            className={`rounded-full border px-4 py-2 text-[14px] transition-colors ${
              active === filter
                ? "border-accent bg-accent text-accent-ink"
                : "border-line text-muted hover:border-ink hover:text-ink"
            }`}
          >
            {filters[filter]}
            <span className="ml-2 font-mono text-[11px] opacity-70">
              {count(filter)}
            </span>
          </button>
        ))}
      </div>

      <ul className="mt-12 grid gap-x-6 gap-y-14 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <li
            key={project.slug}
            hidden={active !== "all" && project.type !== active}
          >
            <ProjectCard
              project={project}
              href={localePath(locale, `/work/${project.slug}`)}
              typeLabel={types[project.type]}
              aspect="aspect-[4/3]"
            />
          </li>
        ))}
      </ul>
    </>
  );
}
