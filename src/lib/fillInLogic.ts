/**
 * Pure parsing/grading helpers for FillInSection.
 * Kept separate from the component so they can be unit-tested and so the
 * component file only exports a component (react-refresh friendly).
 */

import type { BlankConfig } from "../types/data";

export type FillInSegment =
  { kind: "text"; value: string } | { kind: "blank"; name: string };

/** A blank reference in the body: `{{name}}`. */
const BLANK_REF = /\{\{([^{}]*)\}\}/g;

/**
 * Splits a body into text runs and `{{name}}` blank references, in order.
 * Names are returned verbatim (trimmed); this does not check them against the
 * `blanks` map — see {@link validateFillIn}.
 */
export function parseBody(body: string): FillInSegment[] {
  const segments: FillInSegment[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  BLANK_REF.lastIndex = 0;
  while ((match = BLANK_REF.exec(body)) !== null) {
    if (match.index > lastIndex) {
      segments.push({
        kind: "text",
        value: body.slice(lastIndex, match.index),
      });
    }
    segments.push({ kind: "blank", name: match[1].trim() });
    lastIndex = BLANK_REF.lastIndex;
  }
  if (lastIndex < body.length) {
    segments.push({ kind: "text", value: body.slice(lastIndex) });
  }
  return segments;
}

/**
 * Authoring errors that would otherwise surface as a silently mis-grading
 * section. Lesson files are outside `tsconfig.app.json`, so *none* of the
 * interface's requirements are enforced at build time — this function is the
 * only thing that enforces them, and the component renders its output instead
 * of an interaction.
 */
export function validateFillIn(
  body: string,
  blanks: Record<string, unknown>
): string[] {
  const errors: string[] = [];
  const segments = parseBody(body);
  const refs = segments.filter(
    (s): s is Extract<FillInSegment, { kind: "blank" }> => s.kind === "blank"
  );

  if (refs.length === 0) {
    errors.push(
      "body has no {{name}} blanks, so the section can never be completed and " +
        'would block lesson progress (e.g. "defined with the {{kw}} keyword").'
    );
  }

  const seen = new Set<string>();
  for (const ref of refs) {
    if (ref.name.length === 0) {
      errors.push("body contains an empty reference {{}}.");
      continue;
    }
    if (seen.has(ref.name)) {
      errors.push(
        `body references {{${ref.name}}} more than once; give each blank its own name.`
      );
    }
    seen.add(ref.name);
    if (!(ref.name in blanks)) {
      errors.push(
        `body references {{${ref.name}}}, which has no entry in blanks.`
      );
    }
  }

  for (const name of Object.keys(blanks)) {
    if (!seen.has(name)) {
      errors.push(`blanks has "${name}", which the body never references.`);
    }
    errors.push(...validateBlankConfig(name, blanks[name]));
  }

  return errors;
}

/**
 * Checks one blank against what {@link BlankConfig} asks for.
 *
 * The parameter is `unknown` on purpose. A lesson file can declare a blank as a
 * bare string, or omit fields the interface marks required, and still compile —
 * so treating the value as a `BlankConfig` here would be assuming the very thing
 * this function is checking.
 */
function validateBlankConfig(name: string, declared: unknown): string[] {
  const errors: string[] = [];

  if (
    declared === null ||
    typeof declared !== "object" ||
    Array.isArray(declared)
  ) {
    return [
      `blank "${name}" must be an object naming its matcher, e.g. ` +
        `{ match: "text", answers: ["def"], caseSensitive: true, hintMode: "coloring" }.`,
    ];
  }
  const config = declared as Record<string, unknown>;

  if (config.match !== "text" && config.match !== "numeric") {
    return [
      `blank "${name}" needs match: "text" or match: "numeric". Without it the ` +
        `grading rule is a guess — a number written as text is compared literally, ` +
        `so 9.090 would be marked wrong against 9.09.`,
    ];
  }

  if (config.match === "text") {
    if (
      !Array.isArray(config.answers) ||
      config.answers.length === 0 ||
      config.answers.every((a: unknown) => !String(a).trim())
    ) {
      errors.push(`blank "${name}" needs a non-empty answers list.`);
    }
    if (typeof config.caseSensitive !== "boolean") {
      errors.push(
        `blank "${name}" needs caseSensitive: true or false. Python is ` +
          `case-sensitive, so this is a real grading decision with no safe default.`
      );
    }
    if (config.hintMode !== "coloring" && config.hintMode !== "none") {
      errors.push(`blank "${name}" needs hintMode: "coloring" or "none".`);
    }
  } else {
    if (!Number.isFinite(config.answer)) {
      errors.push(
        `blank "${name}" has a missing or non-finite numeric answer.`
      );
    }
    // Tolerance is required: exact float comparison misgrades computed values
    // (0.1 + 0.2 !== 0.3). Zero is allowed but only deliberately, for integers.
    if (typeof config.tolerance !== "number" || !(config.tolerance >= 0)) {
      errors.push(
        `blank "${name}" needs a tolerance >= 0; exact float comparison misgrades computed values.`
      );
    }
    if (config.hintMode !== "highLow" && config.hintMode !== "none") {
      errors.push(`blank "${name}" needs hintMode: "highLow" or "none".`);
    }
  }

  return errors;
}

// --- Grading -------------------------------------------------------------

/** Exact-match grading, trimmed and case-insensitive unless caseSensitive is set. */
export function matchText(
  userAnswer: string,
  answers: string[],
  caseSensitive: boolean
): boolean {
  const norm = (s: string) =>
    caseSensitive ? s.trim() : s.trim().toLowerCase();
  const u = norm(userAnswer);
  return u.length > 0 && answers.some((a) => norm(a) === u);
}

/** Result of a numeric comparison, including which way a wrong answer was wrong. */
export interface NumericMatch {
  ok: boolean;
  /** null when the input could not be read as a number at all. */
  parsed: number | null;
  /** "high" if too large, "low" if too small; null when ok or unparseable. */
  direction: "high" | "low" | null;
}

/**
 * Tolerance grading: `|parsed − answer| <= tolerance`, inclusive at the boundary.
 *
 * Parsing uses `Number()` rather than `parseFloat` so that partial numbers are
 * rejected outright: `parseFloat("12abc")` is 12, which would grade a typo as an
 * answer. Empty input, `NaN`, and infinities are all unparseable — and
 * unparseable is deliberately *not* the same as wrong (see the component: a typo
 * must not burn an attempt).
 */
export function matchNumeric(
  raw: string,
  answer: number,
  tolerance: number
): NumericMatch {
  const trimmed = raw.trim();
  if (trimmed.length === 0) {
    return { ok: false, parsed: null, direction: null };
  }
  const parsed = Number(trimmed);
  if (!Number.isFinite(parsed)) {
    return { ok: false, parsed: null, direction: null };
  }
  if (Math.abs(parsed - answer) <= tolerance) {
    return { ok: true, parsed, direction: null };
  }
  return { ok: false, parsed, direction: parsed > answer ? "high" : "low" };
}

/** True when this blank's typed answer is acceptable. */
export function isBlankCorrect(
  config: BlankConfig,
  userAnswer: string
): boolean {
  if (config.match === "text") {
    return matchText(userAnswer, config.answers, config.caseSensitive);
  }
  return matchNumeric(userAnswer, config.answer, config.tolerance).ok;
}

/** True when the input cannot be read as a number — a typo, not a wrong answer. */
export function isUnparseableNumber(
  config: BlankConfig,
  userAnswer: string
): boolean {
  if (config.match !== "numeric") return false;
  if (userAnswer.trim().length === 0) return false;
  return (
    matchNumeric(userAnswer, config.answer, config.tolerance).parsed === null
  );
}

// --- Per-letter (Wordle-style) hinting for text blanks -------------------

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
 * Scores a guess for per-letter hinting. Only the letters the learner actually
 * typed are scored, so the answer's length is never revealed. When a blank
 * accepts alternatives, scores against whichever answer gives the most helpful
 * feedback (most greens, then yellows).
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
