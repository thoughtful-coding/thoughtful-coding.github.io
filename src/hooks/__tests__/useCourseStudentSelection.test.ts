import { renderHook, act } from "@testing-library/react";
import { vi, describe, it, expect, beforeEach } from "vitest";
import { useCourseStudentSelection } from "../useCourseStudentSelection";
import type { Course, CourseId } from "../../types/data";
import type { InstructorStudentInfo } from "../../types/apiServiceTypes";

// Mock react-router-dom
const setSearchParamsMock = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useSearchParams: () => [new URLSearchParams(), setSearchParamsMock],
  };
});

const mockCourses: Course[] = [
  {
    id: "course-1" as CourseId,
    title: "Intro to Python",
    description: "Learn Python",
    image: "python.png",
    units: [],
  },
  {
    id: "course-2" as CourseId,
    title: "Advanced Python",
    description: "More Python",
    image: "python2.png",
    units: [],
  },
];

const mockStudents: InstructorStudentInfo[] = [
  {
    studentId: "student-123",
    studentName: "Alice",
    studentEmail: "alice@example.com",
  },
  {
    studentId: "student-456",
    studentName: "Bob",
    studentEmail: "bob@example.com",
  },
];

describe("useCourseStudentSelection", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("initializes with empty selections", () => {
    const { result } = renderHook(() =>
      useCourseStudentSelection({
        courses: mockCourses,
        permittedStudents: mockStudents,
      })
    );

    expect(result.current.selectedCourseId).toBe("");
    expect(result.current.selectedStudentId).toBe("");
  });

  it("updates URL params when course changes", () => {
    const { result } = renderHook(() =>
      useCourseStudentSelection({
        courses: mockCourses,
        permittedStudents: mockStudents,
      })
    );

    act(() => {
      result.current.handleCourseChange("course-1" as CourseId);
    });

    expect(result.current.selectedCourseId).toBe("course-1");
    expect(setSearchParamsMock).toHaveBeenCalledWith({ course: "course-1" });
  });

  it("preserves student in URL when course changes", () => {
    const { result } = renderHook(() =>
      useCourseStudentSelection({
        courses: mockCourses,
        permittedStudents: mockStudents,
      })
    );

    // Select course and student
    act(() => {
      result.current.handleCourseChange("course-1" as CourseId);
    });
    act(() => {
      result.current.handleStudentChange("student-123");
    });

    expect(result.current.selectedStudentId).toBe("student-123");

    // Change course - student should be preserved
    act(() => {
      result.current.handleCourseChange("course-2" as CourseId);
    });

    expect(result.current.selectedStudentId).toBe("student-123");
    expect(setSearchParamsMock).toHaveBeenLastCalledWith({
      course: "course-2",
      student: "student-123",
    });
  });

  it("updates URL params when student changes", () => {
    const { result } = renderHook(() =>
      useCourseStudentSelection({
        courses: mockCourses,
        permittedStudents: mockStudents,
      })
    );

    act(() => {
      result.current.handleCourseChange("course-1" as CourseId);
    });
    act(() => {
      result.current.handleStudentChange("student-123");
    });

    expect(setSearchParamsMock).toHaveBeenLastCalledWith({
      course: "course-1",
      student: "student-123",
    });
  });

  it("builds URL params correctly", () => {
    const { result } = renderHook(() =>
      useCourseStudentSelection({
        courses: mockCourses,
        permittedStudents: mockStudents,
      })
    );

    act(() => {
      result.current.handleCourseChange("course-1" as CourseId);
    });
    act(() => {
      result.current.handleStudentChange("student-123");
    });

    const params = result.current.buildUrlParams({ extra: "value" });
    expect(params).toEqual({
      course: "course-1",
      student: "student-123",
      extra: "value",
    });
  });

  it("preserves student when course is deselected", () => {
    const { result } = renderHook(() =>
      useCourseStudentSelection({
        courses: mockCourses,
        permittedStudents: mockStudents,
      })
    );

    act(() => {
      result.current.handleCourseChange("course-1" as CourseId);
    });
    act(() => {
      result.current.handleStudentChange("student-123");
    });
    act(() => {
      result.current.handleCourseChange("");
    });

    // Student preserved in URL even without course
    expect(setSearchParamsMock).toHaveBeenLastCalledWith({
      student: "student-123",
    });
  });

  it("clears URL params when no course and no student", () => {
    const { result } = renderHook(() =>
      useCourseStudentSelection({
        courses: mockCourses,
        permittedStudents: mockStudents,
      })
    );

    act(() => {
      result.current.handleCourseChange("course-1" as CourseId);
    });
    act(() => {
      result.current.handleCourseChange("");
    });

    expect(setSearchParamsMock).toHaveBeenLastCalledWith({});
  });
});
