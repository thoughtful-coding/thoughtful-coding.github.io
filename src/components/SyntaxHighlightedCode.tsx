import React from "react";
import CodeMirror from "@uiw/react-codemirror";
import { python } from "@codemirror/lang-python";
import { oneDark } from "@codemirror/theme-one-dark";
import { EditorView } from "@codemirror/view";

interface SyntaxHighlightedCodeProps {
  code: string;
  className?: string;
}

// Minimal read-only code display with Python syntax highlighting
// Used for Parsons problem blocks where we want highlighting but no editing UI
const SyntaxHighlightedCode: React.FC<SyntaxHighlightedCodeProps> = ({
  code,
  className,
}) => {
  return (
    <div className={className}>
      <CodeMirror
        value={code}
        extensions={[
          python(),
          EditorView.editable.of(false),
          EditorView.lineWrapping,
        ]}
        theme={oneDark}
        readOnly={true}
        basicSetup={{
          lineNumbers: false,
          foldGutter: false,
          highlightActiveLineGutter: false,
          highlightActiveLine: false,
          dropCursor: false,
          allowMultipleSelections: false,
          indentOnInput: false,
          bracketMatching: false,
          closeBrackets: false,
          autocompletion: false,
          rectangularSelection: false,
          crosshairCursor: false,
          highlightSelectionMatches: false,
          searchKeymap: false,
          historyKeymap: false,
          foldKeymap: false,
          completionKeymap: false,
          lintKeymap: false,
        }}
      />
    </div>
  );
};

export default SyntaxHighlightedCode;
