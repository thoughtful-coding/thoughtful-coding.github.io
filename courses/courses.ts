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
  directory: string; // Local directory name in courses/
  repo: string; // Git repository URL
  ref: string; // Branch, tag, or commit SHA
};

type CourseSource = LocalCourse | GitCourse;

const courseSources: CourseSource[] = [
  { type: "local", directory: "science-of-learning" },
  {
    type: "git",
    directory: "thoughtful-python",
    repo: "https://github.com/thoughtful-coding/thoughtful-python.git",
    ref: "main",
  },
  { type: "local", directory: "end-to-end-tests", devOnly: true },
];

export default courseSources;
export type { CourseSource, LocalCourse, GitCourse };
