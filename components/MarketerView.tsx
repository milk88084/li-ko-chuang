"use client";

import {
  Presentation,
  BarChart,
  Globe,
  LineChart,
  Search,
  Users,
  ArrowUpRight,
  FileText,
  MessageCircle,
  Megaphone,
  Store,
  Send,
  Wallet,
  Share2,
  Sparkles,
  Handshake,
} from "lucide-react";
import Image from "next/image";
import content from "@/data/content.json";
import { useLanguage } from "@/providers/LanguageProvider";

type ContentType = typeof content;
type LanguageKey = keyof ContentType;

const iconMap = {
  Presentation,
  BarChart,
  Globe,
  LineChart,
  Search,
  Users,
  FileText,
  MessageCircle,
  Megaphone,
  Store,
  Send,
  Wallet,
  Share2,
  Sparkles,
  Handshake,
};

export function MarketerView() {
  const { language } = useLanguage();
  const t = content[language as LanguageKey];
  const data = t.marketer;

  return (
    <main id="view-marketing">
      {/* Hero - Transparent background to show 3D canvas */}
      {/* Hero - Transparent background to show 3D canvas */}
      <section className="h-screen flex flex-col justify-center items-center text-center px-6 pt-24 relative z-10 bg-transparent overflow-hidden">
        {/* Background Decorative Elements */}
        <div className="absolute top-1/4 -left-20 w-80 h-80 bg-amber-500/10 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-amber-600/10 rounded-full blur-[120px] pointer-events-none"></div>

        <div className="max-w-4xl mx-auto space-y-6 md:space-y-8 relative">
          <div className="fade-in-up flex justify-center">
            <span className="px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-[0.2em] bg-amber-500/10 dark:bg-amber-400/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 backdrop-blur-md shadow-sm">
              {data.hero.badge}
            </span>
          </div>

          <div className="space-y-4">
            <h1 className="fade-in-up delay-100 text-5xl md:text-7xl font-bold tracking-tight text-gray-900 dark:text-white leading-[1.1]">
              {data.hero.title} <br />
              <span className="relative inline-block">
                <span className="relative z-10 text-transparent bg-clip-text bg-linear-to-r from-amber-600 to-amber-400 dark:from-amber-400 dark:to-amber-200">
                  {data.hero.titleHighlight}
                </span>
                <div className="absolute -bottom-2 left-0 w-full h-3 bg-amber-500/10 -rotate-1"></div>
              </span>
            </h1>

            <p className="fade-in-up delay-200 text-lg md:text-xl text-gray-600 dark:text-gray-400 leading-relaxed max-w-2xl mx-auto font-light">
              <span className="text-gray-900 dark:text-white font-medium">
                {data.hero.description}
              </span>
              <br className="hidden md:block" />
              <span className="text-gray-500 dark:text-gray-500">
                {data.hero.descriptionSub}
              </span>
            </p>
          </div>

          <div className="fade-in-up delay-300 flex flex-col sm:flex-row gap-4 justify-center pt-4 md:pt-6">
            <a
              href="#marketer-intro"
              className="group bg-gray-900 dark:bg-white text-white dark:text-black px-8 py-3 rounded-full text-sm font-medium transition-all hover:bg-gray-800 dark:hover:bg-gray-200 hover:scale-105 active:scale-95 flex items-center justify-center gap-2 shadow-lg shadow-gray-200/50 dark:shadow-none"
            >
              {data.hero.ctaText}
              <ArrowUpRight className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </a>
          </div>
        </div>
      </section>

      {/* Philosophy */}
      <section
        id="marketer-intro"
        className="py-24 px-6 bg-white dark:bg-[#0a0a0a] relative z-10 transition-colors duration-300"
      >
        <div className="max-w-3xl mx-auto">
          <div className="mb-12">
            <h2 className="text-3xl font-semibold tracking-tight mb-2 text-gray-900 dark:text-white">
              {data.philosophy.title}
            </h2>
            <div className="h-1 w-12 bg-amber-200 dark:bg-amber-900 rounded-full"></div>
          </div>
          <div className="prose prose-lg prose-gray dark:prose-invert text-gray-600 dark:text-gray-400 font-light leading-loose">
            <p className="mb-6 text-xl text-gray-800 dark:text-gray-200">
              &ldquo;{data.philosophy.quote}&rdquo;
            </p>
            <p>{data.philosophy.content}</p>
          </div>
        </div>
      </section>

      {/* Marketing Experience */}
      <section className="py-24 px-6 bg-gray-50 dark:bg-[#050505] border-y border-gray-100 dark:border-white/5 relative z-10 transition-colors duration-300">
        <div className="max-w-3xl mx-auto">
          <div className="mb-16">
            <h2 className="text-3xl font-semibold tracking-tight mb-2 text-gray-900 dark:text-white">
              {data.experience.title}
            </h2>
            <p className="text-gray-500 dark:text-gray-500 mt-2 font-light">
              {data.experience.subtitle}
            </p>
          </div>
          <div className="space-y-12 relative border-l border-amber-200 dark:border-amber-900 ml-3 md:ml-0 pl-8 md:pl-0">
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
                <div className="absolute -left-[37px] top-2 h-4 w-4 rounded-full border-4 border-gray-50 dark:border-[#050505] bg-amber-600 md:hidden"></div>
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
      </section>

      {/* Marketing Projects */}
      <section
        id="mkt-projects"
        className="py-24 px-6 bg-white dark:bg-[#0a0a0a] relative z-10 transition-colors duration-300"
      >
        <div className="max-w-5xl mx-auto">
          <div className="mb-16">
            <h2 className="text-3xl font-semibold tracking-tight mb-2 text-gray-900 dark:text-white">
              {data.projects.title}
            </h2>
            <p className="text-gray-500 dark:text-gray-500 mt-2 font-light">
              {data.projects.subtitle}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
            {data.projects.items.map((project, index) => {
              const IconComponent =
                iconMap[project.icon as keyof typeof iconMap];
              const bgColorClass =
                project.bgColor === "amber" ? "bg-amber-50" : "bg-purple-50";
              const gradientClass =
                project.bgColor === "amber"
                  ? "from-amber-50 to-amber-100"
                  : "from-purple-50 to-purple-100";
              const iconColorClass =
                project.bgColor === "amber"
                  ? "text-amber-300"
                  : "text-purple-300";

              return (
                <article
                  key={index}
                  className="group block bg-white dark:bg-[#1C1C1E] rounded-3xl overflow-hidden border border-gray-100 dark:border-white/10 shadow-sm hover:shadow-xl dark:shadow-none transition-all duration-300"
                >
                  <div
                    className={`aspect-video w-full overflow-hidden ${bgColorClass} dark:bg-gray-800 relative`}
                  >
                    {project.image ? (
                      <>
                        <Image
                          src={project.image}
                          alt={project.title}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors duration-500" />
                      </>
                    ) : (
                      <>
                        <div
                          className={`absolute inset-0 bg-linear-to-tr ${gradientClass} dark:from-gray-800 dark:to-gray-900 group-hover:scale-105 transition-transform duration-500`}
                        ></div>
                        <div className="absolute inset-0 flex items-center justify-center opacity-50 group-hover:opacity-100 transition-opacity">
                          {IconComponent && (
                            <IconComponent
                              className={`w-12 h-12 ${iconColorClass} dark:text-gray-500`}
                            />
                          )}
                        </div>
                      </>
                    )}
                  </div>
                  <div className="p-8">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                      {project.title}
                    </h3>
                    {/* Project Tech Tag */}
                    {(() => {
                      const colorMap: Record<string, string> = {
                        amber:
                          "text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/30",
                        purple:
                          "text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/30",
                        blue: "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30",
                        pink: "text-pink-600 dark:text-pink-400 bg-pink-50 dark:bg-pink-900/30",
                        indigo:
                          "text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30",
                        green:
                          "text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/30",
                      };
                      const colorClasses =
                        colorMap[project.techColor as keyof typeof colorMap] ||
                        "text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/30";

                      return (
                        <p
                          className={`text-xs font-mono mb-6 inline-block px-2 py-1 rounded ${colorClasses}`}
                        >
                          {project.tech}
                        </p>
                      );
                    })()}
                    <div className="space-y-2 text-sm">
                      <p className="text-gray-600 dark:text-gray-400 font-light">
                        <strong>{data.projects.problemLabel}:</strong>{" "}
                        {project.problem}
                      </p>
                      <p className="text-gray-600 dark:text-gray-400 font-light">
                        <strong>{data.projects.resultLabel}:</strong>{" "}
                        {project.result}
                      </p>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* Marketing Stack */}
      <section className="py-24 bg-white dark:bg-[#0a0a0a] border-t border-gray-100 dark:border-white/5 relative z-10 transition-colors duration-300 overflow-hidden">
        <div className="max-w-4xl mx-auto px-6 mb-16 text-center">
          <h2 className="text-3xl font-semibold tracking-tight text-gray-900 dark:text-white">
            {data.marketingStack.title}
          </h2>
          <p className="text-gray-500 dark:text-gray-500 mt-2 font-light">
            {data.marketingStack.subtitle}
          </p>
        </div>

        <div className="flex flex-col gap-8">
          {/* First Row: Moving Right */}
          <div className="flex whitespace-nowrap overflow-hidden">
            <div className="flex animate-marquee-right gap-6 px-3 w-max">
              {[
                ...data.marketingStack.items,
                ...data.marketingStack.items,
                ...data.marketingStack.items,
                ...data.marketingStack.items,
              ].map((item, index) => {
                const IconComponent =
                  iconMap[item.icon as keyof typeof iconMap];
                return (
                  <div
                    key={`row1-${index}`}
                    className="group relative bg-[#0a0a0a]/5 dark:bg-white/5 px-8 py-6 rounded-2xl border border-gray-900/10 dark:border-white/5 flex items-center gap-4 transition-all duration-500 min-w-[240px] hover:scale-105 cursor-default overflow-hidden hover:border-gray-900/20 dark:hover:border-white/20"
                  >
                    <div className="relative z-10 p-2.5 rounded-xl bg-white dark:bg-white/5 group-hover:bg-white dark:group-hover:bg-white group-hover:scale-110 transition-all duration-500 shadow-sm border border-black/5 dark:border-white/5">
                      {IconComponent && (
                        <IconComponent className="w-5 h-5 text-gray-400 group-hover:text-black transition-colors" />
                      )}
                    </div>
                    <span className="relative z-10 text-gray-700 dark:text-gray-300 font-medium text-lg group-hover:text-black dark:group-hover:text-white transition-colors">
                      {item.name}
                    </span>
                    {/* Subtle Glow Background */}
                    <div
                      className="absolute inset-0 opacity-0 group-hover:opacity-10 dark:group-hover:opacity-20 transition-opacity duration-500 z-0"
                      style={{
                        background: item.hoverColor
                          ? `var(--color-${item.hoverColor})`
                          : "#f59e0b",
                      }}
                    ></div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Second Row: Moving Left */}
          <div className="flex whitespace-nowrap overflow-hidden">
            <div className="flex animate-marquee-left gap-6 px-3 w-max">
              {[
                ...data.marketingStack.items,
                ...data.marketingStack.items,
                ...data.marketingStack.items,
                ...data.marketingStack.items,
              ]
                .reverse()
                .map((item, index) => {
                  const IconComponent =
                    iconMap[item.icon as keyof typeof iconMap];
                  return (
                    <div
                      key={`row2-${index}`}
                      className="group relative bg-[#0a0a0a]/5 dark:bg-white/5 px-8 py-6 rounded-2xl border border-gray-900/10 dark:border-white/5 flex items-center gap-4 transition-all duration-500 min-w-[240px] hover:scale-105 cursor-default overflow-hidden hover:border-gray-900/20 dark:hover:border-white/20"
                    >
                      <div className="relative z-10 p-2.5 rounded-xl bg-white dark:bg-white/5 group-hover:bg-white dark:group-hover:bg-white group-hover:scale-110 transition-all duration-500 shadow-sm border border-black/5 dark:border-white/5">
                        {IconComponent && (
                          <IconComponent className="w-5 h-5 text-gray-400 group-hover:text-black transition-colors" />
                        )}
                      </div>
                      <span className="relative z-10 text-gray-700 dark:text-gray-300 font-medium text-lg group-hover:text-black dark:group-hover:text-white transition-colors">
                        {item.name}
                      </span>
                      {/* Subtle Glow Background */}
                      <div
                        className="absolute inset-0 opacity-0 group-hover:opacity-10 dark:group-hover:opacity-20 transition-opacity duration-500 z-0"
                        style={{
                          background: item.hoverColor
                            ? `var(--color-${item.hoverColor})`
                            : "#f59e0b",
                        }}
                      ></div>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      </section>

      {/* Marketing Contact CTA */}
      <section className="py-24 px-6 bg-white dark:bg-[#0a0a0a] border-t border-gray-100 dark:border-white/5 text-center relative z-10 transition-colors duration-300">
        <div className="max-w-2xl mx-auto space-y-8">
          <h2 className="text-3xl font-semibold tracking-tight text-gray-900 dark:text-white">
            {data.contact.title}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 font-light text-lg">
            {data.contact.description}
          </p>
          <a
            href={`mailto:${data.contact.email}`}
            className="inline-flex items-center gap-2 text-xl font-medium text-gray-900 dark:text-white hover:text-amber-600 dark:hover:text-amber-400 transition-colors border-b border-gray-900 dark:border-white hover:border-amber-600 dark:hover:border-amber-400 pb-1"
          >
            {data.contact.email}
            <ArrowUpRight className="w-5 h-5" />
          </a>
        </div>
      </section>
    </main>
  );
}
