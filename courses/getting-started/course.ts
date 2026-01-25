import type { CourseManifest, CourseId } from "../../src/types/data";

/**
 * "Getting Started" course manifest.
 * Contains course metadata and unit ordering.
 */
const courseManifest: CourseManifest = {
  id: "getting-started" as CourseId,
  title: "Getting Started",
  blurb:
    "Learn how to use this website and understand how it aligns with what we know about how humans learn.",
  longDescription: `This course introduces the Thoughtful Coding platform and the research-backed learning methods it employs. You'll learn how to use the interactive features effectively and understand why the lessons are structured the way they are.

#### By the End of This Course You Will...
- Understand the PRIMM learning method (Predict, Run, Investigate, Modify, Make)
- Know how reflection strengthens long-term retention
- Be comfortable navigating lessons and using the code editor
- Be ready to start learning Python with confidence`,
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
