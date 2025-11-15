import { API_GATEWAY_BASE_URL } from "../config";
import { useAuthStore } from "../stores/authStore";
import { ErrorCode } from "../types/apiServiceTypes";
import type {
  UserProgressData,
  BatchCompletionsInput,
  ErrorResponse,
  ReflectionInteractionInput,
  ReflectionVersionItem,
  ListOfReflectionDraftsResponse,
  ListOfFinalLearningEntriesResponse,
  PrimmEvaluationRequest,
  PrimmEvaluationResponse,
  ListOfInstructorStudentsResponse,
  ClassUnitProgressResponse,
  ListOfAssignmentSubmissionsResponse,
  StudentLearningEntriesResponse,
  StudentPrimmSubmissionsResponse,
  StudentDetailedProgressResponse,
} from "../types/apiServiceTypes";
import {
  UserId,
  LessonId,
  SectionId,
  UnitId,
  AccessTokenId,
  RefreshTokenId,
} from "../types/data";

// --- AUTH PROVIDER INTERFACE ---

/**
 * Interface for authentication operations used by the API service.
 * This allows for dependency injection and easier testing.
 */
export interface AuthProvider {
  getAccessToken: () => string | null;
  getRefreshToken: () => string | null;
  setTokens: (tokens: { accessToken: string; refreshToken: string }) => void;
  logout: () => void;
  setSessionExpired: (expired: boolean) => void;
}

// --- RESILIENCE CONFIGURATION ---

// Timeout configuration (30 seconds)
const DEFAULT_TIMEOUT = 30000;

// Retry configuration
const RETRYABLE_STATUS_CODES = [408, 429, 502, 503, 504];
const MAX_RETRIES = 3;
const INITIAL_RETRY_DELAY = 1000; // 1 second

// --- HELPER FUNCTIONS FOR RESILIENCE ---

/**
 * Wraps a fetch call with timeout logic using AbortController.
 * @param url - The URL to fetch
 * @param options - RequestInit options
 * @param timeout - Timeout in milliseconds (default: 30 seconds)
 * @returns Promise<Response>
 */
async function fetchWithTimeout(
  url: string,
  options: RequestInit = {},
  timeout = DEFAULT_TIMEOUT
): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    return response;
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      throw new Error(`Request timeout after ${timeout}ms`);
    }
    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
}

/**
 * Wraps a fetch call with retry logic and exponential backoff.
 * @param url - The URL to fetch
 * @param options - RequestInit options
 * @param retries - Number of retries remaining (default: MAX_RETRIES)
 * @returns Promise<Response>
 */
async function fetchWithRetry(
  url: string,
  options: RequestInit = {},
  retries = MAX_RETRIES
): Promise<Response> {
  try {
    const response = await fetchWithTimeout(url, options);

    // Only retry on specific status codes
    if (
      !response.ok &&
      RETRYABLE_STATUS_CODES.includes(response.status) &&
      retries > 0
    ) {
      const delay = INITIAL_RETRY_DELAY * 2 ** (MAX_RETRIES - retries);
      await new Promise((resolve) => setTimeout(resolve, delay));
      return fetchWithRetry(url, options, retries - 1);
    }

    return response;
  } catch (error) {
    // Retry on network errors if retries remain
    if (retries > 0) {
      const delay = INITIAL_RETRY_DELAY * 2 ** (MAX_RETRIES - retries);
      await new Promise((resolve) => setTimeout(resolve, delay));
      return fetchWithRetry(url, options, retries - 1);
    }
    throw error;
  }
}

// Custom Error class to hold status and parsed response
export class ApiError extends Error {
  status: number;
  data: ErrorResponse | { message: string };

  constructor(
    message: string,
    status: number,
    data?: ErrorResponse | { message: string }
  ) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data || { message };
    Object.setPrototypeOf(this, ApiError.prototype);
  }
}

// --- AUTOMATIC TOKEN REFRESH LOGIC ---

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value: unknown) => void;
  reject: (reason?: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

async function fetchWithAuth(
  url: string,
  options: RequestInit = {},
  authProvider: AuthProvider = useAuthStore.getState().actions
): Promise<Response> {
  const token = authProvider.getAccessToken();

  if (!token) {
    return Promise.reject(new ApiError("No access token available.", 401));
  }

  options.headers = {
    ...options.headers,
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  let response = await fetchWithRetry(url, options);

  if (response.status === 401 || response.status === 403) {
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      }).then(() => {
        options.headers!["Authorization"] =
          `Bearer ${authProvider.getAccessToken()}`;
        return fetchWithRetry(url, options);
      });
    }

    isRefreshing = true;
    const refreshToken = authProvider.getRefreshToken();
    if (!refreshToken) {
      authProvider.logout();
      isRefreshing = false;
      return Promise.reject(
        new ApiError("Session expired. Please log in again.", 401)
      );
    }

    try {
      const newTokens = await refreshAccessToken(refreshToken);
      authProvider.setTokens(newTokens);
      processQueue(null, newTokens.accessToken);

      options.headers!["Authorization"] = `Bearer ${newTokens.accessToken}`;
      response = await fetchWithRetry(url, options);
    } catch (refreshError) {
      processQueue(refreshError, null);

      // Show SessionExpiredModal
      authProvider.setSessionExpired(true);

      return Promise.reject(
        new ApiError("Session expired. Please log in again.", 401)
      );
    } finally {
      isRefreshing = false;
    }
  }

  return response;
}

export async function loginWithGoogle(
  googleIdToken: string
): Promise<{ accessToken: AccessTokenId; refreshToken: RefreshTokenId }> {
  const response = await fetchWithRetry(`${API_GATEWAY_BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ googleIdToken }),
  });
  return handleApiResponse(response);
}

export async function refreshAccessToken(
  refreshToken: string
): Promise<{ accessToken: AccessTokenId; refreshToken: RefreshTokenId }> {
  const response = await fetchWithRetry(
    `${API_GATEWAY_BASE_URL}/auth/refresh`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    }
  );
  return handleApiResponse(response);
}

export async function logoutUser(refreshToken: string): Promise<void> {
  await fetchWithRetry(`${API_GATEWAY_BASE_URL}/auth/logout`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refreshToken }),
  });
}

const handleApiResponse = async (response: Response) => {
  if (!response.ok) {
    let errorData: ErrorResponse;
    try {
      const parsed = await response.json();

      // Validate that errorCode exists and is valid (required as of API v1.3.0)
      if (
        !parsed.errorCode ||
        !Object.values(ErrorCode).includes(parsed.errorCode)
      ) {
        console.warn(
          `API returned error response without valid errorCode field (status ${response.status}):`,
          parsed
        );
        // Create a well-formed ErrorResponse with the original data in details
        errorData = {
          message: parsed.message || `HTTP error ${response.status}`,
          errorCode: ErrorCode.INTERNAL_ERROR,
          details: parsed,
        };
      } else {
        errorData = parsed as ErrorResponse;
      }
    } catch (_e) {
      // If body is not valid JSON, create a fallback error
      errorData = {
        message: `HTTP error ${response.status}: ${response.statusText}`,
        errorCode: ErrorCode.INTERNAL_ERROR,
      };
    }
    throw new ApiError(errorData.message, response.status, errorData);
  }
  return response.json();
};

export async function getUserProgress(): Promise<UserProgressData> {
  const response = await fetchWithAuth(`${API_GATEWAY_BASE_URL}/progress`);
  return handleApiResponse(response);
}

export async function updateUserProgress(
  batchInput: BatchCompletionsInput
): Promise<UserProgressData> {
  const response = await fetchWithAuth(`${API_GATEWAY_BASE_URL}/progress`, {
    method: "PUT",
    body: JSON.stringify(batchInput),
  });
  return handleApiResponse(response);
}

/**
 * Submits reflection content to the server for AI feedback (creating a draft)
 * OR to finalize a learning entry.
 * Corresponds to POST /reflections/{lessonId}/sections/{sectionId}
 * @param apiGatewayUrl - The base URL of the API Gateway.
 * @param lessonId - The ID of the lesson.
 * @param sectionId - The ID of the reflection section.
 * @param submissionData - The reflection content and flags (ReflectionInteractionInput).
 * @returns A Promise resolving to ReflectionFeedbackAndDraftResponse if isFinal=false,
 * or ReflectionVersionItem (the final entry) if isFinal=true.
 */
export async function submitReflectionInteraction(
  lessonId: LessonId,
  sectionId: SectionId,
  submissionData: ReflectionInteractionInput
): Promise<ReflectionVersionItem> {
  const endpoint = `${API_GATEWAY_BASE_URL}/reflections/${lessonId}/sections/${sectionId}`;
  const response = await fetchWithAuth(endpoint, {
    method: "POST",
    body: JSON.stringify(submissionData),
  });
  return handleApiResponse(response);
}

/**
 * Fetches all draft versions of a specific reflection section for the user.
 * Corresponds to GET /lessons/{lessonId}/sections/{sectionId}/reflections
 * @param apiGatewayUrl - The base URL of the API Gateway.
 * @param lessonId - The ID of the lesson.
 * @param sectionId - The ID of the reflection section.
 * @returns A Promise resolving to ListOfReflectionDraftsResponse.
 */
export async function getReflectionDraftVersions(
  lessonId: LessonId,
  sectionId: SectionId
): Promise<ListOfReflectionDraftsResponse> {
  const endpoint = `${API_GATEWAY_BASE_URL}/reflections/${lessonId}/sections/${sectionId}`;
  const response = await fetchWithAuth(endpoint);
  return handleApiResponse(response);
}

/**
 * Fetches all finalized learning entries for the authenticated user.
 * Corresponds to GET /learning-entries
 * @param apiGatewayUrl - The base URL of the API Gateway.
 * @returns A Promise resolving to ListOfFinalLearningEntriesResponse.
 */
export async function getFinalizedLearningEntries(): Promise<ListOfFinalLearningEntriesResponse> {
  const response = await fetchWithAuth(
    `${API_GATEWAY_BASE_URL}/learning-entries`
  );
  return handleApiResponse(response);
}

export async function submitPrimmEvaluation(
  payload: PrimmEvaluationRequest
): Promise<PrimmEvaluationResponse> {
  const endpoint = `${API_GATEWAY_BASE_URL}/primm-feedback`;
  const response = await fetchWithAuth(endpoint, {
    method: "POST",
    body: JSON.stringify(payload),
  });
  return handleApiResponse(response);
}

export async function getInstructorPermittedStudents(): Promise<ListOfInstructorStudentsResponse> {
  const response = await fetchWithAuth(
    `${API_GATEWAY_BASE_URL}/instructor/students`
  );
  return handleApiResponse(response);
}

export async function getInstructorClassUnitProgress(
  unitId: UnitId,
  studentIds: UserId[] // Optional: Server could get permitted students itself, or client sends IDs
): Promise<ClassUnitProgressResponse> {
  // For this version, let's assume the server will determine permitted students based on the instructor's idToken.
  // If you wanted client to send studentIds, you'd add it to query params or request body (if POST).
  // For a GET, usually it's query params. e.g. ?studentIds=id1,id2,id3

  const endpoint = `${API_GATEWAY_BASE_URL}/instructor/units/${unitId}/class-progress`;
  const response = await fetchWithAuth(endpoint);
  return handleApiResponse(response);
}

export async function getSubmissionsForAssignment<
  T extends "Reflection" | "PRIMM" | "Testing",
>(
  unitId: UnitId,
  lessonId: LessonId,
  sectionId: SectionId,
  assignmentType: T,
  primmExampleId?: string
): Promise<ListOfAssignmentSubmissionsResponse<T>> {
  const basePath = `${API_GATEWAY_BASE_URL}/instructor/units/${unitId}/lessons/${lessonId}/sections/${sectionId}/assignment-submissions`;
  const queryParams = new URLSearchParams({ assignmentType });
  if (assignmentType === "PRIMM" && primmExampleId) {
    queryParams.append("primmExampleId", primmExampleId);
  }
  const endpoint = `${basePath}?${queryParams.toString()}`;
  const response = await fetchWithAuth(endpoint);
  return handleApiResponse(response);
}

export async function getInstructorStudentFinalLearningEntries(
  studentId: UserId
): Promise<StudentLearningEntriesResponse> {
  const endpoint = `${API_GATEWAY_BASE_URL}/instructor/students/${studentId}/learning-entries?filter=final`;
  const response = await fetchWithAuth(endpoint);
  return handleApiResponse(response);
}

export async function getInstructorStudentPrimmSubmissions(
  studentId: UserId
): Promise<StudentPrimmSubmissionsResponse> {
  const endpoint = `${API_GATEWAY_BASE_URL}/instructor/students/${studentId}/primm-submissions`;
  const response = await fetchWithAuth(endpoint);
  return handleApiResponse(response);
}

export async function getStudentDetailedProgress(
  studentId: UserId
): Promise<StudentDetailedProgressResponse> {
  const endpoint = `${API_GATEWAY_BASE_URL}/instructor/students/${studentId}/detailed-progress`;
  const response = await fetchWithAuth(endpoint);
  return handleApiResponse(response);
}
