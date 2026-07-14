"use client";

import {
  useState,
  useCallback,
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
  User,
  MessageCircle,
} from "lucide-react";
import content from "@/data/content.json";
import { useLanguage } from "@/providers/LanguageProvider";
import { useTheme } from "next-themes";
import Image from "next/image";
import { ProjectShowcase } from "./ProjectShowcase";
import { ProjectTimeline } from "./ProjectTimeline";
import { MediumArticles } from "./MediumArticles";

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

// Frosted-glass floating card with a violet tint, light border, and stacked
// shadow plates beneath — tilted in 3D so every card faces the same direction.
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
      {/* Stacked layers peeking out below to fake a deck-of-cards shadow */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 translate-y-[9px] scale-[0.965] rounded-3xl border border-black/5 bg-black/4 backdrop-blur-md dark:border-white/10 dark:bg-white/5"
      />
      <div
        aria-hidden
        className="absolute inset-0 -z-20 translate-y-[18px] scale-[0.92] rounded-3xl border border-black/3 bg-black/2 dark:border-white/6 dark:bg-white/2.5"
      />
      {/* Main glass surface */}
      <div
        className={`relative rounded-3xl border border-black/10 p-5 text-left backdrop-blur-xl dark:border-white/20 ${className ?? ""}`}
        style={{
          backgroundImage: isDark
            ? "linear-gradient(140deg, rgba(255,255,255,0.14), rgba(168,85,247,0.10))"
            : "linear-gradient(140deg, rgba(255,255,255,0.85), rgba(255,255,255,0.6))",
          boxShadow: isDark
            ? "inset 0 1px 0 rgba(255,255,255,0.18), 0 8px 18px -6px rgba(168,85,247,0.5), 0 24px 40px -16px rgba(139,92,246,0.4), 0 48px 70px -30px rgba(120,60,220,0.35)"
            : "inset 0 1px 0 rgba(255,255,255,0.7), 0 8px 18px -6px rgba(0,0,0,0.12), 0 24px 40px -16px rgba(0,0,0,0.10), 0 48px 70px -30px rgba(0,0,0,0.08)",
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
    <div
      aria-hidden
      className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-40 backdrop-blur-xl"
      style={{
        background: `linear-gradient(to bottom, transparent, ${toColor})`,
        WebkitMaskImage: "linear-gradient(to bottom, transparent, black 55%)",
        maskImage: "linear-gradient(to bottom, transparent, black 55%)",
      }}
    />
  );
}

export function EngineerView() {
  const { language } = useLanguage();
  const { resolvedTheme } = useTheme();
  const t = content[language as LanguageKey];
  const data = t.engineer;
  const isDark = resolvedTheme === "dark";
  const [activeProjectIndex, setActiveProjectIndex] = useState(0);

  const offlineHighlightTitle =
    language === "en" ? "Offline Event Highlights" : "線下活動精華回顧";

  const offlineHighlights = [
    {
      name: "OpenClaw Meetup",
      time: "2026/03/04",
      imageSrc: "/meetup_01.jpg",
    },
    {
      name: "Dify AI Meetup",
      time: "2026/01/22",
      imageSrc: "/meetup_02.jpg",
    },
    {
      name: "claude code Meetup",
      time: "2025/12/30",
      imageSrc: "/meetup_03.jpg",
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

  // Day/night hero background: a deep colorful night gradient in dark mode; a
  // clean white base with no purple in light mode.
  const heroBackground = isDark
    ? "radial-gradient(85% 65% at 78% 34%, rgba(232,72,214,0.32), transparent 55%)," +
      "radial-gradient(75% 55% at 44% 26%, rgba(147,89,241,0.36), transparent 55%)," +
      "radial-gradient(72% 65% at 12% 92%, rgba(250,190,120,0.3), transparent 50%)," +
      "linear-gradient(180deg, #000000 0%, #0a0510 22%, #1c0f30 55%, #170a24 80%, #0a0508 100%)"
    : "radial-gradient(100% 90% at 50% 8%, rgba(0,0,0,0.03), transparent 60%)," +
      "linear-gradient(180deg, #ffffff 0%, #f5f5f7 100%)";
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
    <main id="view-engineer">
      <section className="relative z-10 flex min-h-screen flex-col items-center overflow-hidden px-6 pb-0 pt-28 text-center md:h-screen md:pt-16">
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

        {/* Centre-aligned header */}
        <div className="relative z-30 mx-auto max-w-3xl md:shrink-0">
          <h1
            className="fade-in-up delay-100 text-4xl font-bold leading-[1.08] tracking-tight md:text-[clamp(4rem,5.5vh,3.75rem)]"
            style={{
              backgroundImage: titleGradient,
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              WebkitTextFillColor: "transparent",
              color: "transparent",
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

        {/* Stage: central phone + asymmetrical floating glass cards.
            This outer div's fade-in animation makes browsers promote it to
            its own stacking context, so the blurred bridge below is nested
            inside it (not a sibling) — otherwise the bridge's z-20 would
            always paint over this whole subtree regardless of the cards'
            z-30. */}
        <div className="fade-in delay-300 relative mt-auto h-[440px] w-full md:h-[42vh] md:min-h-[280px]">
          <div className="relative mx-auto h-full w-full max-w-5xl">
            {/* Left top card — Complete your Profile (slight depth-of-field blur) */}
            <div className="absolute left-0 top-0 z-30 hidden md:block">
              <div className="animate-float" style={{ filter: "blur(0.4px)" }}>
                <FloatingGlassCard
                  className="w-[230px]"
                  style={{ transform: cardTilt }}
                  isDark={isDark}
                >
                  <div className="flex items-center gap-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-linear-to-br from-fuchsia-400/80 to-violet-500/80">
                      <User className="h-4 w-4 text-white" />
                    </span>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                      Complete your Profile
                    </p>
                  </div>
                  <p className="mt-3 text-xs font-light leading-relaxed text-gray-500 dark:text-white/55">
                    Create a profile in your style
                  </p>
                </FloatingGlassCard>
              </div>
            </div>

            {/* Left bottom card — Fast processing of requests */}
            <div className="absolute left-4 z-30 hidden md:block md:bottom-[2vh]">
              <div className="animate-float" style={{ animationDelay: "1.5s" }}>
                <FloatingGlassCard
                  className="w-[240px]"
                  style={{ transform: cardTilt }}
                  isDark={isDark}
                >
                  <p className="text-sm font-semibold leading-snug text-gray-900 dark:text-white">
                    Fast processing of requests according
                  </p>
                  <div className="mt-3 flex items-center gap-2 rounded-full border border-black/10 bg-black/3 px-3 py-2 dark:border-white/10 dark:bg-white/5">
                    <MessageCircle className="h-3.5 w-3.5 text-gray-400 dark:text-white/60" />
                    <span className="text-xs font-light text-gray-500 dark:text-white/60">
                      How can I help you?
                    </span>
                  </div>
                </FloatingGlassCard>
              </div>
            </div>

            {/* Right card — pricing / plans */}
            <div className="absolute right-0 top-4 z-30 hidden md:block">
              <div className="animate-float" style={{ animationDelay: "0.8s" }}>
                <FloatingGlassCard
                  className="w-[210px]"
                  style={{ transform: cardTilt }}
                  isDark={isDark}
                >
                  <div className="space-y-2.5">
                    {[
                      { name: "Monthly", price: "$25 / month", best: false },
                      { name: "Yearly", price: "$180 / year", best: true },
                      { name: "Ultimate", price: "$490", best: false },
                    ].map((plan) => (
                      <div
                        key={plan.name}
                        className={`flex items-center justify-between rounded-xl border px-3 py-2.5 ${
                          plan.best
                            ? "border-black/10 bg-black/5 dark:border-white/25 dark:bg-white/15"
                            : "border-black/6 bg-black/2 dark:border-white/10 dark:bg-white/4"
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

            {/* Central phone mockup image — enlarged, flush to the bottom */}
            <div className="absolute bottom-0 left-1/2 z-0 -translate-x-1/2">
              <Image
                src="/engineer_hero.png"
                alt="LI KO CHUANG portfolio shown on an iPhone held in hand"
                width={1024}
                height={926}
                priority
                className="w-[380px] max-w-none drop-shadow-[0_40px_90px_-30px_rgba(0,0,0,0.25)] md:w-[46vh] md:min-w-[450px] dark:drop-shadow-[0_45px_120px_-25px_rgba(168,85,247,0.6)]"
                style={{ animationDelay: "0.4s" }}
              />
            </div>
          </div>

          {/* Blurred bridge so the hero melts into the next section — kept
              inside the Stage box's stacking context so it can sit between
              the phone (z-0) and the cards (z-30) above. */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-40 backdrop-blur-xl"
            style={{
              background: `linear-gradient(to bottom, transparent, ${fadeToWhite})`,
              WebkitMaskImage:
                "linear-gradient(to bottom, transparent, black 55%)",
              maskImage: "linear-gradient(to bottom, transparent, black 55%)",
            }}
          />
        </div>
      </section>

      <section
        id="eng-intro"
        className="relative z-10 flex flex-col justify-center overflow-hidden bg-white px-6 py-20 transition-colors duration-300 md:h-screen md:py-10 dark:bg-[#0a0a0a]"
      >
        <div className="mx-auto w-full max-w-6xl">
          {/* Giant headline — kept above the enlarged phone mockup (z-30 vs
              the phone's z-20) so it never gets visually covered. A drop
              shadow keeps it legible where it overlaps the phone's light
              bezel/screen, since z-index alone doesn't guarantee contrast. */}
          <h2
            className="relative z-30 text-center text-[15vw] font-bold leading-[0.9] tracking-tighter text-gray-900 md:text-[clamp(3rem,9vh,8.5rem)] dark:text-white"
            style={{
              filter: isDark
                ? "drop-shadow(0 2px 16px rgba(0,0,0,0.7))"
                : "drop-shadow(0 2px 16px rgba(255,255,255,0.85))",
            }}
          >
            {data.philosophy.title}
          </h2>

          {/* Banner with a phone breaking out of its bounds */}
          <div className="relative mt-8 md:mt-[3vh]">
            <div className="relative min-h-[400px] overflow-hidden rounded-4xl bg-white dark:bg-[#0a0a0a] md:h-[34vh] md:min-h-[260px] md:rounded-[2.5rem]">
              {/* Blended monochrome photo on the right */}
              <div className="absolute inset-y-0 right-0 w-2/3 md:w-1/2">
                <Image
                  src="/engineer_intro_bg.webp"
                  alt="Working with people"
                  fill
                  sizes="(max-width: 768px) 66vw, 50vw"
                  className="object-cover grayscale"
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
              <Image
                src="/engineer_intro.png"
                alt="LI KO CHUANG site shown on a tilted iPhone"
                width={808}
                height={1024}
                className="w-[300px] drop-shadow-[0_50px_90px_-25px_rgba(60,70,150,0.5)] md:h-[calc(70vh_-_2.8rem)] md:w-auto md:min-h-[380px]"
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
        className="relative z-10 flex flex-col justify-center overflow-hidden py-20 px-6 bg-gray-50 dark:bg-[#050505] border-y border-gray-100 dark:border-white/5 transition-colors duration-300 md:h-screen md:py-10"
      >
        <div className="mx-auto w-full max-w-6xl">
          <ProjectShowcase
            projects={data.showcase.projects}
            nextProjectLabel={data.showcase.nextProject}
            viewProjectLabel={data.showcase.viewProject}
            isDark={isDark}
            onProjectChange={handleShowcaseProjectChange}
          />
        </div>
      </section>
      <div></div>

      <section
        id="eng-work"
        className="py-24 px-6 bg-gray-50 dark:bg-[#050505] border-y border-gray-100 dark:border-white/5 relative z-10 transition-colors duration-300"
      >
        <div className="max-w-3xl mx-auto">
          <div className="mb-16">
            <h2 className="text-3xl font-semibold tracking-tight mb-2 text-gray-900 dark:text-white">
              {data.experience.title}
            </h2>
            <p className="text-gray-500 dark:text-gray-500 mt-2 font-light">
              {data.experience.subtitle}
            </p>
          </div>
          <div className="space-y-12 relative border-l border-gray-200 dark:border-gray-700 ml-3 md:ml-0 pl-8 md:pl-0">
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
          <div className="flex items-center gap-3 mb-8">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            <h2 className="text-xs font-bold uppercase tracking-widest text-gray-500 dark:text-gray-500">
              {data.now.title}
            </h2>
          </div>
          <h3 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-white">
            {data.now.subtitle}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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

      <section className="py-24 bg-white dark:bg-[#0a0a0a] border-t border-gray-100 dark:border-white/5 relative z-10 transition-colors duration-300 overflow-hidden">
        <div className="max-w-4xl mx-auto px-6 mb-16 text-center">
          <h2 className="text-3xl font-semibold tracking-tight text-gray-900 dark:text-white">
            {data.techStack.title}
          </h2>
          <p className="text-gray-500 dark:text-gray-500 mt-2 font-light">
            {data.techStack.subtitle}
          </p>
        </div>

        <div className="flex flex-col gap-8">
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
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-semibold tracking-tight mb-2 text-gray-900 dark:text-white">
              {data.projects.title}
            </h2>
            <p className="text-gray-500 dark:text-gray-500 mt-2 font-light">
              {data.projects.subtitle}
            </p>
          </div>
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
        <SectionBridge toColor={fadeToWhite} />
      </section>

      <section
        id="eng-articles"
        className="py-24 px-6 bg-white dark:bg-[#0a0a0a] border-t border-gray-100 dark:border-white/5 relative z-10 transition-colors duration-300"
      >
        <div className="max-w-5xl mx-auto">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-semibold tracking-tight mb-2 text-gray-900 dark:text-white">
              {data.mediumArticles.title}
            </h2>
            <p className="text-gray-500 dark:text-gray-500 mt-2 font-light">
              {data.mediumArticles.subtitle}
            </p>
          </div>
          <MediumArticles
            readMore={data.mediumArticles.readMore}
            viewAll={data.mediumArticles.viewAll}
            loading={data.mediumArticles.loading}
            noArticles={data.mediumArticles.noArticles}
            mediumUrl={data.mediumArticles.mediumUrl}
          />
        </div>
        <SectionBridge toColor={fadeToGray} />
      </section>
      <section
        id="eng-offline-highlight"
        className="py-24 px-6 bg-gray-50 dark:bg-[#050505] border-t border-gray-100 dark:border-white/5 relative z-10 transition-colors duration-300 overflow-hidden"
      >
        <div className="max-w-3xl mx-auto">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-semibold tracking-tight text-gray-900 dark:text-white">
              {offlineHighlightTitle}
            </h2>
          </div>

          <div className="space-y-10">
            {offlineHighlights.map((item, index) => (
              <div
                key={`${item.name}-${index}`}
                className={`grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch fade-in-up ${
                  index === 0
                    ? "delay-100"
                    : index === 1
                      ? "delay-200"
                      : "delay-300"
                }`}
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

      <section className="py-24 px-6 bg-gray-50 dark:bg-[#050505] border-t border-gray-100 dark:border-white/5 text-center relative z-10 transition-colors duration-300">
        <div className="max-w-2xl mx-auto space-y-8">
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
