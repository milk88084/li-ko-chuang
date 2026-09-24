/**
 * Scroll maths for the engineer hero's portrait frame sequence.
 *
 * Kept free of DOM so the timing — which frame shows at which scroll
 * progress, how the eased reveal windows line up — can be tested directly.
 * The component owns the canvas, the listeners and the rAF loop.
 */

/** Frames on disk: public/frames/0001.webp … 0192.webp. */
export const FRAME_COUNT = 192;

/**
 * The turn plays through the first 70% of the stage; the remaining scroll is
 * spent on the statement, the spec rows and the exit.
 */
export const PORTRAIT_TURN_END = 0.7;

/** Below this gap the smoothed progress snaps, so the rAF loop settles. */
const SETTLE_EPSILON = 0.0004;

export const clamp = (value: number, min = 0, max = 1) =>
  Math.min(max, Math.max(min, value));

/** Maps `from`…`to` onto 0…1, clamped rather than extrapolated. */
export const range = (progress: number, from: number, to: number) =>
  clamp((progress - from) / (to - from));

/** Cubic ease-out — fast off the mark, settling at the end. */
export const ease = (t: number) => 1 - Math.pow(1 - t, 3);

/** Cubic ease-in-out, symmetric about the midpoint. */
export const easeIO = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

export const framePath = (index: number) =>
  `/frames/${String(index + 1).padStart(4, "0")}.webp`;

/** The frame to paint at a given stage progress (0…1). */
export const frameIndexAt = (progress: number, frameCount = FRAME_COUNT) =>
  Math.round(
    easeIO(range(progress, 0, PORTRAIT_TURN_END)) * (frameCount - 1),
  );

/**
 * One frame of exponential smoothing toward `target`, snapping when the gap
 * stops mattering. `factor` of 1 means no smoothing — what reduced motion uses.
 */
export const stepToward = (current: number, target: number, factor: number) => {
  const next = current + (target - current) * factor;
  return Math.abs(target - next) < SETTLE_EPSILON ? target : next;
};

/** Han, kana, and CJK punctuation — scripts written without word spaces. */
const CJK = /[　-〿぀-ヿ㐀-䶿一-鿿＀-･]/;

/**
 * Characters that may not begin a line (行頭禁則): sentence punctuation and
 * closing brackets/quotes. They ride along with the character before them.
 */
const NO_LINE_START = /[、。，．・：；？！）〕］｝〉》」』】〙〗””’〟ーヽヾゝゞ々‐–—~…‥]/;

/**
 * Characters that may not end a line (行末禁則): opening brackets and quotes.
 * They ride along with the character after them.
 */
const NO_LINE_END = /[（〔［｛〈《「『【〘〖““‘〝]/;

/**
 * Cuts the statement into the units that fade in one after another.
 *
 * Latin text splits on spaces. Chinese has no word spaces, so splitting on
 * them would yield a single token and the staggered reveal would collapse
 * into one whole-sentence fade — there, each character becomes its own unit.
 * Spaces win when both are present, so a mixed sentence still reads as words.
 *
 * Each token is rendered as an inline-block span, which switches off the
 * browser's own CJK line-breaking rules — so the split has to keep 禁則
 * punctuation glued to its neighbour, or a line can open with a full stop.
 */
export const splitStatement = (text: string) => {
  if (text.includes(" ")) {
    return { tokens: text.split(" "), separator: " " };
  }
  if (!CJK.test(text)) {
    return { tokens: [text], separator: " " };
  }

  const tokens: string[] = [];
  let glueNext = false;
  for (const char of text) {
    const append = glueNext || (NO_LINE_START.test(char) && tokens.length > 0);
    if (append && tokens.length > 0) {
      tokens[tokens.length - 1] += char;
    } else {
      tokens.push(char);
    }
    glueNext = NO_LINE_END.test(char);
  }
  return { tokens, separator: "" };
};

/**
 * Where the vertical crop is anchored: 0 = top, 0.5 = centre, 1 = bottom.
 *
 * The frames are 1280x720 landscape and the subject's head starts about 8% down,
 * so a centred crop eats the head on any viewport wider than 16:9 — and the
 * pinned stage, sitting below the fixed nav, is wider than 16:9 more often than
 * not. Anchoring to the top spends the overflow on his feet instead.
 */
export const PORTRAIT_ANCHOR_Y = 0;

/**
 * The `object-fit: cover` rectangle for drawing an image into a box: scaled to
 * cover it completely, centred horizontally, anchored vertically by `anchorY`.
 */
export const coverRect = (
  boxWidth: number,
  boxHeight: number,
  imageWidth: number,
  imageHeight: number,
  anchorY = PORTRAIT_ANCHOR_Y,
) => {
  const scale = Math.max(boxWidth / imageWidth, boxHeight / imageHeight);
  const dw = imageWidth * scale;
  const dh = imageHeight * scale;
  const dx = (boxWidth - dw) / 2;
  const dy = (boxHeight - dh) * clamp(anchorY);
  // `(negative) * 0` is -0, which reads as a bug in an offset. Normalise it.
  return { dx: dx === 0 ? 0 : dx, dy: dy === 0 ? 0 : dy, dw, dh };
};
