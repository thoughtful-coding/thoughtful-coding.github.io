import {
  parseBody,
  validateFillIn,
  matchText,
  matchNumeric,
  isBlankCorrect,
  isUnparseableNumber,
  scoreGuess,
} from "../fillInLogic";
import type {
  BlankConfig,
  NumericBlankConfig,
  TextBlankConfig,
} from "../../types/data";

describe("parseBody", () => {
  it("splits text and named references in order", () => {
    expect(parseBody("a {{one}} b {{two}} c")).toEqual([
      { kind: "text", value: "a " },
      { kind: "blank", name: "one" },
      { kind: "text", value: " b " },
      { kind: "blank", name: "two" },
      { kind: "text", value: " c" },
    ]);
  });

  it("handles a reference at the very start and end, and trims names", () => {
    expect(parseBody("{{ a }} mid {{b}}")).toEqual([
      { kind: "blank", name: "a" },
      { kind: "text", value: " mid " },
      { kind: "blank", name: "b" },
    ]);
  });

  it("leaves bracket-heavy prose alone — no marker syntax to collide with", () => {
    expect(parseBody("print(nums[0]) and a [[literal]]")).toEqual([
      { kind: "text", value: "print(nums[0]) and a [[literal]]" },
    ]);
  });

  it("returns a single text segment when there are no references", () => {
    expect(parseBody("no blanks here")).toEqual([
      { kind: "text", value: "no blanks here" },
    ]);
  });

  it("is not affected by the regex's lastIndex across calls", () => {
    parseBody("{{a}} {{b}}");
    expect(parseBody("{{a}}")).toEqual([{ kind: "blank", name: "a" }]);
  });
});

describe("validateFillIn", () => {
  // Lesson files are not typechecked, so the validator's whole job is checking
  // what the interface asks for but cannot enforce. Every malformed fixture
  // below is a thing an author can really write and ship.
  const ok = validateFillIn;

  const TEXT: TextBlankConfig = {
    match: "text",
    answers: ["one"],
    caseSensitive: false,
    hintMode: "coloring",
  };
  const NUM: NumericBlankConfig = {
    match: "numeric",
    answer: 2,
    tolerance: 0,
    hintMode: "highLow",
  };

  it("accepts a well-formed section", () => {
    expect(ok("a {{x}} and {{y}}", { x: TEXT, y: NUM })).toEqual([]);
  });

  describe("body and blanks must line up", () => {
    it("flags a body with no blanks at all", () => {
      const errors = ok("nothing to fill in", {});
      expect(errors).toHaveLength(1);
      expect(errors[0]).toContain("no {{name}} blanks");
    });

    it("flags a reference with no matching blank", () => {
      expect(ok("a {{missing}}", {}).join(" ")).toContain(
        "references {{missing}}"
      );
    });

    it("flags a blank the body never references", () => {
      expect(ok("a {{x}}", { x: TEXT, spare: TEXT }).join(" ")).toContain(
        'blanks has "spare"'
      );
    });

    it("flags a repeated reference", () => {
      expect(ok("{{x}} and {{x}}", { x: TEXT }).join(" ")).toContain(
        "more than once"
      );
    });
  });

  describe("every blank names its matcher", () => {
    it("rejects a bare string, which used to mean a text blank", () => {
      expect(ok("a {{x}}", { x: "one" }).join(" ")).toContain(
        "naming its matcher"
      );
    });

    it("rejects a bare array", () => {
      expect(ok("a {{x}}", { x: ["one", "two"] }).join(" ")).toContain(
        "naming its matcher"
      );
    });

    it("rejects a config with no match, rather than guessing one", () => {
      const errors = ok("a {{x}}", { x: { answers: ["one"] } });
      expect(errors.join(" ")).toContain(
        'needs match: "text" or match: "numeric"'
      );
    });

    it("reports only the missing matcher, since the other rules depend on it", () => {
      expect(ok("a {{x}}", { x: { answers: ["one"] } })).toHaveLength(1);
    });
  });

  describe("text blanks", () => {
    it("flags an empty or blank-only answers list", () => {
      expect(
        ok("a {{x}}", { ...{ x: { ...TEXT, answers: [] } } }).join(" ")
      ).toContain("non-empty answers list");
      expect(
        ok("a {{x}}", { x: { ...TEXT, answers: ["", "  "] } }).join(" ")
      ).toContain("non-empty answers list");
    });

    it("requires caseSensitive to be stated, not defaulted", () => {
      const { caseSensitive: _omitted, ...withoutCasing } = TEXT;
      expect(ok("a {{x}}", { x: withoutCasing }).join(" ")).toContain(
        "needs caseSensitive: true or false"
      );
    });

    it("requires a hintMode, and rejects the numeric one", () => {
      const { hintMode: _omitted, ...withoutHint } = TEXT;
      expect(ok("a {{x}}", { x: withoutHint }).join(" ")).toContain(
        'needs hintMode: "coloring" or "none"'
      );
      expect(
        ok("a {{x}}", { x: { ...TEXT, hintMode: "highLow" } }).join(" ")
      ).toContain('needs hintMode: "coloring" or "none"');
    });
  });

  describe("numeric blanks", () => {
    it("flags a missing tolerance", () => {
      const { tolerance: _omitted, ...withoutTolerance } = NUM;
      expect(ok("a {{x}}", { x: withoutTolerance }).join(" ")).toContain(
        "needs a tolerance"
      );
    });

    it("flags a negative tolerance and a non-finite answer", () => {
      const errors = ok("a {{x}}", {
        x: { ...NUM, answer: Number.NaN, tolerance: -1 },
      });
      expect(errors.join(" ")).toContain("non-finite numeric answer");
      expect(errors.join(" ")).toContain("needs a tolerance");
    });

    it("allows a deliberate zero tolerance", () => {
      expect(ok("a {{x}}", { x: { ...NUM, tolerance: 0 } })).toEqual([]);
    });

    it("requires a hintMode, and rejects the text one", () => {
      const { hintMode: _omitted, ...withoutHint } = NUM;
      expect(ok("a {{x}}", { x: withoutHint }).join(" ")).toContain(
        'needs hintMode: "highLow" or "none"'
      );
      expect(
        ok("a {{x}}", { x: { ...NUM, hintMode: "coloring" } }).join(" ")
      ).toContain('needs hintMode: "highLow" or "none"');
    });
  });
});

describe("matchText", () => {
  it("matches case-insensitively and trims by default", () => {
    expect(matchText("  DEF ", ["def"], false)).toBe(true);
  });

  it("accepts any of the alternatives", () => {
    expect(matchText("six", ["6", "six"], false)).toBe(true);
    expect(matchText("6", ["6", "six"], false)).toBe(true);
  });

  it("rejects a wrong or empty answer", () => {
    expect(matchText("class", ["def"], false)).toBe(false);
    expect(matchText("", ["def"], false)).toBe(false);
    expect(matchText("   ", ["def"], false)).toBe(false);
  });

  it("respects caseSensitive when set", () => {
    expect(matchText("Def", ["def"], true)).toBe(false);
    expect(matchText("def", ["def"], true)).toBe(true);
  });
});

describe("matchNumeric", () => {
  it("accepts a value inside the tolerance", () => {
    expect(matchNumeric("9.1", 9.09, 0.1)).toEqual({
      ok: true,
      parsed: 9.1,
      direction: null,
    });
  });

  it("accepts a value exactly on the boundary (<=, not <)", () => {
    expect(matchNumeric("9.5", 9, 0.5).ok).toBe(true);
    expect(matchNumeric("8.5", 9, 0.5).ok).toBe(true);
  });

  it("rejects just outside the boundary and reports the direction", () => {
    expect(matchNumeric("9.51", 9, 0.5)).toEqual({
      ok: false,
      parsed: 9.51,
      direction: "high",
    });
    expect(matchNumeric("8.49", 9, 0.5)).toEqual({
      ok: false,
      parsed: 8.49,
      direction: "low",
    });
  });

  it("reports direction correctly for negative answers", () => {
    expect(matchNumeric("-3", -5, 1).direction).toBe("high");
    expect(matchNumeric("-7", -5, 1).direction).toBe("low");
  });

  it("honours a zero tolerance", () => {
    expect(matchNumeric("8", 8, 0).ok).toBe(true);
    expect(matchNumeric("8.01", 8, 0).ok).toBe(false);
  });

  it("survives floating-point representation error", () => {
    // 0.1 + 0.2 is 0.30000000000000004, so a zero tolerance genuinely misses.
    expect(matchNumeric("0.3", 0.1 + 0.2, 0).ok).toBe(false);
    expect(matchNumeric("0.3", 0.1 + 0.2, 1e-9).ok).toBe(true);
  });

  describe("parsing", () => {
    const unparseable = { ok: false, parsed: null, direction: null };

    it("rejects empty and whitespace-only input rather than reading it as 0", () => {
      expect(matchNumeric("", 0, 0)).toEqual(unparseable);
      expect(matchNumeric("   ", 0, 0)).toEqual(unparseable);
    });

    it("rejects a partial number instead of taking its numeric prefix", () => {
      expect(matchNumeric("12abc", 12, 0)).toEqual(unparseable);
    });

    it("rejects a comma decimal separator", () => {
      expect(matchNumeric("9,09", 9.09, 0.1)).toEqual(unparseable);
    });

    it("rejects infinities", () => {
      expect(matchNumeric("Infinity", 1, 0)).toEqual(unparseable);
      expect(matchNumeric("-Infinity", 1, 0)).toEqual(unparseable);
    });

    it("accepts exponent notation and padded input", () => {
      expect(matchNumeric("1e-3", 0.001, 0).ok).toBe(true);
      expect(matchNumeric("  42  ", 42, 0).ok).toBe(true);
    });
  });
});

describe("isBlankCorrect / isUnparseableNumber", () => {
  const text: BlankConfig = {
    match: "text",
    answers: ["def"],
    caseSensitive: false,
    hintMode: "coloring",
  };
  const numeric: BlankConfig = {
    match: "numeric",
    answer: 9.09,
    tolerance: 0.1,
    hintMode: "highLow",
  };

  it("routes to the matcher named by the blank's `match`", () => {
    expect(isBlankCorrect(text, "DEF")).toBe(true);
    expect(isBlankCorrect(numeric, "9.1")).toBe(true);
    expect(isBlankCorrect(numeric, "12")).toBe(false);
  });

  it("treats an unreadable number as a typo, not a wrong answer", () => {
    expect(isUnparseableNumber(numeric, "9,09")).toBe(true);
    expect(isUnparseableNumber(numeric, "12")).toBe(false);
  });

  it("does not call an empty box a typo — that is just unanswered", () => {
    expect(isUnparseableNumber(numeric, "")).toBe(false);
    expect(isUnparseableNumber(numeric, "   ")).toBe(false);
  });

  it("never reports a typo for a text blank", () => {
    expect(isUnparseableNumber(text, "anything")).toBe(false);
  });
});

describe("scoreGuess", () => {
  const statuses = (guess: string, answers: string[], cs = false) =>
    scoreGuess(guess, answers, cs).map((s) => s.status);

  it("marks all letters correct for an exact match", () => {
    expect(statuses("def", ["def"])).toEqual(["correct", "correct", "correct"]);
  });

  it("colors misplaced letters yellow and placed letters green", () => {
    expect(statuses("fed", ["def"])).toEqual(["present", "correct", "present"]);
  });

  it("marks absent letters grey", () => {
    expect(statuses("cat", ["def"])).toEqual(["absent", "absent", "absent"]);
  });

  it("respects letter counts (no double-credit for repeats)", () => {
    expect(statuses("ede", ["def"])).toEqual(["present", "present", "absent"]);
  });

  it("returns the learner's letters verbatim, never padding to answer length", () => {
    const scored = scoreGuess("de", ["def"], false);
    expect(scored.map((s) => s.char)).toEqual(["d", "e"]);
    expect(scored).toHaveLength(2); // shorter than the answer — length not revealed
  });

  it("is case-insensitive by default", () => {
    expect(statuses("DEF", ["def"])).toEqual(["correct", "correct", "correct"]);
  });

  it("scores against the most helpful acceptable answer", () => {
    expect(statuses("six", ["6", "six"])).toEqual([
      "correct",
      "correct",
      "correct",
    ]);
  });

  it("returns nothing for an empty guess", () => {
    expect(scoreGuess("", ["def"], false)).toEqual([]);
  });
});
