import { clientIp, isBot, visitorKey } from "@/lib/visits";

const CHROME =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36";

describe("isBot", () => {
  it("lets a normal browser through", () => {
    expect(isBot(CHROME)).toBe(false);
  });

  it("flags crawlers, preview fetchers and scripts", () => {
    expect(isBot("Mozilla/5.0 (compatible; Googlebot/2.1)")).toBe(true);
    expect(isBot("facebookexternalhit/1.1")).toBe(true);
    expect(isBot("Mozilla/5.0 HeadlessChrome/130.0")).toBe(true);
    expect(isBot("curl/8.4.0")).toBe(true);
  });

  it("treats a missing user agent as a bot", () => {
    expect(isBot(null)).toBe(true);
    expect(isBot("")).toBe(true);
  });
});

describe("clientIp", () => {
  it("takes the first hop of x-forwarded-for", () => {
    expect(clientIp("203.0.113.7, 10.0.0.1")).toBe("203.0.113.7");
  });

  it("falls back when the header is absent", () => {
    expect(clientIp(null)).toBe("unknown");
  });
});

describe("visitorKey", () => {
  const day = new Date("2026-11-16T08:00:00Z");

  it("is stable for the same visitor on the same day", async () => {
    const a = await visitorKey("203.0.113.7", CHROME, day);
    const later = new Date("2026-11-16T23:59:00Z");
    expect(await visitorKey("203.0.113.7", CHROME, later)).toBe(a);
  });

  it("changes the next day and for a different visitor", async () => {
    const a = await visitorKey("203.0.113.7", CHROME, day);
    const nextDay = new Date("2026-11-17T00:00:01Z");
    expect(await visitorKey("203.0.113.7", CHROME, nextDay)).not.toBe(a);
    expect(await visitorKey("203.0.113.8", CHROME, day)).not.toBe(a);
  });

  it("never contains the raw IP", async () => {
    const key = await visitorKey("203.0.113.7", CHROME, day);
    expect(key).not.toContain("203.0.113.7");
    expect(key).toMatch(/^visits:seen:[0-9a-f]{64}$/);
  });
});
