/**
 * Works out which options a learner got wrong, so each can carry its own
 * explanation. Kept out of the components so it is unit-testable and so the
 * component files stay react-refresh friendly.
 */

import type { QuizOption } from "../types/data";

export interface OptionFeedbackEntry {
  index: number;
  /** "chose" is a wrongly picked option; "missed" is a right one left unpicked. */
  reason: "chose" | "missed";
  text: string;
  feedback: string;
}

/**
 * Entries for every option the learner mishandled that has feedback authored.
 *
 * `includeMissed` is false for one-best-answer questions: the only mistake
 * available is picking a distractor, and the correct option's feedback would
 * duplicate `feedback.correct`.
 */
export function collectOptionFeedback(
  options: QuizOption[],
  chosen: readonly number[],
  correct: readonly number[],
  includeMissed: boolean
): OptionFeedbackEntry[] {
  const chosenSet = new Set(chosen);
  const correctSet = new Set(correct);
  const entries: OptionFeedbackEntry[] = [];

  options.forEach((option, index) => {
    if (!option?.feedback) return;
    const picked = chosenSet.has(index);
    const shouldPick = correctSet.has(index);
    if (picked && !shouldPick) {
      entries.push({
        index,
        reason: "chose",
        text: option.text,
        feedback: option.feedback,
      });
    } else if (!picked && shouldPick && includeMissed) {
      entries.push({
        index,
        reason: "missed",
        text: option.text,
        feedback: option.feedback,
      });
    }
  });

  return entries;
}

/**
 * Authoring problems that leave text no learner will ever read. A one-best-answer
 * question never renders its correct option's feedback, so writing one is a
 * mistake worth naming rather than silently dropping.
 */
export function findUnreachableOptionFeedback(
  options: QuizOption[],
  correctAnswer: number
): number[] {
  return options
    .map((option, index) =>
      option?.feedback && index === correctAnswer ? index : -1
    )
    .filter((index) => index >= 0);
}
