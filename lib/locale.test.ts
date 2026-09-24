import {
  LOCALES,
  LOCALIZED_ROUTES,
  ZH_PREFIX,
  htmlLang,
  localePath,
  localeFromPathname,
  otherLocale,
  otherLocalePath,
} from "@/lib/locale";

describe("localeFromPathname", () => {
  it("reads zh from the /zh prefix", () => {
    expect(localeFromPathname("/zh")).toBe("zh");
    expect(localeFromPathname("/zh/engineer")).toBe("zh");
  });

  it("treats everything else as English", () => {
    expect(localeFromPathname("/")).toBe("en");
    expect(localeFromPathname("/engineer")).toBe("en");
  });

  it("does not mistake a route that merely starts with the letters", () => {
    expect(localeFromPathname("/zhuangzi")).toBe("en");
  });

  it("tolerates a trailing slash", () => {
    expect(localeFromPathname("/zh/")).toBe("zh");
  });
});

describe("localePath", () => {
  it("leaves English paths unprefixed, so existing URLs keep working", () => {
    expect(localePath("en", "")).toBe("/");
    expect(localePath("en", "/engineer")).toBe("/engineer");
  });

  it("prefixes Chinese paths", () => {
    expect(localePath("zh", "")).toBe(ZH_PREFIX);
    expect(localePath("zh", "/engineer")).toBe(`${ZH_PREFIX}/engineer`);
  });

  it("never produces a double slash", () => {
    for (const locale of LOCALES) {
      for (const route of LOCALIZED_ROUTES) {
        expect(localePath(locale, route)).not.toMatch(/\/\//);
      }
    }
  });

  it("always returns an absolute path", () => {
    for (const locale of LOCALES) {
      for (const route of LOCALIZED_ROUTES) {
        expect(localePath(locale, route).startsWith("/")).toBe(true);
      }
    }
  });
});

describe("otherLocale", () => {
  it("flips", () => {
    expect(otherLocale("en")).toBe("zh");
    expect(otherLocale("zh")).toBe("en");
  });
});

describe("otherLocalePath", () => {
  it("crosses to the mirrored page, not back to the homepage", () => {
    expect(otherLocalePath("/engineer")).toBe("/zh/engineer");
    expect(otherLocalePath("/zh/engineer")).toBe("/engineer");
    expect(otherLocalePath("/marketer")).toBe("/zh/marketer");
  });

  it("maps the two homepages onto each other", () => {
    expect(otherLocalePath("/")).toBe("/zh");
    expect(otherLocalePath("/zh")).toBe("/");
  });

  it("is its own inverse for every localized route", () => {
    for (const locale of LOCALES) {
      for (const route of LOCALIZED_ROUTES) {
        const path = localePath(locale, route);
        expect(otherLocalePath(otherLocalePath(path))).toBe(path);
      }
    }
  });

  it("falls back to the other locale's homepage for untranslated routes", () => {
    // /studio is an internal tool with no Chinese mirror; sending someone to
    // /zh/studio would 404.
    expect(otherLocalePath("/studio")).toBe("/zh");
    expect(otherLocalePath("/some/deep/unknown")).toBe("/zh");
  });

  it("ignores a query string or hash on the current path", () => {
    expect(otherLocalePath("/engineer?a=1")).toBe("/zh/engineer");
    expect(otherLocalePath("/engineer#eng-projects")).toBe("/zh/engineer");
  });
});

describe("htmlLang", () => {
  it("uses a BCP 47 tag, not the internal key", () => {
    expect(htmlLang("en")).toBe("en");
    expect(htmlLang("zh")).toBe("zh-Hant");
  });
});
