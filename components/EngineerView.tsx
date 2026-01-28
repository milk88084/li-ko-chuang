'use client';

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
} from 'lucide-react';
import content from '@/data/content.json';
import { useLanguage } from '@/providers/LanguageProvider';
import { useTheme } from 'next-themes';
import { ProjectShowcase } from './ProjectShowcase';
import { ProjectTimeline } from './ProjectTimeline';

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
};

export function EngineerView() {
  const { language } = useLanguage();
  const { resolvedTheme } = useTheme();
  const t = content[language as LanguageKey];
  const data = t.engineer;
  const isDark = resolvedTheme === 'dark';

  return (
    <main id="view-engineer">
      {/* Hero - Transparent background to show 3D canvas */}
      <section className="min-h-screen flex flex-col justify-center items-center text-center px-6 pt-20 relative z-10 bg-transparent">
        <div className="max-w-3xl mx-auto space-y-8">
          <p className="fade-in-up text-xs font-semibold uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-4 bg-white/50 dark:bg-black/50 px-3 py-1 rounded-full inline-block backdrop-blur-sm">
            {data.hero.badge}
          </p>
          <h1 className="fade-in-up delay-100 text-5xl md:text-7xl font-semibold tracking-tight leading-tight text-gray-900 dark:text-white drop-shadow-sm">
            {data.hero.title} <span className="text-gray-400 dark:text-gray-500">{data.hero.titleHighlight}</span>
          </h1>
          <p className="fade-in-up delay-200 text-lg md:text-xl text-gray-600 dark:text-gray-300 leading-relaxed max-w-2xl mx-auto font-light">
            {data.hero.description} <br className="hidden md:block" />
            {data.hero.descriptionSub}
          </p>

          <div className="fade-in-up delay-300 flex flex-col sm:flex-row gap-4 justify-center pt-8">
            <a
              href="#eng-projects"
              className="group bg-gray-900 dark:bg-white text-white dark:text-black px-8 py-3 rounded-full text-sm font-medium transition-all hover:bg-gray-800 dark:hover:bg-gray-200 hover:scale-105 active:scale-95 flex items-center justify-center gap-2 shadow-lg shadow-gray-200/50 dark:shadow-none"
            >
              {data.hero.ctaText}
              <Code2 className="w-4 h-4 group-hover:translate-y-1 transition-transform" />
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
            <div className="h-1 w-12 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
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

      {/* Project Showcase */}
      <section id="eng-showcase" className="py-24 px-6 bg-gray-50 dark:bg-[#050505] border-y border-gray-100 dark:border-white/5 relative z-10 transition-colors duration-300">
        <div className="max-w-6xl mx-auto">
          <div className="mb-16 text-center">
            <h2 className="text-3xl font-semibold tracking-tight mb-2 text-gray-900 dark:text-white">
              {data.showcase.title}
            </h2>
            <p className="text-gray-500 dark:text-gray-500 mt-2 font-light">
              {data.showcase.subtitle}
            </p>
          </div>
          <ProjectShowcase 
            projects={data.showcase.projects}
            nextProjectLabel={data.showcase.nextProject}
            viewProjectLabel={data.showcase.viewProject}
            isDark={isDark}
          />
        </div>
      </section>

      {/* Experience */}
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
              <div key={index} className="relative md:grid md:grid-cols-[1fr_3fr] md:gap-10">
                <div className="hidden md:block text-right pt-1">
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {item.period}
                  </span>
                </div>
                <div className={`absolute -left-[37px] top-2 h-4 w-4 rounded-full border-4 border-gray-50 dark:border-[#050505] ${index === 0 ? 'bg-gray-900 dark:bg-white' : 'bg-gray-300 dark:bg-gray-600'} md:hidden`}></div>
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

      {/* Now Page */}
      <section id="eng-now" className="py-24 px-6 bg-white dark:bg-[#0a0a0a] relative z-10 transition-colors duration-300">
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
                <div key={index} className="bg-gray-50 dark:bg-[#1C1C1E] p-6 rounded-xl border border-gray-100 dark:border-white/10 transition-colors duration-300">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                    {IconComponent && <IconComponent className="w-4 h-4 text-gray-400" />} {item.title}
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

      {/* Tech Stack */}
      <section className="py-24 px-6 bg-white dark:bg-[#0a0a0a] border-t border-gray-100 dark:border-white/5 relative z-10 transition-colors duration-300">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-semibold tracking-tight text-gray-900 dark:text-white">
              {data.techStack.title}
            </h2>
            <p className="text-gray-500 dark:text-gray-500 mt-2 font-light">
              {data.techStack.subtitle}
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {data.techStack.items.map((item, index) => {
              const IconComponent = iconMap[item.icon as keyof typeof iconMap];
              return (
                <div key={index} className="bg-gray-50 dark:bg-[#1C1C1E] p-6 rounded-2xl border border-gray-100 dark:border-white/10 flex flex-col items-center justify-center group transition-colors duration-300">
                  {IconComponent && <IconComponent className={`w-8 h-8 mb-3 text-gray-400 group-hover:text-${item.hoverColor} transition-colors`} />}
                  <span className="text-gray-900 dark:text-white font-medium">{item.name}</span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Projects */}
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
          />
        </div>
      </section>

      

      {/* Contact CTA */}
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
