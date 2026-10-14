import { ArrowUpRight } from "lucide-react";
import type { MediumArticle } from "@/lib/medium";
import { htmlLang, type Locale } from "@/lib/locale";

// Medium posts as a ruled list: date, title, tags, with the thumbnail beside
// it on wide screens. Rendered on the server from lib/medium.

function parseDate(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

export function ArticleList({
  articles,
  locale,
  readMore,
  empty,
}: {
  articles: MediumArticle[];
  locale: Locale;
  readMore: string;
  empty: string;
}) {
  if (articles.length === 0) {
    return <p className="py-12 text-[17px] text-muted">{empty}</p>;
  }

  return (
    <ul className="border-t border-line">
      {articles.map((article) => {
        const date = parseDate(article.pubDate);
        return (
        <li key={article.link} className="reveal border-b border-line">
          <a
            href={article.link}
            target="_blank"
            rel="noopener noreferrer"
            className="group grid gap-4 py-8 md:grid-cols-12 md:items-center md:gap-6"
          >
            <time
              dateTime={date?.toISOString()}
              className="font-mono text-[12px] text-muted md:col-span-2"
            >
              {date?.toLocaleDateString(htmlLang(locale), {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </time>
            <div className="md:col-span-7">
              <h3 className="text-[clamp(20px,2.2vw,28px)] leading-snug tracking-[-0.02em] transition-colors group-hover:text-accent">
                {article.title}
              </h3>
              {article.categories.length > 0 && (
                <p className="mt-3 font-mono text-[11px] text-muted uppercase">
                  {article.categories.join(" · ")}
                </p>
              )}
            </div>
            <div className="flex items-center justify-between gap-6 md:col-span-3 md:justify-end">
              {article.thumbnail && (
                // eslint-disable-next-line @next/next/no-img-element -- Medium's CDN host varies per post.
                <img
                  src={article.thumbnail}
                  alt=""
                  loading="lazy"
                  className="hidden h-20 w-32 rounded-[6px] object-cover md:block"
                />
              )}
              <span className="flex items-center gap-1 text-[13px] text-accent">
                {readMore}
                <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </span>
            </div>
          </a>
        </li>
        );
      })}
    </ul>
  );
}
