"use client";

import {
  useState,
  useCallback,
  useRef,
  type ReactNode,
  type CSSProperties,
} from "react";
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
  MessageCircle,
} from "lucide-react";
import content from "@/data/content.json";
import { useLanguage } from "@/providers/LanguageProvider";
import { useTheme } from "next-themes";
import Image from "next/image";
import { ProjectShowcase } from "./ProjectShowcase";
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

// Frosted-glass floating card: a genuinely see-through pane (backdrop-blur
// doing the work, minimal white tint) so whatever's behind it shows through
// blurred. Border and inner text follow the normal light/dark convention.
// Tilted in 3D so every card faces the same direction.
function FloatingGlassCard({
  className,
  style,
  isDark,
  children,
}: {
  className?: string;
  style?: CSSProperties;
  isDark: boolean;
  children: ReactNode;
}) {
  return (
    <div className="relative transform-gpu transform-3d" style={style}>
      {/* Main glass surface — no color fill at all, just a border/highlight
          for definition. The drop shadow is a real CSS box-shadow (not a
          separate blurred div sitting behind the panel), so it only ever
          renders outside the card's edges and never bleeds through the
          transparent interior. */}
      <div
        className={`relative flex flex-col justify-center rounded-3xl border p-5 text-left ${
          isDark ? "border-white/20" : "border-black/10"
        } ${className ?? ""}`}
        style={{
          boxShadow: isDark
            ? "inset 0 1px 0 rgba(255,255,255,0.15), 0 12px 24px -8px rgba(255,255,255,0.18), 0 30px 45px -20px rgba(255,255,255,0.1)"
            : "inset 0 1px 0 rgba(255,255,255,0.5), 0 12px 24px -8px rgba(0,0,0,0.18), 0 30px 45px -20px rgba(0,0,0,0.12)",
        }}
      >
        {children}
      </div>
    </div>
  );
}

// Fades a section's bottom edge into the next section's background color, so
// two sections with different backgrounds melt into each other instead of
// meeting at a hard edge. Only needed where the two backgrounds actually
// differ — adjacent same-color sections don't need a bridge.
function SectionBridge({ toColor }: { toColor: string }) {
  return (
    <div className="my-10 ">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-40 backdrop-blur-xl"
        style={{
          background: `linear-gradient(to bottom, transparent, ${toColor})`,
          WebkitMaskImage: "linear-gradient(to bottom, transparent, black 55%)",
          maskImage: "linear-gradient(to bottom, transparent, black 55%)",
        }}
      />
    </div>
  );
}

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

  // Shared 3D tilt so every floating card faces the same direction, matching
  // the reference (bottom-left edge near, top-right corner receding further back).
  const cardTilt =
    "perspective(1000px) rotateX(30deg) rotateY(38deg) rotateZ(-20deg)";

  // Day/night hero background: a deep blue-black night gradient (brand blue
  // #3250FE, no purple) in dark mode; a clean white base in light mode.
  // Both variants END on the exact background color of the next section
  // (intro: #ffffff light / #0a0a0a dark) so the hero melts into it with no
  // color step at the seam — the earlier grey (#f5f5f7) / near-black (#05060d)
  // endpoints were what made the join read as two stacked boxes.
  const heroBackground = isDark
    ? "radial-gradient(85% 65% at 78% 34%, rgba(50,80,254,0.34), transparent 55%)," +
      "radial-gradient(75% 55% at 44% 26%, rgba(90,130,255,0.32), transparent 55%)," +
      "radial-gradient(72% 65% at 12% 92%, rgba(250,190,120,0.3), transparent 50%)," +
      "linear-gradient(180deg, #000000 0%, #05070f 22%, #0a1230 55%, #0a0f24 82%, #0a0a0a 100%)"
    : "radial-gradient(100% 90% at 50% 8%, rgba(0,0,0,0.03), transparent 60%)," +
      "linear-gradient(180deg, #ffffff 0%, #f4f4f6 46%, #ffffff 100%)";
  const heroVignette = isDark
    ? "radial-gradient(115% 85% at 50% 42%, transparent 38%, rgba(0,0,0,0.55) 100%)"
    : "radial-gradient(120% 90% at 50% 40%, transparent 62%, rgba(0,0,0,0.05) 100%)";
  // Text halo: bright on the dark background, dark on the white background.
  const titleGradient = isDark
    ? "radial-gradient(60% 130% at 50% 45%, #ffffff 0%, rgba(255,255,255,0.92) 42%, rgba(255,255,255,0.52) 80%, rgba(255,255,255,0.3) 100%)"
    : "radial-gradient(60% 130% at 50% 45%, #1d1d1f 0%, rgba(29,29,31,0.92) 42%, rgba(29,29,31,0.62) 80%, rgba(29,29,31,0.4) 100%)";
  const bodyGradient = isDark
    ? "radial-gradient(70% 170% at 50% 50%, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.62) 60%, rgba(255,255,255,0.32) 100%)"
    : "radial-gradient(70% 170% at 50% 50%, rgba(60,60,67,0.9) 0%, rgba(60,60,67,0.62) 60%, rgba(60,60,67,0.36) 100%)";
  // Colors the section bridges fade into — the two alternating background
  // tones used across the page (bg-white / bg-gray-50, and their dark variants).
  const fadeToWhite = isDark ? "#0a0a0a" : "#ffffff";
  const fadeToGray = isDark ? "#050505" : "#f9fafb";

  return (
    <main id="view-engineer" ref={rootRef}>
      {/* overflow-clip, not overflow-hidden, on every section that clips:
          `hidden` makes the section a scroll container, and a scroll container
          that never scrolls leaves the view() timelines of everything inside it
          permanently inactive. `clip` clips identically without creating one. */}
      <section className="hero-timeline relative z-10 flex min-h-screen flex-col items-center overflow-clip px-6 pb-0 pt-28 text-center md:h-screen md:pt-16">
        {/* Mesh / radial gradient background (adapts to day / night) */}
        <div
          aria-hidden
          className="absolute inset-0 z-0 transition-[background] duration-500"
          style={{ background: heroBackground }}
        />
        {/* Vignette to draw focus to the centre */}
        <div
          aria-hidden
          className="absolute inset-0 z-0 transition-[background] duration-500"
          style={{ background: heroVignette }}
        />

        {/* Centre-aligned header. Entry is the one-shot load animation on the
            children; `scroll-out` then hands the exit over to the wheel. */}
        <div className="scroll-out relative z-30 mx-auto max-w-3xl md:shrink-0">
          <h1
            className="fade-in-up delay-100 pb-[0.15em] text-4xl font-bold leading-[1.2] tracking-tight md:text-[clamp(4rem,5.5vh,3.75rem)]"
            style={{
              backgroundImage: titleGradient,
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              WebkitTextFillColor: "transparent",
              color: "transparent",
              filter: "drop-shadow(0 6px 16px rgba(0,0,0,0.22))",
            }}
          >
            {data.hero.title} {data.hero.titleHighlight}
          </h1>
          <p
            className="fade-in-up delay-200 mx-auto mt-3 max-w-xl text-sm font-light leading-relaxed md:text-[clamp(1rem,1.8vh,1rem)]"
            style={{
              backgroundImage: bodyGradient,
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              WebkitTextFillColor: "transparent",
              color: "transparent",
            }}
          >
            {data.hero.description}
          </p>
        </div>

        {/* Stage: central phone + asymmetrical floating glass cards. Three
            layers stacked by z-index — a drifting phone (z-0), a STATIC
            full-width bridge pinned to the bottom (z-10), and the drifting
            cards (z-20). Keeping the bridge out of the parallax means it always
            covers the hero→intro seam instead of drifting off it, while phone
            and cards still parallax together (identical drift on both layers). */}
        <div className="fade-in delay-300 relative mt-auto h-[440px] w-full md:h-[42vh] md:min-h-[440px]">
          {/* Phone layer — drifts, sits UNDER the bridge so its bottom melts
              into the next section. */}
          <div
            className="parallax absolute inset-0 z-0"
            style={
              {
                "--parallax-from": "36px",
                "--parallax-to": "-36px",
              } as CSSProperties
            }
          >
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2">
              <Image
                src="/engineer_hero.png"
                alt="LI KO CHUANG portfolio shown on an iPhone held in hand"
                width={1024}
                height={926}
                priority
                className="w-[380px] max-w-none drop-shadow-[0_40px_90px_-30px_rgba(0,0,0,0.25)] md:w-[46vh] md:min-w-[450px] dark:drop-shadow-[0_45px_120px_-25px_rgba(168,85,247,0.6)]"
              />
            </div>
          </div>

          {/* Static full-width bridge — pinned to the section bottom so it does
              NOT drift with the parallax (that drift used to lift it off the
              bottom and expose a hard hero→intro seam). Sits above the phone
              (z-0) and below the cards (z-20); w-screen breaks it out of the
              centred column to cover the full viewport width. */}
          <div
            aria-hidden
            className="pointer-events-none absolute bottom-0 left-1/2 z-10 h-40 w-screen -translate-x-1/2 backdrop-blur-xl"
            style={{
              background: `linear-gradient(to bottom, transparent, ${fadeToWhite})`,
              WebkitMaskImage:
                "linear-gradient(to bottom, transparent, black 55%)",
              maskImage: "linear-gradient(to bottom, transparent, black 55%)",
            }}
          />

          {/* Cards layer — drifts, sits ABOVE the bridge so the glass cards
              stay sharp. */}
          <div
            className="parallax relative z-20 mx-auto h-full w-full max-w-5xl"
            style={
              {
                "--parallax-from": "36px",
                "--parallax-to": "-36px",
              } as CSSProperties
            }
          >
            {/* Left card — a single card, deliberately sitting LOWER than the
                right card (top-[120px] vs the right's top-[-48px]) so the two
                sides read as a staggered pair, not a level shelf. */}
            <div className="absolute left-0 top-[120px] z-30 hidden md:block">
              <div className="animate-float">
                <FloatingGlassCard
                  className="h-[210px] w-[220px]"
                  style={{ transform: cardTilt }}
                  isDark={isDark}
                >
                  <p className="text-sm font-semibold leading-snug text-gray-900 dark:text-white">
                    Fast processing of requests according
                  </p>
                  <div className="mt-3 flex items-center gap-2 rounded-full border border-black/10 px-3 py-2 dark:border-white/10">
                    <MessageCircle className="h-3.5 w-3.5 text-gray-400 dark:text-white/60" />
                    <span className="text-xs font-light text-gray-500 dark:text-white/60">
                      How can I help you?
                    </span>
                  </div>
                </FloatingGlassCard>
              </div>
            </div>

            {/* Right card — pricing / plans, sits higher than the left card */}
            <div className="absolute right-0 top-[-48px] z-30 hidden md:block">
              <div className="animate-float" style={{ animationDelay: "0.8s" }}>
                <FloatingGlassCard
                  className="h-[210px] w-[220px]"
                  style={{ transform: cardTilt }}
                  isDark={isDark}
                >
                  <div className="space-y-2">
                    {[
                      { name: "Monthly", price: "$25 / month", best: false },
                      { name: "Yearly", price: "$180 / year", best: true },
                      { name: "Ultimate", price: "$490", best: false },
                    ].map((plan) => (
                      <div
                        key={plan.name}
                        className={`flex items-center justify-between rounded-xl border px-3 py-2 ${
                          plan.best
                            ? "border-black/15 dark:border-white/30"
                            : "border-black/6 dark:border-white/10"
                        }`}
                      >
                        <div>
                          <p className="text-sm font-semibold text-gray-900 dark:text-white">
                            {plan.name}
                          </p>
                          <p className="text-[10px] font-light text-gray-500 dark:text-white/50">
                            {plan.price}
                          </p>
                        </div>
                        {plan.best && (
                          <span className="rounded-full bg-gray-900 px-2 py-0.5 text-[9px] font-semibold text-white dark:bg-white dark:text-black">
                            Best value
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </FloatingGlassCard>
              </div>
            </div>
          </div>
        </div>
        <SectionBridge toColor={fadeToWhite} />
      </section>

      <section
        id="eng-intro"
        className="relative z-10 flex flex-col justify-center overflow-clip bg-white px-6 py-20 transition-colors duration-300 md:h-screen md:py-10 dark:bg-[#0a0a0a]"
      >
        <div className="reveal mx-auto w-full max-w-6xl">
          {/* Giant headline — kept above the enlarged phone mockup (z-30 vs
              the phone's z-20) so it never gets visually covered. A drop
              shadow keeps it legible where it overlaps the phone's light
              bezel/screen, since z-index alone doesn't guarantee contrast. */}
          <h2
            className="parallax relative z-30 text-center text-[15vw] font-bold leading-[0.9] tracking-tighter text-gray-900 md:text-[clamp(3rem,9vh,8.5rem)] dark:text-white"
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
            <div className="relative min-h-[400px] overflow-clip rounded-4xl bg-white dark:bg-[#0a0a0a] md:h-[34vh] md:min-h-[260px] md:rounded-[2.5rem]">
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
                <div className="absolute inset-0 bg-white dark:bg-[#0a0a0a] mix-blend-color opacity-70" />
                <div className="absolute inset-0 bg-linear-to-r from-white dark:from-[#0a0a0a] via-white/60 dark:via-[#0a0a0a]/60 to-transparent" />
              </div>

              {/* Label inside the banner */}
              <div className="absolute bottom-7 left-7 z-10 md:bottom-6 md:left-10">
                <p className="text-3xl font-bold text-gray-900 dark:text-white md:text-3xl">
                  LI KO CHUANG
                </p>
                <p className="mt-2 max-w-xs text-xs font-light leading-relaxed text-gray-600 dark:text-white/70 md:text-sm">
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
                alt="LI KO CHUANG site shown on a tilted iPhone"
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
            <h3 className="text-2xl font-semibold leading-tight tracking-tight text-gray-900 md:text-[clamp(1.25rem,3vh,2.25rem)] dark:text-white">
              {data.philosophy.quote}
            </h3>
            {/* Narrower + pushed to the right edge so the enlarged phone
                mockup hanging down the middle doesn't cover this text. */}
            <div className="md:ml-auto md:max-w-[280px]">
              <p className="mb-3 text-[10px] font-semibold uppercase tracking-wider text-gray-400 md:text-xs">
                [OVERVIEW]
              </p>
              <p className="text-sm font-light leading-relaxed text-gray-600 md:text-[clamp(0.75rem,1.6vh,1rem)] dark:text-gray-400">
                {data.philosophy.content}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section
        id="eng-showcase"
        className="relative z-10 flex flex-col justify-center overflow-clip py-20 px-6 bg-gray-50 dark:bg-[#050505] border-y border-gray-100 dark:border-white/5 transition-colors duration-300 md:h-screen md:py-10"
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

      <section
        id="eng-work"
        className="py-24 px-6 bg-gray-50 dark:bg-[#050505] border-y border-gray-100 dark:border-white/5 relative z-10 transition-colors duration-300"
      >
        <div className="max-w-3xl mx-auto">
          <div className="reveal mb-16">
            <h2 className="text-3xl font-semibold tracking-tight mb-2 text-gray-900 dark:text-white">
              {data.experience.title}
            </h2>
            <p className="text-gray-500 dark:text-gray-500 mt-2 font-light">
              {data.experience.subtitle}
            </p>
          </div>
          <div className="reveal-stagger space-y-12 relative border-l border-gray-200 dark:border-gray-700 ml-3 md:ml-0 pl-8 md:pl-0">
            {data.experience.items.map((item, index) => (
              <div
                key={index}
                className="relative md:grid md:grid-cols-[1fr_3fr] md:gap-10"
              >
                <div className="hidden md:block text-right pt-1">
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {item.period}
                  </span>
                </div>
                <div
                  className={`absolute -left-[37px] top-2 h-4 w-4 rounded-full border-4 border-gray-50 dark:border-[#050505] ${index === 0 ? "bg-gray-900 dark:bg-white" : "bg-gray-300 dark:bg-gray-600"} md:hidden`}
                ></div>
                <div>
                  <span className="md:hidden text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1 block">
                    {item.period}
                  </span>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {item.role}
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 text-sm mb-3">
                    {item.company}
                  </p>
                  <p className="text-gray-600 dark:text-gray-400 font-light leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <SectionBridge toColor={fadeToWhite} />
      </section>

      <section
        id="eng-now"
        className="py-24 px-6 bg-white dark:bg-[#0a0a0a] relative z-10 transition-colors duration-300"
      >
        <div className="max-w-3xl mx-auto">
          <div className="reveal flex items-center gap-3 mb-8">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            <h2 className="text-xs font-bold uppercase tracking-widest text-gray-500 dark:text-gray-500">
              {data.now.title}
            </h2>
          </div>
          <h3 className="reveal text-2xl font-semibold mb-6 text-gray-900 dark:text-white">
            {data.now.subtitle}
          </h3>
          <div className="reveal-stagger grid grid-cols-1 md:grid-cols-2 gap-8">
            {data.now.items.map((item, index) => {
              const IconComponent = iconMap[item.icon as keyof typeof iconMap];
              return (
                <div
                  key={index}
                  className="bg-gray-50 dark:bg-[#1C1C1E] p-6 rounded-xl border border-gray-100 dark:border-white/10 transition-colors duration-300"
                >
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                    {IconComponent && (
                      <IconComponent className="w-4 h-4 text-gray-400" />
                    )}{" "}
                    {item.title}
                  </h4>
                  <p className="text-gray-600 dark:text-gray-400 text-sm font-light leading-relaxed">
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-24 bg-white dark:bg-[#0a0a0a] border-t border-gray-100 dark:border-white/5 relative z-10 transition-colors duration-300 overflow-clip">
        <div className="reveal max-w-4xl mx-auto px-6 mb-16 text-center">
          <h2 className="text-3xl font-semibold tracking-tight text-gray-900 dark:text-white">
            {data.techStack.title}
          </h2>
          <p className="text-gray-500 dark:text-gray-500 mt-2 font-light">
            {data.techStack.subtitle}
          </p>
        </div>

        {/* No blur on the way in/out here: these rows are viewport-wide and
            already running an infinite marquee, so a scrubbed filter on top
            of that is the one place it actually costs frames. */}
        <div
          className="reveal flex flex-col gap-8"
          style={{ "--reveal-blur": "0px" } as CSSProperties}
        >
          <div className="flex whitespace-nowrap overflow-hidden">
            <div className="flex animate-marquee-right gap-6 px-3 w-max">
              {[
                ...data.techStack.items.slice(
                  0,
                  Math.ceil(data.techStack.items.length / 2),
                ),
                ...data.techStack.items.slice(
                  0,
                  Math.ceil(data.techStack.items.length / 2),
                ),
              ].map((item, index) => {
                const IconComponent =
                  iconMap[item.icon as keyof typeof iconMap];
                return (
                  <div
                    key={`row1-${index}`}
                    className="group relative bg-[#0a0a0a]/5 dark:bg-white/5 px-8 py-6 rounded-2xl border border-gray-900/10 dark:border-white/5 flex items-center gap-4 transition-all duration-500 min-w-[200px] hover:scale-105 cursor-default overflow-hidden hover:border-gray-900/20 dark:hover:border-white/20"
                  >
                    <div className="relative z-10 p-2.5 rounded-xl bg-white dark:bg-white/5 group-hover:bg-white dark:group-hover:bg-white group-hover:scale-110 transition-all duration-500 shadow-sm border border-black/5 dark:border-white/5">
                      {IconComponent && (
                        <IconComponent className="w-5 h-5 text-gray-400 group-hover:text-black transition-colors" />
                      )}
                    </div>
                    <span className="relative z-10 text-gray-700 dark:text-gray-300 font-medium text-lg group-hover:text-black dark:group-hover:text-white transition-colors">
                      {item.name}
                    </span>
                    <div
                      className="absolute inset-0 opacity-0 group-hover:opacity-10 dark:group-hover:opacity-20 transition-opacity duration-500 z-0"
                      style={{
                        background: item.hoverColor
                          ? `var(--color-${item.hoverColor})`
                          : "#3b82f6",
                      }}
                    ></div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex whitespace-nowrap overflow-hidden">
            <div className="flex animate-marquee-left gap-6 px-3 w-max">
              {[
                ...data.techStack.items.slice(
                  Math.ceil(data.techStack.items.length / 2),
                ),
                ...data.techStack.items.slice(
                  Math.ceil(data.techStack.items.length / 2),
                ),
              ].map((item, index) => {
                const IconComponent =
                  iconMap[item.icon as keyof typeof iconMap];
                return (
                  <div
                    key={`row2-${index}`}
                    className="group relative bg-[#0a0a0a]/5 dark:bg-white/5 px-8 py-6 rounded-2xl border border-gray-900/10 dark:border-white/5 flex items-center gap-4 transition-all duration-500 min-w-[200px] hover:scale-105 cursor-default overflow-hidden hover:border-gray-900/20 dark:hover:border-white/20"
                  >
                    <div className="relative z-10 p-2.5 rounded-xl bg-white dark:bg-white/5 group-hover:bg-white dark:group-hover:bg-white group-hover:scale-110 transition-all duration-500 shadow-sm border border-black/5 dark:border-white/5">
                      {IconComponent && (
                        <IconComponent className="w-5 h-5 text-gray-400 group-hover:text-black transition-colors" />
                      )}
                    </div>
                    <span className="relative z-10 text-gray-700 dark:text-gray-300 font-medium text-lg group-hover:text-black dark:group-hover:text-white transition-colors">
                      {item.name}
                    </span>
                    <div
                      className="absolute inset-0 opacity-0 group-hover:opacity-10 dark:group-hover:opacity-20 transition-opacity duration-500 z-0"
                      style={{
                        background: item.hoverColor
                          ? `var(--color-${item.hoverColor})`
                          : "#3b82f6",
                      }}
                    ></div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        <SectionBridge toColor={fadeToGray} />
      </section>

      <section
        id="eng-projects"
        className="py-24 px-6 bg-gray-50 dark:bg-[#050505] border-t border-gray-100 dark:border-white/5 relative z-10 transition-colors duration-300"
      >
        <div className="max-w-5xl mx-auto">
          <div className="reveal mb-12 text-center">
            <h2 className="text-3xl font-semibold tracking-tight mb-2 text-gray-900 dark:text-white">
              {data.projects.title}
            </h2>
            <p className="text-gray-500 dark:text-gray-500 mt-2 font-light">
              {data.projects.subtitle}
            </p>
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
        <SectionBridge toColor={fadeToWhite} />
      </section>

      <section
        id="eng-articles"
        className="py-24 px-6 bg-white dark:bg-[#0a0a0a] border-t border-gray-100 dark:border-white/5 relative z-10 transition-colors duration-300"
      >
        <div className="max-w-5xl mx-auto">
          <div className="reveal mb-12 text-center">
            <h2 className="text-3xl font-semibold tracking-tight mb-2 text-gray-900 dark:text-white">
              {data.mediumArticles.title}
            </h2>
            <p className="text-gray-500 dark:text-gray-500 mt-2 font-light">
              {data.mediumArticles.subtitle}
            </p>
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
        <SectionBridge toColor={fadeToGray} />
      </section>
      <section
        id="eng-offline-highlight"
        className="py-24 px-6 bg-gray-50 dark:bg-[#050505] border-t border-gray-100 dark:border-white/5 relative z-10 transition-colors duration-300 overflow-clip"
      >
        <div className="max-w-3xl mx-auto">
          <div className="reveal mb-12 text-center">
            <h2 className="text-3xl font-semibold tracking-tight text-gray-900 dark:text-white">
              {offlineHighlightTitle}
            </h2>
          </div>

          {/* The rows used to fade in once on mount with fixed delays; the
              stagger is now carried by the scroll timeline instead. */}
          <div className="reveal-stagger space-y-10">
            {offlineHighlights.map((item, index) => (
              <div
                key={`${item.name}-${index}`}
                className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch"
              >
                {index === 1 ? (
                  <>
                    <div className="md:col-span-4">
                      <div className="h-full rounded-2xl border border-gray-100 dark:border-white/10 bg-gray-900/5 dark:bg-white/5 p-6 md:p-7 flex flex-col">
                        <div className="space-y-5">
                          <p className="inline-flex items-center gap-2 text-[10px] md:text-xs font-semibold uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400 bg-gray-900/5 dark:bg-white/5 px-3 py-2 rounded-full backdrop-blur-sm">
                            <CalendarDays className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                            {item.time}
                          </p>

                          <div>
                            <h3 className="text-xl md:text-2xl font-semibold tracking-tight italic text-gray-900 dark:text-white">
                              {item.name}
                            </h3>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="md:col-span-8 relative">
                      <div className="relative overflow-hidden rounded-2xl border border-gray-100 dark:border-white/10 bg-white/5 shadow-sm">
                        <div className="absolute inset-0 bg-linear-to-t from-black/35 via-black/10 to-transparent pointer-events-none" />
                        <div className="aspect-video relative">
                          <Image
                            src={item.imageSrc}
                            alt={item.name}
                            fill
                            sizes="(max-width: 768px) 100vw, 66vw"
                            className="object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                            priority={false}
                          />
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="md:col-span-8 relative">
                      <div className="relative overflow-hidden rounded-2xl border border-gray-100 dark:border-white/10 bg-white/5 shadow-sm">
                        <div className="absolute inset-0 bg-linear-to-t from-black/35 via-black/10 to-transparent pointer-events-none" />
                        <div className="aspect-video relative">
                          <Image
                            src={item.imageSrc}
                            alt={item.name}
                            fill
                            sizes="(max-width: 768px) 100vw, 66vw"
                            className="object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                            priority={index === 0}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="md:col-span-4">
                      <div className="h-full rounded-2xl border border-gray-100 dark:border-white/10 bg-white dark:bg-[#0a0a0a] p-6 md:p-7 flex flex-col">
                        <div className="space-y-5">
                          <p className="inline-flex items-center gap-2 text-[10px] md:text-xs font-semibold uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400 bg-gray-900/5 dark:bg-white/5 px-3 py-2 rounded-full backdrop-blur-sm">
                            <CalendarDays className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                            {item.time}
                          </p>

                          <div>
                            <h3 className="text-xl md:text-2xl font-semibold italic tracking-tight text-gray-900 dark:text-white">
                              {item.name}
                            </h3>
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Last section: reveals against its own section timeline (see
          .reveal-in-section) because there is no page left to scroll after it. */}
      <section className="section-timeline py-24 px-6 bg-gray-50 dark:bg-[#050505] border-t border-gray-100 dark:border-white/5 text-center relative z-10 transition-colors duration-300">
        <div className="reveal-in-section max-w-2xl mx-auto space-y-8">
          <h2 className="text-3xl font-semibold tracking-tight text-gray-900 dark:text-white">
            {data.contact.title}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 font-light text-lg">
            {data.contact.description}
          </p>
          <a
            href={`mailto:${data.contact.email}`}
            className="inline-flex items-center gap-2 text-xl font-medium text-gray-900 dark:text-white hover:text-gray-600 dark:hover:text-gray-300 transition-colors border-b border-gray-900 dark:border-white hover:border-gray-600 dark:hover:border-gray-300 pb-1"
          >
            {data.contact.email}
            <ArrowUpRight className="w-5 h-5" />
          </a>
        </div>
      </section>
    </main>
  );
}
