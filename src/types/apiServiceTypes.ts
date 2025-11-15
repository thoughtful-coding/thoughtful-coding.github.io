import {
  AssessmentLevel,
  SectionId,
  LessonId,
  UnitId,
  UserId,
  IsoTimestamp,
  SectionKind,
} from "./data";

export type AuthToken = string & { readonly __brand: "AuthToken" };

export interface SectionCompletionInput {
  unitId: UnitId;
  lessonId: LessonId;
  sectionId: SectionId;
  attemptsBeforeSuccess: number; // Number of attempts (including successful attempt) before completing section
}

export interface UserProgressData {
  userId: UserId; // Server will derive this from the token and include it in response
  completion: {
    [unitId: UnitId]: {
      [lessonId: LessonId]: {
        [sectionId: SectionId]: IsoTimestamp;
      };
    };
  };
}

export interface BatchCompletionsInput {
  completions: SectionCompletionInput[];
}

/**
 * Standard error codes returned by the API for programmatic error handling.
 * Matches the API specification v1.3.0+
 */
export enum ErrorCode {
  VALIDATION_ERROR = "VALIDATION_ERROR",
  AUTHENTICATION_FAILED = "AUTHENTICATION_FAILED",
  AUTHORIZATION_FAILED = "AUTHORIZATION_FAILED",
  RESOURCE_NOT_FOUND = "RESOURCE_NOT_FOUND",
  RATE_LIMIT_EXCEEDED = "RATE_LIMIT_EXCEEDED",
  AI_SERVICE_UNAVAILABLE = "AI_SERVICE_UNAVAILABLE",
  INTERNAL_ERROR = "INTERNAL_ERROR",
}

/**
 * Standard error response structure from the API.
 * As of v1.3.0, errorCode is required in all error responses.
 */
export interface ErrorResponse {
  /** Human-readable error message */
  message: string;
  /** Standard error code for programmatic error handling */
  errorCode: ErrorCode;
  /** Optional additional error details (e.g., validation errors from Pydantic) */
  details?: any;
}

/**
 * Input from the client when interacting with a reflection section.
 * Corresponds to POST /lessons/{lessonId}/sections/{sectionId}/reflections request body.
 * Based on your Swagger: ReflectionInteractionInput
 */
export interface ReflectionInteractionInput {
  userTopic: string;
  isUserTopicPredefined: boolean;
  userCode: string;
  isUserCodePredefined: boolean;
  userExplanation: string; // As per your Swagger's ReflectionInteractionInput
  isFinal?: boolean; // Defaults to false on the server if not provided
  sourceVersionId?: string | null; // Optional from client if isFinal=true; server might look up latest draft
}

/**
 * Represents a single reflection version/item as stored and returned by the API.
 * This is used for individual drafts, items in draft lists, and items in final entry lists.
 * Based on your Swagger: ReflectionVersionItem
 */
export interface ReflectionVersionItem {
  versionId: string; // e.g., "v_1685000000000_abc123" or the composite SK
  userId: UserId;
  lessonId: LessonId;
  sectionId: SectionId;
  userTopic: string; // Content submitted by the user for this version
  userCode: string; // Content submitted by the user for this version
  userExplanation: string; // Content submitted by the user for this version
  createdAt: IsoTimestamp; // ISO 8601 date-time string
  isFinal: boolean; // True if this is a finalized learning entry

  // These are populated for drafts (isFinal: false) after AI feedback.
  // For final entries (isFinal: true), these fields on the final record itself are null,
  // as the qualifying feedback is on the 'sourceVersionId' draft.
  aiFeedback?: string | null;
  aiAssessment?: AssessmentLevel | null;

  // If isFinal is true, this should point to the draft version that
  // contained the AI feedback qualifying this as a final submission.
  // Can also be used if a draft is a copy of another draft.
  sourceVersionId?: string | null;

  // This field is primarily for DynamoDB GSI use and might not always be present
  // in API responses unless specifically projected/needed by the client for that view.
  // Your ReflectionVersionItem in Swagger didn't explicitly list it.
  finalEntryCreatedAt?: IsoTimestamp | null;
}

/**
 * Response structure for GET /lessons/{lessonId}/sections/{sectionId}/reflections.
 * Contains a list of draft versions.
 * Based on your Swagger: ListOfReflectionVersionsResponse (when listing drafts)
 */
export interface ListOfReflectionDraftsResponse {
  versions: ReflectionVersionItem[]; // Array of drafts (ReflectionVersionItem where isFinal=false)
  lastEvaluatedKey?: Record<string, any> | null; // For pagination
}

/**
 * Response structure for GET /learning-entries.
 * Contains a list of finalized learning entries.
 * Based on your Swagger: ListOfReflectionVersionsResponse (when listing final entries,
 * where items are ReflectionVersionItem with isFinal=true)
 */
export interface ListOfFinalLearningEntriesResponse {
  entries: ReflectionVersionItem[]; // Array of final entries (ReflectionVersionItem where isFinal=true)
  lastEvaluatedKey?: Record<string, any> | null; // For pagination
}

export interface PrimmEvaluationRequest {
  lessonId: LessonId;
  sectionId: SectionId;
  primmExampleId: string;
  codeSnippet: string;
  userPredictionPromptText: string; // The prompt shown to the user
  userPredictionText: string; // User's English prediction
  userPredictionConfidence: number; // 1-3 for Low/Medium/High
  userExplanationText: string;
  actualOutputSummary?: string | null;
}

export interface PrimmEvaluationResponse {
  aiPredictionAssessment: AssessmentLevel;
  aiExplanationAssessment: AssessmentLevel;
  aiOverallComment: string;
}

export interface InstructorStudentInfo {
  studentId: UserId;
  studentName?: string | null; // Optional, as it might not be available in POC
  studentEmail?: string | null; // Optional
}

export interface ListOfInstructorStudentsResponse {
  students: InstructorStudentInfo[];
  // lastEvaluatedKey?: Record<string, any> | null; // For future pagination if the list becomes very long
}

/**
 * Details about a section completion, including timestamp and attempt count
 */
export interface SectionCompletionDetail {
  completedAt: IsoTimestamp;
  attemptsBeforeSuccess: number;
}

export interface StudentUnitCompletionData {
  studentId: UserId;
  // studentName?: string | null; // Optional: server could still provide this if easily available
  completedSectionsInUnit: {
    // Key is full lessonId (e.g., "00_intro/lesson_1")
    [lessonId: LessonId]: { [sectionId: SectionId]: SectionCompletionDetail };
  };
}

// Response from the new batch progress endpoint
export interface ClassUnitProgressResponse {
  unitId: UnitId;
  // unitTitle?: string; // Optional: client can get this from its own data
  studentProgressData: StudentUnitCompletionData[];
  // lastEvaluatedKey for paginating students if needed in the future
}

// Keep these for the table rendering logic (they are client-side display models)
export interface StudentLessonProgressItem {
  lessonId: LessonId;
  lessonTitle: string;
  completionPercent: number;
  isCompleted: boolean;
  completedSectionsCount: number;
  totalRequiredSectionsInLesson: number;
}

export interface DisplayableStudentUnitProgress {
  // This is what the client will compute and use for the table rows
  studentId: string;
  studentName?: string | null;
  unitId: UnitId;
  unitTitle: string;
  lessonsProgress: StudentLessonProgressItem[];
  overallUnitCompletionPercent: number;
}

export interface StoredPrimmSubmissionItem {
  userId: UserId;
  submissionCompositeKey: string; // Sort Key: lessonId#sectionId#primmExampleId#timestampIso
  lessonId: LessonId;
  sectionId: SectionId;
  primmExampleId: string;
  timestampIso: IsoTimestamp;
  codeSnippet: string;
  userPredictionPromptText: string;
  userPredictionText: string;
  userPredictionConfidence: number;
  actualOutputSummary?: string | null;
  userExplanationText?: string | null;
  aiPredictionAssessment: AssessmentLevel;
  aiExplanationAssessment?: AssessmentLevel | null;
  aiOverallComment?: string | null;
  createdAt: string;
}

export interface AssignmentSubmission<T extends "Reflection" | "PRIMM"> {
  studentId: UserId;
  studentName?: string | null;
  submissionTimestamp: IsoTimestamp;
  submissionDetails: T extends "Reflection"
    ? ReflectionVersionItem[]
    : StoredPrimmSubmissionItem;
  // If Reflection, submissionDetails will be the full ReflectionVersionItem, allowing access to iterations if needed later.
  // If PRIMM, it's the StoredPrimmSubmissionItem.
}

export interface ListOfAssignmentSubmissionsResponse<
  T extends "Reflection" | "PRIMM",
> {
  assignmentType: T;
  unitId: UnitId;
  lessonId: LessonId;
  sectionId: SectionId;
  primmExampleId?: string; // Only for PRIMM
  submissions: AssignmentSubmission<T>[];
}

/**
 * Represents the status and details of a single section for a student.
 */
export interface SectionStatusItem {
  sectionId: SectionId;
  sectionTitle: string;
  sectionKind: SectionKind;
  status: "completed" | "submitted" | "not_started";
  submissionTimestamp?: IsoTimestamp | null;
  submissionDetails?:
    | ReflectionVersionItem[]
    | StoredPrimmSubmissionItem
    | null;
}

/**
 * Represents a student's progress and submissions for all sections within a single lesson.
 */
export interface LessonProgressProfile {
  lessonId: LessonId;
  lessonTitle: string;
  sections: SectionStatusItem[];
}

/**
 * Represents a student's progress and submissions for all lessons within a single unit.
 */
export interface UnitProgressProfile {
  unitId: UnitId;
  unitTitle: string;
  lessons: LessonProgressProfile[];
}

/**
 * The main response object from the GET /instructor/students/{studentId}/detailed-progress endpoint.
 */
export interface StudentDetailedProgressResponse {
  studentId: UserId;
  studentName?: string | null;
  profile: UnitProgressProfile[];
}

/**
 * Response from GET /instructor/students/{studentId}/learning-entries
 * Returns all reflection entries (drafts and final) for a student
 */
export interface StudentLearningEntriesResponse {
  entries: ReflectionVersionItem[];
}

/**
 * Response from GET /instructor/students/{studentId}/primm-submissions
 * Returns all PRIMM submissions for a student
 */
export interface StudentPrimmSubmissionsResponse {
  submissions: StoredPrimmSubmissionItem[];
}
