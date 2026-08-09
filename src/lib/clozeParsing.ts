/**
 * Pure parsing/grading helpers for ClozeSection (fill-in-the-blank).
 * Kept separate from the component so they can be unit-tested and so the
 * component file only exports a component (react-refresh friendly).
 */

export type ClozeSegment =
  | { kind: "text"; value: string }
  | { kind: "blank"; index: number; answers: string[] };

/**
 * Splits a cloze body into text runs and blanks. Blanks are marked `[[answer]]`,
 * with pipe-separated alternatives (`[[6|six]]`).
 *
 * The lazy match is guarded by `(?!\])` so answers that themselves end in a
 * bracket close correctly: in `[[nums[0]]]` the closing `]]` is taken to be the
 * last two brackets, giving the answer `nums[0]` rather than `nums[0`.
 */
export function parseCloze(body: string): ClozeSegment[] {
  const segments: ClozeSegment[] = [];
  const regex = /\[\[(.+?)\]\](?!\])/g;
  let lastIndex = 0;
  let blankIndex = 0;
  let match: RegExpExecArray | null;
  while ((match = regex.exec(body)) !== null) {
    if (match.index > lastIndex) {
      segments.push({ kind: "text", value: body.slice(lastIndex, match.index) });
    }
    const answers = match[1]
      .split("|")
      .map((a) => a.trim())
      .filter((a) => a.length > 0);
    segments.push({ kind: "blank", index: blankIndex++, answers });
    lastIndex = regex.lastIndex;
  }
  if (lastIndex < body.length) {
    segments.push({ kind: "text", value: body.slice(lastIndex) });
  }
  return segments;
}

/** Exact-match grading, trimmed and case-insensitive unless caseSensitive is set. */
export function isBlankCorrect(
  userAnswer: string,
  answers: string[],
  caseSensitive: boolean
): boolean {
  const norm = (s: string) =>
    caseSensitive ? s.trim() : s.trim().toLowerCase();
  const u = norm(userAnswer);
  return u.length > 0 && answers.some((a) => norm(a) === u);
}

export type LetterStatus = "correct" | "present" | "absent";
export interface ScoredLetter {
  char: string;
  status: LetterStatus;
}

/** Wordle scoring of one guess against one answer (count-aware, two-pass). */
function scoreAgainst(
  guess: string,
  answer: string,
  caseSensitive: boolean
): ScoredLetter[] {
  const g = [...guess];
  const norm = (c: string) => (caseSensitive ? c : c.toLowerCase());
  const gN = g.map(norm);
  const aN = [...answer].map(norm);
  const status: LetterStatus[] = new Array(g.length).fill("absent");

  // Pass 1: exact-position matches (green).
  for (let i = 0; i < g.length; i++) {
    if (i < aN.length && gN[i] === aN[i]) status[i] = "correct";
  }
  // Tally answer letters not already consumed by a green match.
  const remaining: Record<string, number> = {};
  for (let i = 0; i < aN.length; i++) {
    const greenHere = i < g.length && gN[i] === aN[i];
    if (!greenHere) remaining[aN[i]] = (remaining[aN[i]] ?? 0) + 1;
  }
  // Pass 2: present-but-misplaced (yellow), respecting remaining counts.
  for (let i = 0; i < g.length; i++) {
    if (status[i] === "correct") continue;
    const c = gN[i];
    if ((remaining[c] ?? 0) > 0) {
      status[i] = "present";
      remaining[c] -= 1;
    }
  }
  return g.map((char, i) => ({ char, status: status[i] }));
}

/**
 * Scores a guess for per-letter (Wordle-style) hinting. Only the letters the
 * learner actually typed are scored, so the answer's length is never revealed.
 * When a blank accepts alternatives, scores against whichever answer gives the
 * most helpful feedback (most greens, then yellows).
 */
export function scoreGuess(
  rawGuess: string,
  answers: string[],
  caseSensitive: boolean
): ScoredLetter[] {
  const guess = rawGuess.trim();
  if (guess.length === 0) return [];
  let best: ScoredLetter[] = [];
  let bestScore = -1;
  for (const answer of answers) {
    const scored = scoreAgainst(guess, answer, caseSensitive);
    const score =
      scored.filter((s) => s.status === "correct").length * 2 +
      scored.filter((s) => s.status === "present").length;
    if (score > bestScore) {
      bestScore = score;
      best = scored;
    }
  }
  return best;
}
