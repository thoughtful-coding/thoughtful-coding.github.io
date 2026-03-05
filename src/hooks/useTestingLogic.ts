import { useState, useCallback } from "react";
import { usePyodide } from "../contexts/PyodideContext";
import type { PythonExecutionResult } from "../contexts/PyodideContext";
import type {
  UnitId,
  LessonId,
  SectionId,
  TestCase,
  TestMode,
} from "../types/data";
import { useProgressActions } from "../stores/progressStore";

export interface TestResult {
  description: string;
  passed: boolean;
  actual: any;
  expected: any;
  input?: any[]; // Optional for output-based tests
}

type RunPythonCodeFn = (
  code: string,
  libraryCode?: string
) => Promise<PythonExecutionResult>;

// Parse a single test case result from Python execution output
function parseTestCaseResult(
  testResult: PythonExecutionResult,
  testCase: TestCase,
  includeInput: boolean
): TestResult {
  if (!testResult.success) {
    const errorMsg = testResult.error
      ? `${testResult.error.type}: ${testResult.error.message}`
      : "Unknown error";
    return {
      description: testCase.description,
      passed: false,
      actual: `Execution error: ${errorMsg}`,
      expected: testCase.expected,
      ...(includeInput && { input: testCase.input }),
    };
  }

  try {
    const parsedResult = JSON.parse(testResult.stdout);

    if (parsedResult.success) {
      return {
        description: testCase.description,
        passed: parsedResult.passed,
        actual: parsedResult.actual,
        expected: parsedResult.expected,
        ...(includeInput && { input: parsedResult.input }),
      };
    } else {
      return {
        description: testCase.description,
        passed: false,
        actual: parsedResult.error,
        expected: parsedResult.expected,
        ...(includeInput && { input: parsedResult.input }),
      };
    }
  } catch {
    return {
      description: testCase.description,
      passed: false,
      actual: `Parse error: ${testResult.stdout}`,
      expected: testCase.expected,
      ...(includeInput && { input: testCase.input }),
    };
  }
}

/**
 * Execute test cases against user code via Pyodide. Stops on first failure.
 * Pure function — no React state or side effects.
 */
export async function executeTests(
  runPythonCode: RunPythonCodeFn,
  userCode: string,
  testCases: TestCase[],
  testMode: TestMode,
  functionToTest: string,
  libraryCode?: string
): Promise<TestResult[]> {
  const results: TestResult[] = [];

  if (functionToTest === "__main__") {
    for (const testCase of testCases) {
      const testScript = `
import sys
from io import StringIO
import json

# Capture stdout
old_stdout = sys.stdout
captured_output = StringIO()
sys.stdout = captured_output

try:
    # Execute user code
    exec('''${userCode.replace(/\\/g, "\\\\").replace(/'/g, "\\'")}''')

    # Get the output
    output = captured_output.getvalue().strip()

    # Restore stdout
    sys.stdout = old_stdout

    expected = '''${testCase.expected
      .replace(/\\/g, "\\\\")
      .replace(/'/g, "\\'")}'''

    result = {
        "success": True,
        "actual": output,
        "expected": expected,
        "passed": output == expected
    }

except Exception as e:
    # Restore stdout
    sys.stdout = old_stdout

    result = {
        "success": False,
        "error": f"{type(e).__name__}: {e}",
        "actual": "",
        "expected": '''${testCase.expected
          .replace(/\\/g, "\\\\")
          .replace(/'/g, "\\'")}'''
    }

print(json.dumps(result))
`;

      const testResult = await runPythonCode(testScript, libraryCode);
      const parsed = parseTestCaseResult(testResult, testCase, false);
      results.push(parsed);
      if (!parsed.passed) break;
    }
  } else {
    const escapedUserCode = userCode
      .replace(/\\/g, "\\\\")
      .replace(/'/g, "\\'");

    for (const testCase of testCases) {
      let testScript: string;

      if (testMode === "procedure") {
        testScript = `
import json
import sys
from io import StringIO

# Capture stdout
old_stdout = sys.stdout
captured_output = StringIO()
sys.stdout = captured_output

try:
    # Execute user code to define the function
    _user_globals = {}
    exec('''${escapedUserCode}''', _user_globals)

    # Clear output from user code (e.g., example function calls at bottom)
    captured_output.truncate(0)
    captured_output.seek(0)

    # Check if function exists
    if '${functionToTest}' not in _user_globals:
        raise NameError("Function '${functionToTest}' is not defined.")

    user_func = _user_globals['${functionToTest}']
    test_input = ${JSON.stringify(testCase.input)}
    expected = ${JSON.stringify(testCase.expected)}

    # Call function (ignore return value, capture print output)
    user_func(*test_input)

    # Get the output
    output = captured_output.getvalue().strip()

    # Restore stdout
    sys.stdout = old_stdout

    result = {
        "success": True,
        "actual": output,
        "expected": expected,
        "input": test_input,
        "passed": output == expected
    }

except Exception as e:
    # Restore stdout
    sys.stdout = old_stdout

    result = {
        "success": False,
        "error": f"{type(e).__name__}: {e}",
        "input": ${JSON.stringify(testCase.input)},
        "expected": ${JSON.stringify(testCase.expected)}
    }

print(json.dumps(result))
`;
      } else {
        // testMode === "function": Capture return value
        testScript = `
import json
import sys
from io import StringIO

# Capture stdout
old_stdout = sys.stdout
sys.stdout = StringIO()

try:
    # Execute user code to define the function
    _user_globals = {}
    exec('''${escapedUserCode}''', _user_globals)

    # Check if function exists
    if '${functionToTest}' not in _user_globals:
        raise NameError("Function '${functionToTest}' is not defined.")

    user_func = _user_globals['${functionToTest}']
    test_input = ${JSON.stringify(testCase.input)}
    expected = ${JSON.stringify(testCase.expected)}

    actual = user_func(*test_input)

    # Convert to string for comparison if expected is string
    if isinstance(expected, str) and not isinstance(actual, str):
        actual = str(actual)

    # Restore stdout
    sys.stdout = old_stdout

    result = {
        "success": True,
        "actual": actual,
        "expected": expected,
        "input": test_input,
        "passed": actual == expected
    }

except Exception as e:
    # Restore stdout
    sys.stdout = old_stdout

    result = {
        "success": False,
        "error": f"{type(e).__name__}: {e}",
        "input": ${JSON.stringify(testCase.input)},
        "expected": ${JSON.stringify(testCase.expected)}
    }

print(json.dumps(result))
`;
      }

      const testResult = await runPythonCode(testScript, libraryCode);
      const parsed = parseTestCaseResult(testResult, testCase, true);
      results.push(parsed);
      if (!parsed.passed) break;
    }
  }

  return results;
}

interface UseTestingLogicProps {
  unitId: UnitId;
  lessonId: LessonId;
  sectionId: SectionId;
  testMode: TestMode;
  functionToTest: string; // "__main__" for testing entire program, function name for testing specific functions
  testCases: TestCase[];
}

export const useTestingLogic = ({
  unitId,
  lessonId,
  sectionId,
  testMode,
  functionToTest,
  testCases,
}: UseTestingLogicProps) => {
  const {
    runPythonCode,
    isLoading: isPyodideLoading,
    error: pyodideError,
  } = usePyodide();
  const { completeSection, incrementAttemptCounter } = useProgressActions();

  const [isRunningTests, setIsRunningTests] = useState(false);
  const [testResults, setTestResults] = useState<TestResult[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const runTests = useCallback(
    async (userCode: string, libraryCode?: string) => {
      setIsRunningTests(true);
      setTestResults(null);
      setError(null);

      try {
        const results = await executeTests(
          runPythonCode,
          userCode,
          testCases,
          testMode,
          functionToTest,
          libraryCode
        );

        setTestResults(results);

        const allPassed = results.every((res) => res.passed);
        if (allPassed) {
          // Pass userCode as firstCompletionContent for academic integrity auditing
          completeSection(unitId, lessonId, sectionId, undefined, userCode);
        } else {
          // Increment attempt counter on test failure
          incrementAttemptCounter(unitId, lessonId, sectionId);
        }
      } catch (e) {
        // Increment attempt counter on error (code failed to execute)
        incrementAttemptCounter(unitId, lessonId, sectionId);
        const errorMessage =
          e instanceof Error ? e.message : "An unknown error occurred.";
        console.error("Testing execution error:", errorMessage);
        setError(errorMessage);
      } finally {
        setIsRunningTests(false);
      }
    },
    [
      testMode,
      functionToTest,
      testCases,
      runPythonCode,
      completeSection,
      incrementAttemptCounter,
      unitId,
      lessonId,
      sectionId,
    ]
  );

  return {
    runTests,
    testResults,
    isLoading: isRunningTests || isPyodideLoading,
    error: error || pyodideError?.message,
  };
};
