import { enhancePythonError, extractRelevantTraceback } from "../pythonErrorEnhancer";

describe("pythonErrorEnhancer", () => {
  describe("enhancePythonError", () => {
    it("should add hints for NameError", () => {
      const result = enhancePythonError(
        "NameError",
        "name 'x' is not defined",
        ""
      );

      expect(result).toContain("name 'x' is not defined");
      expect(result).toContain("💡");
      expect(result).toContain("hasn't been defined yet");
      expect(result).toContain("Spell the variable name correctly");
    });

    it("should add hints for SyntaxError with missing colon", () => {
      const result = enhancePythonError(
        "SyntaxError",
        "invalid syntax",
        "  File \"<stdin>\", line 1\n    if x\n       ^\nSyntaxError: invalid syntax"
      );

      expect(result).toContain("invalid syntax");
      expect(result).toContain("💡");
      expect(result).toContain("Missing colon");
    });

    it("should add hints for IndentationError", () => {
      const result = enhancePythonError(
        "IndentationError",
        "expected an indented block",
        ""
      );

      expect(result).toContain("expected an indented block");
      expect(result).toContain("💡");
      expect(result).toContain("indent the next line");
    });

    it("should add hints for TypeError with concatenation", () => {
      const result = enhancePythonError(
        "TypeError",
        "can only concatenate str (not \"int\") to str",
        ""
      );

      expect(result).toContain("can only concatenate");
      expect(result).toContain("💡");
      expect(result).toContain("Use str() to convert");
    });

    it("should add hints for ValueError with int conversion", () => {
      const result = enhancePythonError(
        "ValueError",
        "invalid literal for int() with base 10: 'abc'",
        ""
      );

      expect(result).toContain("invalid literal for int()");
      expect(result).toContain("💡");
      expect(result).toContain("convert something to an integer");
    });

    it("should add hints for IndexError", () => {
      const result = enhancePythonError(
        "IndexError",
        "list index out of range",
        ""
      );

      expect(result).toContain("list index out of range");
      expect(result).toContain("💡");
      expect(result).toContain("zero-indexed");
    });

    it("should add hints for ZeroDivisionError", () => {
      const result = enhancePythonError(
        "ZeroDivisionError",
        "division by zero",
        ""
      );

      expect(result).toContain("division by zero");
      expect(result).toContain("💡");
      expect(result).toContain("can't divide by zero");
    });

    it("should return original message for unknown error types", () => {
      const result = enhancePythonError(
        "CustomUnknownError",
        "something went wrong",
        ""
      );

      expect(result).toBe("something went wrong");
      expect(result).not.toContain("💡");
    });

    it("should replace capture groups in hints", () => {
      const result = enhancePythonError(
        "AttributeError",
        "'int' object has no attribute 'append'",
        ""
      );

      expect(result).toContain("'int' object has no attribute 'append'");
      expect(result).toContain("int type");
      expect(result).toContain("'append'");
    });
  });

  describe("extractRelevantTraceback", () => {
    it("should extract the last few lines of a traceback", () => {
      const fullTraceback = `Traceback (most recent call last):
  File "<stdin>", line 5, in <module>
  File "<stdin>", line 2, in foo
    x = 1 / 0
ZeroDivisionError: division by zero`;

      const result = extractRelevantTraceback(fullTraceback);

      expect(result).toContain("division by zero");
      expect(result.split('\n').length).toBeLessThanOrEqual(4);
    });

    it("should return original traceback if very short", () => {
      const shortTraceback = "ValueError: invalid value";

      const result = extractRelevantTraceback(shortTraceback);

      expect(result).toBe(shortTraceback);
    });
  });
});
