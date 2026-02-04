"use client";

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
  Film,
  Activity,
  Palette,
  Trophy,
} from "lucide-react";
import Image from "next/image";
import content from "@/data/content.json";
import { useLanguage } from "@/providers/LanguageProvider";

type ContentType = typeof content;
type LanguageKey = keyof ContentType;

interface Episode {
  title: string;
  duration: string;
  link: string;
}

interface PodcastData {
  badge: string;
  title: string;
  titleSub: string;
  image: string;
  description: string;
  podcastLink: string;
  spotifyLink: string;
  platforms: { name: string; color: string }[];
  episodesTitle: string;
  episodes: Episode[];
}

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
  Film,
  Activity,
  Palette,
  Trophy,
};

import { useState } from "react";

export function CreatorView() {
  const { language } = useLanguage();
  const t = content[language as LanguageKey];
  const data = t.creator;

  const podcastData: PodcastData = data.podcast;

  const initialEmbed = podcastData.podcastLink
    ? podcastData.podcastLink.replace(
        "podcasts.apple.com",
        "embed.podcasts.apple.com",
      )
    : "";
  const [activeEmbedUrl, setActiveEmbedUrl] = useState(initialEmbed);

  const handleEpisodeClick = (e: React.MouseEvent, link: string) => {
    e.preventDefault();
    const embedLink = link.replace(
      "podcasts.apple.com",
      "embed.podcasts.apple.com",
    );
    setActiveEmbedUrl(embedLink);

    const playerElement = document.getElementById("podcast-player");
    if (playerElement) {
      playerElement.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  return (
    <main id="view-creator">
      <section className="min-h-screen flex flex-col justify-center items-center text-center px-6 pt-20 relative z-10 bg-transparent overflow-hidden">
        <div className="absolute top-1/4 -left-20 w-80 h-80 bg-pink-500/10 rounded-full blur-[120px] pointer-events-none animate-blob"></div>
        <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-purple-600/10 rounded-full blur-[120px] pointer-events-none animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-pink-400/5 rounded-full blur-[140px] pointer-events-none"></div>

        <div className="max-w-4xl mx-auto space-y-10 relative">
          <div className="fade-in-up flex justify-center">
            <span className="px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-[0.2em] bg-pink-500/10 dark:bg-pink-400/10 text-pink-600 dark:text-pink-400 border border-pink-500/20 backdrop-blur-md shadow-sm">
              {data.hero.badge}
            </span>
          </div>

          <div className="space-y-4">
            <h1 className="fade-in-up delay-100 text-6xl md:text-8xl font-bold tracking-tight text-gray-900 dark:text-white leading-[1.1]">
              {data.hero.title} <br />
              <span className="relative inline-block">
                <span className="relative z-10 text-transparent bg-clip-text bg-linear-to-r from-pink-600 to-purple-500 dark:from-pink-400 dark:to-purple-300">
                  {data.hero.titleHighlight}
                </span>
                <div className="absolute -bottom-2 left-0 w-full h-3 bg-pink-500/10 -rotate-1"></div>
              </span>
            </h1>

            <p className="fade-in-up delay-200 text-xl md:text-2xl text-gray-600 dark:text-gray-400 leading-relaxed max-w-2xl mx-auto font-light">
              <span className="text-gray-900 dark:text-white font-medium">
                {data.hero.description}
              </span>
              <br className="hidden md:block" />
              <span className="text-gray-500 dark:text-gray-500">
                {data.hero.descriptionSub}
              </span>
            </p>
          </div>

          <div className="fade-in-up delay-300 flex flex-col sm:flex-row gap-6 justify-center pt-8">
            <a
              href="#podcast"
              className="group relative px-10 py-4 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-full text-base font-semibold transition-all hover:scale-105 active:scale-95 shadow-2xl hover:shadow-pink-500/20 overflow-hidden"
            >
              <div className="absolute inset-0 bg-linear-to-r from-pink-600 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <span className="relative z-10 flex items-center justify-center gap-3">
                {data.hero.ctaPrimary}
                <ArrowUpRight className="w-4 h-4 group-hover:translate-y-1 transition-transform" />
              </span>
            </a>
          </div>
        </div>
      </section>

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
              <Quote className="w-6 h-6 text-pink-400 shrink-0 mt-1" />
              {data.about.quote}
            </p>
            <p>{data.about.content}</p>
          </div>
        </div>
      </section>

      <section
        id="podcast"
        className="py-24 px-6 bg-gray-50 dark:bg-[#050505] border-y border-gray-100 dark:border-white/5 relative z-10 transition-colors duration-300"
      >
        <div className="max-w-4xl mx-auto">
          <div className="bg-white dark:bg-[#1C1C1E] rounded-4xl p-8 md:p-12 border border-gray-200/50 dark:border-white/10 shadow-xl shadow-gray-100/50 dark:shadow-none overflow-hidden relative group transition-colors duration-300">
            <div className="absolute inset-0 bg-linear-to-r from-transparent via-pink-50/50 dark:via-pink-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none transform -skew-x-12 translate-x-full group-hover:-translate-x-full"></div>

            <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12 relative z-10">
              <div className="w-40 h-40 md:w-48 md:h-48 rounded-2xl overflow-hidden shadow-inner shrink-0 border border-pink-100 dark:border-white/10 relative">
                <Image
                  src={
                    podcastData.image ||
                    "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?q=80&w=1000&auto=format&fit=crop"
                  }
                  alt={data.podcast.title}
                  fill
                  className="object-cover"
                />
              </div>

              <div className="text-center md:text-left space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-pink-50 dark:bg-pink-900/30 rounded-full border border-pink-100 dark:border-transparent">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                  <span className="text-xs font-semibold uppercase tracking-wide text-pink-600 dark:text-pink-300">
                    {data.podcast.badge}
                  </span>
                </div>

                <h2 className="text-3xl md:text-4xl font-semibold text-gray-900 dark:text-white tracking-tight">
                  {data.podcast.title}{" "}
                  <span className="text-gray-300 dark:text-gray-600 font-light">
                    {data.podcast.titleSub}
                  </span>
                </h2>

                <p className="text-gray-600 dark:text-gray-400 font-light leading-relaxed max-w-md">
                  {data.podcast.description}
                </p>

                <div className="pt-4 flex flex-wrap justify-center md:justify-start gap-3">
                  {podcastData.podcastLink && (
                    <button
                      onClick={() =>
                        setActiveEmbedUrl(
                          podcastData.podcastLink.replace(
                            "podcasts.apple.com",
                            "embed.podcasts.apple.com",
                          ),
                        )
                      }
                      className="px-6 py-2 bg-gray-900 dark:bg-white text-white dark:text-black rounded-full text-sm font-medium hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors flex items-center gap-2"
                    >
                      <Mic className="w-3 h-3" /> Show Info
                    </button>
                  )}
                  {podcastData.spotifyLink && (
                    <a
                      href={podcastData.spotifyLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-6 py-2 bg-green-500 text-white rounded-full text-sm font-medium hover:bg-green-600 transition-colors flex items-center gap-2"
                    >
                      <Play className="w-3 h-3 fill-current" /> Spotify
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div id="podcast-player" className="mt-12 fade-in">
            <div className="bg-white dark:bg-[#1C1C1E] rounded-3xl border border-gray-100 dark:border-white/10 overflow-hidden shadow-xl aspect-4/3 md:aspect-16/6 min-h-[175px]">
              {activeEmbedUrl && (
                <iframe
                  allow="autoplay *; encrypted-media *; fullscreen *; clipboard-write"
                  frameBorder="0"
                  height="100%"
                  style={{
                    width: "100%",
                    maxWidth: "100%",
                    overflow: "hidden",
                    background: "transparent",
                  }}
                  sandbox="allow-forms allow-popups allow-same-origin allow-scripts allow-storage-access-by-user-activation allow-top-navigation-by-user-activation"
                  src={activeEmbedUrl}
                ></iframe>
              )}
            </div>
          </div>

          <div className="mt-12 space-y-6">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              {data.podcast.episodesTitle}
            </h3>
            <div className="grid gap-4">
              {data.podcast.episodes.map((episode, index) => (
                <button
                  key={index}
                  onClick={(e) => handleEpisodeClick(e, episode.link || "")}
                  className="w-full flex items-center justify-between p-4 bg-white dark:bg-[#1C1C1E] rounded-xl border border-gray-100 dark:border-white/10 hover:shadow-md transition-all group text-left"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-pink-100 dark:bg-pink-900/30 flex items-center justify-center">
                      <Play className="w-4 h-4 text-pink-500 group-hover:scale-110 transition-transform" />
                    </div>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {episode.title}
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-400">
                      {episode.duration}
                    </span>
                    <div className="px-3 py-1 bg-pink-500/10 text-pink-500 text-[10px] font-bold uppercase rounded-full opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      Listen Now
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section
        id="social"
        className="py-24 bg-white dark:bg-[#0a0a0a] border-t border-gray-100 dark:border-white/5 relative z-10 transition-colors duration-300 overflow-hidden"
      >
        <div className="max-w-4xl mx-auto px-6 mb-16 text-center">
          <h2 className="text-3xl font-semibold tracking-tight text-gray-900 dark:text-white">
            {data.interests.title}
          </h2>
          <p className="text-gray-500 dark:text-gray-500 mt-2 font-light">
            {data.interests.subtitle}
          </p>
        </div>

        <div className="flex flex-col gap-8 mb-16">
          <div className="flex whitespace-nowrap overflow-hidden">
            <div className="flex animate-marquee-right gap-6 px-3 w-max">
              {[
                ...data.interests.items,
                ...data.interests.items,
                ...data.interests.items,
                ...data.interests.items,
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

          <div className="flex whitespace-nowrap overflow-hidden">
            <div className="flex animate-marquee-left gap-6 px-3 w-max">
              {[
                ...data.interests.items,
                ...data.interests.items,
                ...data.interests.items,
                ...data.interests.items,
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
                  <div className="w-12 h-12 rounded-xl bg-pink-50 dark:bg-pink-900/30 flex items-center justify-center shrink-0">
                    {IconComponent && (
                      <IconComponent className="w-6 h-6 text-pink-500" />
                    )}
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

      <section className="py-32 px-6 bg-white dark:bg-[#0a0a0a] border-t border-gray-100 dark:border-white/5 relative z-10 transition-colors duration-300">
        <div className="max-w-4xl mx-auto flex flex-col items-center">
          <div className="max-w-2xl text-center space-y-6 mb-16">
            <h2 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white">
              {data.contact.title}
            </h2>
            <p className="text-gray-500 dark:text-gray-400 text-lg font-light leading-relaxed">
              {data.contact.description}
            </p>
          </div>

          <div className="w-full">
            <div className="flex flex-col items-center gap-8">
              <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-pink-500/80 dark:text-pink-400/80">
                {data.interests.socialTitle}
              </h3>

              <div className="flex flex-wrap justify-center gap-5">
                {data.interests.socialLinks.map((social, index) => {
                  const isInstagram = social.platform === "Instagram";
                  const isYoutube = social.platform === "YouTube";

                  return (
                    <a
                      key={index}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`group relative flex items-center gap-3 px-8 py-4 rounded-2xl transition-all duration-300 hover:scale-105 active:scale-95 text-white overflow-hidden shadow-lg ${
                        isInstagram
                          ? "bg-linear-to-tr from-[#833ab4] via-[#fd1d1d] to-[#fcb045]"
                          : isYoutube
                            ? "bg-[#FF0000]"
                            : "bg-gray-900 dark:bg-white dark:text-black"
                      }`}
                    >
                      <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      {isInstagram && (
                        <Instagram className="w-5 h-5 relative z-10" />
                      )}
                      {isYoutube && (
                        <Youtube className="w-5 h-5 relative z-10" />
                      )}
                      {!isInstagram && !isYoutube && (
                        <Instagram className="w-5 h-5 relative z-10" />
                      )}{" "}
                      <span className="font-semibold tracking-wide relative z-10">
                        {social.platform}
                      </span>
                    </a>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
