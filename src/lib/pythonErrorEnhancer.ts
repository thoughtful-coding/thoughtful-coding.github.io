/**
 * Python Error Message Enhancer
 *
 * This module provides beginner-friendly hints for common Python errors.
 * When students encounter errors, they get both the technical error message
 * and helpful guidance on how to fix it.
 */

interface ErrorPattern {
  /** Regex pattern to match against error message */
  pattern: RegExp;
  /** Beginner-friendly hint to help students fix the error */
  hint: string;
}

interface ErrorHintConfig {
  /** General hint for this error type (always shown) */
  generalHint: string;
  /** Specific patterns to match for more targeted hints */
  patterns?: ErrorPattern[];
}

/**
 * Map of Python error types to beginner-friendly hints
 */
const ERROR_HINTS: Record<string, ErrorHintConfig> = {
  SyntaxError: {
    generalHint: "Python couldn't understand your code. Check for typos, missing colons, or incorrect indentation.",
    patterns: [
      {
        pattern: /invalid syntax/i,
        hint: "There's a syntax error in your code. Common causes:\n• Missing colon (:) at the end of if, for, while, or def statements\n• Unclosed parentheses, brackets, or quotes\n• Using = instead of == for comparison",
      },
      {
        pattern: /unexpected indent/i,
        hint: "Your code has unexpected indentation. Make sure all lines in the same block have the same indentation level (usually 4 spaces).",
      },
      {
        pattern: /expected an indented block/i,
        hint: "Python expected indented code after a colon (:). After if, for, while, or def statements, the next line must be indented.",
      },
      {
        pattern: /unindent does not match/i,
        hint: "Your indentation is inconsistent. Make sure you're using the same number of spaces throughout (either all tabs or all spaces, preferably 4 spaces).",
      },
      {
        pattern: /unterminated string/i,
        hint: "You forgot to close a string. Check that all quotes (' or \") are properly closed.",
      },
      {
        pattern: /EOL while scanning/i,
        hint: "You reached the end of the line while Python was still looking for a closing quote. Make sure all strings are closed on the same line or use triple quotes (\"\"\" or ''') for multi-line strings.",
      },
    ],
  },

  IndentationError: {
    generalHint: "Python uses indentation to group code. Check that your indentation is consistent.",
    patterns: [
      {
        pattern: /expected an indented block/i,
        hint: "After statements like if, for, while, or def, you need to indent the next line (usually 4 spaces).",
      },
      {
        pattern: /unexpected indent/i,
        hint: "This line has indentation but shouldn't. Remove the extra spaces or tabs at the beginning.",
      },
      {
        pattern: /unindent does not match/i,
        hint: "Your indentation levels don't match. Use either all spaces or all tabs (spaces are recommended), and be consistent with the number.",
      },
    ],
  },

  NameError: {
    generalHint: "Python doesn't recognize this name. It might be a typo or a variable you haven't defined yet.",
    patterns: [
      {
        pattern: /name '(\w+)' is not defined/i,
        hint: "The variable '$1' hasn't been defined yet. Make sure you:\n• Spell the variable name correctly (Python is case-sensitive!)\n• Define the variable before using it\n• Check if the variable is defined in the right scope",
      },
    ],
  },

  TypeError: {
    generalHint: "You're trying to do an operation that doesn't work with these types of data.",
    patterns: [
      {
        pattern: /unsupported operand type.*'([^']+)'.*'([^']+)'/i,
        hint: "You can't use this operation between $1 and $2. For example, you can't add a number to a string directly. Try converting types with int(), str(), or float().",
      },
      {
        pattern: /can only concatenate str.*to str/i,
        hint: "You're trying to add a non-string to a string. Use str() to convert numbers to strings first, or use f-strings: f\"text {variable}\"",
      },
      {
        pattern: /'(\w+)' object is not callable/i,
        hint: "You're trying to call something that isn't a function. Check:\n• Did you accidentally add parentheses () after a variable?\n• Did you overwrite a function name with a different value?",
      },
      {
        pattern: /missing \d+ required positional argument/i,
        hint: "This function needs more arguments than you provided. Check the function definition to see what parameters it expects.",
      },
      {
        pattern: /takes \d+ positional argument.*but \d+ were given/i,
        hint: "You're passing too many or too few arguments to this function. Check how many parameters the function expects.",
      },
    ],
  },

  ValueError: {
    generalHint: "The value you're using is the right type but has an incorrect value.",
    patterns: [
      {
        pattern: /invalid literal for int\(\) with base 10/i,
        hint: "You're trying to convert something to an integer that isn't a valid number. Make sure the string contains only digits (and optionally a minus sign).",
      },
      {
        pattern: /could not convert string to float/i,
        hint: "You're trying to convert a non-numeric string to a decimal number. Check that the string contains a valid number.",
      },
      {
        pattern: /not enough values to unpack/i,
        hint: "You're trying to unpack fewer values than expected. For example, if you write 'a, b = [1]', Python expects 2 values but only gets 1.",
      },
      {
        pattern: /too many values to unpack/i,
        hint: "You're trying to unpack more values than variables. For example, 'a = [1, 2, 3]' gives 3 values but you only have 1 variable.",
      },
    ],
  },

  IndexError: {
    generalHint: "You're trying to access an index that doesn't exist in the list or string.",
    patterns: [
      {
        pattern: /list index out of range/i,
        hint: "You're trying to access a list position that doesn't exist. Remember:\n• Lists are zero-indexed (first item is at index 0)\n• If a list has n items, valid indices are 0 to n-1\n• Use len(list) to check the list size",
      },
      {
        pattern: /string index out of range/i,
        hint: "You're trying to access a position in the string that doesn't exist. Remember strings are zero-indexed, so valid indices are 0 to len(string)-1.",
      },
    ],
  },

  KeyError: {
    generalHint: "You're trying to access a dictionary key that doesn't exist.",
    patterns: [
      {
        pattern: /.*/,
        hint: "This key isn't in the dictionary. You can:\n• Use the .get() method instead: dict.get('key', default_value)\n• Check if the key exists first: if 'key' in dict:\n• Use dict.keys() to see all available keys",
      },
    ],
  },

  AttributeError: {
    generalHint: "You're trying to access a property or method that doesn't exist on this object.",
    patterns: [
      {
        pattern: /'(\w+)' object has no attribute '(\w+)'/i,
        hint: "The $1 type doesn't have a '$2' method or property. Check:\n• Is this the right object type?\n• Did you spell the attribute name correctly?\n• Use dir(object) to see available methods",
      },
    ],
  },

  ZeroDivisionError: {
    generalHint: "You're trying to divide by zero, which is mathematically undefined.",
    patterns: [
      {
        pattern: /division by zero/i,
        hint: "You can't divide by zero. Check that your divisor isn't zero before dividing, or handle it with a try/except block.",
      },
    ],
  },

  ImportError: {
    generalHint: "Python can't find the module you're trying to import.",
    patterns: [
      {
        pattern: /No module named '(\w+)'/i,
        hint: "The module '$1' isn't available. In this browser environment, only standard library modules and Pyodide-compatible packages can be imported.",
      },
    ],
  },

  UnboundLocalError: {
    generalHint: "You're trying to use a variable before it's been assigned a value in this scope.",
    patterns: [
      {
        pattern: /local variable '(\w+)' referenced before assignment/i,
        hint: "You're using the variable '$1' before giving it a value. This often happens when you:\n• Try to modify a global variable inside a function without using 'global'\n• Use a variable before the line where it's defined",
      },
    ],
  },

  RecursionError: {
    generalHint: "Your function is calling itself too many times (infinite recursion).",
    patterns: [
      {
        pattern: /maximum recursion depth exceeded/i,
        hint: "Your recursive function doesn't have a proper base case, so it keeps calling itself forever. Make sure your recursive function:\n• Has a base case (a condition where it stops recursing)\n• Makes progress toward the base case with each call",
      },
    ],
  },

  FileNotFoundError: {
    generalHint: "Python can't find the file you're trying to open.",
    patterns: [
      {
        pattern: /No such file or directory/i,
        hint: "The file doesn't exist at that path. Check:\n• Is the filename spelled correctly?\n• Is the file in the right location?\n• Note: In this browser environment, you can't access local files on your computer",
      },
    ],
  },
};

/**
 * Enhances a Python error message with beginner-friendly hints
 *
 * @param errorType - The Python error type (e.g., "NameError", "SyntaxError")
 * @param errorMessage - The original error message
 * @param traceback - The full Python traceback
 * @returns Enhanced error message with helpful hints
 */
export function enhancePythonError(
  errorType: string,
  errorMessage: string,
  traceback?: string
): string {
  const config = ERROR_HINTS[errorType];

  if (!config) {
    // Unknown error type - return original message
    return errorMessage;
  }

  const hints: string[] = [];

  // Add general hint for this error type
  hints.push(`💡 ${config.generalHint}`);

  // Check for specific patterns
  if (config.patterns) {
    for (const { pattern, hint } of config.patterns) {
      if (pattern.test(errorMessage) || (traceback && pattern.test(traceback))) {
        // Replace $1, $2, etc. with capture groups
        const match = errorMessage.match(pattern) || traceback?.match(pattern);
        let enhancedHint = hint;
        if (match) {
          for (let i = 1; i < match.length; i++) {
            enhancedHint = enhancedHint.replace(new RegExp(`\\$${i}`, 'g'), match[i]);
          }
        }
        hints.push(`\n💡 ${enhancedHint}`);
        // Only show the first matching pattern
        break;
      }
    }
  }

  // Combine original message with hints
  return `${errorMessage}\n\n${hints.join('\n')}`;
}

/**
 * Extracts the most relevant line from a Python traceback for beginner display
 *
 * @param traceback - The full Python traceback
 * @returns The most relevant error line, or the full traceback if parsing fails
 */
export function extractRelevantTraceback(traceback: string): string {
  // Try to extract just the last line of the traceback (the actual error)
  // and the line before it (which shows the problematic code line)
  const lines = traceback.split('\n');

  // Find lines that show the actual code (start with spaces/numbers)
  // and the error line (starts with error type)
  const relevantLines: string[] = [];

  for (let i = lines.length - 1; i >= 0; i--) {
    const line = lines[i].trim();
    if (!line) continue;

    relevantLines.unshift(lines[i]);

    // Stop after we have the error line and a few context lines
    if (relevantLines.length >= 4) break;
  }

  return relevantLines.length > 0 ? relevantLines.join('\n') : traceback;
}
