import { siteConfig } from "@/lib/site-config";

// Shared artwork for every generated OG image. Satori (what next/og renders
// with) supports flexbox only — no grid, and every element that holds more
// than one child needs an explicit `display: flex`.

export const OG_SIZE = { width: 1200, height: 630 };

const BLUE = "#3250FE";
const INK = "#1D1D1F";
const MUTED = "#667085";
const PAPER = "#FBFBFD";

/**
 * A card with the site's blue wordmark, the page's own title and a strapline.
 * Each route's opengraph-image.tsx passes its own copy so previews are
 * distinguishable in a chat thread rather than four identical images.
 */
export function OgCard({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        backgroundColor: PAPER,
        padding: "68px 80px",
      }}
    >
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div
          style={{
            display: "flex",
            fontSize: 30,
            fontWeight: 700,
            letterSpacing: "0.12em",
            color: BLUE,
          }}
        >
          LI KO CHUAN
        </div>

        <div
          style={{
            display: "flex",
            marginTop: 44,
            fontSize: 82,
            fontWeight: 800,
            letterSpacing: "-0.04em",
            lineHeight: 1.05,
            color: INK,
            maxWidth: 940,
          }}
        >
          {title}
        </div>

        <div
          style={{
            display: "flex",
            marginTop: 26,
            fontSize: 32,
            lineHeight: 1.35,
            color: MUTED,
            maxWidth: 900,
          }}
        >
          {subtitle}
        </div>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          fontSize: 24,
          color: MUTED,
        }}
      >
        <div style={{ display: "flex" }}>
          Frontend Engineer · Taipei · React · Next.js · TypeScript
        </div>
        <div style={{ display: "flex", color: BLUE }}>
          {siteConfig.siteUrl.replace(/^https?:\/\//, "")}
        </div>
      </div>
    </div>
  );
}
