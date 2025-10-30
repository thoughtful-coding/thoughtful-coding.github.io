import React, { useRef } from "react";
import type {
  ExecutableCode,
  UnitId,
  LessonId,
  SectionId,
} from "../../types/data";
import type { RealTurtleInstance } from "../../lib/turtleRenderer";
import { useTurtleExecution } from "../../hooks/useTurtleExecution";
import { useInteractiveExample } from "../../hooks/useInteractiveExample";
import { useDraftCode } from "../../hooks/useDraftCode";
import InteractiveExampleDisplay from "./InteractiveExampleDisplay";
import CodeEditor from "../CodeEditor";
import styles from "./Section.module.css";

interface CodeExecutorProps {
  example: ExecutableCode;
  unitId: UnitId;
  lessonId: LessonId;
  sectionId: SectionId;
  onTurtleInstanceReady?: (instance: RealTurtleInstance) => void;
}

// A sub-component specifically for the Turtle visualization
const TurtleDisplay: React.FC<CodeExecutorProps> = ({
  example,
  unitId,
  lessonId,
  sectionId,
  onTurtleInstanceReady,
}) => {
  // Persistent draft code management
  const [code, setCode] = useDraftCode(unitId, lessonId, sectionId, example.initialCode);
  const canvasRef = useRef<HTMLDivElement>(null);

  const { runTurtleCode, stopExecution, isLoading, error } = useTurtleExecution(
    {
      canvasRef,
      unitId,
      lessonId,
      sectionId,
      onTurtleInstanceReady,
    }
  );

  return (
    <div className={styles.turtleEditorContainer}>
      <CodeEditor
        value={code}
        onChange={setCode}
        readOnly={isLoading}
        minHeight="150px"
      />
      <div className={styles.editorControls}>
        <button
          onClick={() => runTurtleCode(code)}
          disabled={isLoading}
          className={styles.runButton}
        >
          {isLoading ? "Executing..." : "Run Code"}
        </button>
        <button
          onClick={stopExecution}
          disabled={!isLoading}
          className={styles.runButton}
        >
          Stop
        </button>
      </div>
      {error && (
        <div className={styles.errorFeedback}>
          <pre>{error}</pre>
        </div>
      )}
      <div>
        <h4>Turtle Output:</h4>
        <div ref={canvasRef} className={styles.turtleCanvasContainer}>
          {/* p5.js will inject its canvas here */}
        </div>
      </div>
    </div>
  );
};

// A sub-component specifically for the Console visualization
const ConsoleDisplay: React.FC<CodeExecutorProps> = ({
  example,
  unitId,
  lessonId,
  sectionId,
}) => {
  // Persistent draft code management
  const [code, setCode] = useDraftCode(unitId, lessonId, sectionId, example.initialCode);

  const { runCode, isLoading, output, error } = useInteractiveExample({
    unitId,
    lessonId,
    sectionId,
  });

  // Create a new handler function that calls runCode with the current state
  const handleRunCode = () => {
    return runCode(code);
  };

  return (
    // 3. Pass the new handler and the state management props down.
    // Note: This assumes InteractiveExampleDisplay now accepts `value` and `onChange` props.
    <InteractiveExampleDisplay
      value={code}
      onChange={setCode}
      onRunCode={handleRunCode}
      isLoading={isLoading}
      output={output}
      error={error}
      isReadOnly={false}
    />
  );
};

// The main component that decides which visualization to render
const CodeExecutor: React.FC<CodeExecutorProps> = (props) => {
  const { example } = props;

  if (example.visualization === "turtle") {
    return <TurtleDisplay {...props} />;
  }

  // Default to console visualization
  return <ConsoleDisplay {...props} />;
};

export default CodeExecutor;
