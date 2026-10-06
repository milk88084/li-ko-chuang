"use client";

import { useState, useCallback, useRef, type CSSProperties } from "react";
import {
  Code2,
  Cpu,
  BookOpen,
  Layout,
  Smartphone,
  Zap,
  Box,
  Type,
  ArrowUpRight,
  Globe,
  Palette,
  FileJson,
  Shield,
  CheckCircle2,
  Link,
  Workflow,
  Atom,
  Waves,
  Wind,
  Brush,
  GitBranch,
  MousePointer2,
  Sparkles,
  Database,
  Terminal,
  CalendarDays,
  Rocket,
} from "lucide-react";
import content from "@/data/content.json";
import { useLanguage } from "@/providers/LanguageProvider";
import { useTheme } from "next-themes";
import Image from "next/image";
import { ProjectShowcase } from "./ProjectShowcase";
import { ScrollPortraitHero } from "./ScrollPortraitHero";
import { ProjectTimeline } from "./ProjectTimeline";
import { MediumArticles } from "./MediumArticles";
import { useScrollReveal } from "@/hooks/useScrollReveal";

type ContentType = typeof content;
type LanguageKey = keyof ContentType;

const iconMap = {
  Code2,
  Cpu,
  BookOpen,
  Layout,
  Smartphone,
  Zap,
  Box,
  Type,
  ArrowUpRight,
  Globe,
  Palette,
  FileJson,
  Shield,
  CheckCircle2,
  Link,
  Workflow,
  Atom,
  Waves,
  Wind,
  Brush,
  GitBranch,
  MousePointer2,
  Sparkles,
  Database,
  Terminal,
};

// Shared opener for every section below the hero: a mono "// label" kicker in
// the accent color over a large, tightly tracked, left-aligned heading.
function SectionHeader({
  label,
  title,
  subtitle,
}: {
  label: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="reveal">
      <p className="eng-label mb-4">{`// ${label}`}</p>
      <h2 className="text-4xl font-medium leading-[1.05] tracking-[-0.04em] md:text-[3.25rem]">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-4 max-w-xl text-base leading-relaxed text-(--eng-muted)">
          {subtitle}
        </p>
      )}
    </div>
  );
}

// Every section shares the page ground; the opaque background is still needed
// so each one covers the pinned hero stage as it rides up over it.
const SECTION = "relative z-10 bg-(--eng-bg) px-6 py-24 md:py-32";
const CARD = "rounded-[10px] bg-(--eng-card)";

export function EngineerView() {
  const { language } = useLanguage();
  const { resolvedTheme } = useTheme();
  const t = content[language as LanguageKey];
  const data = t.engineer;
  const isDark = resolvedTheme === "dark";
  const [activeProjectIndex, setActiveProjectIndex] = useState(0);
  const rootRef = useRef<HTMLElement>(null);

  useScrollReveal(rootRef);

  const offlineHighlightTitle =
    language === "en" ? "Offline Event Highlights" : "線下活動精華回顧";

  const offlineHighlights = [
    {
      name: "OpenClaw Meetup",
      time: "2026/03/04",
      imageSrc: "/meetup_01.webp",
    },
    {
      name: "Dify AI Meetup",
      time: "2026/01/22",
      imageSrc: "/meetup_02.webp",
    },
    {
      name: "claude code Meetup",
      time: "2025/12/30",
      imageSrc: "/meetup_03.webp",
    },
  ];

  const handleShowcaseProjectChange = useCallback((index: number) => {
    setActiveProjectIndex(index);
    setTimeout(() => {
      const timelineSection = document.getElementById("eng-projects");
      if (timelineSection) {
        timelineSection.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 100);
  }, []);

  return (
    <main id="view-engineer" ref={rootRef}>
      {/* Opening act: the scroll-driven portrait turn. Owns its own pinned
          620vh stage and rides up under the section below it. */}
      <ScrollPortraitHero />

      <section
        id="eng-intro"
        className="relative z-10 flex flex-col justify-center overflow-clip bg-(--eng-bg) px-6 py-20 md:h-screen md:py-10"
      >
        <div className="reveal mx-auto w-full max-w-6xl">
          {/* Giant headline — kept above the enlarged phone mockup (z-30 vs
              the phone's z-20) so it never gets visually covered. A drop
              shadow keeps it legible where it overlaps the phone's light
              bezel/screen, since z-index alone doesn't guarantee contrast. */}
          <h2
            className="parallax relative z-30 text-center text-[15vw] font-bold leading-[0.9] tracking-[-0.05em] md:text-[clamp(3rem,9vh,8.5rem)]"
            style={
              {
                filter: isDark
                  ? "drop-shadow(0 2px 16px rgba(0,0,0,0.7))"
                  : "drop-shadow(0 2px 16px rgba(255,255,255,0.85))",
                "--parallax-from": "28px",
                "--parallax-to": "-28px",
              } as CSSProperties
            }
          >
            {data.philosophy.title}
          </h2>

          {/* Banner with a phone breaking out of its bounds */}
          <div className="relative mt-8 md:mt-[3vh]">
            <div className="relative min-h-[400px] overflow-clip rounded-[10px] bg-(--eng-card) md:h-[34vh] md:min-h-[260px]">
              {/* Blended monochrome photo on the right */}
              <div className="absolute inset-y-0 right-0 w-2/3 md:w-1/2">
                {/* Over-scaled so the parallax drift always has image to
                    slide, instead of exposing a bare strip at the edges. */}
                <Image
                  src="/engineer_intro_bg.webp"
                  alt="Working with people"
                  fill
                  sizes="(max-width: 768px) 66vw, 50vw"
                  className="parallax scale-110 object-cover grayscale"
                  style={
                    {
                      "--parallax-from": "-22px",
                      "--parallax-to": "22px",
                    } as CSSProperties
                  }
                />
                <div className="absolute inset-0 bg-(--eng-card) mix-blend-color opacity-70" />
                <div className="absolute inset-0 bg-linear-to-r from-(--eng-card) via-(--eng-card)/60 to-transparent" />
              </div>

              {/* Label inside the banner */}
              <div className="absolute bottom-7 left-7 z-10 md:bottom-6 md:left-10">
                <p className="text-3xl font-bold tracking-[-0.03em]">
                  LI KO CHUAN
                </p>
                <p className="mt-2 max-w-xs text-xs leading-relaxed text-(--eng-muted) md:text-sm">
                  {data.philosophy.quote}
                </p>
              </div>
            </div>

            {/* Phone mockup image — centered, sized to 70% of the section's
                own height on desktop (calc(100vh - 4rem) * 0.7), so it
                deliberately breaks out past the banner's top and bottom
                edges. Sized by height (w-auto) instead of width so it scales
                with viewport height like the rest of this section. */}
            <div className="pointer-events-none absolute left-1/2 top-1/2 z-20 -translate-x-1/2 -translate-y-1/2">
              {/* Parallax sits on the image, not on the wrapper: the wrapper's
                  -translate-x-1/2 utility compiles to the same `translate`
                  property the keyframes drive, so they cannot share an element. */}
              <Image
                src="/engineer_intro.png"
                alt="Li Ko Chuan site shown on a tilted iPhone"
                width={808}
                height={1024}
                className="parallax w-[300px] drop-shadow-[0_50px_90px_-25px_rgba(60,70,150,0.5)] md:h-[calc(70vh_-_2.8rem)] md:w-auto md:min-h-[380px]"
                style={
                  {
                    "--parallax-from": "70px",
                    "--parallax-to": "-70px",
                  } as CSSProperties
                }
              />
            </div>
          </div>

          {/* Two-column overview */}
          <div className="mt-12 grid gap-8 md:mt-[3vh] md:grid-cols-2 md:gap-16">
            <h3 className="text-2xl font-medium leading-tight tracking-[-0.03em] md:text-[clamp(1.25rem,3vh,2.25rem)]">
              {data.philosophy.quote}
            </h3>
            {/* Narrower + pushed to the right edge so the enlarged phone
                mockup hanging down the middle doesn't cover this text. */}
            <div className="md:ml-auto md:max-w-[280px]">
              <p className="eng-label mb-3">
                {"// overview"}
              </p>
              <p className="text-sm leading-relaxed text-(--eng-muted) md:text-[clamp(0.75rem,1.6vh,1rem)]">
                {data.philosophy.content}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section
        id="eng-showcase"
        className="relative z-10 flex flex-col justify-center overflow-clip bg-(--eng-bg) px-6 py-20 md:h-screen md:py-10"
      >
        <div className="reveal mx-auto w-full max-w-6xl">
          <ProjectShowcase
            projects={data.showcase.projects}
            nextProjectLabel={data.showcase.nextProject}
            viewProjectLabel={data.showcase.viewProject}
            isDark={isDark}
            onProjectChange={handleShowcaseProjectChange}
          />
        </div>
      </section>

      {/* Experience: header pinned on the left while the role cards stack
          over each other on the right, each one sticking a little lower than
          the last so the edges of the earlier cards stay visible. */}
      <section id="eng-work" className={SECTION}>
        <div className="mx-auto grid max-w-6xl gap-12 md:grid-cols-[1fr_1.4fr] md:gap-16">
          <div className="md:sticky md:top-32 md:self-start">
            <SectionHeader
              label="experience"
              title={data.experience.title}
              subtitle={data.experience.subtitle}
            />
          </div>
          <ol className="reveal-stagger space-y-4">
            {data.experience.items.map((item, index) => (
              <li
                key={index}
                className={`${CARD} p-6 md:sticky md:p-8`}
                style={{ top: `${8 + index}rem` }}
              >
                <p className="flex items-center gap-3 font-(family-name:--font-jetbrains-mono) text-xs text-(--eng-muted)">
                  <span className="h-2 w-2 bg-(--eng-accent)" />
                  {item.period}
                </p>
                <h3 className="mt-5 text-xl font-medium tracking-tight md:text-2xl">
                  {item.role}
                </h3>
                <p className="mt-1 text-sm text-(--eng-muted)">
                  {item.company}
                </p>
                <p className="mt-4 leading-relaxed text-(--eng-muted)">
                  {item.description}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section id="eng-now" className={SECTION}>
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <SectionHeader label="now" title={data.now.subtitle} />
            <p className="reveal flex items-center gap-2 text-sm text-(--eng-muted)">
              <span className="h-2 w-2 animate-pulse rounded-full bg-green-500" />
              {data.now.title}
            </p>
          </div>
          {/* Bento: the first card spans the full row and the rest pair up; a
              leftover last card spans the full row too instead of sitting
              alone at half width. */}
          <div className="reveal-stagger grid grid-cols-1 gap-3 md:grid-cols-2">
            {data.now.items.map((item, index) => {
              const IconComponent = iconMap[item.icon as keyof typeof iconMap];
              const isLast = index === data.now.items.length - 1;
              const fullRow = index === 0 || (isLast && index % 2 === 1);
              return (
                <div
                  key={index}
                  className={`${CARD} flex flex-col p-6 md:p-8 ${fullRow ? "md:col-span-2 md:min-h-56" : "md:min-h-48"}`}
                >
                  {IconComponent && (
                    <IconComponent className="mb-auto h-5 w-5 text-(--eng-accent)" />
                  )}
                  <h3 className="mt-10 text-xl font-medium tracking-tight md:text-2xl">
                    {item.title}
                  </h3>
                  <p className="mt-2 max-w-md text-sm leading-relaxed text-(--eng-muted)">
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className={`${SECTION} overflow-clip px-0`}>
        <div className="mx-auto mb-14 max-w-6xl px-6">
          <SectionHeader
            label="stack"
            title={data.techStack.title}
            subtitle={data.techStack.subtitle}
          />
        </div>

        {/* No blur on the way in/out here: these rows are viewport-wide and
            already running an infinite marquee, so a scrubbed filter on top
            of that is the one place it actually costs frames. */}
        <div
          className="reveal flex flex-col gap-3"
          style={{ "--reveal-blur": "0px" } as CSSProperties}
        >
          {[
            {
              key: "row1",
              anim: "animate-marquee-right",
              items: data.techStack.items.slice(
                0,
                Math.ceil(data.techStack.items.length / 2),
              ),
            },
            {
              key: "row2",
              anim: "animate-marquee-left",
              items: data.techStack.items.slice(
                Math.ceil(data.techStack.items.length / 2),
              ),
            },
          ].map((row) => (
            <div key={row.key} className="flex overflow-hidden whitespace-nowrap">
              <div className={`flex w-max gap-3 px-1.5 ${row.anim}`}>
                {[...row.items, ...row.items].map((item, index) => {
                  const IconComponent =
                    iconMap[item.icon as keyof typeof iconMap];
                  return (
                    <div
                      key={`${row.key}-${index}`}
                      className={`${CARD} group flex min-w-[200px] cursor-default items-center gap-4 px-7 py-5 transition-colors duration-300 hover:bg-(--eng-ink) hover:text-(--eng-bg)`}
                    >
                      {IconComponent && (
                        <IconComponent className="h-5 w-5 text-(--eng-muted) transition-colors group-hover:text-(--eng-accent)" />
                      )}
                      <span className="text-lg font-medium">{item.name}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Shipped Solo — a stat band framing the projects below it. The two
          apps here are the only things on the page with a public App Store
          link. */}
      <section id="eng-shipped" className={`${SECTION} py-0 md:py-0`}>
        <div className="mx-auto max-w-6xl">
          <div className={`reveal ${CARD} px-6 py-8 md:px-10 md:py-12`}>
            <p className="eng-label mb-6 flex items-center gap-2">
              <Rocket className="h-3.5 w-3.5" />
              {data.shipped.label}
            </p>

            <div className="grid gap-10 md:grid-cols-[1.1fr_1fr] md:gap-12">
              <div>
                <h3 className="text-3xl font-medium tracking-[-0.03em] md:text-4xl">
                  {data.shipped.title}
                </h3>
                <p className="mt-4 text-sm leading-relaxed text-(--eng-muted)">
                  {data.shipped.description}
                </p>

                <div className="mt-6 flex flex-wrap gap-3">
                  {data.shipped.apps.map((app) => (
                    <a
                      key={app.name}
                      href={app.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${app.name} — ${data.shipped.appStoreLabel}`}
                      className="group inline-flex items-center gap-2.5 rounded-full bg-(--eng-bg) py-1.5 pr-4 pl-1.5 transition-colors hover:bg-(--eng-ink) hover:text-(--eng-bg)"
                    >
                      {/* the real App Store icon. araS's is near-white, so the
                          ring is what keeps it from dissolving into the pill. */}
                      <Image
                        src={app.icon}
                        alt=""
                        width={64}
                        height={64}
                        className="h-8 w-8 rounded-[9px] object-cover ring-1 ring-black/10 dark:ring-white/15"
                      />
                      <span className="text-sm font-medium">{app.name}</span>
                      <span className="text-xs opacity-60">{app.caption}</span>
                      <ArrowUpRight className="h-3.5 w-3.5 opacity-60 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </a>
                  ))}
                </div>
              </div>

              <dl className="grid grid-cols-2 content-start gap-x-6 gap-y-8">
                {data.shipped.stats.map((stat) => (
                  <div key={stat.label} className="border-t border-(--eng-ink)/10 pt-4">
                    <dt className="text-2xl font-medium tracking-tight text-(--eng-accent) md:text-3xl">
                      {stat.value}
                    </dt>
                    <dd className="mt-1 text-xs leading-relaxed text-(--eng-muted)">
                      {stat.label}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>
      </section>

      <section id="eng-projects" className={SECTION}>
        <div className="mx-auto max-w-6xl">
          <div className="mb-12">
            <SectionHeader
              label="projects"
              title={data.projects.title}
              subtitle={data.projects.subtitle}
            />
          </div>
          <div className="reveal">
            <ProjectTimeline
              projects={data.projects.items}
              problemLabel={data.projects.problemLabel}
              outcomeLabel={data.projects.outcomeLabel}
              techLabel={data.projects.techLabel}
              isDark={isDark}
              activeProjectIndex={activeProjectIndex}
              onProjectChange={setActiveProjectIndex}
            />
          </div>
        </div>
      </section>

      <section id="eng-articles" className={SECTION}>
        <div className="mx-auto max-w-6xl">
          <div className="mb-12">
            <SectionHeader
              label="writing"
              title={data.mediumArticles.title}
              subtitle={data.mediumArticles.subtitle}
            />
          </div>
          <div className="reveal">
            <MediumArticles
              readMore={data.mediumArticles.readMore}
              viewAll={data.mediumArticles.viewAll}
              loading={data.mediumArticles.loading}
              noArticles={data.mediumArticles.noArticles}
              mediumUrl={data.mediumArticles.mediumUrl}
            />
          </div>
        </div>
      </section>

      <section
        id="eng-offline-highlight"
        className={`${SECTION} overflow-clip`}
      >
        <div className="mx-auto max-w-6xl">
          <div className="mb-12">
            <SectionHeader label="offline" title={offlineHighlightTitle} />
          </div>

          {/* The rows used to fade in once on mount with fixed delays; the
              stagger is now carried by the scroll timeline instead. The
              middle row flips so photo and caption alternate sides. */}
          <div className="reveal-stagger space-y-3">
            {offlineHighlights.map((item, index) => (
              <div
                key={`${item.name}-${index}`}
                className="grid grid-cols-1 items-stretch gap-3 md:grid-cols-12"
              >
                <div
                  className={`relative overflow-hidden rounded-[10px] md:col-span-8 ${index === 1 ? "md:order-2" : ""}`}
                >
                  <div className="relative aspect-video">
                    <Image
                      src={item.imageSrc}
                      alt={item.name}
                      fill
                      sizes="(max-width: 768px) 100vw, 66vw"
                      className="object-cover"
                      priority={false}
                    />
                  </div>
                </div>

                <div
                  className={`${CARD} flex flex-col justify-between gap-8 p-6 md:col-span-4 md:p-8`}
                >
                  <p className="flex items-center gap-2 font-(family-name:--font-jetbrains-mono) text-xs text-(--eng-muted)">
                    <CalendarDays className="h-3.5 w-3.5 text-(--eng-accent)" />
                    {item.time}
                  </p>
                  <h3 className="text-2xl font-medium tracking-tight md:text-3xl">
                    {item.name}
                  </h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Last section: reveals against its own section timeline (see
          .reveal-in-section) because there is no page left to scroll after it. */}
      <section className={`section-timeline ${SECTION}`}>
        <div className="reveal-in-section mx-auto max-w-6xl">
          <div
            className={`${CARD} grid gap-10 p-8 md:grid-cols-[1.4fr_1fr] md:items-end md:p-14`}
          >
            <div>
              <p className="eng-label mb-4">{"// contact"}</p>
              <h2 className="text-4xl font-medium leading-[1.05] tracking-[-0.04em] md:text-6xl">
                {data.contact.title}
              </h2>
              <p className="mt-6 max-w-lg text-lg leading-relaxed text-(--eng-muted)">
                {data.contact.description}
              </p>
            </div>
            <div className="flex flex-col items-start gap-4 md:items-end">
              <a
                href={`mailto:${data.contact.email}`}
                className="inline-flex items-center gap-2 rounded-md bg-(--eng-accent) px-6 py-3.5 text-base font-medium text-white transition-opacity hover:opacity-85"
              >
                {data.contact.email}
                <ArrowUpRight className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
