'use client';

import {
  Mic,
  Play,
  Instagram,
  Youtube,
  Heart,
  Coffee,
  Sparkles,
  Camera,
  Music,
  BookOpen,
  ArrowUpRight,
  Quote,
} from 'lucide-react';
import content from '@/data/content.json';
import { useLanguage } from '@/providers/LanguageProvider';

type ContentType = typeof content;
type LanguageKey = keyof ContentType;

const iconMap = {
  Mic,
  Play,
  Instagram,
  Youtube,
  Heart,
  Coffee,
  Sparkles,
  Camera,
  Music,
  BookOpen,
};

export function CreatorView() {
  const { language } = useLanguage();
  const t = content[language as LanguageKey];
  const data = t.creator;

  return (
    <main id="view-creator">
      {/* Hero - Transparent background to show 3D canvas */}
      <section className="min-h-screen flex flex-col justify-center items-center text-center px-6 pt-20 relative z-10 bg-transparent">
        <div className="max-w-3xl mx-auto space-y-8">
          <p className="fade-in-up text-xs font-semibold uppercase tracking-widest text-pink-500 dark:text-pink-400 mb-4 bg-white/50 dark:bg-black/50 px-3 py-1 rounded-full inline-block backdrop-blur-sm">
            {data.hero.badge}
          </p>
          <h1 className="fade-in-up delay-100 text-5xl md:text-7xl font-semibold tracking-tight leading-tight text-gray-900 dark:text-white drop-shadow-sm">
            {data.hero.title} <span className="text-pink-500 dark:text-pink-400">{data.hero.titleHighlight}</span>
          </h1>
          <p className="fade-in-up delay-200 text-lg md:text-xl text-gray-600 dark:text-gray-300 leading-relaxed max-w-2xl mx-auto font-light">
            {data.hero.description}<br className="hidden md:block" />
            {data.hero.descriptionSub}
          </p>

          <div className="fade-in-up delay-300 flex flex-col sm:flex-row gap-4 justify-center pt-8">
            <a
              href="#podcast"
              className="group bg-pink-500 dark:bg-pink-500 text-white px-8 py-3 rounded-full text-sm font-medium transition-all hover:bg-pink-600 dark:hover:bg-pink-400 hover:scale-105 active:scale-95 flex items-center justify-center gap-2 shadow-lg shadow-pink-200/50 dark:shadow-none"
            >
              {data.hero.ctaPrimary}
              <Mic className="w-4 h-4 group-hover:scale-110 transition-transform" />
            </a>
            <a
              href="#social"
              className="group bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-8 py-3 rounded-full text-sm font-medium transition-all hover:bg-gray-100 dark:hover:bg-gray-700 hover:scale-105 active:scale-95 flex items-center justify-center gap-2 border border-gray-200 dark:border-gray-700"
            >
              {data.hero.ctaSecondary}
              <Instagram className="w-4 h-4 group-hover:scale-110 transition-transform" />
            </a>
          </div>
        </div>
      </section>

      {/* About / Life Philosophy */}
      <section className="py-24 px-6 bg-white dark:bg-[#0a0a0a] relative z-10 transition-colors duration-300">
        <div className="max-w-3xl mx-auto">
          <div className="mb-12">
            <h2 className="text-3xl font-semibold tracking-tight mb-2 text-gray-900 dark:text-white">
              {data.about.title}
            </h2>
            <div className="h-1 w-12 bg-pink-200 dark:bg-pink-900 rounded-full"></div>
          </div>
          <div className="prose prose-lg prose-gray dark:prose-invert text-gray-600 dark:text-gray-400 font-light leading-loose">
            <p className="mb-6 text-xl text-gray-800 dark:text-gray-200 flex items-start gap-3">
              <Quote className="w-6 h-6 text-pink-400 flex-shrink-0 mt-1" />
              {data.about.quote}
            </p>
            <p>
              {data.about.content}
            </p>
          </div>
        </div>
      </section>

      {/* Podcast Section */}
      <section
        id="podcast"
        className="py-24 px-6 bg-gray-50 dark:bg-[#050505] border-y border-gray-100 dark:border-white/5 relative z-10 transition-colors duration-300"
      >
        <div className="max-w-4xl mx-auto">
          <div className="bg-white dark:bg-[#1C1C1E] rounded-[2rem] p-8 md:p-12 border border-gray-200/50 dark:border-white/10 shadow-xl shadow-gray-100/50 dark:shadow-none overflow-hidden relative group transition-colors duration-300">
            {/* Hover Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-pink-50/50 dark:via-pink-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none transform -skew-x-12 translate-x-full group-hover:-translate-x-full"></div>

            <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12 relative z-10">
              <div className="w-40 h-40 md:w-48 md:h-48 rounded-2xl bg-gradient-to-br from-pink-100 to-pink-300 dark:from-pink-900 dark:to-pink-800 shadow-inner flex items-center justify-center flex-shrink-0 border border-pink-100 dark:border-white/10">
                <Mic className="w-12 h-12 text-pink-500 dark:text-pink-300" />
              </div>

              <div className="text-center md:text-left space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-pink-50 dark:bg-pink-900/30 rounded-full border border-pink-100 dark:border-transparent">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                  <span className="text-xs font-semibold uppercase tracking-wide text-pink-600 dark:text-pink-300">
                    {data.podcast.badge}
                  </span>
                </div>

                <h2 className="text-3xl md:text-4xl font-semibold text-gray-900 dark:text-white tracking-tight">
                  {data.podcast.title}{' '}
                  <span className="text-gray-300 dark:text-gray-600 font-light">
                    {data.podcast.titleSub}
                  </span>
                </h2>

                <p className="text-gray-600 dark:text-gray-400 font-light leading-relaxed max-w-md">
                  {data.podcast.description}
                </p>

                <div className="pt-4 flex flex-wrap justify-center md:justify-start gap-3">
                  <a
                    href="#"
                    className="px-6 py-2 bg-gray-900 dark:bg-white text-white dark:text-black rounded-full text-sm font-medium hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors flex items-center gap-2"
                  >
                    <Play className="w-3 h-3 fill-current" /> Apple Podcasts
                  </a>
                  <a
                    href="#"
                    className="px-6 py-2 bg-green-500 text-white rounded-full text-sm font-medium hover:bg-green-600 transition-colors flex items-center gap-2"
                  >
                    <Play className="w-3 h-3 fill-current" /> Spotify
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Episodes */}
          <div className="mt-12 space-y-6">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              {data.podcast.episodesTitle}
            </h3>
            <div className="grid gap-4">
              {data.podcast.episodes.map((episode, index) => (
                <a
                  key={index}
                  href="#"
                  className="flex items-center justify-between p-4 bg-white dark:bg-[#1C1C1E] rounded-xl border border-gray-100 dark:border-white/10 hover:shadow-md transition-all group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-pink-100 dark:bg-pink-900/30 flex items-center justify-center">
                      <Play className="w-4 h-4 text-pink-500 group-hover:scale-110 transition-transform" />
                    </div>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {episode.title}
                    </span>
                  </div>
                  <span className="text-sm text-gray-400">{episode.duration}</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Social Media / Interests */}
      <section
        id="social"
        className="py-24 px-6 bg-white dark:bg-[#0a0a0a] relative z-10 transition-colors duration-300"
      >
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-semibold tracking-tight text-gray-900 dark:text-white">
              {data.interests.title}
            </h2>
            <p className="text-gray-500 dark:text-gray-500 mt-2 font-light">
              {data.interests.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-12">
            {data.interests.items.map((item, index) => {
              const IconComponent = iconMap[item.icon as keyof typeof iconMap];
              return (
                <div key={index} className="bg-gray-50 dark:bg-[#1C1C1E] p-6 rounded-2xl border border-gray-100 dark:border-white/10 flex flex-col items-center justify-center group transition-colors duration-300">
                  {IconComponent && <IconComponent className={`w-8 h-8 mb-3 text-gray-400 group-hover:text-${item.hoverColor} transition-colors`} />}
                  <span className="text-gray-900 dark:text-white font-medium">{item.name}</span>
                </div>
              );
            })}
          </div>

          {/* Social Links */}
          <div className="text-center">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
              {data.interests.socialTitle}
            </h3>
            <div className="flex flex-wrap justify-center gap-4">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full hover:opacity-90 transition-opacity"
              >
                <Instagram className="w-5 h-5" />
                <span className="font-medium">Instagram</span>
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-6 py-3 bg-red-500 text-white rounded-full hover:opacity-90 transition-opacity"
              >
                <Youtube className="w-5 h-5" />
                <span className="font-medium">YouTube</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Life Values */}
      <section className="py-24 px-6 bg-gray-50 dark:bg-[#050505] border-t border-gray-100 dark:border-white/5 relative z-10 transition-colors duration-300">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-semibold tracking-tight text-gray-900 dark:text-white">
              {data.values.title}
            </h2>
            <p className="text-gray-500 dark:text-gray-500 mt-2 font-light">
              {data.values.subtitle}
            </p>
          </div>

          <div className="space-y-8">
            {data.values.items.map((value, index) => {
              const IconComponent = iconMap[value.icon as keyof typeof iconMap];
              return (
                <div
                  key={index}
                  className="flex gap-6 p-6 bg-white dark:bg-[#1C1C1E] rounded-2xl border border-gray-100 dark:border-white/10 transition-colors duration-300"
                >
                  <div className="w-12 h-12 rounded-xl bg-pink-50 dark:bg-pink-900/30 flex items-center justify-center flex-shrink-0">
                    {IconComponent && <IconComponent className="w-6 h-6 text-pink-500" />}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                      {value.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 font-light">
                      {value.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Contact CTA */}
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
            className="inline-flex items-center gap-2 text-xl font-medium text-gray-900 dark:text-white hover:text-pink-500 dark:hover:text-pink-400 transition-colors border-b border-gray-900 dark:border-white hover:border-pink-500 dark:hover:border-pink-400 pb-1"
          >
            {data.contact.email}
            <ArrowUpRight className="w-5 h-5" />
          </a>
        </div>
      </section>
    </main>
  );
}
