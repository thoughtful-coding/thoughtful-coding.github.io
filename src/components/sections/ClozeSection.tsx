import React, { useCallback, useEffect, useMemo, useState } from "react";
import type {
  ClozeSectionData,
  ClozeHintMode,
  UnitId,
  LessonId,
  CourseId,
} from "../../types/data";
import styles from "./Section.module.css";
import { useSectionProgress } from "../../hooks/useSectionProgress";
import {
  useProgressActions,
  useIsPenaltyActive,
  useRemainingPenaltyTime,
} from "../../stores/progressStore";
import ContentRenderer from "../content_blocks/ContentRenderer";
import {
  parseCloze,
  isBlankCorrect,
  scoreGuess,
  type ClozeSegment,
  type LetterStatus,
} from "../../lib/clozeParsing";

interface ClozeSectionProps {
  section: ClozeSectionData;
  unitId: UnitId;
  lessonId: LessonId;
  courseId: CourseId;
  lessonPath: string;
}

interface ClozeState {
  answers: { [index: number]: string };
  // Snapshot of the answers at the moment of the last "Check" — drives the
  // per-letter hint colors (Wordle-style: colors reflect submitted guesses).
  checkedAnswers: { [index: number]: string };
}

const TILE_COLOR: Record<LetterStatus, string> = {
  correct: "#6aaa64",
  present: "#c9b458",
  absent: "#787c7e",
};
const STATUS_LABEL: Record<LetterStatus, string> = {
  correct: "correct",
  present: "wrong position",
  absent: "not in answer",
};

/** Wordle-style colored tiles for one checked guess. */
const LetterFeedback: React.FC<{
  guess: string;
  answers: string[];
  caseSensitive: boolean;
  testId: string;
}> = ({ guess, answers, caseSensitive, testId }) => {
  const scored = useMemo(
    () => scoreGuess(guess, answers, caseSensitive),
    [guess, answers, caseSensitive]
  );
  if (scored.length === 0) return null;
  return (
    <span
      role="img"
      aria-label={`Hint: ${scored
        .map((s) => `${s.char} ${STATUS_LABEL[s.status]}`)
        .join(", ")}`}
      style={{ display: "inline-flex", gap: 2, marginTop: 4 }}
      data-testid={testId}
    >
      {scored.map((s, i) => (
        <span
          key={i}
          aria-hidden="true"
          title={STATUS_LABEL[s.status]}
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            minWidth: "1.4em",
            height: "1.4em",
            padding: "0 0.15em",
            background: TILE_COLOR[s.status],
            color: "#fff",
            fontWeight: 700,
            borderRadius: 3,
            textTransform: "uppercase",
            fontSize: "0.85em",
          }}
        >
          {s.char}
        </span>
      ))}
    </span>
  );
};

interface ClozeBlankProps {
  index: number;
  answers: string[];
  value: string;
  caseSensitive: boolean;
  hintMode: ClozeHintMode;
  checkedGuess: string | undefined;
  isCorrect: boolean;
  showFeedback: boolean;
  disabled: boolean;
  onChange: (value: string) => void;
  testIdBase: string;
}

/**
 * A single blank: the text field plus its hint scaffolding. This is the seam
 * for author-selectable hint styles — a new mode (e.g. front-to-back reveal)
 * is added as another branch here without touching the rest of the section.
 */
const ClozeBlank: React.FC<ClozeBlankProps> = ({
  index,
  answers,
  value,
  caseSensitive,
  hintMode,
  checkedGuess,
  isCorrect,
  showFeedback,
  disabled,
  onChange,
  testIdBase,
}) => {
  const hasChecked = showFeedback && checkedGuess !== undefined;
  let inputClass = styles.predictionInput;
  if (hasChecked) {
    inputClass = `${styles.predictionInput} ${
      isCorrect ? styles.clozeInputCorrect : styles.clozeInputIncorrect
    }`;
  }
  // Width tracks what the learner typed — never the answer — so the length of
  // the target word is never revealed.
  const widthCh = Math.max(6, value.length + 1);

  const showColoring =
    hintMode === "coloring" &&
    hasChecked &&
    !isCorrect &&
    checkedGuess !== undefined &&
    checkedGuess.trim().length > 0;

  return (
    <span style={{ display: "inline-flex", flexDirection: "column", verticalAlign: "top" }}>
      <input
        type="text"
        className={inputClass}
        style={{ width: `${widthCh}ch` }}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        aria-label={`Blank ${index + 1}`}
        autoComplete="off"
        autoCapitalize="off"
        spellCheck={false}
        data-testid={`${testIdBase}-${index}`}
      />
      {showColoring && (
        <LetterFeedback
          guess={checkedGuess}
          answers={answers}
          caseSensitive={caseSensitive}
          testId={`${testIdBase}-hint-${index}`}
        />
      )}
    </span>
  );
};

const ClozeSection: React.FC<ClozeSectionProps> = ({
  section,
  unitId,
  lessonId,
  courseId,
  lessonPath,
}) => {
  const caseSensitive = section.caseSensitive ?? false;
  const hintMode: ClozeHintMode = section.hintMode ?? "coloring";

  const { startPenalty, incrementAttemptCounter } = useProgressActions();
  const isLockedOut = useIsPenaltyActive();
  const remainingPenaltyTime = useRemainingPenaltyTime();

  const segments = useMemo(() => parseCloze(section.body), [section.body]);
  const blanks = useMemo(
    () =>
      segments.filter(
        (s): s is Extract<ClozeSegment, { kind: "blank" }> => s.kind === "blank"
      ),
    [segments]
  );

  // True when the given answers map fills every blank correctly.
  const areAnswersComplete = useCallback(
    (answers: ClozeState["answers"]) =>
      blanks.length > 0 &&
      blanks.every((b) =>
        isBlankCorrect(answers[b.index] ?? "", b.answers, caseSensitive)
      ),
    [blanks, caseSensitive]
  );

  // Completion is judged on the *checked* answers, not what's currently typed,
  // so the section only flips to complete after "Check Answers" is clicked.
  // (Previously, correcting a blank after a wrong check auto-completed with no
  // click, because useSectionProgress re-evaluates this on every keystroke.)
  const checkCompletion = useCallback(
    (state: ClozeState) => areAnswersComplete(state.checkedAnswers),
    [areAnswersComplete]
  );

  const [state, setState, isComplete] = useSectionProgress<ClozeState>(
    unitId,
    lessonId,
    section.id,
    `cloze_${section.id}`,
    { answers: {}, checkedAnswers: {} },
    checkCompletion
  );

  const [showFeedback, setShowFeedback] = useState(
    Object.keys(state.checkedAnswers).length > 0 || isComplete
  );

  // Re-render each second so the lock-out countdown ticks down (and clears
  // itself the moment the penalty expires). Mirrors the quiz sections.
  const [, setTick] = useState(0);
  useEffect(() => {
    if (isLockedOut && remainingPenaltyTime > 0) {
      const interval = setInterval(() => setTick((t) => t + 1), 1000);
      return () => clearInterval(interval);
    }
  }, [isLockedOut, remainingPenaltyTime]);

  // Author guard: this is a required section, so a body with no [[blanks]] can
  // never be completed and would silently block lesson progress. Warn loudly.
  useEffect(() => {
    if (blanks.length === 0) {
      console.warn(
        `ClozeSection "${section.id}": body has no [[blanks]], so it can never ` +
          `be completed and will block lesson progress. Add at least one blank, ` +
          `e.g. "A Python [[function]] is defined with [[def]]."`
      );
    }
  }, [blanks.length, section.id]);

  const handleChange = (index: number, value: string) => {
    setState((prev) => ({
      ...prev,
      answers: { ...prev.answers, [index]: value },
    }));
  };

  const handleCheck = () => {
    if (isLockedOut) return;
    setShowFeedback(true);
    setState((prev) => ({ ...prev, checkedAnswers: { ...prev.answers } }));
    // A wrong check triggers the same time-penalty lock-out as the quiz sections.
    // Evaluate the live answers (what was just submitted); state.checkedAnswers
    // won't reflect this click until the setState above commits.
    if (!areAnswersComplete(state.answers)) {
      startPenalty();
      incrementAttemptCounter(unitId, lessonId, section.id);
    }
  };

  const correctCount = blanks.filter((b) =>
    isBlankCorrect(state.checkedAnswers[b.index] ?? "", b.answers, caseSensitive)
  ).length;

  return (
    <section id={section.id} className={styles.section}>
      <h2 className={styles.title}>{section.title}</h2>
      <div className={styles.content}>
        <ContentRenderer
          content={section.content}
          courseId={courseId}
          lessonPath={lessonPath}
        />
      </div>

      <p style={{ lineHeight: 2.6 }}>
        {segments.map((seg, i) =>
          seg.kind === "text" ? (
            <span key={i}>{seg.value}</span>
          ) : (
            <ClozeBlank
              key={i}
              index={seg.index}
              answers={seg.answers}
              value={state.answers[seg.index] ?? ""}
              caseSensitive={caseSensitive}
              hintMode={hintMode}
              checkedGuess={state.checkedAnswers[seg.index]}
              isCorrect={isBlankCorrect(
                state.checkedAnswers[seg.index] ?? "",
                seg.answers,
                caseSensitive
              )}
              showFeedback={showFeedback}
              disabled={isLockedOut}
              onChange={(v) => handleChange(seg.index, v)}
              testIdBase={`cloze-input-${section.id}`}
            />
          )
        )}
      </p>

      <div className={styles.editorControls}>
        <button
          className={styles.quizSubmitButton}
          onClick={handleCheck}
          disabled={isLockedOut}
          data-testid={`cloze-check-${section.id}`}
        >
          Check Answers
        </button>
      </div>

      {isLockedOut && !isComplete && (
        <div className={styles.penaltyMessageActive}>
          Time penalty active — study the highlighted letters, then try again in{" "}
          {remainingPenaltyTime} second{remainingPenaltyTime === 1 ? "" : "s"}.
        </div>
      )}

      {showFeedback &&
        (isComplete ? (
          <div className={styles.testSuccess}>
            <p>
              {section.feedback?.correct ??
                "Correct! All blanks filled in properly."}
            </p>
          </div>
        ) : (
          <div className={styles.incorrectFeedback}>
            <p>
              {correctCount} / {blanks.length} correct.{" "}
              {section.feedback?.incorrect ??
                "Use the colored letters as hints, then check again."}
            </p>
          </div>
        ))}
    </section>
  );
};

export default ClozeSection;
