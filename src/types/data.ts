// src/types/data.ts

import { PrimmEvaluationResponse } from "./apiServiceTypes";

// --- Base Structures ---

export type UserId = string & { readonly __brand: "UserId" };
export type IsoTimestamp = string & { readonly __brand: "IsoTimestamp" };
export type AccessTokenId = string & { readonly __brand: "AccessTokenId" };
export type RefreshTokenId = string & { readonly __brand: "RefreshTokenId" };

export type UnitId = string & { readonly __brand: "UnitId" };
export type LessonId = string & { readonly __brand: "LessonId" };
export type LessonPath = string & { readonly __brand: "LessonPath" };
export type SectionId = string & { readonly __brand: "SectionId" };

export interface TextBlock {
  kind: "text";
  value: string;
}

export interface CodeBlock {
  kind: "code";
  language: string;
  value: string;
}

export interface ImageBlock {
  kind: "image";
  src: string;
  alt: string;
  maxWidthPercentage?: number;
}

export interface VideoBlock {
  kind: "video";
  src: string;
  start?: number;
  end?: number;
  caption?: string;
}

export type ContentBlock = TextBlock | CodeBlock | ImageBlock | VideoBlock;

export interface LessonSection {
  kind: SectionKind;
  id: SectionId;
  title: string;
  content: ContentBlock[];
}

// --- Specific Section Kind Interfaces (Extending LessonSection) ---

export type SectionKind =
  | "Information"
  // Question Sections
  | "MultipleChoice"
  | "MultipleSelection"
  | "Matching"
  // AI Sections
  | "Reflection"
  // Executable Code Sections
  | "Observation"
  | "Coverage"
  | "Prediction"
  | "PRIMM"
  | "Testing"
  | "Debugger";

export interface InformationSectionData extends LessonSection {
  kind: "Information";
}

// --- Question Section ---

export interface FeedbackText {
  correct: string;
  incorrect?: string;
}

export interface MultipleChoiceSectionData extends LessonSection {
  kind: "MultipleChoice";
  options: string[];
  correctAnswer: number;
  feedback?: FeedbackText;
}

export interface MultipleSelectionSectionData extends LessonSection {
  kind: "MultipleSelection";
  options: string[];
  correctAnswers: number[];
  feedback?: FeedbackText;
}

export interface MatchingSectionData extends LessonSection {
  kind: "Matching";
  prompts: Array<{ [key: string]: string }>;
  // An optional array of indices to determine the initial shuffled order of answers.
  initialOrder?: number[];
  feedback?: FeedbackText;
}

// --- AI Sections ---

export interface ReflectionSubmission {
  topic: string;
  code: string;
  explanation: string;
  timestamp: number;
  submitted: boolean;
}

export type AssessmentLevel =
  | "achieves"
  | "mostly"
  | "developing"
  | "insufficient";

export interface ReflectionSectionData extends LessonSection {
  kind: "Reflection";
  topic: string;
  isTopicPredefined: boolean;

  code: string;
  isCodePredefined: boolean;

  explanation: string;
  isExplanationPredefined: boolean;
}

export interface ReflectionResponse {
  feedback: string; // Text feedback (simulated AI)
  assessment: AssessmentLevel; // Assessment level based on rubric
  timestamp: number; // When feedback was generated
}

// Type for the history entry combining submission and optional response
export interface ReflectionHistoryEntry {
  submission: ReflectionSubmission;
  response?: ReflectionResponse;
}

// Type for the state saved in localStorage
export interface SavedReflectionState {
  history: ReflectionHistoryEntry[];
  // Optionally save draft state too
  // draftTopic?: string;
  // draftCode?: string;
  // draftExplanation?: string;
}

// --- Executable Sections ---

export interface ExecutableCode {
  initialCode: string;
  visualization: "console" | "turtle";
  allowImageDownload?: boolean;
}

export interface ObservationSectionData extends LessonSection {
  kind: "Observation";
  example: ExecutableCode;
}

export interface TestCase {
  input: any[];
  expected: any;
  description: string;
  referenceImage?: string; // Path to reference image for visual turtle tests (e.g., "data/07_loops_advanced/images/turtle-square-100.png")
}

export type TestMode = "procedure" | "function";

export interface TestingSectionData extends LessonSection {
  kind: "Testing";
  example: ExecutableCode;
  testMode: TestMode;
  functionToTest: string; // "__main__" for testing entire program output, function name for testing specific functions
  testCases: TestCase[];
  visualThreshold?: number; // Similarity threshold (0.0-1.0) for visual turtle tests. Recommended: 0.95. Only used when testCases contain referenceImage
}

export interface DebuggerSectionData extends LessonSection {
  kind: "Debugger";
  example: ExecutableCode;
  advancedControls?: boolean;
}

export interface InputParam {
  variableName: string; // Name of the variable used in the Python code
  variableType: "string" | "number" | "boolean"; // Input type hint
}

export interface PredictionTableRow {
  inputs: any[]; // Use 'any[]' for flexibility or define specific input types if consistent
  hint?: string; // Optional hint for the user
}

export interface PredictionSectionData extends LessonSection {
  kind: "Prediction";
  example: ExecutableCode;
  testMode: TestMode;
  functionToTest: string;
  predictionTable: {
    columns: InputParam[];
    rows: PredictionTableRow[];
  };
}

export interface CoverageTableRow {
  fixedInputs: { [variableName: string]: any }; // Pre-filled, locked values (use {} for no fixed inputs)
  expectedOutput: string; // The exact stdout expected
  hint?: string; // Optional hint for the user
}

export interface CoverageSectionData extends LessonSection {
  kind: "Coverage";
  example: ExecutableCode;
  testMode: TestMode;
  functionToTest: string;
  coverageTable: {
    columns: InputParam[];
    rows: CoverageTableRow[];
  };
}

// Type for the state of a single challenge row
export interface ChallengeState {
  inputs: { [paramName: string]: string }; // Store all inputs as strings initially
  actualOutput: string | null;
  isCorrect: boolean | null;
  isRunning: boolean;
}

export interface SavedPredictionState {
  predictions: {
    [rowIndex: number]: {
      userAnswer: string;
      isCorrect: boolean | null;
      actualOutput: string | null;
    };
  };
}

// Type for the overall state saved in localStorage
export interface SavedCoverageState {
  challengeStates: { [challengeId: string]: Omit<ChallengeState, "isRunning"> }; // Don't save runtime state
}

export interface SavedCodeState {
  [exampleId: string]: string; // Map example ID to its code string
}

export interface PRIMMSectionData extends LessonSection {
  kind: "PRIMM";
  example: ExecutableCode;
  predictPrompt: string;
  conclusion: string;
}

// This will be the structure stored per PRIMM example via useSectionProgress
export interface EnhancedPRIMMExampleUserState {
  userEnglishPrediction: string;
  isPredictionLocked: boolean;
  actualPyodideOutput: string | null;
  keyOutputSnippet: string | null;
  userExplanationText: string;
  aiEvaluationResult: PrimmEvaluationResponse | null;
  currentUiStep: "PREDICT" | "RUN" | "EXPLAIN" | "VIEW_AI_FEEDBACK";
  isComplete: boolean;
}

export interface SavedEnhancedPRIMMSectionState {
  exampleStates: {
    [exampleId: string]: EnhancedPRIMMExampleUserState;
  };
}

export type AnyLessonSectionData =
  | InformationSectionData
  | ObservationSectionData
  | TestingSectionData
  | DebuggerSectionData
  | PredictionSectionData
  | MultipleChoiceSectionData
  | MultipleSelectionSectionData
  | MatchingSectionData
  | ReflectionSectionData
  | CoverageSectionData
  | PRIMMSectionData;

export interface Lesson {
  guid: LessonId;
  title: string;
  description: string;
  sections: LessonSection[];
}

export interface LessonReference {
  path: LessonPath;
}

export interface Unit {
  id: UnitId;
  title: string;
  description: string;
  lessons: LessonReference[];
  image: string;
}

/**
 * Unit manifest schema for unit.ts files.
 * Contains unit metadata and lesson ordering with relative paths.
 * All paths in the manifest are relative to the unit directory.
 *
 * Example unit.ts file:
 * ```typescript
 * import type { UnitManifest, UnitId } from "../../../types/data";
 *
 * const unitData: UnitManifest = {
 *   id: "intro_python" as UnitId,
 *   title: "Introduction to Python",
 *   description: "Learn Python fundamentals...",
 *   image: "images/unit_icon_intro.svg",
 *   lessons: [
 *     "lessons/00_intro_strings",
 *     "lessons/01_intro_integers",
 *   ],
 * };
 *
 * export default unitData;
 * ```
 */
export interface UnitManifest {
  id: UnitId;
  title: string;
  description: string;
  image: string; // Relative to unit directory (e.g., "images/unit_icon.svg")
  lessons: string[]; // Relative paths to lessons (e.g., "lessons/00_intro_strings")
}

/**
 * Internal type for unit directory discovery.
 * Represents the directory name containing a unit.ts file.
 */
export type UnitDirectory = string & { readonly __brand: "UnitDirectory" };

export interface UnitsData {
  units: Unit[];
}

export interface DisplayableAssignment {
  key: string; // A unique key for React lists, e.g., `${lessonGuid}-${sectionId}-${primmExampleId || 'reflection' || 'testing'}`
  unitId: UnitId;
  lessonId: LessonId; // GUID
  lessonTitle: string;
  sectionId: SectionId;
  sectionTitle: string;
  assignmentType: "Reflection" | "PRIMM" | "Testing";
  primmExampleId?: string; // Only for PRIMM
  assignmentDisplayTitle: string; // e.g., "Reflection: Variables" or "PRIMM: Example 1 - Loops" or "Testing: First Solutions"
}

// Turtle

export type JsTurtleCommand =
  | { type: "forward"; distance: number }
  | { type: "backward"; distance: number }
  | { type: "right"; angle: number }
  | { type: "left"; angle: number }
  | { type: "goto"; x: number; y: number }
  | { type: "penup" }
  | { type: "pendown" }
  | { type: "setPenColor"; color: string }
  | { type: "setFillColor"; color: string }
  | { type: "setPenSize"; size: number }
  | { type: "setSpeed"; speed: number }
  | { type: "beginFill" }
  | { type: "endFill" }
  | { type: "clear" };
