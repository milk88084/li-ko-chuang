import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "magazine.feg.com.tw",
      },
    ],
  },
  // The site used to be split by role (/engineer, /marketer, /creator). Those
  // URLs are indexed and shared, so each one lands on its closest page in the
  // content-based structure rather than a 404. Permanent (308), so search
  // engines move their ranking across.
  async redirects() {
    const moved = [
      { from: "/engineer", to: "/work?type=engineering" },
      { from: "/marketer", to: "/work?type=marketing" },
      { from: "/creator", to: "/about" },
    ];
    return moved.flatMap(({ from, to }) => [
      { source: from, destination: to, permanent: true },
      { source: `/zh${from}`, destination: `/zh${to}`, permanent: true },
    ]);
  },
  async headers() {
    return [
      {
        // Applies to every route. Most hosts (e.g. Vercel) already set HSTS
        // for you, but declaring it here keeps the behavior host-independent.
        source: "/:path*",
        headers: [
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        ],
      },
    ];
  },
};

export default nextConfig;
