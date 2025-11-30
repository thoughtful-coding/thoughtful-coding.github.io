import "@testing-library/jest-dom";
import { vi } from "vitest";

// Mock the 'scrollIntoView' function for the JSDOM environment
// This is necessary for any component that uses refs to scroll to elements
Element.prototype.scrollIntoView = vi.fn();

// Mock DOM APIs needed by CodeMirror
Range.prototype.getClientRects = vi.fn(() => ({
  length: 0,
  item: () => null,
  [Symbol.iterator]: function* () {},
}));

Range.prototype.getBoundingClientRect = vi.fn(() => ({
  x: 0,
  y: 0,
  bottom: 0,
  height: 0,
  left: 0,
  right: 0,
  top: 0,
  width: 0,
  toJSON: () => {},
}));

// Mock window.alert
global.alert = vi.fn();
