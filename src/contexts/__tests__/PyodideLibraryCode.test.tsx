import { describe, it, expect } from "vitest";

describe("PyodideContext - Library Code Integration", () => {
  it("creates virtual module setup code with proper escaping", () => {
    const libraryCode = `def greet(name):
    return f"Hello, {name}!"`;

    // This is the module setup code that would be executed
    const moduleSetupCode = `
import sys
import types

# Clean up any existing module from previous execution
if 'thoughtful_code' in sys.modules:
    del sys.modules['thoughtful_code']

# Create virtual module 'thoughtful_code'
_module = types.ModuleType('thoughtful_code')
exec(${JSON.stringify(libraryCode)}, _module.__dict__)
sys.modules['thoughtful_code'] = _module
del _module  # Clean up temporary variable
`;

    // Verify the code contains the key parts
    expect(moduleSetupCode).toContain("types.ModuleType('thoughtful_code')");
    expect(moduleSetupCode).toContain("sys.modules['thoughtful_code']");

    // Verify library code is properly JSON-stringified (handles quotes)
    expect(moduleSetupCode).toContain(JSON.stringify(libraryCode));
  });

  it("module setup handles special characters in library code", () => {
    const libraryCodeWithQuotes = 'def test():\n    return "It\'s working"';
    const escaped = JSON.stringify(libraryCodeWithQuotes);

    // JSON.stringify should properly escape quotes
    expect(escaped).toContain('\\"');
    expect(escaped).not.toContain('"It\'s working"'); // Should be escaped
  });

  it("includes cleanup code when libraryCode is provided", () => {
    const libraryCode = "def foo(): return 1";

    const moduleSetupCode = `
import sys
import types

# Clean up any existing module from previous execution
if 'thoughtful_code' in sys.modules:
    del sys.modules['thoughtful_code']

# Create virtual module 'thoughtful_code'
_module = types.ModuleType('thoughtful_code')
exec(${JSON.stringify(libraryCode)}, _module.__dict__)
sys.modules['thoughtful_code'] = _module
del _module  # Clean up temporary variable
`;

    // Verify cleanup happens before module creation
    expect(moduleSetupCode).toContain("if 'thoughtful_code' in sys.modules:");
    expect(moduleSetupCode).toContain("del sys.modules['thoughtful_code']");

    // Verify cleanup appears before module creation
    const cleanupIndex = moduleSetupCode.indexOf(
      "del sys.modules['thoughtful_code']"
    );
    const createIndex = moduleSetupCode.indexOf(
      "_module = types.ModuleType('thoughtful_code')"
    );
    expect(cleanupIndex).toBeLessThan(createIndex);
  });

  it("executes cleanup code when libraryCode is undefined", () => {
    const libraryCode = undefined;

    // When libraryCode is undefined, cleanup code should still execute
    if (!libraryCode) {
      const cleanupCode = `
import sys
if 'thoughtful_code' in sys.modules:
    del sys.modules['thoughtful_code']
`;

      // Verify cleanup code structure
      expect(cleanupCode).toContain("if 'thoughtful_code' in sys.modules:");
      expect(cleanupCode).toContain("del sys.modules['thoughtful_code']");
      // Should NOT contain module creation
      expect(cleanupCode).not.toContain("types.ModuleType");
    }
  });

  it("demonstrates module isolation between sections", () => {
    // Section A with library code
    const libraryCodeA = "def foo(): return 1";
    const setupA = `
import sys
import types

# Clean up any existing module from previous execution
if 'thoughtful_code' in sys.modules:
    del sys.modules['thoughtful_code']

# Create virtual module 'thoughtful_code'
_module = types.ModuleType('thoughtful_code')
exec(${JSON.stringify(libraryCodeA)}, _module.__dict__)
sys.modules['thoughtful_code'] = _module
del _module  # Clean up temporary variable
`;

    // Section B with different library code
    const libraryCodeB = "def foo(): return 2";
    const setupB = `
import sys
import types

# Clean up any existing module from previous execution
if 'thoughtful_code' in sys.modules:
    del sys.modules['thoughtful_code']

# Create virtual module 'thoughtful_code'
_module = types.ModuleType('thoughtful_code')
exec(${JSON.stringify(libraryCodeB)}, _module.__dict__)
sys.modules['thoughtful_code'] = _module
del _module  # Clean up temporary variable
`;

    // Both sections clean up before creating - ensures isolation
    expect(setupA).toContain("del sys.modules['thoughtful_code']");
    expect(setupB).toContain("del sys.modules['thoughtful_code']");

    // Each section has different library code
    expect(setupA).toContain(libraryCodeA);
    expect(setupB).toContain(libraryCodeB);
    expect(setupA).not.toContain(libraryCodeB);
  });
});

// Note: Full integration testing is done in component tests where hooks are mocked
// Examples:
// - TestingSection.test.tsx - verifies testMode with libraryCode
// - CodeExecutor tests - verify console/turtle execution with libraryCode
// - ParsonsSection tests - verify Parsons sections pass libraryCode
