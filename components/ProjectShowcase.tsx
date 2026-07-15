"use client";

import {
  useState,
  useEffect,
  useCallback,
  useLayoutEffect,
  useRef,
} from "react";
import Image from "next/image";
import {
  ChevronLeft,
  ChevronRight,
  Monitor,
  Tablet,
  Smartphone,
} from "lucide-react";

interface Project {
  id: number;
  name: string;
  description: string;
  tech: string[];
  color: string;
  img: string;
  video: string;
  link: string;
}

interface ProjectShowcaseProps {
  projects: Project[];
  nextProjectLabel: string;
  viewProjectLabel: string;
  isDark?: boolean;
  onProjectChange?: (index: number) => void;
}

type DeviceKey = "desktop" | "tablet" | "mobile";

interface Device {
  key: DeviceKey;
  label: string;
  resolution: string;
  icon: typeof Monitor;
  mockup: string;
  /** screen aspect (w/h) */
  aspect: number;
  /** screen corner radius, as a fraction of the screen width */
  radius: number;
  /** screen corners in the mockup image, normalised 0..1: top-left, top-right, bottom-right, bottom-left */
  corners: [number, number][];
}

const DEVICES: Device[] = [
  {
    key: "desktop",
    label: "Desktop",
    resolution: "1440 × 900",
    icon: Monitor,
    mockup: "/mockup-desktop.webp",
    aspect: 16 / 10,
    radius: 0.028,
    corners: [
      [0.1835, 0.17598],
      [0.80287, 0.22481],
      [0.86051, 0.65593],
      [0.22783, 0.65543],
    ],
  },
  {
    key: "tablet",
    label: "Tablet",
    resolution: "1024 × 768",
    icon: Tablet,
    mockup: "/mockup-tablet.webp",
    aspect: 4 / 3,
    radius: 0.035,
    corners: [
      [0.2009, 0.27067],
      [0.71296, 0.28227],
      [0.85485, 0.75515],
      [0.30418, 0.79063],
    ],
  },
  {
    key: "mobile",
    label: "Mobile",
    resolution: "375 × 812",
    icon: Smartphone,
    mockup: "/mockup-mobile.webp",
    aspect: 9 / 19.5,
    radius: 0.115,
    corners: [
      [0.30764, 0.10597],
      [0.58104, 0.19645],
      [0.74536, 0.91487],
      [0.47386, 0.85334],
    ],
  },
];

/**
 * Homography mapping the screen rectangle (0,0)–(w,h) onto the four screen
 * corners of the mockup photo, expressed as a CSS matrix3d.
 */
function screenMatrix(
  w: number,
  h: number,
  corners: [number, number][],
  stage: number,
): string {
  const src: [number, number][] = [
    [0, 0],
    [w, 0],
    [w, h],
    [0, h],
  ];
  const dst = corners.map(([x, y]) => [x * stage, y * stage]);

  const A: number[][] = [];
  const b: number[] = [];
  for (let i = 0; i < 4; i++) {
    const [u, v] = src[i];
    const [x, y] = dst[i];
    A.push([u, v, 1, 0, 0, 0, -u * x, -v * x]);
    b.push(x);
    A.push([0, 0, 0, u, v, 1, -u * y, -v * y]);
    b.push(y);
  }
  for (let i = 0; i < 8; i++) {
    let pivot = i;
    for (let r = i + 1; r < 8; r++) {
      if (Math.abs(A[r][i]) > Math.abs(A[pivot][i])) pivot = r;
    }
    [A[i], A[pivot]] = [A[pivot], A[i]];
    [b[i], b[pivot]] = [b[pivot], b[i]];
    for (let r = i + 1; r < 8; r++) {
      const f = A[r][i] / A[i][i];
      for (let c = i; c < 8; c++) A[r][c] -= f * A[i][c];
      b[r] -= f * b[i];
    }
  }
  const m = new Array(8).fill(0);
  for (let i = 7; i >= 0; i--) {
    let s = b[i];
    for (let c = i + 1; c < 8; c++) s -= A[i][c] * m[c];
    m[i] = s / A[i][i];
  }
  const [a, bb, c, d, e, f, g, hh] = m;
  return `matrix3d(${a},${d},0,${g},${bb},${e},0,${hh},0,0,1,0,${c},${f},0,1)`;
}

export function ProjectShowcase({
  projects,
  isDark = false,
}: ProjectShowcaseProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [deviceType, setDeviceType] = useState<DeviceKey>("desktop");
  const [progress, setProgress] = useState(0);
  const [stageSize, setStageSize] = useState(0);

  const stageRef = useRef<HTMLDivElement>(null);

  const currentProject = projects[currentIndex];
  const device = DEVICES.find((d) => d.key === deviceType) ?? DEVICES[0];

  const nextProject = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % projects.length);
    setProgress(0);
  }, [projects.length]);

  const prevProject = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + projects.length) % projects.length);
    setProgress(0);
  }, [projects.length]);

  useEffect(() => {
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          nextProject();
          return 0;
        }
        return prev + 2;
      });
    }, 100);

    return () => clearInterval(progressInterval);
  }, [nextProject]);

  useLayoutEffect(() => {
    const node = stageRef.current;
    if (!node) return;
    const observer = new ResizeObserver(([entry]) => {
      setStageSize(entry.contentRect.width);
    });
    observer.observe(node);
    setStageSize(node.getBoundingClientRect().width);
    return () => observer.disconnect();
  }, []);

  // the screen rectangle, in its own (un-projected) coordinates
  const screenWidth = stageSize;
  const screenHeight = stageSize / device.aspect;
  const transform = stageSize
    ? screenMatrix(screenWidth, screenHeight, device.corners, stageSize)
    : undefined;

  return (
    <div className="w-full">
      {/* Stage */}
      <div className="relative">
        {/* the device's name, set full-bleed behind it */}
        <div className="pointer-events-none absolute top-1/2 left-1/2 flex w-screen -translate-x-1/2 -translate-y-1/2 justify-center overflow-hidden select-none">
          <span
            key={device.key}
            className={`animate-[fadeIn_0.6s_ease-out] text-[22vw] leading-none font-black tracking-tighter italic whitespace-nowrap ${
              isDark ? "text-white/10" : "text-gray-900/6"
            }`}
          >
            {device.label.toUpperCase()}
          </span>
        </div>

        <div className="relative flex items-center justify-center px-6 py-10 md:py-6">
          {/* the cut-out mockup defines the stage box; the screen is projected onto it */}
          <div
            ref={stageRef}
            className="relative aspect-square w-full max-w-[420px] md:max-w-[440px] lg:max-w-[520px]"
          >
            <Image
              key={device.mockup}
              src={device.mockup}
              alt={`${device.label} mockup`}
              fill
              priority
              // already a compact webp; the optimiser re-encodes it to JPEG and drops the alpha
              unoptimized
              sizes="(max-width: 768px) 90vw, 640px"
              className="animate-[fadeIn_0.5s_ease-out] object-contain drop-shadow-[0_30px_50px_rgba(15,23,42,0.25)]"
            />

            {transform && (
              <div
                className="absolute top-0 left-0 origin-top-left overflow-hidden"
                style={{
                  width: screenWidth,
                  height: screenHeight,
                  transform,
                  borderRadius: device.radius * screenWidth,
                }}
              >
                <div className="relative h-full w-full">
                  {deviceType === "mobile" ? (
                    <video
                      key={currentProject.video}
                      src={currentProject.video}
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <Image
                      src={currentProject.img}
                      alt={currentProject.name}
                      fill
                      sizes="(max-width: 768px) 90vw, 640px"
                      className="object-cover"
                    />
                  )}

                  {/* screen sheen, so the render doesn't look pasted on */}
                  <div className="pointer-events-none absolute inset-0 bg-linear-to-tr from-white/0 via-white/5 to-white/15" />

                  {deviceType === "mobile" && (
                    <div className="absolute top-[1.2%] left-1/2 h-[3.6%] w-[30%] -translate-x-1/2 rounded-full bg-black" />
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Meta + device switcher + progress. The switcher (2 arrow buttons
            + 3 device buttons) needs ~250px, which doesn't fit a third of a
            mobile-width row alongside the counter and label, so on mobile
            it wraps to its own centered row below them; sm+ keeps the
            original single-line grid. */}
        <div
          className={`absolute inset-x-0 top-0 flex flex-wrap items-center justify-between gap-y-4 px-6 py-5 font-mono text-[10px] tracking-[0.2em] uppercase sm:grid sm:grid-cols-3 sm:flex-nowrap sm:gap-y-0 ${
            isDark ? "text-white/40" : "text-gray-400"
          }`}
        >
          <div className="order-1 w-fit justify-self-start">
            <span>
              {String(currentIndex + 1).padStart(2, "0")} /{" "}
              {String(projects.length).padStart(2, "0")}
            </span>
            <div
              className={`mt-1.5 h-0.5 w-full rounded-full ${
                isDark ? "bg-white/10" : "bg-gray-200"
              }`}
            >
              <div
                className={`h-full rounded-full transition-all duration-100 ${
                  isDark ? "bg-white" : "bg-gray-900"
                }`}
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Device switcher, flanked by prev/next project arrows */}
          <div className="order-3 flex w-full items-center justify-center gap-3 normal-case tracking-normal sm:order-2 sm:w-auto sm:justify-self-center">
            <button
              type="button"
              onClick={prevProject}
              aria-label="Previous project"
              className={`flex h-8 w-8 cursor-pointer items-center justify-center rounded-full transition-all ${
                isDark
                  ? "bg-white/10 text-white/70 hover:bg-white/20 hover:text-white"
                  : "border border-gray-200 bg-white text-gray-500 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            <div
              className={`flex gap-1 rounded-full p-1 ${
                isDark ? "bg-white/10" : "border border-gray-200 bg-white"
              }`}
            >
              {DEVICES.map(({ key, label, icon: Icon }) => {
                const active = deviceType === key;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setDeviceType(key)}
                    aria-label={`${label} view`}
                    aria-pressed={active}
                    className={`flex cursor-pointer items-center gap-2 rounded-full px-4 py-2 font-sans text-xs font-medium transition-all ${
                      active
                        ? isDark
                          ? "bg-white text-black"
                          : "bg-gray-900 text-white"
                        : isDark
                          ? "text-gray-400 hover:text-white"
                          : "text-gray-500 hover:text-gray-900"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span className="hidden sm:inline">{label}</span>
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              onClick={nextProject}
              aria-label="Next project"
              className={`flex h-8 w-8 cursor-pointer items-center justify-center rounded-full transition-all ${
                isDark
                  ? "bg-white/10 text-white/70 hover:bg-white/20 hover:text-white"
                  : "border border-gray-200 bg-white text-gray-500 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          <span className="order-2 justify-self-end sm:order-3">
            PROJECT SHOWCASE
          </span>
        </div>
      </div>
    </div>
  );
}
