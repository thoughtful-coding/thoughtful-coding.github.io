// src/types/pyodide.d.ts (Create this file if it doesn't exist)
declare global {
  interface Window {
    loadPyodide: (config: { indexURL: string }) => Promise<PyodideInterface>;
  }
}

// Basic interface - expand as needed or use @types/pyodide
export interface PyodideInterface {
  runPythonAsync: (code: string, options?: { globals?: any }) => Promise<any>;
  setStdout: (options: {
    batched?: (output: string) => void;
    raw?: (output: number) => void;
  }) => void;
  setStderr: (options: {
    batched?: (output: string) => void;
    raw?: (output: number) => void;
  }) => void;
  // Add other methods you might use, e.g., loadPackage, pyimport
  loadPackage: (packages: string | string[]) => Promise<void>;
  pyimport: (module: string) => any;
  setInterruptBuffer: (interruptBuffer: Uint8Array | null) => void;
  toPy: (obj: any) => any;

  globals: any;
}

// Export {} to make it a module if needed, or configure tsconfig appropriately
export {};
