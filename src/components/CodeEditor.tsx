// src/components/CodeEditor.tsx
import React, { useCallback, useMemo } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { python } from "@codemirror/lang-python";
import { oneDark } from "@codemirror/theme-one-dark";
import { EditorView } from "@codemirror/view"; // Import EditorView for DOM event handlers

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  readOnly?: boolean;
  height?: string;
  minHeight?: string;
  preventPaste?: boolean; // New prop to control paste prevention
  "data-testid"?: string; // Test ID for e2e testing
}

const CodeEditor: React.FC<CodeEditorProps> = ({
  value,
  onChange,
  readOnly = false,
  height = "auto",
  minHeight = "100px",
  preventPaste = false, // Default to false
  "data-testid": testId,
}) => {
  const handleChange = useCallback(
    (val: string) => {
      onChange(val);
    },
    [onChange]
  );

  // Memoize extensions to avoid re-creating them on every render
  const extensions = useMemo(() => {
    const baseExtensions = [python()];

    if (preventPaste) {
      baseExtensions.push(
        EditorView.domEventHandlers({
          paste(event) {
            // console.log("Paste event intercepted in CodeMirror");
            event.preventDefault();
            // Optionally, provide user feedback here (e.g., a small temporary message)
            // For example, you could dispatch a custom event or update a shared state
            // to show a "Pasting is disabled" message.
            alert("Pasting is disabled for this code editor."); // Simple alert for now
            return true; // Indicate that the event was handled
          },
        })
      );
    }
    return baseExtensions;
  }, [preventPaste]); // Re-create extensions only if preventPaste changes

  return (
    <div data-testid={testId}>
      <CodeMirror
        value={value}
        height={height}
        minHeight={minHeight}
        extensions={extensions}
        onChange={handleChange}
        readOnly={readOnly}
        theme={oneDark}
        basicSetup={{
          lineNumbers: true,
          highlightActiveLineGutter: true,
          highlightSpecialChars: true,
          history: true,
          foldGutter: true,
          drawSelection: true,
          dropCursor: true,
          allowMultipleSelections: true,
          indentOnInput: true,
          syntaxHighlighting: true,
          bracketMatching: true,
          closeBrackets: true,
          autocompletion: true,
          rectangularSelection: true,
          crosshairCursor: true,
          highlightActiveLine: true,
          highlightSelectionMatches: true,
          closeBracketsKeymap: true,
          searchKeymap: true,
          historyKeymap: true,
          foldKeymap: true,
          completionKeymap: true,
          lintKeymap: true,
        }}
      />
    </div>
  );
};

export default CodeEditor;
