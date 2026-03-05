import { useCallback } from "react";
import { usePyodide } from "../contexts/PyodideContext";
import type { RefactorStyle, RefactorStyleResult } from "../types/data";

// pylint flags per style
const PYLINT_FLAGS: Record<string, string[]> = {
  pep8: ["--disable=all", "--enable=C", "--msg-template={msg_id}: {msg}"],
  annotated: [
    "--disable=all",
    "--enable=C0115,C0116",
    "--msg-template={msg_id}: {msg}",
  ],
  simple: [
    "--disable=all",
    "--enable=R0912,R0914,R0915,R0801,W0611,W0612,W0603",
    "--msg-template={msg_id}: {msg}",
  ],
  minimalist: [
    "--disable=all",
    "--enable=W0611,W0612",
    "--msg-template={msg_id}: {msg}",
  ],
};

const AST_CHECK_FUNCTION = `
import ast, json
try:
    tree = ast.parse(_student_code)
    has_fn = any(isinstance(n, ast.FunctionDef) for n in tree.body)
    if has_fn:
        print(json.dumps({"passed": True, "feedback": []}))
    else:
        print(json.dumps({"passed": False, "feedback": ["No top-level function defined."]}))
except SyntaxError as e:
    print(json.dumps({"passed": False, "feedback": [f"Syntax error: {e}"]}))
`;

const AST_CHECK_OOP = `
import ast, json
try:
    tree = ast.parse(_student_code)
    classes = [n for n in ast.walk(tree) if isinstance(n, ast.ClassDef)]
    if not classes:
        print(json.dumps({"passed": False, "feedback": ["No class defined."]}))
    else:
        bad_methods = []
        for cls in classes:
            for node in ast.walk(cls):
                if isinstance(node, ast.FunctionDef):
                    if not node.args.args or node.args.args[0].arg != "self":
                        bad_methods.append(node.name)
        if bad_methods:
            print(json.dumps({"passed": False, "feedback": [f"Method '{m}' is missing 'self' parameter." for m in bad_methods]}))
        else:
            print(json.dumps({"passed": True, "feedback": []}))
except SyntaxError as e:
    print(json.dumps({"passed": False, "feedback": [f"Syntax error: {e}"]}))
`;

const AST_CHECK_RECURSIVE = `
import ast, json
try:
    tree = ast.parse(_student_code)
    found_recursion = False
    found_base_case = False
    for node in ast.walk(tree):
        if isinstance(node, ast.FunctionDef):
            fn_name = node.name
            calls = [
                n for n in ast.walk(node)
                if isinstance(n, ast.Call)
                and isinstance(n.func, ast.Name)
                and n.func.id == fn_name
            ]
            if calls:
                found_recursion = True
                if any(isinstance(n, ast.If) for n in ast.walk(node)):
                    found_base_case = True
    if not found_recursion:
        print(json.dumps({"passed": False, "feedback": ["No recursive function call found."]}))
    elif not found_base_case:
        print(json.dumps({"passed": False, "feedback": ["Recursive function found, but no base case (if statement) detected."]}))
    else:
        print(json.dumps({"passed": True, "feedback": []}))
except SyntaxError as e:
    print(json.dumps({"passed": False, "feedback": [f"Syntax error: {e}"]}))
`;

const PYLINT_CHECK = `
import tempfile, os, json, re
from pylint.lint import Run
from pylint.reporters.text import TextReporter
from io import StringIO

with tempfile.NamedTemporaryFile('w', suffix='.py', delete=False, encoding='utf-8') as f:
    f.write(_student_code)
    path = f.name

try:
    out = StringIO()
    Run([path] + list(_pylint_flags), reporter=TextReporter(out), exit=False)
    output = out.getvalue()
finally:
    os.unlink(path)

messages = [
    line.strip()
    for line in output.splitlines()
    if re.match(r'^[A-Z]\\d{4}:', line.strip())
]
print(json.dumps({"passed": len(messages) == 0, "feedback": messages}))
`;

export function useStyleCheck() {
  const { pyodide, runPythonCode } = usePyodide();

  const checkStyle = useCallback(
    async (
      style: RefactorStyle,
      code: string
    ): Promise<RefactorStyleResult> => {
      if (!pyodide) {
        return { passed: false, feedback: ["Python environment not ready."] };
      }

      // Safely pass student code as a Python global to avoid injection
      pyodide.globals.set("_student_code", code);

      let snippet: string;

      if (style === "function") {
        snippet = AST_CHECK_FUNCTION;
      } else if (style === "oop") {
        snippet = AST_CHECK_OOP;
      } else if (style === "recursive") {
        snippet = AST_CHECK_RECURSIVE;
      } else {
        // pylint-based check
        pyodide.globals.set("_pylint_flags", pyodide.toPy(PYLINT_FLAGS[style]));
        snippet = PYLINT_CHECK;
      }

      const result = await runPythonCode(snippet);

      if (!result.success) {
        return {
          passed: false,
          feedback: [
            result.error?.message ?? "Style check failed unexpectedly.",
          ],
        };
      }

      try {
        return JSON.parse(result.stdout.trim()) as RefactorStyleResult;
      } catch {
        return {
          passed: false,
          feedback: ["Could not parse style check output."],
        };
      }
    },
    [pyodide, runPythonCode]
  );

  return { checkStyle };
}
