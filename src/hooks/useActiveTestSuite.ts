// src/hooks/useActiveTestSuite.ts
import { useState, useCallback, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { usePyodide } from "../contexts/PyodideContext";
import { loadProgress, saveProgress } from "../lib/localStorageUtils"; // ANONYMOUS_USER_ID_PLACEHOLDER is used internally by localStorageUtils if userId is null/undefined
import { UserId } from "../types/data";

const ACTIVE_TESTS_STORAGE_KEY = "codeEditorPage_activeTests_v3";

export type TestStatus = "pending" | "passed" | "failed" | "error";

export interface ActiveTest {
  id: string;
  name: string;
  code: string;
  status: TestStatus;
  output?: string;
}

export interface PytestSimResult {
  name: string;
  status: "PASSED" | "FAILED" | "ERROR";
  output: string;
}

const extractTestFunctionName = (code: string): string | null => {
  const match = code.match(/def\s+(test_[a-zA-Z0-9_]+)\s*\(/);
  return match && match[1] ? match[1] : null;
};

// Add currentStorageUserId as a parameter to the hook
export const useActiveTestSuite = (
  currentStorageUserId: UserId | null | undefined
) => {
  const [activeTests, setActiveTests] = useState<ActiveTest[]>(
    () =>
      loadProgress<ActiveTest[]>(
        currentStorageUserId,
        ACTIVE_TESTS_STORAGE_KEY
      ) || []
  );
  const [isRunningTests, setIsRunningTests] = useState<boolean>(false);
  const {
    runPythonCode,
    isLoading: isPyodideLoading,
    error: pyodideError,
  } = usePyodide();

  // Persist activeTests to localStorage, now auth-aware
  useEffect(() => {
    saveProgress(currentStorageUserId, ACTIVE_TESTS_STORAGE_KEY, activeTests);
  }, [activeTests, currentStorageUserId]);

  // Reload tests if the user/storage key changes
  useEffect(() => {
    setActiveTests(
      loadProgress<ActiveTest[]>(
        currentStorageUserId,
        ACTIVE_TESTS_STORAGE_KEY
      ) || []
    );
  }, [currentStorageUserId]);

  const addTestToSuite = useCallback(
    (testCode: string, userGivenName?: string) => {
      if (!testCode.trim()) return;

      const functionName = extractTestFunctionName(testCode);
      const displayName =
        userGivenName || functionName || `Test snippet ${Date.now() % 10000}`;

      const newTest: ActiveTest = {
        id: uuidv4(),
        name: displayName,
        code: testCode,
        status: "pending",
        output: "",
      };
      setActiveTests((prevTests) => [...prevTests, newTest]);
    },
    []
  );

  const deleteTestFromSuite = useCallback((testId: string) => {
    setActiveTests((prevTests) =>
      prevTests.filter((test) => test.id !== testId)
    );
  }, []);

  const runActiveTests = useCallback(
    async (mainCode: string) => {
      if (isPyodideLoading || !runPythonCode || activeTests.length === 0) {
        const errorMessage =
          pyodideError?.message || "Pyodide not ready or no active tests.";
        setActiveTests((prev) =>
          prev.map((t) => ({ ...t, status: "error", output: errorMessage }))
        );
        setIsRunningTests(false);
        return;
      }

      setIsRunningTests(true);
      const initialTestStates = activeTests.map((test) => ({
        ...test,
        status: "pending" as TestStatus,
        output: "Queued...",
      }));
      setActiveTests(initialTestStates);

      // Escape mainCode once for all tests
      const escapedMainCode = mainCode
        .replace(/\\/g, "\\\\")
        .replace(/'/g, "\\'");

      const updatedResults: ActiveTest[] = [];

      for (const currentTest of initialTestStates) {
        setActiveTests((prev) =>
          prev.map((t) =>
            t.id === currentTest.id ? { ...t, output: "Running..." } : t
          )
        );

        const testFunctionToCall =
          extractTestFunctionName(currentTest.code) || currentTest.name;

        const escapedTestCode = currentTest.code
          .replace(/\\/g, "\\\\")
          .replace(/'/g, "\\'");

        // Similar pattern to useTestingLogic.ts - each test runs in isolated namespace
        const singleTestExecutionScript = `
import traceback
import json

_test_globals = {}
result_data = {"name": "${testFunctionToCall.replace(
          /"/g,
          '\\"'
        )}", "status": "ERROR", "output": ""}

try:
    # Execute main code in isolated namespace
    exec('''${escapedMainCode}''', _test_globals)

    # Execute test code in same namespace (can access main code's definitions)
    exec('''${escapedTestCode}''', _test_globals)

    # Check if test function exists
    if '${testFunctionToCall.replace(
      /"/g,
      '\\"'
    )}' not in _test_globals or not callable(_test_globals['${testFunctionToCall.replace(
          /"/g,
          '\\"'
        )}']):
        result_data["output"] = "Test function '${testFunctionToCall.replace(
          /"/g,
          '\\"'
        )}' not found or not callable."
    else:
        # Run the test function
        _test_globals['${testFunctionToCall.replace(/"/g, '\\"')}']()
        result_data["status"] = "PASSED"
        result_data["output"] = ""

except AssertionError as e_assert:
    result_data["status"] = "FAILED"
    result_data["output"] = f"AssertionError: {e_assert}"
except Exception as e_general:
    result_data["status"] = "ERROR"
    result_data["output"] = f"{type(e_general).__name__}: {e_general}"

print("===PYTEST_SINGLE_RESULT_JSON===")
print(json.dumps(result_data))
print("===END_PYTEST_SINGLE_RESULT_JSON===")
      `;

        let testStatus: TestStatus = "error";
        let testOutputString: string =
          "Execution did not complete as expected.";

        try {
          const result = await runPythonCode(singleTestExecutionScript);

          if (!result.success && result.error) {
            testStatus = "error";
            testOutputString = `${result.error.type}: ${result.error.message}`;
          } else {
            const match = result.stdout.match(
              /===PYTEST_SINGLE_RESULT_JSON===\s*([\s\S]*?)\s*===END_PYTEST_SINGLE_RESULT_JSON===/
            );
            if (match && match[1]) {
              try {
                const parsedResult = JSON.parse(
                  match[1].trim()
                ) as PytestSimResult;
                if (parsedResult.name === testFunctionToCall) {
                  testStatus = parsedResult.status.toLowerCase() as TestStatus;
                  testOutputString = parsedResult.output;
                } else {
                  testOutputString = `Result name mismatch. Expected: ${testFunctionToCall}, Got: ${parsedResult.name}. Raw: ${parsedResult.output}`;
                }
              } catch (parseError) {
                testOutputString = `Failed to parse result for test '${currentTest.name}': ${parseError}\nRaw output:\n${result.stdout}`;
              }
            } else {
              testOutputString = `Result format error for test '${currentTest.name}'.\nRaw output:\n${result.stdout}`;
            }
          }
        } catch (e) {
          testStatus = "error";
          testOutputString = `Unexpected error running test '${
            currentTest.name
          }': ${e instanceof Error ? e.message : String(e)}`;
        }

        setActiveTests((prev) =>
          prev.map((t) =>
            t.id === currentTest.id
              ? { ...t, status: testStatus, output: testOutputString }
              : t
          )
        );
        updatedResults.push({
          ...currentTest,
          status: testStatus,
          output: testOutputString,
        });
      }
      setIsRunningTests(false);
    },
    [activeTests, runPythonCode, isPyodideLoading, pyodideError] // Removed setActiveTests as it's part of the component's state cycle
  );

  return {
    activeTests,
    addTestToSuite,
    deleteTestFromSuite,
    runActiveTests,
    isRunningTests,
    isPyodideReady: !isPyodideLoading && !pyodideError,
    pyodideHookError: pyodideError,
  };
};
