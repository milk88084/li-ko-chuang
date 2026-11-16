import { NextRequest, NextResponse } from "next/server";
import { Redis } from "@upstash/redis";
import {
  SEEN_TTL_SECONDS,
  TOTAL_KEY,
  clientIp,
  isBot,
  visitorKey,
} from "@/lib/visits";

// The public visit counter shown in the footer. POST records the current
// visitor (once per person per day, bots skipped) and returns the total.
//
// Redis comes from the Upstash integration on Vercel, which injects the
// KV_REST_API_* variables; the UPSTASH_REDIS_REST_* names are accepted too for
// a database created directly on upstash.com. Without either — local dev, a
// preview deploy with no store — the route answers { count: null } and the
// footer shows a dash instead of breaking.

export const dynamic = "force-dynamic";

const url =
  process.env.KV_REST_API_URL ?? process.env.UPSTASH_REDIS_REST_URL;
const token =
  process.env.KV_REST_API_TOKEN ?? process.env.UPSTASH_REDIS_REST_TOKEN;
const redis = url && token ? new Redis({ url, token }) : null;

export async function POST(req: NextRequest) {
  if (!redis) return NextResponse.json({ count: null });

  try {
    const userAgent = req.headers.get("user-agent");

    if (!isBot(userAgent)) {
      const ip = clientIp(req.headers.get("x-forwarded-for"));
      const key = await visitorKey(ip, userAgent ?? "");
      // NX: only the first request today for this visitor gets "OK".
      const firstToday = await redis.set(key, 1, {
        nx: true,
        ex: SEEN_TTL_SECONDS,
      });
      if (firstToday) {
        return NextResponse.json({ count: await redis.incr(TOTAL_KEY) });
      }
    }

    const count = (await redis.get<number>(TOTAL_KEY)) ?? 0;
    return NextResponse.json({ count });
  } catch {
    return NextResponse.json({ count: null }, { status: 503 });
  }
}
