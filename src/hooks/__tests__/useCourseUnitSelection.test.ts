import { renderHook, act } from "@testing-library/react";
import { vi, describe, it, expect, beforeEach } from "vitest";
import { useCourseUnitSelection } from "../useCourseUnitSelection";
import type { Course, CourseId, Unit, UnitId } from "../../types/data";

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

const mockUnits: Unit[] = [
  {
    id: "unit-1" as UnitId,
    title: "Unit 1",
    lessons: [],
    courseId: "course-1" as CourseId,
  },
  {
    id: "unit-2" as UnitId,
    title: "Unit 2",
    lessons: [],
    courseId: "course-1" as CourseId,
  },
  {
    id: "unit-3" as UnitId,
    title: "Unit 3",
    lessons: [],
    courseId: "course-2" as CourseId,
  },
];

describe("useCourseUnitSelection", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("initializes with empty selections", () => {
    const { result } = renderHook(() =>
      useCourseUnitSelection({ courses: mockCourses, units: mockUnits })
    );

    expect(result.current.selectedCourseId).toBe("");
    expect(result.current.selectedUnitId).toBe("");
    expect(result.current.unitsForSelectedCourse).toHaveLength(0);
  });

  it("filters units by selected course", () => {
    const { result } = renderHook(() =>
      useCourseUnitSelection({ courses: mockCourses, units: mockUnits })
    );

    act(() => {
      result.current.handleCourseChange("course-1" as CourseId);
    });

    expect(result.current.selectedCourseId).toBe("course-1");
    expect(result.current.unitsForSelectedCourse).toHaveLength(2);
    expect(result.current.unitsForSelectedCourse[0].id).toBe("unit-1");
  });

  it("updates URL params when course changes", () => {
    const { result } = renderHook(() =>
      useCourseUnitSelection({ courses: mockCourses, units: mockUnits })
    );

    act(() => {
      result.current.handleCourseChange("course-1" as CourseId);
    });

    expect(setSearchParamsMock).toHaveBeenCalledWith({ course: "course-1" });
  });

  it("clears unit when course changes", () => {
    const { result } = renderHook(() =>
      useCourseUnitSelection({ courses: mockCourses, units: mockUnits })
    );

    // Select course and unit
    act(() => {
      result.current.handleCourseChange("course-1" as CourseId);
    });
    act(() => {
      result.current.handleUnitChange("unit-1" as UnitId);
    });

    expect(result.current.selectedUnitId).toBe("unit-1");

    // Change course - unit should be cleared
    act(() => {
      result.current.handleCourseChange("course-2" as CourseId);
    });

    expect(result.current.selectedUnitId).toBe("");
  });

  it("builds URL params correctly", () => {
    const { result } = renderHook(() =>
      useCourseUnitSelection({ courses: mockCourses, units: mockUnits })
    );

    act(() => {
      result.current.handleCourseChange("course-1" as CourseId);
    });
    act(() => {
      result.current.handleUnitChange("unit-1" as UnitId);
    });

    const params = result.current.buildUrlParams({ lesson: "lesson-1" });
    expect(params).toEqual({
      course: "course-1",
      unit: "unit-1",
      lesson: "lesson-1",
    });
  });

  it("skips unit handling when includeUnit is false", () => {
    const { result } = renderHook(() =>
      useCourseUnitSelection({
        courses: mockCourses,
        units: mockUnits,
        includeUnit: false,
      })
    );

    act(() => {
      result.current.handleCourseChange("course-1" as CourseId);
    });

    // handleUnitChange should be a no-op
    act(() => {
      result.current.handleUnitChange("unit-1" as UnitId);
    });

    expect(result.current.selectedUnitId).toBe("");

    // buildUrlParams should not include unit
    const params = result.current.buildUrlParams();
    expect(params).toEqual({ course: "course-1" });
  });
});
