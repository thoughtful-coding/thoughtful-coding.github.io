import type { CourseManifest, CourseId } from "../../../types/data";

/**
 * "Getting Started" course manifest.
 * Contains course metadata and unit ordering.
 */
const courseManifest: CourseManifest = {
  id: "getting-started" as CourseId,
  title: "Getting Started",
  description:
    "Learn how to use this website and understand how it aligns with what we know about how humans learn.",
  image: "images/course_icon_getting_started.svg",
  difficulty: "beginner",
  units: [
    "00_science_of_learning",
    "01_instructor_basics",
    "02_creating_content",
    "03_power_users",
  ],
};

export default courseManifest;
