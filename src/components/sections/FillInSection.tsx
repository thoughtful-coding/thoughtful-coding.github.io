import React, { useCallback, useEffect, useMemo, useState } from "react";
import type {
  BlankConfig,
  FillInSectionData,
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
  parseBody,
  validateFillIn,
  isBlankCorrect,
  isUnparseableNumber,
  matchNumeric,
  scoreGuess,
  type FillInSegment,
  type LetterStatus,
} from "../../lib/fillInLogic";

interface FillInSectionProps {
  section: FillInSectionData;
  unitId: UnitId;
  lessonId: LessonId;
  courseId: CourseId;
  lessonPath: string;
}

interface FillInState {
  answers: Record<string, string>;
  // Snapshot of the answers at the moment of the last "Check". Completion and
  // all hinting read from this, never from live typing.
  checkedAnswers: Record<string, string>;
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

/** Wordle-style colored tiles for one checked guess at a text blank. */
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

interface FillInBlankProps {
  config: BlankConfig;
  position: number;
  value: string;
  checkedGuess: string | undefined;
  showFeedback: boolean;
  disabled: boolean;
  onChange: (value: string) => void;
  testIdBase: string;
}

/**
 * One blank: the input, its unit, and whatever hint its `match` type offers.
 * Adding a matcher means adding a branch here and in `fillInLogic`, and nothing
 * else in the section changes.
 */
const FillInBlank: React.FC<FillInBlankProps> = ({
  config,
  position,
  value,
  checkedGuess,
  showFeedback,
  disabled,
  onChange,
  testIdBase,
}) => {
  const hasChecked = showFeedback && checkedGuess !== undefined;
  const isCorrect = hasChecked && isBlankCorrect(config, checkedGuess ?? "");
  const unparseable =
    hasChecked && isUnparseableNumber(config, checkedGuess ?? "");

  let inputClass = styles.predictionInput;
  if (hasChecked && !unparseable) {
    inputClass = `${styles.predictionInput} ${
      isCorrect ? styles.fillInInputCorrect : styles.fillInInputIncorrect
    }`;
  }
  // Width tracks what the learner typed — never the answer — so the length of
  // the target is never revealed.
  const widthCh = Math.max(6, value.length + 1);

  const guess = checkedGuess ?? "";
  const wrongWithGuess = hasChecked && !isCorrect && guess.trim().length > 0;

  let hint: React.ReactNode = null;
  if (unparseable) {
    hint = (
      <span
        className={styles.fillInBlankNote}
        data-testid={`${testIdBase}-unparseable-${position}`}
      >
        enter a number
      </span>
    );
  } else if (wrongWithGuess && config.match === "text") {
    if (config.hintMode === "coloring") {
      hint = (
        <LetterFeedback
          guess={guess}
          answers={config.answers}
          caseSensitive={config.caseSensitive}
          testId={`${testIdBase}-hint-${position}`}
        />
      );
    }
  } else if (wrongWithGuess && config.match === "numeric") {
    if (config.hintMode === "highLow") {
      const { direction } = matchNumeric(
        guess,
        config.answer,
        config.tolerance
      );
      if (direction) {
        hint = (
          <span
            className={styles.fillInBlankNote}
            data-testid={`${testIdBase}-hint-${position}`}
          >
            too {direction === "high" ? "high" : "low"}
          </span>
        );
      }
    }
  }

  return (
    <span
      style={{
        display: "inline-flex",
        flexDirection: "column",
        verticalAlign: "top",
      }}
    >
      <span>
        <input
          type="text"
          // Deliberately not type="number": the scroll wheel silently edits it,
          // and the browser would swallow input like "9,09" that we need to see
          // in order to tell the learner what is wrong with it.
          inputMode={config.match === "numeric" ? "decimal" : "text"}
          className={inputClass}
          style={{ width: `${widthCh}ch` }}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          aria-label={`Blank ${position + 1}`}
          autoComplete="off"
          autoCapitalize="off"
          spellCheck={false}
          data-testid={`${testIdBase}-${position}`}
        />
        {config.match === "numeric" && config.unit && (
          <span className={styles.fillInUnit}> {config.unit}</span>
        )}
      </span>
      {hint}
    </span>
  );
};

const FillInSection: React.FC<FillInSectionProps> = ({
  section,
  unitId,
  lessonId,
  courseId,
  lessonPath,
}) => {
  const { startPenalty, incrementAttemptCounter } = useProgressActions();
  const isLockedOut = useIsPenaltyActive();
  const remainingPenaltyTime = useRemainingPenaltyTime();

  const segments = useMemo(() => parseBody(section.body), [section.body]);
  const errors = useMemo(
    () => validateFillIn(section.body, section.blanks),
    [section.body, section.blanks]
  );

  // Blank names in body order, deduped, and only those that actually resolve.
  const blankNames = useMemo(() => {
    const names: string[] = [];
    for (const seg of segments) {
      if (seg.kind === "blank" && seg.name in section.blanks) {
        if (!names.includes(seg.name)) names.push(seg.name);
      }
    }
    return names;
  }, [segments, section.blanks]);

  const areAnswersComplete = useCallback(
    (answers: Record<string, string>) =>
      blankNames.length > 0 &&
      blankNames.every((n) =>
        isBlankCorrect(section.blanks[n], answers[n] ?? "")
      ),
    [blankNames, section.blanks]
  );

  // Completion is judged on the *checked* answers, not what's currently typed,
  // so the section only flips to complete after "Check Answers" is clicked.
  // useSectionProgress re-evaluates this on every keystroke; reading live input
  // here would silently complete the section with no click.
  const checkCompletion = useCallback(
    (state: FillInState) => areAnswersComplete(state.checkedAnswers),
    [areAnswersComplete]
  );

  const [state, setState, isComplete] = useSectionProgress<FillInState>(
    unitId,
    lessonId,
    section.id,
    `fillIn_${section.id}`,
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

  const handleChange = (name: string, value: string) => {
    setState((prev) => ({
      ...prev,
      answers: { ...prev.answers, [name]: value },
    }));
  };

  // Nothing to grade until at least one blank has been filled in, and a section
  // that is already complete must not be re-graded — re-checking it would
  // recompute completion as false and start a penalty on a finished section.
  const hasAnyAnswer = blankNames.some(
    (n) => (state.answers[n] ?? "").trim().length > 0
  );
  const canCheck = !isLockedOut && !isComplete && hasAnyAnswer;

  const handleCheck = () => {
    if (!canCheck) return;
    setShowFeedback(true);
    setState((prev) => ({ ...prev, checkedAnswers: { ...prev.answers } }));

    // A number the parser cannot read is a typo, not a wrong answer: show the
    // learner what to fix without spending an attempt or locking them out.
    const hasTypo = blankNames.some((n) =>
      isUnparseableNumber(section.blanks[n], state.answers[n] ?? "")
    );
    // Evaluate the live answers (what was just submitted); state.checkedAnswers
    // won't reflect this click until the setState above commits.
    if (!hasTypo && !areAnswersComplete(state.answers)) {
      startPenalty();
      incrementAttemptCounter(unitId, lessonId, section.id);
    }
  };

  const correctCount = blankNames.filter((n) =>
    isBlankCorrect(section.blanks[n], state.checkedAnswers[n] ?? "")
  ).length;

  const hasNumericBlank = blankNames.some(
    (n) => section.blanks[n].match === "numeric"
  );

  if (errors.length > 0) {
    return (
      <section id={section.id} className={styles.section}>
        <h2 className={styles.title}>{section.title}</h2>
        <div
          className={styles.incorrectFeedback}
          data-testid={`fill-in-errors-${section.id}`}
        >
          <p>
            <strong>
              This section is misconfigured and cannot be answered.
            </strong>
          </p>
          <ul>
            {errors.map((e) => (
              <li key={e}>{e}</li>
            ))}
          </ul>
        </div>
      </section>
    );
  }

  let position = -1;

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
        {segments.map((seg: FillInSegment, i) => {
          if (seg.kind === "text") return <span key={i}>{seg.value}</span>;
          position += 1;
          const name = seg.name;
          return (
            <FillInBlank
              key={i}
              config={section.blanks[name]}
              position={position}
              value={state.answers[name] ?? ""}
              checkedGuess={state.checkedAnswers[name]}
              showFeedback={showFeedback}
              disabled={isLockedOut || isComplete}
              onChange={(v) => handleChange(name, v)}
              testIdBase={`fill-in-input-${section.id}`}
            />
          );
        })}
      </p>

      {hasNumericBlank && (
        <p className={styles.fillInHelpText}>
          Use <code>.</code> as the decimal separator — for example{" "}
          <code>12.5</code>.
        </p>
      )}

      <div className={styles.editorControls}>
        <button
          className={styles.quizSubmitButton}
          onClick={handleCheck}
          disabled={!canCheck}
          data-testid={`fill-in-check-${section.id}`}
        >
          Check Answers
        </button>
      </div>

      {isLockedOut && !isComplete && (
        <div className={styles.penaltyMessageActive}>
          Time penalty active — study the hints, then try again in{" "}
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
              {correctCount} / {blankNames.length} correct.{" "}
              {section.feedback?.incorrect ??
                "Use the hints beneath each blank, then check again."}
            </p>
          </div>
        ))}
    </section>
  );
};

export default FillInSection;
