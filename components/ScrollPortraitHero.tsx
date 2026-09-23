"use client";

import { Fragment, useEffect, useMemo, useRef } from "react";
import content from "@/data/content.json";
import { useLanguage } from "@/providers/LanguageProvider";
import {
  FRAME_COUNT,
  clamp,
  coverRect,
  ease,
  frameIndexAt,
  framePath,
  range,
  splitStatement,
  stepToward,
} from "@/lib/scroll-portrait";
import styles from "./ScrollPortraitHero.module.css";

type LanguageKey = keyof typeof content;

/** Code fragments that drift past the portrait — identical in both locales. */
const CHIPS = [
  { text: "spec.md", x: 64, y: 16, speed: 1.4 },
  { text: "<Hero />", x: 76, y: 34, speed: 0.8 },
  { text: "useScrollProgress()", x: 58, y: 58, speed: 1.8 },
  { text: "tsc --noEmit ✓", x: 34, y: 74, speed: 1.1 },
  { text: "eas submit", x: 86, y: 12, speed: 2.2 },
];

/** Matches --sp-ground in the stylesheet; used to letterbox the canvas. */
const GROUND = { light: "#ECEDF1", dark: "#0A0A0A" } as const;

/**
 * The page's opening act: a 620vh stage pinned to the viewport, inside which
 * a 192-frame portrait turn plays out under scroll while the intro hands over
 * to a statement, a spec table and drifting code chips.
 *
 * All of it is driven from one scroll progress value (0…1 across the stage),
 * smoothed in a rAF loop and written straight to style properties — no React
 * state, so scrolling never re-renders. The maths lives in lib/scroll-portrait.
 */
export function ScrollPortraitHero() {
  const { language } = useLanguage();
  const data = content[language as LanguageKey].engineer.scrollHero;

  // Frames live outside the effect: switching language re-runs it (to pick up
  // the freshly rendered word spans) and must not re-download 192 images.
  const imagesRef = useRef<(HTMLImageElement | undefined)[]>([]);
  const stageRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const introRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLAnchorElement>(null);
  const statementRef = useRef<HTMLHeadingElement>(null);
  const specRef = useRef<HTMLDListElement>(null);
  const chipsRef = useRef<HTMLDivElement>(null);
  const bigwordRef = useRef<HTMLHeadingElement>(null);
  const meterRef = useRef<HTMLSpanElement>(null);
  const hintRef = useRef<HTMLSpanElement>(null);

  // Split up front so the markup ships whole to the crawler and to no-JS
  // readers; the loop only ever touches the spans' styles.
  const { tokens, separator } = useMemo(
    () => splitStatement(data.statement),
    [data.statement],
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    const stage = stageRef.current;
    if (!canvas || !stage) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const wordEls = Array.from(
      statementRef.current?.querySelectorAll<HTMLElement>("span") ?? [],
    );
    const specRows = Array.from(
      specRef.current?.querySelectorAll<HTMLElement>("div") ?? [],
    );
    const chipEls = Array.from(
      chipsRef.current?.querySelectorAll<HTMLElement>("span") ?? [],
    );

    // ---- frames: paint the first one as soon as it lands, then fill in ----
    if (imagesRef.current.length === 0) {
      imagesRef.current = new Array<HTMLImageElement | undefined>(FRAME_COUNT);
    }
    const images = imagesRef.current;
    let disposed = false;

    const loadFrame = (index: number) =>
      new Promise<void>((resolve) => {
        if (images[index]) {
          resolve();
          return;
        }
        const image = new Image();
        image.decoding = "async";
        image.onload = () => {
          images[index] = image;
          resolve();
        };
        image.onerror = () => resolve();
        image.src = framePath(index);
      });

    loadFrame(0).then(() => {
      if (disposed) return;
      paint(lastIndex, true);
      for (let i = 1; i < FRAME_COUNT; i++) loadFrame(i);
    });

    // ---- canvas sizing ----
    let width = 0;
    let height = 0;
    let dpr = 1;
    // `painted` is the frame currently on the canvas (-1 = stale, repaint);
    // `lastIndex` is the frame the scroll position actually asks for, which
    // survives a stale repaint so a resize or theme flip redraws the right one.
    let painted = -1;
    let lastIndex = 0;

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      painted = -1;
    };

    /** Nearest already-decoded frame, so an early scroll never blanks out. */
    const nearest = (index: number) => {
      if (images[index]) return images[index];
      for (let d = 1; d < FRAME_COUNT; d++) {
        if (images[index - d]) return images[index - d];
        if (images[index + d]) return images[index + d];
      }
      return undefined;
    };

    const paint = (index: number, force = false) => {
      lastIndex = index;
      if (index === painted && !force) return;
      const image = nearest(index);
      if (!image) return;
      painted = images[index] ? index : -1;

      const { dx, dy, dw, dh } = coverRect(
        canvas.width,
        canvas.height,
        image.naturalWidth,
        image.naturalHeight,
      );

      ctx.fillStyle = document.documentElement.classList.contains("dark")
        ? GROUND.dark
        : GROUND.light;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(image, dx, dy, dw, dh);
    };

    // ---- scroll progress ----
    let target = 0;
    let current = 0;

    const readScroll = () => {
      const rect = stage.getBoundingClientRect();
      const scrollable = stage.offsetHeight - window.innerHeight;
      target = scrollable > 0 ? clamp(-rect.top / scrollable) : 0;
    };

    const render = (p: number) => {
      paint(frameIndexAt(p));

      // Intro and CTA clear out as soon as the turn begins.
      const gone = 1 - range(p, 0.02, 0.1);
      for (const el of [introRef.current, ctaRef.current]) {
        if (!el) continue;
        el.style.opacity = String(gone);
        el.style.pointerEvents = gone < 0.1 ? "none" : "";
      }
      if (introRef.current) {
        introRef.current.style.transform = `translateY(${-30 * (1 - gone)}px)`;
      }
      if (hintRef.current) {
        hintRef.current.style.opacity = String(1 - range(p, 0, 0.04));
      }

      // Statement: word by word in, then blurred away left to right.
      const inProgress = range(p, 0.26, 0.5);
      const outProgress = range(p, 0.8, 0.9);
      wordEls.forEach((word, i) => {
        const eased = ease(clamp(inProgress * wordEls.length * 1.25 - i));
        const out = clamp(outProgress * 1.6 - (i / wordEls.length) * 0.6);
        word.style.opacity = String(
          reduceMotion ? (inProgress > 0 ? 1 - out : 0) : eased * (1 - out),
        );
        word.style.filter = reduceMotion
          ? "none"
          : `blur(${(1 - eased) * 10 + out * 12}px)`;
        word.style.transform = reduceMotion
          ? "none"
          : `translateY(${(1 - eased) * 0.25}em)`;
      });

      // Spec rows stagger in behind the statement, then fade with it.
      specRows.forEach((row, i) => {
        const eased = ease(range(p, 0.44 + i * 0.035, 0.52 + i * 0.035));
        const out = range(p, 0.8 + i * 0.012, 0.88 + i * 0.012);
        row.style.opacity = String(eased * (1 - out));
        row.style.transform = `translateY(${(1 - eased) * 14}px)`;
      });

      // Chips drift at their own speeds so the field has depth.
      chipEls.forEach((chip, i) => {
        const speed = CHIPS[i]?.speed ?? 1;
        const visible =
          range(p, 0.36 + i * 0.02, 0.5 + i * 0.02) * (1 - range(p, 0.78, 0.86));
        chip.style.opacity = String(visible);
        chip.style.transform = reduceMotion
          ? "none"
          : `translate3d(0, ${(0.55 - p) * speed * 260}px, 0) rotate(${
              (p - 0.5) * speed * 14
            }deg)`;
      });

      // Exit: the portrait blurs out and the big word rises to hand over.
      const exit = range(p, 0.84, 0.97);
      canvas.style.filter = reduceMotion ? "none" : `blur(${exit * 26}px)`;
      canvas.style.opacity = String(1 - exit * 0.92);
      if (bigwordRef.current) {
        bigwordRef.current.style.transform = `translateY(${
          (1 - ease(range(p, 0.88, 1))) * 90
        }vh)`;
      }
      if (meterRef.current) meterRef.current.style.height = `${p * 100}%`;
    };

    const onResize = () => {
      resize();
      render(current);
    };

    let frame = 0;
    const loop = () => {
      current = stepToward(current, target, reduceMotion ? 1 : 0.12);
      render(current);
      frame = requestAnimationFrame(loop);
    };

    resize();
    readScroll();
    current = target;
    render(current);
    frame = requestAnimationFrame(loop);

    window.addEventListener("scroll", readScroll, { passive: true });
    window.addEventListener("resize", onResize);

    // Repaint on theme change so the canvas letterboxing follows the page.
    const themeObserver = new MutationObserver(() => paint(lastIndex, true));
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", readScroll);
      window.removeEventListener("resize", onResize);
      themeObserver.disconnect();
    };
    // Re-running on language change re-reads the freshly rendered word spans.
  }, [language, tokens.length]);

  return (
    <div className={styles.root}>
      {/* The section is named by the statement inside it, not by `bigword`:
          that word is decorative (it can be a name, e.g. "MAX") and makes a
          useless accessible name for the whole opening section. */}
      <section
        ref={stageRef}
        className={styles.stage}
        aria-labelledby="scroll-portrait-statement"
      >
        <div className={styles.pin}>
          <canvas ref={canvasRef} className={styles.canvas} aria-hidden />
          <div className={styles.scrim} aria-hidden />

          <p ref={introRef} className={styles.intro}>
            {data.intro}
          </p>
          <a ref={ctaRef} className={styles.cta} href="#eng-projects">
            {data.ctaText}
          </a>

          <h1
            ref={statementRef}
            id="scroll-portrait-statement"
            className={styles.statement}
          >
            {/* Any separator must be a text node BETWEEN the spans: each span
                is inline-block, which swallows leading whitespace inside it and
                would run the whole statement together as one word. */}
            {tokens.map((token, i) => (
              <Fragment key={`${token}-${i}`}>
                {i > 0 && separator}
                <span>{token}</span>
              </Fragment>
            ))}
          </h1>

          <dl ref={specRef} className={styles.spec}>
            {data.spec.map((row) => (
              <div key={row.label} className={styles.specRow}>
                <dt>{row.label}</dt>
                <dd>{row.value}</dd>
              </div>
            ))}
          </dl>

          <div ref={chipsRef} aria-hidden>
            {CHIPS.map((chip) => (
              <span
                key={chip.text}
                className={styles.chip}
                style={{ left: `${chip.x}%`, top: `${chip.y}%` }}
              >
                {chip.text}
              </span>
            ))}
          </div>

          <h2 ref={bigwordRef} className={styles.bigword} aria-hidden>
            {data.bigword}
          </h2>
          <div className={styles.meter} aria-hidden>
            <span ref={meterRef} className={styles.meterFill} />
          </div>
          <span ref={hintRef} className={styles.hint}>
            {data.hint}
          </span>
        </div>
      </section>
    </div>
  );
}
