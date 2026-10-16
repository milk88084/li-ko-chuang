import type { CSSProperties } from "react";

// Splits a line into words (or, for Chinese, characters — there are no spaces
// to split on) and lets each rise into place in turn. CSS only: the text is
// whole in the server HTML and the animation needs no hydration.

const CJK = /[　-〿㐀-鿿＀-￯]/;

/**
 * Characters that may not begin a line (行頭禁則). Splitting Chinese into one
 * inline-block per character would otherwise let "，" wrap onto a line of its
 * own, so each one rides along with the character before it.
 */
const NO_LINE_START = /[、。，．・：；？！）〕］｝〉》」』】～…]/;

function tokens(text: string): string[] {
  if (!CJK.test(text)) return text.split(/(\s+)/).filter(Boolean);
  const out: string[] = [];
  for (const char of Array.from(text)) {
    if (NO_LINE_START.test(char) && out.length) out[out.length - 1] += char;
    else out.push(char);
  }
  return out;
}

export function SplitReveal({
  text,
  className = "",
  delay = 0,
  startIndex = 0,
}: {
  text: string;
  className?: string;
  /** Milliseconds before the first word moves. */
  delay?: number;
  /** Offsets the stagger, so a second line can continue where the first ended. */
  startIndex?: number;
}) {
  let index = startIndex;
  return (
    <span className={className}>
      {/* Screen readers get the line whole, not one word per element. */}
      <span className="sr-only">{text}</span>
      {tokens(text).map((token, i) => {
        if (/^\s+$/.test(token)) {
          return (
            <span key={i} aria-hidden>
              {" "}
            </span>
          );
        }
        const style = {
          "--i": index++,
          "--base-delay": `${delay}ms`,
        } as CSSProperties;
        return (
          <span key={i} aria-hidden className="split-word">
            <span style={style}>{token}</span>
          </span>
        );
      })}
    </span>
  );
}

/** How many animated tokens `text` produces — for chaining a second line. */
export const splitCount = (text: string) =>
  tokens(text).filter((t) => !/^\s+$/.test(t)).length;
