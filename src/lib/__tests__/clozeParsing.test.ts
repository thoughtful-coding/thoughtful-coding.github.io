import { parseCloze, isBlankCorrect, scoreGuess } from "../clozeParsing";

describe("parseCloze", () => {
  it("splits text and blanks in order with sequential indices", () => {
    const segs = parseCloze("a [[one]] b [[two]] c");
    expect(segs).toEqual([
      { kind: "text", value: "a " },
      { kind: "blank", index: 0, answers: ["one"] },
      { kind: "text", value: " b " },
      { kind: "blank", index: 1, answers: ["two"] },
      { kind: "text", value: " c" },
    ]);
  });

  it("parses pipe-separated alternatives, trimming each", () => {
    const segs = parseCloze("target [[6 | six]] mL");
    expect(segs[1]).toEqual({ kind: "blank", index: 0, answers: ["6", "six"] });
  });

  it("handles a blank at the very start and end", () => {
    const segs = parseCloze("[[a]] mid [[b]]");
    expect(segs.map((s) => s.kind)).toEqual(["blank", "text", "blank"]);
  });

  it("keeps trailing brackets that belong to the answer", () => {
    const segs = parseCloze("print([[nums[0]]])");
    expect(segs).toEqual([
      { kind: "text", value: "print(" },
      { kind: "blank", index: 0, answers: ["nums[0]"] },
      { kind: "text", value: ")" },
    ]);
  });

  it("still ends a blank at the first ]] when no extra bracket follows", () => {
    const segs = parseCloze("[[a]] then [[b]]");
    expect(segs).toEqual([
      { kind: "blank", index: 0, answers: ["a"] },
      { kind: "text", value: " then " },
      { kind: "blank", index: 1, answers: ["b"] },
    ]);
  });

  it("returns a single text segment when there are no blanks", () => {
    expect(parseCloze("no blanks here")).toEqual([
      { kind: "text", value: "no blanks here" },
    ]);
  });
});

describe("isBlankCorrect", () => {
  it("matches case-insensitively and trims by default", () => {
    expect(isBlankCorrect("  DEF ", ["def"], false)).toBe(true);
    expect(isBlankCorrect("Return", ["return"], false)).toBe(true);
  });

  it("accepts any of the alternatives", () => {
    expect(isBlankCorrect("six", ["6", "six"], false)).toBe(true);
    expect(isBlankCorrect("6", ["6", "six"], false)).toBe(true);
  });

  it("rejects a wrong or empty answer", () => {
    expect(isBlankCorrect("class", ["def"], false)).toBe(false);
    expect(isBlankCorrect("", ["def"], false)).toBe(false);
    expect(isBlankCorrect("   ", ["def"], false)).toBe(false);
  });

  it("respects caseSensitive when set", () => {
    expect(isBlankCorrect("Def", ["def"], true)).toBe(false);
    expect(isBlankCorrect("def", ["def"], true)).toBe(true);
  });
});

describe("scoreGuess", () => {
  const statuses = (guess: string, answers: string[], cs = false) =>
    scoreGuess(guess, answers, cs).map((s) => s.status);

  it("marks all letters correct for an exact match", () => {
    expect(statuses("def", ["def"])).toEqual(["correct", "correct", "correct"]);
  });

  it("colors misplaced letters yellow and placed letters green", () => {
    // answer "def", guess "fed" -> f present, e correct, d present
    expect(statuses("fed", ["def"])).toEqual(["present", "correct", "present"]);
  });

  it("marks absent letters grey", () => {
    expect(statuses("cat", ["def"])).toEqual(["absent", "absent", "absent"]);
  });

  it("respects letter counts (no double-credit for repeats)", () => {
    // answer "def" has one 'e'; guess "ede" -> first e present, d present,
    // second e absent (the single 'e' is already accounted for).
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
    // "six" matches the "six" alternative fully rather than the "6" one
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
