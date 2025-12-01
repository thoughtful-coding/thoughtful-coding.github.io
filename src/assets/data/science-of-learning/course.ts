import type { CourseManifest, CourseId } from "../../../types/data";

/**
 * Science of Learning course manifest.
 * Contains course metadata and unit ordering.
 */
const courseManifest: CourseManifest = {
  id: "science-of-learning" as CourseId,
  title: "The Science of Learning",
  description:
    "Learn how to use this website and understand a bit about the science of learning",
  image: "images/unit_icon_learning.svg",
  difficulty: "beginner",
  units: ["00_learning"],
};

export default courseManifest;
