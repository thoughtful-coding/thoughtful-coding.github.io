import type { CourseManifest, CourseId } from "../../../types/data";

/**
 * Introduction to Python course manifest.
 * Contains course metadata and unit ordering.
 */
const courseManifest: CourseManifest = {
  id: "intro-python" as CourseId,
  title: "Introduction to Python",
  description:
    "Learn Python programming from scratch with interactive lessons and exercises",
  image: "images/python-logo.svg",
  difficulty: "beginner",
  units: [
    "00_intro",
    "01_variables",
    "02_strings",
    "03_functions",
    "04_functions_advanced",
    "05_conditionals",
    "06_loops",
    "07_loops_advanced",
    "08_lists_intro",
    "09_lists_advanced",
    "10_functions_return",
    "12_end_to_end_tests",
  ],
};

export default courseManifest;
