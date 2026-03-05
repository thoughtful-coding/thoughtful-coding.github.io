import React, { useState, useEffect, useCallback } from "react";
import type {
  RefactorSectionData,
  RefactorStyle,
  RefactorTabConfig,
  UnitId,
  LessonId,
  CourseId,
  SectionId,
} from "../../types/data";
import styles from "./Section.module.css";
import refactorStyles from "./RefactorSection.module.css";
import ContentRenderer from "../content_blocks/ContentRenderer";
import CodeEditor from "../CodeEditor";
import { usePyodide } from "../../contexts/PyodideContext";
import { useProgressStore } from "../../stores/progressStore";
import { useStyleCheck } from "../../hooks/useStyleCheck";
import { ConsoleTestResults } from "./TestResultsDisplay";
import { executeTests } from "../../hooks/useTestingLogic";
import type { TestResult } from "../../hooks/useTestingLogic";
import LoadingSpinner from "../LoadingSpinner";

const STYLE_LABELS: Record<RefactorStyle, string> = {
  function: "Function",
  oop: "OOP",
  recursive: "Recursive",
  pep8: "PEP 8",
  annotated: "Annotated",
  simple: "Simple",
  minimalist: "Minimalist",
};

const PYLINT_STYLES = new Set<RefactorStyle>([
  "pep8",
  "annotated",
  "simple",
  "minimalist",
]);

interface TabResult {
  testResults: TestResult[];
  testsPassed: boolean;
  stylePassed: boolean;
  styleFeedback: string[];
  error?: string;
}

interface RefactorSectionProps {
  section: RefactorSectionData;
  unitId: UnitId;
  lessonId: LessonId;
  courseId: CourseId;
  lessonPath: string;
}

/** Count non-empty, non-comment lines */
function countCodeLines(code: string): number {
  return code.split("\n").filter((l) => {
    const trimmed = l.trim();
    return trimmed.length > 0 && !trimmed.startsWith("#");
  }).length;
}

const RefactorSection: React.FC<RefactorSectionProps> = ({
  section,
  unitId,
  lessonId,
  courseId,
  lessonPath,
}) => {
  const {
    pyodide,
    runPythonCode,
    loadPylint,
    isLoading: isPyodideLoading,
  } = usePyodide();
  const { getDraft, saveDraft, completeSection } = useProgressStore(
    (s) => s.actions
  );
  const { checkStyle } = useStyleCheck();

  const [activeStyle, setActiveStyle] = useState<RefactorStyle>(
    section.tabs[0].style
  );
  const [tabCodes, setTabCodes] = useState<
    Partial<Record<RefactorStyle, string>>
  >(() => {
    const codes: Partial<Record<RefactorStyle, string>> = {};
    for (const tab of section.tabs) {
      const key = `${section.id}-${tab.style}` as SectionId;
      const draft = getDraft(unitId, lessonId, key);
      codes[tab.style] =
        draft?.code ?? `# ${STYLE_LABELS[tab.style]} version\n`;
    }
    return codes;
  });
  const [tabResults, setTabResults] = useState<
    Partial<Record<RefactorStyle, TabResult>>
  >({});
  const [isRunning, setIsRunning] = useState(false);
  const [isPylintLoading, setIsPylintLoading] = useState(false);

  const needsPylint = section.tabs.some((t) => PYLINT_STYLES.has(t.style));
  const allTabsPassed = section.tabs.every(
    (t) => tabResults[t.style]?.testsPassed && tabResults[t.style]?.stylePassed
  );
  const tabsByStyle = Object.fromEntries(
    section.tabs.map((t) => [t.style, t])
  ) as Record<RefactorStyle, RefactorTabConfig>;
  const activeTab = tabsByStyle[activeStyle];

  useEffect(() => {
    if (!needsPylint || isPyodideLoading) return;
    setIsPylintLoading(true);
    loadPylint()
      .catch(console.error)
      .finally(() => setIsPylintLoading(false));
  }, [needsPylint, isPyodideLoading, loadPylint]);

  useEffect(() => {
    if (allTabsPassed) {
      completeSection(unitId, lessonId, section.id);
    }
  }, [allTabsPassed, completeSection, unitId, lessonId, section.id]);

  const handleCodeChange = useCallback(
    (style: RefactorStyle, code: string) => {
      setTabCodes((prev) => ({ ...prev, [style]: code }));
      const key = `${section.id}-${style}` as SectionId;
      saveDraft(unitId, lessonId, key, { code, isModified: true });
    },
    [section.id, unitId, lessonId, saveDraft]
  );

  /** Check maxLines constraint; returns a failure TabResult or null if within limit */
  const checkMaxLines = (
    code: string,
    maxLines: number | undefined,
    testResults: TestResult[]
  ): TabResult | null => {
    if (maxLines == null) return null;
    const lineCount = countCodeLines(code);
    if (lineCount <= maxLines) return null;
    return {
      testResults,
      testsPassed: true,
      stylePassed: false,
      styleFeedback: [
        `Your solution is ${lineCount} lines — try to get it under ${maxLines}.`,
      ],
    };
  };

  const handleRunTests = useCallback(async () => {
    if (!pyodide || isRunning) return;
    const code = tabCodes[activeStyle] ?? "";
    setIsRunning(true);
    setTabResults((prev) => ({ ...prev, [activeStyle]: undefined }));

    try {
      // OOP: skip correctness tests, line count + style check only
      if (activeStyle === "oop") {
        const lineFail = checkMaxLines(code, activeTab.maxLines, []);
        if (lineFail) {
          setTabResults((prev) => ({ ...prev, oop: lineFail }));
          return;
        }
        const styleResult = await checkStyle("oop", code);
        setTabResults((prev) => ({
          ...prev,
          oop: {
            testResults: [],
            testsPassed: true,
            stylePassed: styleResult.passed,
            styleFeedback: styleResult.feedback,
          },
        }));
        return;
      }

      // 1. Correctness tests
      const testResults = await executeTests(
        runPythonCode,
        code,
        section.testCases,
        activeTab.testMode,
        activeTab.functionToTest
      );

      const testsPassed = testResults.every((r) => r.passed);

      if (!testsPassed) {
        setTabResults((prev) => ({
          ...prev,
          [activeStyle]: {
            testResults,
            testsPassed: false,
            stylePassed: false,
            styleFeedback: [],
          },
        }));
        return;
      }

      // 2. Line count check (if configured)
      const lineFail = checkMaxLines(code, activeTab.maxLines, testResults);
      if (lineFail) {
        setTabResults((prev) => ({ ...prev, [activeStyle]: lineFail }));
        return;
      }

      // 3. Style check (only if all tests and line count pass)
      const styleResult = await checkStyle(activeStyle, code);
      setTabResults((prev) => ({
        ...prev,
        [activeStyle]: {
          testResults,
          testsPassed: true,
          stylePassed: styleResult.passed,
          styleFeedback: styleResult.feedback,
        },
      }));
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : "Unexpected error.";
      setTabResults((prev) => ({
        ...prev,
        [activeStyle]: {
          testResults: [],
          testsPassed: false,
          stylePassed: false,
          styleFeedback: [],
          error: message,
        },
      }));
    } finally {
      setIsRunning(false);
    }
  }, [
    pyodide,
    isRunning,
    tabCodes,
    activeStyle,
    activeTab,
    section,
    runPythonCode,
    checkStyle,
  ]);

  const activeResult = tabResults[activeStyle];
  const isDisabled =
    isPyodideLoading || isRunning || (needsPylint && isPylintLoading);

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

      <div className={styles.exampleContainer}>
        <h4>Original Program:</h4>
        <CodeEditor
          value={section.originalCode}
          onChange={() => {}}
          readOnly
          minHeight="60px"
        />

        {/* Tab bar */}
        <div className={refactorStyles.tabBar}>
          {section.tabs.map((tab) => {
            const result = tabResults[tab.style];
            const passed = result?.testsPassed && result?.stylePassed;
            const attempted = result !== undefined;
            return (
              <button
                key={tab.style}
                className={[
                  refactorStyles.tab,
                  activeStyle === tab.style ? refactorStyles.tabActive : "",
                  passed
                    ? refactorStyles.tabPassed
                    : attempted
                      ? refactorStyles.tabAttempted
                      : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
                onClick={() => setActiveStyle(tab.style)}
              >
                {STYLE_LABELS[tab.style]}
                {passed && <span className={refactorStyles.tabBadge}>✓</span>}
              </button>
            );
          })}
        </div>

        {/* Active tab */}
        <div className={refactorStyles.tabPanel}>
          {/* Per-tab instructions */}
          <div className={styles.content}>
            <ContentRenderer
              content={activeTab.instructions}
              courseId={courseId}
              lessonPath={lessonPath}
            />
          </div>

          <CodeEditor
            value={tabCodes[activeStyle] ?? ""}
            onChange={(code) => handleCodeChange(activeStyle, code)}
            readOnly={isDisabled}
            minHeight="200px"
            data-testid={`refactor-editor-${section.id}-${activeStyle}`}
          />
          <div className={styles.editorControls}>
            <button
              onClick={handleRunTests}
              disabled={isDisabled}
              className={styles.testButton}
            >
              {isRunning ? "Running..." : "Run Tests"}
            </button>
            {isPylintLoading && (
              <span className={styles.pyodideStatus}>
                Loading style checker...
              </span>
            )}
            {activeStyle === "oop" && (
              <span className={styles.pyodideStatus}>
                Note: correctness testing is not yet supported for OOP.
              </span>
            )}
          </div>
        </div>

        {isRunning && <LoadingSpinner message="Running tests..." />}

        {!isRunning && activeResult && (
          <div className={styles.resultsArea}>
            {activeResult.error && (
              <div className={styles.errorFeedback}>
                <pre>{activeResult.error}</pre>
              </div>
            )}

            {activeResult.testResults.length > 0 && (
              <ConsoleTestResults results={activeResult.testResults} />
            )}

            {activeResult.testsPassed &&
              activeResult.styleFeedback.length > 0 && (
                <div className={styles.testFailure}>
                  <h4>Style issues found:</h4>
                  <ul className={refactorStyles.feedbackList}>
                    {activeResult.styleFeedback.map((msg, i) => (
                      <li key={i}>
                        <code>{msg}</code>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

            {activeResult.testsPassed && activeResult.stylePassed && (
              <div className={styles.testSuccess}>
                <h4>Tab complete!</h4>
                <p>
                  {activeStyle === "oop"
                    ? `Code matches the ${STYLE_LABELS[activeStyle]} style.`
                    : `All tests passed and code matches the ${STYLE_LABELS[activeStyle]} style.`}
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {allTabsPassed && (
        <div className={styles.completionMessage}>
          All styles complete! Well done.
        </div>
      )}
    </section>
  );
};

export default RefactorSection;
