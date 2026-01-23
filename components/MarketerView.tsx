'use client';

import {
  Presentation,
  BarChart,
  Globe,
  LineChart,
  Search,
  Users,
  PenTool,
  ArrowUpRight,
} from 'lucide-react';
import content from '@/data/content.json';
import { useLanguage } from '@/providers/LanguageProvider';

type ContentType = typeof content;
type LanguageKey = keyof ContentType;

const iconMap = {
  Presentation,
  BarChart,
  Globe,
  LineChart,
  Search,
  Users,
  PenTool,
};

export function MarketerView() {
  const { language } = useLanguage();
  const t = content[language as LanguageKey];
  const data = t.marketer;

  return (
    <main id="view-marketing">
      {/* Hero - Transparent background to show 3D canvas */}
      <section className="min-h-screen flex flex-col justify-center items-center text-center px-6 pt-20 relative z-10 bg-transparent">
        <div className="max-w-3xl mx-auto space-y-8">
          <p className="fade-in-up text-xs font-semibold uppercase tracking-widest text-amber-600 dark:text-amber-400 mb-4 bg-white/50 dark:bg-black/50 px-3 py-1 rounded-full inline-block backdrop-blur-sm">
            {data.hero.badge}
          </p>
          <h1 className="fade-in-up delay-100 text-5xl md:text-7xl font-semibold tracking-tight leading-tight text-gray-900 dark:text-white drop-shadow-sm">
            {data.hero.title} <span className="text-amber-600 dark:text-amber-400">{data.hero.titleHighlight}</span>
          </h1>
          <p className="fade-in-up delay-200 text-lg md:text-xl text-gray-600 dark:text-gray-300 leading-relaxed max-w-2xl mx-auto font-light">
            {data.hero.description} <br className="hidden md:block" />
            {data.hero.descriptionSub}
          </p>

          <div className="fade-in-up delay-300 flex flex-col sm:flex-row gap-4 justify-center pt-8">
            <a
              href="#mkt-projects"
              className="group bg-amber-600 dark:bg-amber-500 text-white px-8 py-3 rounded-full text-sm font-medium transition-all hover:bg-amber-700 dark:hover:bg-amber-400 hover:scale-105 active:scale-95 flex items-center justify-center gap-2 shadow-lg shadow-amber-200/50 dark:shadow-none"
            >
              {data.hero.ctaText}
              <Presentation className="w-4 h-4 group-hover:translate-y-1 transition-transform" />
            </a>
          </div>
        </div>
      </section>

      {/* Philosophy */}
      <section className="py-24 px-6 bg-white dark:bg-[#0a0a0a] relative z-10 transition-colors duration-300">
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
            <p>
              {data.philosophy.content}
            </p>
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
              <div key={index} className="relative md:grid md:grid-cols-[1fr_3fr] md:gap-10">
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
              const IconComponent = iconMap[project.icon as keyof typeof iconMap];
              const bgColorClass = project.bgColor === 'amber' ? 'bg-amber-50' : 'bg-purple-50';
              const gradientClass = project.bgColor === 'amber' 
                ? 'from-amber-50 to-amber-100' 
                : 'from-purple-50 to-purple-100';
              const iconColorClass = project.bgColor === 'amber' ? 'text-amber-300' : 'text-purple-300';
              
              return (
                <article key={index} className="group block bg-white dark:bg-[#1C1C1E] rounded-3xl overflow-hidden border border-gray-100 dark:border-white/10 shadow-sm hover:shadow-xl dark:shadow-none transition-all duration-300">
                  <div className={`aspect-video w-full overflow-hidden ${bgColorClass} dark:bg-gray-800 relative`}>
                    <div className={`absolute inset-0 bg-gradient-to-tr ${gradientClass} dark:from-gray-800 dark:to-gray-900 group-hover:scale-105 transition-transform duration-500`}></div>
                    <div className="absolute inset-0 flex items-center justify-center opacity-50 group-hover:opacity-100 transition-opacity">
                      {IconComponent && <IconComponent className={`w-12 h-12 ${iconColorClass} dark:text-gray-500`} />}
                    </div>
                  </div>
                  <div className="p-8">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                      {project.title}
                    </h3>
                    <p className={`text-xs font-mono text-${project.techColor}-600 dark:text-${project.techColor}-400 mb-6 bg-${project.techColor}-50 dark:bg-${project.techColor}-900/30 inline-block px-2 py-1 rounded`}>
                      {project.tech}
                    </p>
                    <div className="space-y-2 text-sm">
                      <p className="text-gray-600 dark:text-gray-400 font-light">
                        <strong>{data.projects.problemLabel}:</strong> {project.problem}
                      </p>
                      <p className="text-gray-600 dark:text-gray-400 font-light">
                        <strong>{data.projects.resultLabel}:</strong> {project.result}
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
      <section className="py-24 px-6 bg-gray-50 dark:bg-[#050505] border-t border-gray-100 dark:border-white/5 relative z-10 transition-colors duration-300">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-semibold tracking-tight text-gray-900 dark:text-white">
              {data.marketingStack.title}
            </h2>
            <p className="text-gray-500 dark:text-gray-500 mt-2 font-light">
              {data.marketingStack.subtitle}
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {data.marketingStack.items.map((item, index) => {
              const IconComponent = iconMap[item.icon as keyof typeof iconMap];
              return (
                <div key={index} className="bg-amber-50 dark:bg-[#1C1C1E] p-6 rounded-2xl border border-amber-100 dark:border-white/10 flex flex-col items-center justify-center group transition-colors duration-300">
                  {IconComponent && <IconComponent className={`w-8 h-8 mb-3 text-amber-400 group-hover:text-${item.hoverColor} transition-colors`} />}
                  <span className="text-gray-900 dark:text-white font-medium">
                    {item.name}
                  </span>
                </div>
              );
            })}
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
