import type { CourseManifest, CourseId } from "../../src/types/data";

/**
 * Test "course" to allow end-to-end testing of sections via playwright.
 * Contains course metadata and unit ordering.
 */
const courseManifest: CourseManifest = {
  id: "end-to-end-tests" as CourseId,
  title: "End-to-End Tests",
  description:
    "A test-bed to allow end-to-end testing of all the sections via playwright.",
  image: "images/course_icon_end_to_end_tests.svg",
  difficulty: "beginner",
  units: ["00_end_to_end_tests"],
};

export default courseManifest;
