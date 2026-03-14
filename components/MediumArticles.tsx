"use client";

import { useEffect, useState } from "react";
import { ArrowUpRight, BookOpen, Tag } from "lucide-react";
import type { MediumArticle } from "@/app/api/medium-rss/route";

interface MediumArticlesProps {
  readMore: string;
  viewAll: string;
  loading: string;
  noArticles: string;
  mediumUrl: string;
}

function formatDate(dateStr: string): string {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function MediumArticles({
  readMore,
  viewAll,
  loading,
  noArticles,
  mediumUrl,
}: MediumArticlesProps) {
  const [articles, setArticles] = useState<MediumArticle[]>([]);
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading",
  );

  useEffect(() => {
    fetch("/api/medium-rss")
      .then((res) => res.json())
      .then((data) => {
        if (data.articles && data.articles.length > 0) {
          setArticles(data.articles);
          setStatus("success");
        } else {
          setStatus("error");
        }
      })
      .catch(() => setStatus("error"));
  }, []);

  if (status === "loading") {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="rounded-2xl bg-white dark:bg-[#1C1C1E] border border-gray-100 dark:border-white/10 overflow-hidden animate-pulse"
          >
            <div className="h-48 bg-gray-100 dark:bg-white/5" />
            <div className="p-5 space-y-3">
              <div className="h-4 bg-gray-100 dark:bg-white/5 rounded-full w-3/4" />
              <div className="h-3 bg-gray-100 dark:bg-white/5 rounded-full w-1/2" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (status === "error" || articles.length === 0) {
    return (
      <p className="text-center text-gray-500 dark:text-gray-500 font-light py-12">
        {noArticles}
      </p>
    );
  }

  return (
    <div className="space-y-10">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map((article, index) => (
          <a
            key={index}
            href={article.link}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-col rounded-2xl bg-white dark:bg-[#1C1C1E] border border-gray-100 dark:border-white/10 overflow-hidden hover:border-gray-300 dark:hover:border-white/30 transition-all duration-300 hover:shadow-lg hover:shadow-gray-100/50 dark:hover:shadow-none hover:-translate-y-1"
          >
            {article.thumbnail ? (
              <div className="h-48 overflow-hidden bg-gray-50 dark:bg-white/5">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={article.thumbnail}
                  alt={article.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
            ) : (
              <div className="h-48 flex items-center justify-center bg-gray-50 dark:bg-white/5">
                <BookOpen className="w-10 h-10 text-gray-200 dark:text-white/10" />
              </div>
            )}

            <div className="flex flex-col flex-1 p-5 gap-3">
              {article.categories.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {article.categories.map((cat) => (
                    <span
                      key={cat}
                      className="inline-flex items-center gap-1 text-[10px] font-medium uppercase tracking-wide text-gray-500 dark:text-gray-500 bg-gray-100 dark:bg-white/5 px-2 py-0.5 rounded-full"
                    >
                      <Tag className="w-2.5 h-2.5" />
                      {cat}
                    </span>
                  ))}
                </div>
              )}

              <h3 className="text-sm font-semibold text-gray-900 dark:text-white leading-snug line-clamp-3 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors">
                {article.title}
              </h3>

              <div className="mt-auto flex items-center justify-between pt-3 border-t border-gray-100 dark:border-white/5">
                <span className="text-xs text-gray-400 dark:text-gray-600">
                  {formatDate(article.pubDate)}
                </span>
                <span className="text-xs font-medium text-gray-500 dark:text-gray-400 flex items-center gap-1 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
                  {readMore}
                  <ArrowUpRight className="w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </span>
              </div>
            </div>
          </a>
        ))}
      </div>

      <div className="text-center">
        <a
          href={mediumUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors border-b border-gray-300 dark:border-gray-700 hover:border-gray-900 dark:hover:border-white pb-0.5"
        >
          {viewAll}
          <ArrowUpRight className="w-4 h-4" />
        </a>
      </div>
    </div>
  );
}
