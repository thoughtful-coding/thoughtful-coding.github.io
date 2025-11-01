# API Implementation Upgrade Plan

This document outlines improvements needed to bring the API implementation in line with the updated Swagger documentation and industry best practices.

## Priority Levels

- **P0 (Critical)**: Blocks functionality or causes bugs
- **P1 (High)**: Important for maintainability and scalability
- **P2 (Medium)**: Nice to have, improves developer experience
- **P3 (Low)**: Optional improvements

---

## Section 1: Client-Only Changes

These changes can be made to the frontend without requiring backend API changes.

### 1.1 Split Swagger Documentation into Multiple Files

**Priority: P1 (High)**

**Current State:**
- Single 1,090-line `swagger.yaml` file
- Difficult to navigate and maintain
- Git diffs span unrelated changes

**Recommended Structure:**
```
docs/api/
├── swagger.yaml                    # Main entry point (~50 lines)
├── paths/
│   ├── authentication.yaml         # /auth/* endpoints
│   ├── progress.yaml               # /progress
│   ├── reflections.yaml            # /reflections/*
│   ├── primm.yaml                  # /primm-feedback
│   ├── student-learning.yaml       # /learning-entries
│   └── instructor/
│       ├── students.yaml           # /instructor/students
│       ├── progress.yaml           # /instructor/units/.../class-progress
│       ├── assignments.yaml        # /instructor/.../assignment-submissions
│       └── detailed-progress.yaml  # /instructor/.../detailed-progress
├── schemas/
│   ├── common.yaml                 # Core types (UnitId, LessonId, etc.)
│   ├── authentication.yaml         # Auth-related schemas
│   ├── progress.yaml               # Progress-related schemas
│   ├── reflections.yaml            # Reflection schemas
│   ├── primm.yaml                  # PRIMM schemas
│   ├── instructor.yaml             # Instructor-specific schemas
│   └── errors.yaml                 # ErrorResponse
├── parameters/
│   └── common.yaml                 # Reusable parameters
└── responses/
    └── common.yaml                 # Reusable responses
```

**Implementation Steps:**
1. Install bundling tool: `npm install -D @apidevtools/swagger-cli`
2. Split current `swagger.yaml` into structure above
3. Update all `$ref` paths to point to new locations
4. Add npm scripts:
   ```json
   {
     "scripts": {
       "api:bundle": "swagger-cli bundle docs/api/swagger.yaml -o docs/api/bundled.yaml -t yaml",
       "api:validate": "swagger-cli validate docs/api/swagger.yaml"
     }
   }
   ```
5. Test bundling and validation
6. Update any CI/CD pipelines that reference the swagger file

**Benefits:**
- Easier to find and edit specific endpoints
- Better git history (changes isolated to relevant files)
- Clearer ownership of API sections
- Faster code reviews

**Files to Modify:**
- `docs/api/swagger.yaml` (split into multiple files)
- `package.json` (add scripts)
- `.gitignore` (ignore bundled.yaml if not committing it)

---

### 1.2 Implement Pagination Parameters in Client Functions

**Priority: P1 (High)**

**Current State:**
Several API functions document pagination support but don't accept parameters:

**Functions Missing Pagination:**

1. **`getFinalizedLearningEntries()`** (src/lib/apiService.ts:337)
   ```typescript
   // Current
   export async function getFinalizedLearningEntries(): Promise<ListOfFinalLearningEntriesResponse>

   // Should be
   export async function getFinalizedLearningEntries(
     limit?: number,
     lastEvaluatedKey?: Record<string, any>
   ): Promise<ListOfFinalLearningEntriesResponse>
   ```

2. **`getInstructorStudentLearningEntries()`** (src/lib/apiService.ts:390)
   ```typescript
   // Current
   export async function getInstructorStudentLearningEntries(
     studentId: UserId
   ): Promise<StudentLearningEntriesResponse>

   // Should be
   export async function getInstructorStudentLearningEntries(
     studentId: UserId,
     filter?: 'all' | 'final' | 'drafts',
     lessonIdGuid?: LessonId,
     limit?: number,
     lastEvaluatedKey?: Record<string, any>
   ): Promise<StudentLearningEntriesResponse>
   ```

3. **`getInstructorStudentPrimmSubmissions()`** (src/lib/apiService.ts:407)
   ```typescript
   // Current
   export async function getInstructorStudentPrimmSubmissions(
     studentId: UserId
   ): Promise<StudentPrimmSubmissionsResponse>

   // Should be
   export async function getInstructorStudentPrimmSubmissions(
     studentId: UserId,
     lessonIdGuid?: LessonId,
     sectionId?: SectionId,
     limit?: number,
     lastEvaluatedKey?: Record<string, any>
   ): Promise<StudentPrimmSubmissionsResponse>
   ```

**Implementation Pattern:**
```typescript
export async function getFinalizedLearningEntries(
  limit?: number,
  lastEvaluatedKey?: Record<string, any>
): Promise<ListOfFinalLearningEntriesResponse> {
  const params = new URLSearchParams();
  if (limit !== undefined) params.append('limit', limit.toString());
  if (lastEvaluatedKey) {
    params.append('lastEvaluatedKey', encodeURIComponent(JSON.stringify(lastEvaluatedKey)));
  }

  const queryString = params.toString();
  const url = `${API_GATEWAY_BASE_URL}/learning-entries${queryString ? '?' + queryString : ''}`;
  const response = await fetchWithAuth(url);
  return handleApiResponse(response);
}
```

**Benefits:**
- Enables pagination in UI (critical for scaling)
- Prevents performance issues with large datasets
- Matches API capabilities

**Files to Modify:**
- `src/lib/apiService.ts`
- Any components calling these functions (update call sites)
- Add tests in `src/lib/__tests__/apiService.test.ts`

---

### 1.3 Create Query Parameter Helper Utility

**Priority: P2 (Medium)**

**Current State:**
Query parameter building is repeated across multiple functions with inconsistent patterns.

**Recommended:**
Create a reusable utility:

```typescript
// src/lib/queryParams.ts

export interface PaginationParams {
  limit?: number;
  lastEvaluatedKey?: Record<string, any>;
}

export function buildQueryString(
  params: Record<string, string | number | boolean | Record<string, any> | undefined>
): string {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null) return;

    if (typeof value === 'object') {
      searchParams.append(key, encodeURIComponent(JSON.stringify(value)));
    } else {
      searchParams.append(key, String(value));
    }
  });

  const queryString = searchParams.toString();
  return queryString ? `?${queryString}` : '';
}

// Usage:
const queryString = buildQueryString({
  filter: 'final',
  lessonIdGuid: 'abc-123',
  limit: 20,
  lastEvaluatedKey: { PK: 'USER#123' }
});
// Returns: "?filter=final&lessonIdGuid=abc-123&limit=20&lastEvaluatedKey=%7B%22PK%22%3A%22USER%23123%22%7D"
```

**Benefits:**
- Consistent query parameter handling
- Reduces code duplication
- Easier to test and maintain

**Files to Create:**
- `src/lib/queryParams.ts`
- `src/lib/__tests__/queryParams.test.ts`

**Files to Modify:**
- `src/lib/apiService.ts` (use new utility)

---

### 1.4 Add Comprehensive API Service Tests

**Priority: P1 (High)**

**Current State:**
Basic tests exist but don't cover:
- Pagination parameter construction
- Query parameter encoding
- Error handling for all endpoints
- Retry logic

**Recommended Test Coverage:**

```typescript
// src/lib/__tests__/apiService.test.ts

describe('Pagination', () => {
  it('should construct pagination query params correctly', () => {
    // Test limit parameter
    // Test lastEvaluatedKey encoding
    // Test both parameters together
  });

  it('should handle missing pagination params', () => {
    // Test that undefined params are omitted from query string
  });
});

describe('Query Filters', () => {
  it('should apply learning entries filter correctly', () => {
    // Test filter=final, filter=drafts, filter=all
  });

  it('should apply optional filters (lessonId, sectionId)', () => {
    // Test that optional filters are included when provided
  });
});

describe('Error Handling', () => {
  it('should parse error codes from API responses', () => {
    // Test VALIDATION_ERROR, RATE_LIMIT_EXCEEDED, etc.
  });

  it('should handle malformed error responses', () => {
    // Test graceful degradation when error response is missing fields
  });
});

describe('Retry Logic', () => {
  it('should retry on 429 (rate limit)', () => {
    // Test exponential backoff
  });

  it('should not retry on 4xx errors (except 429)', () => {
    // Test that 400, 401, 403, 404 don't retry
  });
});
```

**Benefits:**
- Catches regressions early
- Documents expected behavior
- Enables confident refactoring

**Files to Modify:**
- `src/lib/__tests__/apiService.test.ts`

---

### 1.5 Add TypeScript Strict Mode for API Types

**Priority: P2 (Medium)**

**Current State:**
Some API response types use `any` or optional fields that should be required.

**Recommended:**
Audit `src/types/apiServiceTypes.ts` for:
- Replace `any` with specific types
- Mark required fields as non-optional
- Add discriminated unions for polymorphic responses

**Example Improvements:**

```typescript
// Before
export interface AssignmentSubmission {
  submissionDetails: any;  // ❌ Too loose
}

// After
export interface AssignmentSubmission<T extends "Reflection" | "PRIMM"> {
  submissionDetails: T extends "Reflection"
    ? ReflectionVersionItem[]
    : StoredPrimmSubmissionItem;  // ✅ Type-safe
}
```

**Benefits:**
- Better IDE autocomplete
- Catches type errors at compile time
- Self-documenting code

**Files to Modify:**
- `src/types/apiServiceTypes.ts`

---

### 1.6 Create API Documentation Guide

**Priority: P2 (Medium)**

**Current State:**
Swagger has concise descriptions, but developers need tutorial-style content.

**Recommended:**
Create separate developer guides:

```
docs/api/
├── getting-started.md          # Authentication flow, first API call
├── authentication-guide.md     # Token management, refresh flow
├── student-workflows.md        # Common student operations
├── instructor-workflows.md     # Common instructor operations
└── error-handling.md           # Error codes, retry strategies
```

**Sample Content (getting-started.md):**
```markdown
# Getting Started with Thoughtful Python API

## Authentication

1. Obtain a Google ID token using Google Sign-In SDK
2. Exchange for access/refresh tokens:
   ```typescript
   const { accessToken, refreshToken } = await loginWithGoogle(googleIdToken);
   ```
3. Use access token in subsequent requests (automatic via apiService)

## Your First API Call

```typescript
import { getUserProgress } from '@/lib/apiService';

// Get user's learning progress
const progress = await getUserProgress();
console.log(progress.completion);
```

## Common Workflows

### Student: Complete a Section
[Step-by-step example]

### Instructor: View Class Progress
[Step-by-step example]
```

**Benefits:**
- Onboards new developers faster
- Reduces support burden
- Complements Swagger reference docs

**Files to Create:**
- `docs/api/getting-started.md`
- `docs/api/authentication-guide.md`
- `docs/api/student-workflows.md`
- `docs/api/instructor-workflows.md`
- `docs/api/error-handling.md`

---

### 1.7 Validate Swagger File in CI/CD

**Priority: P2 (Medium)**

**Current State:**
No automated validation of Swagger changes.

**Recommended:**
Add GitHub Actions workflow (or equivalent):

```yaml
# .github/workflows/api-validation.yml
name: Validate API Documentation

on:
  pull_request:
    paths:
      - 'docs/api/**'
  push:
    branches:
      - main

jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install dependencies
        run: npm install -D @apidevtools/swagger-cli

      - name: Validate Swagger
        run: npm run api:validate

      - name: Bundle Swagger
        run: npm run api:bundle

      - name: Check for breaking changes
        run: |
          # Optional: Use oasdiff or similar to detect breaking changes
          npx oasdiff breaking docs/api/swagger.yaml docs/api/swagger-previous.yaml
```

**Benefits:**
- Catches syntax errors before merge
- Prevents broken documentation deployments
- Detects breaking API changes

**Files to Create:**
- `.github/workflows/api-validation.yml` (or equivalent for your CI system)

---

## Section 2: Changes Requiring Backend Coordination

These changes require backend API modifications or validation of current backend behavior.

### 2.1 Resolve Query Parameter Inconsistency

**Priority: P0 (Critical)**

**Issue:**
Client and Swagger disagree on filter parameter format for instructor learning entries endpoint.

**Current State:**
- **Client sends:** `?isFinal=true` (apiService.ts:402)
- **Swagger documents:** `?filter=final` (enum: 'all', 'final', 'drafts')

**Required Actions:**

1. **Verify backend implementation**
   - Check what query parameters the actual API endpoint accepts
   - Test with both `?isFinal=true` and `?filter=final`

2. **Choose standard** (recommendation: `filter=final` is more flexible)

3. **Update accordingly:**

   **Option A: Backend uses `isFinal=true`** (update Swagger)
   ```yaml
   # swagger.yaml - change parameter definition
   IsFinalFilter:
     name: isFinal
     in: query
     schema:
       type: boolean
     description: "If true, return only finalized entries"
   ```

   **Option B: Backend uses `filter=final`** (update client)
   ```typescript
   // apiService.ts:402
   export async function getInstructorStudentFinalLearningEntries(
     studentId: UserId
   ): Promise<StudentLearningEntriesResponse> {
     const endpoint = `${API_GATEWAY_BASE_URL}/instructor/students/${studentId}/learning-entries?filter=final`;
     const response = await fetchWithAuth(endpoint);
     return handleApiResponse(response);
   }
   ```

**Recommendation:** Option B (`filter=final`) is better for future extensibility.

**Benefits:**
- Eliminates runtime errors
- Ensures client and server speak same language
- Enables proper filtering functionality

**Files to Check:**
- Backend API Lambda handler for `/instructor/students/{studentId}/learning-entries`

**Files to Modify:**
- `src/lib/apiService.ts` (if choosing Option B)
- `docs/api/swagger.yaml` (if choosing Option A)

---

### 2.2 Verify Pagination Backend Support

**Priority: P1 (High)**

**Issue:**
Swagger documents pagination for multiple endpoints, but we need to verify backend actually supports it.

**Endpoints to Verify:**

1. `GET /learning-entries` - Does it accept `limit` and `lastEvaluatedKey`?
2. `GET /instructor/students/{studentId}/learning-entries` - Pagination supported?
3. `GET /instructor/students/{studentId}/primm-submissions` - Pagination supported?
4. `GET /reflections/{lessonId}/sections/{sectionId}` - Pagination supported?

**Required Actions:**

1. **Test each endpoint** with pagination parameters:
   ```bash
   # Test with limit
   curl -H "Authorization: Bearer $TOKEN" \
     "https://api.example.com/learning-entries?limit=5"

   # Test with lastEvaluatedKey
   curl -H "Authorization: Bearer $TOKEN" \
     "https://api.example.com/learning-entries?limit=5&lastEvaluatedKey=%7B%22PK%22%3A%22USER%23123%22%7D"
   ```

2. **Verify response includes `lastEvaluatedKey`**:
   ```json
   {
     "entries": [...],
     "lastEvaluatedKey": { "PK": "USER#123", "SK": "LESSON#abc" }
   }
   ```

3. **If pagination not supported:**
   - Either implement backend pagination (recommended)
   - Or remove pagination parameters from Swagger (not recommended)

**Benefits:**
- Prevents out-of-memory errors with large datasets
- Enables performant UI with infinite scroll
- Required for production scale

**Files to Check:**
- Backend DynamoDB query implementations
- Backend API Lambda handlers

**Files to Modify (if backend doesn't support):**
- Backend Lambda functions (add pagination support)
- OR `docs/api/swagger.yaml` (remove pagination params - not recommended)

---

### 2.3 Standardize Error Response Structure

**Priority: P1 (High)**

**Issue:**
Need to verify backend consistently returns error responses matching documented schema.

**Documented Error Schema:**
```typescript
{
  message: string;
  errorCode?: "VALIDATION_ERROR" | "AUTHENTICATION_FAILED" | ...;
  details?: any;
}
```

**Required Actions:**

1. **Audit all backend error responses**
   - Lambda function error handlers
   - API Gateway error mappings
   - Validation middleware

2. **Ensure consistency:**
   - All 4xx/5xx responses return ErrorResponse schema
   - Error codes match documented values
   - Details field provides useful debugging info

3. **Test error scenarios:**
   ```bash
   # 400 - Missing required field
   # 401 - Invalid token
   # 403 - Insufficient permissions
   # 404 - Resource not found
   # 429 - Rate limit exceeded
   # 500 - Internal server error
   # 503 - AI service unavailable
   ```

4. **Add backend error mapping if needed:**
   ```python
   # Example Lambda error handler
   ERROR_CODES = {
       ValidationError: "VALIDATION_ERROR",
       AuthenticationError: "AUTHENTICATION_FAILED",
       PermissionError: "AUTHORIZATION_FAILED",
       # ...
   }

   def format_error_response(error):
       return {
           "message": str(error),
           "errorCode": ERROR_CODES.get(type(error)),
           "details": error.details if hasattr(error, 'details') else None
       }
   ```

**Benefits:**
- Predictable error handling in client
- Better debugging experience
- Enables intelligent retry logic

**Files to Check:**
- All backend Lambda function error handlers
- API Gateway response templates

**Files to Modify (if needed):**
- Backend error handling utilities
- API Gateway configuration

---

### 2.4 Implement Rate Limiting (if not already present)

**Priority: P2 (Medium)**

**Issue:**
Swagger documents rate limits, but backend enforcement needs verification.

**Documented Rate Limits:**
- AI endpoints: 10 requests/minute per user
- Other endpoints: 100 requests/minute per user

**Required Actions:**

1. **Verify rate limiting exists:**
   - Check API Gateway throttling settings
   - Check Lambda function rate limiting logic

2. **If not implemented, add:**
   ```python
   # Example: DynamoDB-based rate limiting
   from datetime import datetime, timedelta

   def check_rate_limit(user_id, endpoint_type):
       limit = 10 if endpoint_type == "ai" else 100
       window = timedelta(minutes=1)

       # Query recent requests from DynamoDB
       recent_requests = get_requests_in_window(user_id, window)

       if len(recent_requests) >= limit:
           raise RateLimitError(
               f"Rate limit exceeded: {limit} requests per minute",
               retry_after=60
           )

       # Record this request
       record_request(user_id, datetime.now())
   ```

3. **Ensure 429 responses include:**
   - `Retry-After` header
   - Clear error message
   - Error code: `RATE_LIMIT_EXCEEDED`

4. **Add rate limit headers to successful responses:**
   ```
   X-RateLimit-Limit: 100
   X-RateLimit-Remaining: 73
   X-RateLimit-Reset: 1609459200
   ```

**Benefits:**
- Protects backend from abuse
- Fair resource allocation
- Better client-side rate limit handling

**Files to Check:**
- API Gateway throttling configuration
- Lambda function decorators/middleware

**Files to Modify (if needed):**
- Backend rate limiting middleware
- Lambda function response headers

---

### 2.5 Add Comprehensive Backend API Tests

**Priority: P1 (High)**

**Issue:**
Backend needs tests to prevent regressions and validate Swagger accuracy.

**Required Test Coverage:**

```python
# tests/test_api_endpoints.py

class TestAuthentication:
    def test_login_with_valid_google_token(self):
        # Should return access + refresh tokens
        pass

    def test_login_with_invalid_google_token(self):
        # Should return 401 with proper error structure
        pass

    def test_refresh_token_flow(self):
        # Should return new tokens and invalidate old refresh token
        pass

class TestPagination:
    def test_pagination_with_limit(self):
        # Should respect limit parameter
        # Should return lastEvaluatedKey if more results exist
        pass

    def test_pagination_with_last_evaluated_key(self):
        # Should return next page of results
        pass

    def test_pagination_exhausted(self):
        # Should not include lastEvaluatedKey when no more results
        pass

class TestErrorHandling:
    def test_validation_error_structure(self):
        # Should match ErrorResponse schema
        # Should include errorCode: "VALIDATION_ERROR"
        pass

    def test_rate_limit_error_structure(self):
        # Should return 429
        # Should include Retry-After header
        pass

class TestInstructorEndpoints:
    def test_learning_entries_filter_final(self):
        # Should only return finalized entries
        pass

    def test_learning_entries_filter_drafts(self):
        # Should only return draft entries
        pass
```

**Benefits:**
- Catches backend bugs before production
- Validates Swagger accuracy
- Enables confident backend refactoring

**Files to Create:**
- Backend test files for each endpoint category

---

### 2.6 Document Backend API Versioning Strategy

**Priority: P2 (Medium)**

**Issue:**
No clear versioning strategy for handling breaking changes.

**Recommended Strategy:**

1. **URL-based versioning:**
   ```
   https://api.example.com/v1/progress
   https://api.example.com/v2/progress  # Breaking changes
   ```

2. **Maintain backwards compatibility for N-1 versions**
   - Keep v1 running while v2 is adopted
   - Deprecate v1 after 6-12 months

3. **Semantic versioning for Swagger:**
   - Major: Breaking changes (v1.0.0 → v2.0.0)
   - Minor: New endpoints/fields (v1.0.0 → v1.1.0)
   - Patch: Bug fixes, docs (v1.0.0 → v1.0.1)

4. **Deprecation process:**
   - Add `deprecated: true` to Swagger
   - Include deprecation warnings in responses
   - Communicate timeline to clients

**Benefits:**
- Smooth API evolution
- No breaking existing clients
- Clear communication of changes

**Files to Create:**
- `docs/api/versioning-policy.md`

---

## Summary of Priorities

### P0 (Critical) - Do First
1. [Backend] Resolve query parameter inconsistency (Section 2.1)

### P1 (High) - Do Soon
1. [Client] Split Swagger documentation (Section 1.1)
2. [Client] Implement pagination parameters (Section 1.2)
3. [Client] Add comprehensive API service tests (Section 1.4)
4. [Backend] Verify pagination backend support (Section 2.2)
5. [Backend] Standardize error response structure (Section 2.3)
6. [Backend] Add comprehensive backend API tests (Section 2.5)

### P2 (Medium) - Nice to Have
1. [Client] Create query parameter helper utility (Section 1.3)
2. [Client] Add TypeScript strict mode for API types (Section 1.5)
3. [Client] Create API documentation guide (Section 1.6)
4. [Client] Validate Swagger file in CI/CD (Section 1.7)
5. [Backend] Implement rate limiting if missing (Section 2.4)
6. [Backend] Document versioning strategy (Section 2.6)

### P3 (Low) - Future Enhancements
- Generate TypeScript client from Swagger
- Add API usage analytics/monitoring
- Create interactive API playground

---

## Notes

- All client changes can be made independently
- Backend changes require coordination with backend team/deployment
- Consider creating GitHub issues for each item to track progress
- Test thoroughly in staging before production deployment
