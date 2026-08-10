import {
  collectOptionFeedback,
  findUnreachableOptionFeedback,
} from "../quizFeedback";
import type { QuizOption } from "../../types/data";

const options: QuizOption[] = [
  { text: "zero", feedback: "why zero is wrong" },
  { text: "one" },
  { text: "two", feedback: "why two is wrong" },
  { text: "three", feedback: "why three belongs" },
];

describe("collectOptionFeedback", () => {
  it("explains a wrongly chosen option", () => {
    const entries = collectOptionFeedback(options, [0], [1], false);
    expect(entries).toEqual([
      {
        index: 0,
        reason: "chose",
        text: "zero",
        feedback: "why zero is wrong",
      },
    ]);
  });

  it("says nothing about an option the learner handled correctly", () => {
    expect(collectOptionFeedback(options, [1], [1], false)).toEqual([]);
  });

  it("skips options with no feedback authored", () => {
    // Option 1 is chosen and wrong, but carries no explanation.
    expect(collectOptionFeedback(options, [1], [0], false)).toEqual([]);
  });

  describe("one-best-answer (includeMissed false)", () => {
    it("never reports the correct option the learner failed to pick", () => {
      const entries = collectOptionFeedback(options, [2], [3], false);
      expect(entries.map((e) => e.index)).toEqual([2]);
      expect(entries.every((e) => e.reason === "chose")).toBe(true);
    });
  });

  describe("multi-select (includeMissed true)", () => {
    it("reports both a wrong pick and a missed right answer", () => {
      const entries = collectOptionFeedback(options, [0], [3], true);
      expect(entries).toEqual([
        {
          index: 0,
          reason: "chose",
          text: "zero",
          feedback: "why zero is wrong",
        },
        {
          index: 3,
          reason: "missed",
          text: "three",
          feedback: "why three belongs",
        },
      ]);
    });

    it("keeps options in their authored order", () => {
      const entries = collectOptionFeedback(options, [2], [0, 3], true);
      expect(entries.map((e) => e.index)).toEqual([0, 2, 3]);
    });

    it("says nothing when every option was handled correctly", () => {
      expect(collectOptionFeedback(options, [0, 3], [0, 3], true)).toEqual([]);
    });
  });

  it("tolerates a malformed option rather than throwing", () => {
    const ragged = [
      undefined,
      { text: "ok", feedback: "f" },
    ] as unknown as QuizOption[];
    expect(collectOptionFeedback(ragged, [0, 1], [], true)).toEqual([
      { index: 1, reason: "chose", text: "ok", feedback: "f" },
    ]);
  });
});

describe("findUnreachableOptionFeedback", () => {
  it("flags feedback on the correct option, which never renders", () => {
    expect(findUnreachableOptionFeedback(options, 3)).toEqual([3]);
  });

  it("is quiet when the correct option carries no feedback", () => {
    expect(findUnreachableOptionFeedback(options, 1)).toEqual([]);
  });
});
