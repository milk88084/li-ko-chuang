// Pure helpers behind the public visit counter (app/api/visits/route.ts).
//
// A "visit" is one person on one day: the route records a hashed fingerprint
// for 24 hours and only increments the total the first time it sees it, so
// refreshing or clicking through every page doesn't inflate the number.

export const TOTAL_KEY = "visits:total";
export const SEEN_TTL_SECONDS = 60 * 60 * 24;

// Crawlers, link-preview fetchers and headless browsers. Not exhaustive — the
// private Vercel Analytics numbers are the accurate ones; this just keeps the
// public counter from being padded by the obvious ones.
const BOT_PATTERN =
  /bot|crawl|spider|slurp|preview|fetch|scan|monitor|headless|lighthouse|facebookexternalhit|whatsapp|curl|wget|python|axios|node-fetch|go-http/i;

export function isBot(userAgent: string | null | undefined): boolean {
  if (!userAgent) return true;
  return BOT_PATTERN.test(userAgent);
}

/** The first address in x-forwarded-for, which is the client on Vercel. */
export function clientIp(forwardedFor: string | null | undefined): string {
  return forwardedFor?.split(",")[0]?.trim() || "unknown";
}

/**
 * A one-way key for "this visitor, today". The raw IP never reaches Redis;
 * the date is folded in so the same person yields a new key each UTC day.
 */
export async function visitorKey(
  ip: string,
  userAgent: string,
  now: Date = new Date(),
): Promise<string> {
  const day = now.toISOString().slice(0, 10);
  const bytes = new TextEncoder().encode(`${day}|${ip}|${userAgent}`);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  const hex = Array.from(new Uint8Array(digest), (b) =>
    b.toString(16).padStart(2, "0"),
  ).join("");
  return `visits:seen:${hex}`;
}
