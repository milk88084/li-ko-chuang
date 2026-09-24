import {
  FRAME_COUNT,
  PORTRAIT_ANCHOR_Y,
  PORTRAIT_TURN_END,
  clamp,
  coverRect,
  ease,
  easeIO,
  framePath,
  frameIndexAt,
  range,
  splitStatement,
  stepToward,
} from "@/lib/scroll-portrait";

describe("clamp", () => {
  it("passes values inside the range through untouched", () => {
    expect(clamp(0.5)).toBe(0.5);
  });

  it("clamps to the default 0..1 range", () => {
    expect(clamp(-3)).toBe(0);
    expect(clamp(4)).toBe(1);
  });

  it("honours explicit bounds", () => {
    expect(clamp(12, 0, 10)).toBe(10);
    expect(clamp(-12, -10, 10)).toBe(-10);
  });
});

describe("range", () => {
  it("maps the window onto 0..1", () => {
    expect(range(0.5, 0, 1)).toBe(0.5);
    expect(range(0.25, 0.2, 0.3)).toBeCloseTo(0.5);
  });

  it("clamps outside the window instead of extrapolating", () => {
    expect(range(0.1, 0.2, 0.3)).toBe(0);
    expect(range(0.9, 0.2, 0.3)).toBe(1);
  });

  it("returns the endpoints exactly", () => {
    expect(range(0.2, 0.2, 0.3)).toBe(0);
    expect(range(0.3, 0.2, 0.3)).toBe(1);
  });
});

describe("ease / easeIO", () => {
  it("pins both ends", () => {
    expect(ease(0)).toBe(0);
    expect(ease(1)).toBe(1);
    expect(easeIO(0)).toBe(0);
    expect(easeIO(1)).toBe(1);
  });

  it("is symmetric about the midpoint for easeIO", () => {
    expect(easeIO(0.5)).toBeCloseTo(0.5);
    expect(easeIO(0.25) + easeIO(0.75)).toBeCloseTo(1);
  });

  it("increases monotonically", () => {
    for (let i = 1; i <= 20; i++) {
      const a = i / 20;
      const b = (i - 1) / 20;
      expect(ease(a)).toBeGreaterThan(ease(b));
      expect(easeIO(a)).toBeGreaterThan(easeIO(b));
    }
  });

  it("front-loads ease so it outruns linear", () => {
    expect(ease(0.5)).toBeGreaterThan(0.5);
  });
});

describe("framePath", () => {
  it("zero-pads to four digits and is 1-based on disk", () => {
    expect(framePath(0)).toBe("/frames/0001.webp");
    expect(framePath(11)).toBe("/frames/0012.webp");
    expect(framePath(FRAME_COUNT - 1)).toBe("/frames/0192.webp");
  });
});

describe("frameIndexAt", () => {
  it("starts on the first frame", () => {
    expect(frameIndexAt(0)).toBe(0);
  });

  it("reaches the last frame exactly when the turn ends", () => {
    expect(frameIndexAt(PORTRAIT_TURN_END)).toBe(FRAME_COUNT - 1);
  });

  it("holds the last frame through the remaining scroll", () => {
    expect(frameIndexAt(0.85)).toBe(FRAME_COUNT - 1);
    expect(frameIndexAt(1)).toBe(FRAME_COUNT - 1);
  });

  it("clamps progress that overshoots either end", () => {
    expect(frameIndexAt(-0.4)).toBe(0);
    expect(frameIndexAt(1.6)).toBe(FRAME_COUNT - 1);
  });

  it("never leaves the valid frame window", () => {
    for (let i = 0; i <= 100; i++) {
      const index = frameIndexAt(i / 100);
      expect(Number.isInteger(index)).toBe(true);
      expect(index).toBeGreaterThanOrEqual(0);
      expect(index).toBeLessThan(FRAME_COUNT);
    }
  });

  it("never runs backwards as progress grows", () => {
    let previous = -1;
    for (let i = 0; i <= 200; i++) {
      const index = frameIndexAt(i / 200);
      expect(index).toBeGreaterThanOrEqual(previous);
      previous = index;
    }
  });

  it("accepts a different frame count", () => {
    expect(frameIndexAt(PORTRAIT_TURN_END, 10)).toBe(9);
    expect(frameIndexAt(0, 10)).toBe(0);
  });
});

describe("stepToward", () => {
  it("moves a fraction of the remaining distance", () => {
    expect(stepToward(0, 1, 0.12)).toBeCloseTo(0.12);
  });

  it("snaps once the gap is below the epsilon", () => {
    expect(stepToward(0.5, 0.500_01, 0.12)).toBe(0.500_01);
  });

  it("jumps straight to the target at factor 1, as reduced motion needs", () => {
    expect(stepToward(0, 0.8, 1)).toBe(0.8);
  });

  it("converges from either side without overshooting", () => {
    let current = 1;
    for (let i = 0; i < 200; i++) current = stepToward(current, 0.25, 0.12);
    expect(current).toBe(0.25);

    current = 0;
    for (let i = 0; i < 200; i++) current = stepToward(current, 0.25, 0.12);
    expect(current).toBe(0.25);
  });
});

describe("splitStatement", () => {
  it("splits space-separated text on word boundaries", () => {
    expect(splitStatement("Every build starts")).toEqual({
      tokens: ["Every", "build", "starts"],
      separator: " ",
    });
  });

  it("falls back to characters when the script has no word spaces", () => {
    expect(splitStatement("規格先行")).toEqual({
      tokens: ["規", "格", "先", "行"],
      separator: "",
    });
  });

  it("never drops CJK punctuation", () => {
    // It is glued to its neighbour rather than standing alone — see the
    // line-breaking suite below — but nothing may go missing.
    const { tokens } = splitStatement("規格：先行。");
    expect(tokens.join("")).toBe("規格：先行。");
  });

  it("round-trips: joining the tokens rebuilds the original", () => {
    for (const text of ["a b c", "一二三", "one"]) {
      const { tokens, separator } = splitStatement(text);
      expect(tokens.join(separator)).toBe(text);
    }
  });

  it("leaves a spaceless Latin string whole rather than splitting letters", () => {
    expect(splitStatement("one").tokens).toEqual(["one"]);
  });

  it("prefers word boundaries when a sentence mixes scripts", () => {
    expect(splitStatement("ship 上架 now").tokens).toEqual([
      "ship",
      "上架",
      "now",
    ]);
  });
});

describe("coverRect", () => {
  // The frames are 1280x720 landscape.
  const IW = 1280;
  const IH = 720;

  it("fills the box exactly when the aspects match", () => {
    expect(coverRect(1280, 720, IW, IH)).toEqual({ dx: 0, dy: 0, dw: 1280, dh: 720 });
  });

  it("never leaves a gap, whatever the box shape", () => {
    const boxes = [
      [1600, 620],
      [390, 844],
      [1440, 852],
      [2560, 1080],
      [800, 800],
    ];
    for (const [w, h] of boxes) {
      const { dx, dy, dw, dh } = coverRect(w, h, IW, IH);
      expect(dw).toBeGreaterThanOrEqual(w - 1e-9);
      expect(dh).toBeGreaterThanOrEqual(h - 1e-9);
      expect(dx).toBeLessThanOrEqual(0 + 1e-9);
      expect(dy).toBeLessThanOrEqual(0 + 1e-9);
      expect(dx + dw).toBeGreaterThanOrEqual(w - 1e-9);
      expect(dy + dh).toBeGreaterThanOrEqual(h - 1e-9);
    }
  });

  it("keeps the aspect ratio", () => {
    const { dw, dh } = coverRect(1600, 620, IW, IH);
    expect(dw / dh).toBeCloseTo(IW / IH);
  });

  it("always centres horizontally", () => {
    const { dx, dw } = coverRect(390, 844, IW, IH);
    expect(dx).toBeCloseTo((390 - dw) / 2);
  });

  it("anchors the crop to the top by default, so the head is never cut", () => {
    expect(PORTRAIT_ANCHOR_Y).toBe(0);
    const { dy } = coverRect(1600, 620, IW, IH);
    expect(dy).toBe(0);
  });

  it("still supports a centred crop when asked", () => {
    const { dy, dh } = coverRect(1600, 620, IW, IH, 0.5);
    expect(dy).toBeCloseTo((620 - dh) / 2);
  });

  it("clamps the anchor into 0..1", () => {
    const tall = coverRect(1600, 620, IW, IH, 5);
    const bottom = coverRect(1600, 620, IW, IH, 1);
    expect(tall).toEqual(bottom);
    expect(coverRect(1600, 620, IW, IH, -3).dy).toBe(0);
  });

  it("does not crop vertically at all on portrait boxes", () => {
    const { dy, dh } = coverRect(390, 844, IW, IH);
    expect(dy).toBe(0);
    expect(dh).toBeCloseTo(844);
  });
});

describe("splitStatement line-breaking rules (禁則處理)", () => {
  // Every token becomes an inline-block span, which defeats the browser's own
  // CJK line-breaking rules — so the split itself has to respect them.
  it("never leaves punctuation that cannot start a line as its own token", () => {
    const { tokens } = splitStatement("我寫。你讀，好！");
    expect(tokens).toEqual(["我", "寫。", "你", "讀，", "好！"]);
  });

  it("attaches a run of trailing punctuation to the same token", () => {
    const { tokens } = splitStatement("好嗎？！嗯");
    expect(tokens).toEqual(["好", "嗎？！", "嗯"]);
  });

  it("keeps a closing quote with the character it closes", () => {
    const { tokens } = splitStatement("他說「好」吧");
    expect(tokens).toEqual(["他", "說", "「好」", "吧"]);
  });

  it("never lets an opening bracket end a line either", () => {
    const { tokens } = splitStatement("說「好");
    expect(tokens).toEqual(["說", "「好"]);
  });

  it("still round-trips exactly", () => {
    const text = "做了八年行銷，我看過太多好想法死在執行上。所以我開始自己寫。";
    const { tokens, separator } = splitStatement(text);
    expect(tokens.join(separator)).toBe(text);
    expect(tokens.some((t) => /^[。，、！？」]/.test(t))).toBe(false);
  });

  it("leaves leading punctuation alone when there is nothing to attach it to", () => {
    expect(splitStatement("。好").tokens).toEqual(["。", "好"]);
  });
});
