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
  /** portrait still, used on the mobile mockup when there is no video */
  imgMobile?: string;
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

  // What actually goes on the screen for the current project + device.
  const showVideo = deviceType === "mobile" && Boolean(currentProject.video);
  const screenSrc = showVideo
    ? currentProject.video
    : deviceType === "mobile"
      ? (currentProject.imgMobile ?? currentProject.img)
      : currentProject.img;

  // Switching projects swaps `src` on the same <img>/<video>, and between the
  // old frame going and the new one decoding there is nothing to paint — the
  // dark mockup shows through as a black flash. Track which source has really
  // decoded and hold a loading state over the screen until it matches.
  const [readySrc, setReadySrc] = useState<string | null>(null);
  const isScreenLoading = readySrc !== screenSrc;
  const markScreenReady = useCallback(() => setReadySrc(screenSrc), [screenSrc]);

  // A cached source can already be decoded by the time its element mounts, and
  // then `onLoad`/`onLoadedData` never fires and the overlay would sit there
  // forever. Both elements are keyed on the source, so these ref callbacks run
  // once per switch and catch that case.
  const screenImgRef = useCallback(
    (node: HTMLImageElement | null) => {
      if (node?.complete && node.naturalWidth > 0) setReadySrc(screenSrc);
    },
    [screenSrc],
  );
  const screenVideoRef = useCallback(
    (node: HTMLVideoElement | null) => {
      if (node && node.readyState >= 3) setReadySrc(screenSrc);
    },
    [screenSrc],
  );

  // Rendered twice: inline in the meta bar at sm+, and as its own row
  // below the device mockup on mobile (see render below for why).
  const deviceSwitcherButtons = (
    <>
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
    </>
  );

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
                <div
                  className={`relative h-full w-full ${
                    isDark ? "bg-[#1c1c1e]" : "bg-gray-100"
                  }`}
                >
                  {showVideo ? (
                    <video
                      key={screenSrc}
                      ref={screenVideoRef}
                      src={screenSrc}
                      autoPlay
                      loop
                      muted
                      playsInline
                      onLoadedData={markScreenReady}
                      className={`h-full w-full object-cover transition-opacity duration-300 ${
                        isScreenLoading ? "opacity-0" : "opacity-100"
                      }`}
                    />
                  ) : (
                    <Image
                      key={screenSrc}
                      ref={screenImgRef}
                      src={screenSrc}
                      alt={currentProject.name}
                      fill
                      sizes="(max-width: 768px) 90vw, 640px"
                      onLoad={markScreenReady}
                      className={`object-cover transition-opacity duration-300 ${
                        isScreenLoading ? "opacity-0" : "opacity-100"
                      }`}
                    />
                  )}

                  {/* Loading state, painted on the screen itself. It inherits
                      the screen's 3D transform, which is what keeps it looking
                      like part of the device rather than a floating spinner. */}
                  {isScreenLoading && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div
                        className={`h-[12%] max-h-10 min-h-5 animate-spin rounded-full border-2 aspect-square ${
                          isDark
                            ? "border-white/15 border-t-white/70"
                            : "border-gray-300 border-t-gray-600"
                        }`}
                      />
                    </div>
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

        {/* Meta bar: counter + label. The device switcher only shows here
            at sm+ (inline, 3-column grid); on mobile there isn't room for
            it next to the counter/label, so it renders separately below
            the device mockup instead (see the block right after this
            one's closing stage div). */}
        <div
          className={`absolute inset-x-0 top-0 flex items-center justify-between px-6 py-5 font-mono text-[10px] tracking-[0.2em] uppercase sm:grid sm:grid-cols-3 ${
            isDark ? "text-white/40" : "text-gray-400"
          }`}
        >
          <div className="w-fit justify-self-start">
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

          <div className="hidden items-center gap-3 normal-case tracking-normal sm:flex sm:justify-self-center">
            {deviceSwitcherButtons}
          </div>

          <span className="justify-self-end">PROJECT SHOWCASE</span>
        </div>
      </div>

      {/* Mobile-only device switcher, directly below the device mockup —
          at sm+ it's already shown inline in the meta bar above. */}
      <div className="flex items-center justify-center gap-3 pb-6 normal-case tracking-normal sm:hidden">
        {deviceSwitcherButtons}
      </div>
    </div>
  );
}
