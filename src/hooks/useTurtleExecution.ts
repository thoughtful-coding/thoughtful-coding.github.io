import { useRef, useEffect, useState, useCallback } from "react";
import type {
  JsTurtleCommand,
  UnitId,
  LessonId,
  SectionId,
} from "../types/data";
import { usePyodide } from "../contexts/PyodideContext";
import { useProgressActions } from "../stores/progressStore";
import { RealTurtleInstance, setupJsTurtle } from "../lib/turtleRenderer";

// MODIFIED: The Python code has been updated to simulate a module-level turtle.
const pythonCaptureModuleCode = `
import sys
import json
import random

_js_turtle_commands_ = []

class CaptureTurtle:
    def __init__(self):
        self._speed = 6
    def _add_command(self, command_dict):
        _js_turtle_commands_.append(command_dict)
    def forward(self, distance):
        self._add_command({'type': 'forward', 'distance': float(distance)})
    def backward(self, distance):
        self.forward(-distance)
    def right(self, angle):
        self._add_command({'type': 'right', 'angle': float(angle)})
    def left(self, angle):
        self._add_command({'type': 'left', 'angle': float(angle)})
    def goto(self, x, y=None):
        if y is None and hasattr(x, '__iter__'):
            x, y = x
        self._add_command({'type': 'goto', 'x': float(x), 'y': float(y)})
    def penup(self):
        self._add_command({'type': 'penup'})
    def pendown(self):
        self._add_command({'type': 'pendown'})
    def color(self, *args):
        if len(args) == 1:
            color_value = args[0]
            if isinstance(color_value, str):
                self._add_command({'type': 'setPenColor', 'color': color_value})
            elif isinstance(color_value, tuple) and len(color_value) == 3:
                r, g, b = color_value
                hex_color = '#{:02x}{:02x}{:02x}'.format(int(r*255) if r <= 1 else int(r), int(g*255) if g <= 1 else int(g), int(b*255) if b <= 1 else int(b))
                self._add_command({'type': 'setPenColor', 'color': hex_color})
        elif len(args) == 3:
            r, g, b = args
            hex_color = '#{:02x}{:02x}{:02x}'.format(int(r*255) if r <= 1 else int(r), int(g*255) if g <= 1 else int(g), int(b*255) if b <= 1 else int(b))
            self._add_command({'type': 'setPenColor', 'color': hex_color})
    def random_color(self):
        self.color(random.randint(0, 255), random.randint(0, 255), random.randint(0, 255))
    def fillcolor(self, *args):
        if len(args) == 1:
            color_value = args[0]
            if isinstance(color_value, str):
                self._add_command({'type': 'setFillColor', 'color': color_value})
            elif isinstance(color_value, tuple) and len(color_value) == 3:
                r, g, b = color_value
                hex_color = '#{:02x}{:02x}{:02x}'.format(int(r*255) if r <= 1 else int(r), int(g*255) if g <= 1 else int(g), int(b*255) if b <= 1 else int(b))
                self._add_command({'type': 'setFillColor', 'color': hex_color})
        elif len(args) == 3:
            r, g, b = args
            hex_color = '#{:02x}{:02x}{:02x}'.format(int(r*255) if r <= 1 else int(r), int(g*255) if g <= 1 else int(g), int(b*255) if b <= 1 else int(b))
            self._add_command({'type': 'setFillColor', 'color': hex_color})
    def begin_fill(self):
        self._add_command({'type': 'beginFill'})
    def end_fill(self):
        self._add_command({'type': 'endFill'})
    def width(self, width):
        self._add_command({'type': 'setPenSize', 'size': float(width)})
    def speed(self, speed=None):
        if speed is None:
            return self._speed
        speed_map = {'fastest': 0, 'fast': 10, 'normal': 6, 'slow': 3, 'slowest': 1}
        if isinstance(speed, str):
            speed = speed_map.get(speed.lower(), 6)
        self._speed = max(0, min(10, int(speed)))
        self._add_command({'type': 'setSpeed', 'speed': self._speed})
    def clear(self):
        self._add_command({'type': 'clear'})
    fd, bk, rt, lt, pu, pd = forward, backward, right, left, penup, pendown

# --- NEW IMPLEMENTATION ---
# Create a single, global instance of our turtle capturer.
_instance = CaptureTurtle()
# For compatibility, add dummy Screen and Turtle attributes to the instance.
_instance.Screen = lambda: type('DummyScreen', (object,), {'exitonclick': lambda: None})()
_instance.Turtle = CaptureTurtle
# Replace the 'turtle' module with our pre-made instance.
# Now when a student calls \`turtle.forward()\`, they are calling
# the .forward() method on our singleton \`_instance\`.
sys.modules['turtle'] = _instance
`;

interface UseTurtleExecutionProps {
  canvasRef: React.RefObject<HTMLDivElement | null>;
  unitId: UnitId;
  lessonId: LessonId;
  sectionId: SectionId;
  autoCompleteOnRun?: boolean;
  onTurtleInstanceReady?: (instance: RealTurtleInstance) => void;
}

export const useTurtleExecution = ({
  canvasRef,
  unitId,
  lessonId,
  sectionId,
  autoCompleteOnRun = true,
  onTurtleInstanceReady,
}: UseTurtleExecutionProps) => {
  const jsTurtleRef = useRef<RealTurtleInstance | null>(null);
  const stopRequestedRef = useRef(false);

  const {
    isLoading: isPyodideLoading,
    error: pyodideError,
    runPythonCode,
  } = usePyodide();
  const { completeSection } = useProgressActions();

  const [isRunning, setIsRunning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Only create turtle instance if we don't already have one
    if (isPyodideLoading || !canvasRef.current || jsTurtleRef.current) {
      return;
    }

    const container = canvasRef.current;
    const instance = setupJsTurtle(container);
    jsTurtleRef.current = instance;

    if (onTurtleInstanceReady) {
      onTurtleInstanceReady(instance);
    }

    return () => {
      // Cleanup function - destroy the turtle instance
      if (jsTurtleRef.current) {
        jsTurtleRef.current.destroy();
        jsTurtleRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canvasRef, isPyodideLoading]);

  const runTurtleCode = useCallback(
    async (
      codeToRun: string,
      libraryCode?: string
    ): Promise<JsTurtleCommand[]> => {
      if (isPyodideLoading) {
        setError("Python environment is not ready.");
        return [];
      }

      setIsRunning(true);
      setError(null);
      stopRequestedRef.current = false;

      if (jsTurtleRef.current) jsTurtleRef.current.clear();

      await new Promise((resolve) => requestAnimationFrame(resolve));

      const pythonModuleLines = pythonCaptureModuleCode.split("\n").length;
      const scriptPrefixLines = pythonModuleLines + 2;

      const fullPythonScript = `
${pythonCaptureModuleCode}
_js_turtle_commands_.clear()
try:
${codeToRun
  .split("\n")
  .map((line) => `    ${line}`)
  .join("\n")}
except Exception as e:
    import traceback
    import json
    tb = traceback.extract_tb(e.__traceback__)
    user_code_frame = tb[-1] if tb else None
    line_num = user_code_frame.lineno - ${scriptPrefixLines} if user_code_frame else 'N/A'
    error_info = { "type": type(e).__name__, "message": str(e), "line": line_num }
    print(f"PYTHON_EXECUTION_ERROR:: {json.dumps(error_info)}")
    _js_turtle_commands_ = []
finally:
    pass
import json
json.dumps(_js_turtle_commands_)
`;

      let parsedJsCommands: JsTurtleCommand[] = [];
      try {
        const result = await runPythonCode(fullPythonScript, libraryCode);
        console.log(result);

        // Check if execution failed
        if (!result.success) {
          const errorMsg = result.error
            ? `${result.error.type}: ${result.error.message}`
            : "Unknown error";
          setError(errorMsg);
          return [];
        }

        // Check for errors in stdout (from our custom error handling)
        const errorMarker = "PYTHON_EXECUTION_ERROR::";
        const markerIndex = result.stdout
          ? result.stdout.indexOf(errorMarker)
          : -1;

        if (markerIndex !== -1) {
          const jsonString = result.stdout.substring(
            markerIndex + errorMarker.length
          );
          try {
            const errorInfo = JSON.parse(jsonString.trim());
            const friendlyMessage = `Error on line ${errorInfo.line}: ${errorInfo.type}\n${errorInfo.message}`;
            setError(friendlyMessage);
          } catch {
            setError("A Python error occurred, but it could not be displayed.");
          }
          return [];
        }

        // Parse turtle commands from result
        if (result.result) {
          parsedJsCommands = JSON.parse(result.result);
        }

        if (jsTurtleRef.current) {
          await jsTurtleRef.current.execute(parsedJsCommands);
        }

        if (!stopRequestedRef.current && autoCompleteOnRun) {
          completeSection(unitId, lessonId, sectionId, 1);
        }
      } catch (_e) {
        const errorMessage = _e instanceof Error ? _e.message : String(_e);
        console.error("Turtle execution error:", errorMessage);
        setError(errorMessage);
        parsedJsCommands = [];
      } finally {
        setIsRunning(false);
      }
      return parsedJsCommands;
    },
    [
      runPythonCode,
      isPyodideLoading,
      completeSection,
      unitId,
      lessonId,
      sectionId,
      autoCompleteOnRun,
    ]
  );

  const stopExecution = useCallback(() => {
    if (jsTurtleRef.current && typeof jsTurtleRef.current.stop === "function") {
      stopRequestedRef.current = true;
      jsTurtleRef.current.stop();
    }
  }, []);

  return {
    runTurtleCode,
    stopExecution,
    isLoading: isRunning || isPyodideLoading,
    error: error || pyodideError,
    turtleInstance: jsTurtleRef.current,
  };
};
