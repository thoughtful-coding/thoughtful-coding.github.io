import { useState, useCallback } from "react";
import { usePyodide } from "../contexts/PyodideContext";

const PYTHON_TRACE_SCRIPT_TEMPLATE = `
import io
import sys
import types
import typing
import json

class ExecutionStep(typing.TypedDict):
    step_number: int
    line_number: int
    stack_depth: int
    variables: dict[str, str]
    changed_variables: list[str]
    stdout: str

class AdvancedTracer:
    def __init__(self, max_steps: int = 500) -> None:
        self.steps: list[ExecutionStep] = []
        self.max_steps = max_steps
        self.user_filename = "<student_code>"
        self.source_lines: list[str] = []
        self.previous_variables: dict[str, str] = {}
        self.stack_depth = 0

    def safe_repr(self, value: typing.Any, max_len: int = 50) -> str:
        try:
            if value is None: return "None"
            elif isinstance(value, bool): return str(value)
            elif isinstance(value, (int, float)): return str(value)
            elif isinstance(value, str):
                repr_val = repr(value)
                return repr_val[: max_len - 3] + "..." if len(repr_val) > max_len else repr_val
            elif isinstance(value, (list, tuple)):
                if not value: return "[]" if isinstance(value, list) else "()"
                items = [self.safe_repr(item, 20) for item in value]
                bracket = "[]" if isinstance(value, list) else "()"
                return f"{bracket[0]}{', '.join(items)}{bracket[1]}" if len(value) <= 3 else f"[{len(value)} items]" if isinstance(value, list) else f"({len(value)} items)"
            elif isinstance(value, dict):
                if not value: return "{}"
                items = [f"{self.safe_repr(k, 15)}: {self.safe_repr(v, 15)}" for k, v in value.items()]
                return "{" + ", ".join(items) + "}" if len(value) <= 2 else f"{{{len(value)} items}}"
            elif hasattr(value, "__class__"): return f"<{value.__class__.__name__} object>"
            else: return str(type(value))
        except: return "<unable to display>"

    def get_student_variables(self, frame_locals: dict[str, typing.Any]) -> dict[str, str]:
        student_vars: dict[str, str] = {}
        skip_vars = {"__name__", "__doc__", "__package__", "__loader__", "__spec__", "__builtins__", "__file__", "__cached__", "__annotations__"}
        for name, value in frame_locals.items():
            if name.startswith("_") or name in skip_vars or (hasattr(value, "__module__") and callable(value)):
                continue
            student_vars[name] = self.safe_repr(value)
        return student_vars
    
    def get_changed_variables(self, current_vars: dict[str, str]) -> list[str]:
        changed = []
        for key, value in current_vars.items():
            if self.previous_variables.get(key) != value:
                changed.append(key)
        return changed

    def trace_function(self, frame: types.FrameType, event: str, arg) -> typing.Optional[typing.Callable]:
        if len(self.steps) >= self.max_steps:
            return None
        
        is_user_code = frame.f_code.co_filename == self.user_filename

        if event == 'call' and is_user_code:
            self.stack_depth += 1
        elif event == 'return' and is_user_code:
            self.stack_depth -= 1

        if event != "line" or not is_user_code:
            return self.trace_function
        
        line_no = frame.f_lineno
        stripped_source_line = self.source_lines[line_no - 1].strip() if 1 <= line_no <= len(self.source_lines) else "<unknown>"
        
        if any(stripped_source_line.startswith(x) for x in ["def ", "class ", "@"]):
            return self.trace_function

        current_variables = self.get_student_variables(frame.f_locals)
        changed_variables = self.get_changed_variables(current_variables)
        
        step = ExecutionStep(
            step_number=len(self.steps) + 1,
            line_number=line_no,
            stack_depth=self.stack_depth,
            variables=current_variables,
            changed_variables=changed_variables,
            stdout=sys.stdout.getvalue() if isinstance(sys.stdout, io.StringIO) else ""
        )
        self.steps.append(step)
        
        self.previous_variables = current_variables.copy()
        
        return self.trace_function

    def generate_trace(self, user_code: str) -> dict:
        self.steps = []
        self.source_lines = user_code.split('\\n')
        self.previous_variables = {}
        self.stack_depth = 0
        
        old_stdout = sys.stdout
        captured_output = io.StringIO()
        sys.stdout = captured_output
        
        try:
            compiled_code = compile(user_code, self.user_filename, "exec")
            sys.settrace(self.trace_function)
            exec(compiled_code, {})
        except Exception as e:
            final_stdout = captured_output.getvalue()
            # Append simplified exception message to stdout
            exception_msg = f"{type(e).__name__}: {str(e)}\\n"
            final_stdout_with_error = final_stdout + exception_msg

            error_step = ExecutionStep(
                step_number=len(self.steps) + 1,
                line_number=getattr(e, "lineno", 0),
                variables={},
                changed_variables=[],
                stdout=final_stdout_with_error,
                stack_depth=self.stack_depth
            )
            self.steps.append(error_step)
            return {"success": False, "error": str(e), "error_type": type(e).__name__, "steps": self.steps, "output": final_stdout_with_error}
        finally:
            sys.settrace(None)
            sys.stdout = old_stdout
            
        final_stdout = captured_output.getvalue()
        final_step = ExecutionStep(
            step_number=len(self.steps) + 1,
            line_number=-1,
            stack_depth=0,
            variables=self.previous_variables,
            changed_variables=[],
            stdout=final_stdout
        )
        self.steps.append(final_step)

        return {"success": True, "steps": self.steps, "output": final_stdout}

user_code_to_execute = """{user_code}"""
tracer = AdvancedTracer()
result = tracer.generate_trace(user_code_to_execute)
print("---DEBUGGER_TRACE_START---")
print(json.dumps(result))
print("---DEBUGGER_TRACE_END---")
`;

export interface ExecutionStep {
  step_number: number;
  line_number: number;
  stack_depth: number;
  variables: Record<string, string>;
  changed_variables: string[];
  stdout: string;
}

export interface PythonExecutionPayload {
  success: boolean;
  steps: ExecutionStep[];
  output: string;
  error?: string;
  error_type?: string;
}

export const useDebuggerLogic = () => {
  const {
    runPythonCode,
    isLoading: isPyodideLoading,
    error: pyodideHookError,
  } = usePyodide();

  const [isTracing, setIsTracing] = useState<boolean>(false);
  const [trace, setTrace] = useState<PythonExecutionPayload | null>(null);
  const [error, setError] = useState<string | null>(null);

  const runAndTrace = useCallback(
    async (userCode: string, libraryCode?: string) => {
      setIsTracing(true);
      setTrace(null);
      setError(null);

      const scriptToRun = PYTHON_TRACE_SCRIPT_TEMPLATE.replace(
        "{user_code}",
        userCode
      );
      const { stdout, error: runError } = await runPythonCode(
        scriptToRun,
        libraryCode
      );

      let resultPayload: PythonExecutionPayload | null = null;
      if (runError) {
        setError(`Error during Python execution: ${runError.message}`);
      } else {
        const traceJsonMatch = stdout.match(
          /---DEBUGGER_TRACE_START---([\s\S]*?)---DEBUGGER_TRACE_END---/
        );
        if (traceJsonMatch?.[1]) {
          try {
            const payload = JSON.parse(
              traceJsonMatch[1].trim()
            ) as PythonExecutionPayload;
            setTrace(payload);
            resultPayload = payload;
            if (!payload.success) {
              setError(
                `Execution Error: ${payload.error_type} - ${payload.error}`
              );
            }
          } catch (e) {
            const errorMessage = e instanceof Error ? e.message : String(e);
            setError(`Error parsing trace from Python: ${errorMessage}`);
          }
        } else {
          setError("Could not find trace markers in Pyodide output.");
        }
      }
      setIsTracing(false);
      return resultPayload;
    },
    [runPythonCode]
  );

  return {
    runAndTrace,
    trace,
    isLoading: isTracing || isPyodideLoading,
    error: error || pyodideHookError?.message,
  };
};
