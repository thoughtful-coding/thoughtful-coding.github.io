import { useState, useCallback } from "react";
import { usePyodide, PythonExecutionResult } from "../contexts/PyodideContext";
import type { UnitId, LessonId, SectionId } from "../types/data";
import { useProgressStore, useProgressActions } from "../stores/progressStore";

// Define the props the hook will accept
interface UseInteractiveExampleProps {
  unitId: UnitId;
  lessonId: LessonId;
  sectionId: SectionId;
  autoComplete?: boolean;
}

/**
 * Helper function to format execution result for display.
 * Combines stdout and error information in chronological order.
 */
function formatExecutionOutput(result: PythonExecutionResult): string {
  const parts: string[] = [];

  // Add stdout first (output that occurred before any error)
  if (result.stdout) {
    parts.push(result.stdout.trim());
  }

  // Add stderr if present
  if (result.stderr) {
    parts.push(result.stderr.trim());
  }

  // Add error message if execution failed
  if (!result.success && result.error) {
    // Format as Python would: "ErrorType: message"
    const errorLine = `${result.error.type}: ${result.error.message}`;
    parts.push(errorLine);
  }

  return parts.join("\n");
}

export const useInteractiveExample = ({
  unitId,
  lessonId,
  sectionId,
  autoComplete = true,
}: UseInteractiveExampleProps) => {
  const {
    runPythonCode,
    isLoading: isPyodideLoading,
    error: pyodideError,
  } = usePyodide();
  const [output, setOutput] = useState<string>(""); // Changed from string | null
  const { completeSection } = useProgressActions();

  const runCode = useCallback(
    async (code: string) => {
      setOutput(""); // Reset to empty string
      const result = await runPythonCode(code);

      // Format output with proper stream ordering
      const formattedOutput = formatExecutionOutput(result);
      setOutput(formattedOutput);

      // On any execution (success or error), mark the section as complete
      if (autoComplete) {
        completeSection(unitId, lessonId, sectionId, 1);
      }

      // Return formatted result
      return {
        output: formattedOutput,
        error: result.success
          ? null
          : result.error
            ? `${result.error.type}: ${result.error.message}`
            : null,
      };
    },
    [runPythonCode, completeSection, unitId, lessonId, sectionId, autoComplete]
  );

  const isSectionComplete = useProgressStore(
    (state) => state.completion[unitId]?.[lessonId]?.[sectionId] || false
  );

  return {
    runCode,
    isLoading: isPyodideLoading,
    output,
    error: pyodideError,
    isSectionComplete,
  };
};
