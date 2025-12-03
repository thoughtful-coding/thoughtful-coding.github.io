/**
 * Course source configuration.
 * Supports both local courses (embedded in repo) and git-based courses (fetched during build).
 */

type LocalCourse = {
  type: "local";
  directory: string;
  devOnly?: boolean; // If true, excluded from production builds
};

type GitCourse = {
  type: "git";
  directory: string; // Where to place course in src/assets/data/
  repo: string; // Git repository URL
  ref: string; // Branch, tag, or commit SHA
};

type CourseSource = LocalCourse | GitCourse;

const courseSources: CourseSource[] = [
  { type: "local", directory: "science-of-learning" },
  { type: "local", directory: "intro-python" },
  { type: "local", directory: "end-to-end-tests", devOnly: true },
  // Example git course (uncomment and modify to use):
  // {
  //   type: "git",
  //   directory: "advanced-python",
  //   repo: "https://github.com/someone/advanced-python-course",
  //   ref: "v1.0.0"
  // },
];

export default courseSources;
export type { CourseSource, LocalCourse, GitCourse };
