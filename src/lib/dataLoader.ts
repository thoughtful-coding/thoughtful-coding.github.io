import type {
  Unit,
  Lesson,
  LessonId,
  UnitId,
  LessonReference,
  AnyLessonSectionData,
  SectionId,
  LessonPath,
  UnitManifest,
  CourseManifest,
  Course,
  CourseId,
} from "../types/data";

// Import course sources list
import courseSources from "../../courses/courses";

// Glob pattern to find course.ts manifest files
const courseManifestModules = import.meta.glob(
  "../../courses/*/course.ts"
) as Record<string, () => Promise<{ default: CourseManifest }>>;

// Use import.meta.glob to discover all unit.ts manifest files (now nested in course folders)
const unitManifestModules = import.meta.glob(
  "../../courses/*/*/unit.ts"
) as Record<string, () => Promise<{ default: UnitManifest }>>;

// This glob pattern finds all .ts files under courses/ that could be lessons.
// Vite will handle the actual dynamic importing.
// Apply a type assertion to import.meta.glob to match the expected type.
const lessonFileModules = import.meta.glob("../../courses/**/*.ts") as Record<
  string,
  () => Promise<{ default: Lesson }>
>;

// Export course-related functions
export function getCourses(): Course[] {
  if (!coursesCache) {
    // If processUnitsData hasn't been called yet, return empty array
    return [];
  }
  return coursesCache;
}

export async function getCoursesAsync(): Promise<Course[]> {
  if (!unitsDataProcessed) {
    // Wait for initial loading if still in progress
    if (unitsDataLoadingPromise) {
      await unitsDataLoadingPromise;
    } else {
      // Fallback: start loading now
      console.warn(
        "getCoursesAsync called before data was processed. Attempting to process now."
      );
      await processUnitsData();
    }
  }
  return coursesCache || [];
}

export function getCourse(courseId: CourseId): Course | undefined {
  return getCourses().find((c) => c.id === courseId);
}

// Caches to store loaded data and prevent redundant fetching (now course-scoped)
let coursesCache: Course[] | null = null; // Loaded courses with units
let allUnitsCache: Unit[] | null = null; // Legacy - keeping for backwards compat
const courseUnitsCache: Map<CourseId, Unit[]> = new Map(); // Course → Units
const guidToPathMap: Map<CourseId, Map<LessonId, LessonPath>> = new Map(); // Course → (GUID → Path)
let lessonIdToPathMap: Map<LessonId, LessonPath> | null = null; // Global GUID → Path (for backwards compat)
let lessonPathToIdMap: Map<LessonPath, LessonId> | null = null; // Global Path → GUID
const lessonContentCache: Map<LessonPath, Lesson | null> = new Map(); // Path → Lesson (caching by path now)

// Flag to ensure units data is processed only once
let unitsDataProcessed = false;
let unitsDataLoadingPromise: Promise<void> | null = null;

/**
 * Extracts the course and unit directory from a unit manifest path.
 * Example: "../../courses/intro-python/00_intro/unit.ts" → { courseId: "intro-python", unitDir: "00_intro" }
 */
function extractCourseAndUnit(
  manifestPath: string
): { courseId: string; unitDir: string } | null {
  const match = manifestPath.match(
    /\.\.\/\.\.\/courses\/([^/]+)\/([^/]+)\/unit\.ts/
  );
  return match ? { courseId: match[1], unitDir: match[2] } : null;
}

/**
 * Loads all course and unit manifests and processes them into Course/Unit objects.
 * This function is designed to run only once.
 */
async function processUnitsData(): Promise<void> {
  if (unitsDataProcessed) {
    return;
  }

  try {
    console.log("Loading courses from course.ts files...");

    // Build a map of (courseId, unitDir) → manifest loader for units
    const manifestLoaderMap = new Map<
      string,
      () => Promise<{ default: UnitManifest }>
    >();
    for (const [manifestPath, loader] of Object.entries(unitManifestModules)) {
      const extracted = extractCourseAndUnit(manifestPath);
      if (extracted) {
        const key = `${extracted.courseId}/${extracted.unitDir}`;
        manifestLoaderMap.set(key, loader);
      } else {
        console.warn(
          `Could not extract course/unit from path: ${manifestPath}`
        );
      }
    }

    // Load course manifests
    const courses: Course[] = [];

    for (const courseSource of courseSources) {
      const courseDir = courseSource.directory;
      const coursePath = `../../courses/${courseDir}/course.ts`;
      const loader = courseManifestModules[coursePath];

      if (!loader) {
        console.error(`No course.ts manifest found for ${courseDir}`);
        continue;
      }

      try {
        const module = await loader();
        const manifest = module.default;

        // Validate manifest
        if (!manifest.id || !manifest.title || !Array.isArray(manifest.units)) {
          console.error(`Invalid course manifest in ${courseDir}/course.ts`);
          continue;
        }

        // Resolve course image path
        const resolvedImagePath = manifest.image.startsWith("/")
          ? manifest.image
          : `/data/${courseDir}/${manifest.image}`;

        // Create course object (units will be populated below)
        const course: Course = {
          id: manifest.id,
          title: manifest.title,
          description: manifest.description,
          image: resolvedImagePath,
          difficulty: manifest.difficulty,
          units: [], // Will be populated below
        };

        courses.push(course);
        console.log(`Loaded course: ${manifest.title} (${courseDir})`);
      } catch (error) {
        console.error(
          `Error loading course manifest from ${courseDir}/course.ts:`,
          error
        );
      }
    }

    // Process units for each course
    const allUnits: Unit[] = [];

    for (const course of courses) {
      // Get course manifest to find unit directories
      const coursePath = `../../courses/${course.id}/course.ts`;
      const courseLoader = courseManifestModules[coursePath];

      if (!courseLoader) continue;

      const courseModule = await courseLoader();
      const courseManifest = courseModule.default;
      const unitDirs = courseManifest.units;
      const courseUnits: Unit[] = [];

      for (const unitDir of unitDirs) {
        const loaderKey = `${course.id}/${unitDir}`;
        const loader = manifestLoaderMap.get(loaderKey);

        if (!loader) {
          console.error(
            `Unit directory "${unitDir}" specified in ${course.id}/units.ts but no unit.ts manifest found`
          );
          continue;
        }

        try {
          const module = await loader();
          const manifest = module.default;

          // Validate manifest
          if (
            !manifest.id ||
            !manifest.title ||
            !Array.isArray(manifest.lessons)
          ) {
            console.error(
              `Invalid unit manifest in ${course.id}/${unitDir}/unit.ts`
            );
            continue;
          }

          // Resolve relative paths to course-scoped absolute paths
          const lessonReferences: LessonReference[] = manifest.lessons.map(
            (relativePath) => ({
              path: `${course.id}/${unitDir}/${relativePath}` as LessonPath,
            })
          );

          const resolvedImagePath = `/data/${course.id}/${unitDir}/${manifest.image}`;

          const unit: Unit = {
            id: manifest.id,
            title: manifest.title,
            description: manifest.description,
            image: resolvedImagePath,
            lessons: lessonReferences,
            courseId: course.id,
          };

          courseUnits.push(unit);
          allUnits.push(unit);

          console.log(
            `Loaded unit: ${manifest.title} (${course.id}/${unitDir})`
          );
        } catch (error) {
          console.error(
            `Error loading unit manifest from ${course.id}/${unitDir}/unit.ts:`,
            error
          );
        }
      }

      // Populate the course's units
      course.units = courseUnits;
      courseUnitsCache.set(course.id, courseUnits);
    }

    // Store courses in cache
    coursesCache = courses;
    allUnitsCache = allUnits;

    // Initialize empty maps (will be populated lazily as lessons are loaded)
    lessonIdToPathMap = new Map();
    lessonPathToIdMap = new Map();

    unitsDataProcessed = true;
    console.log(
      `Loaded ${courses.length} courses with ${allUnits.length} units. Lesson metadata will be loaded on demand.`
    );
  } catch (error) {
    console.error("Failed to process unit manifests:", error);
    unitsDataProcessed = false;
    allUnitsCache = [];
    lessonIdToPathMap = new Map();
    lessonPathToIdMap = new Map();
  }
}

// Start loading units data when the module is first loaded.
unitsDataLoadingPromise = processUnitsData();

// Exported functions now rely on the processed data.
export async function fetchUnitsData(): Promise<{ units: Unit[] }> {
  if (!unitsDataProcessed) {
    // Wait for initial loading if still in progress
    if (unitsDataLoadingPromise) {
      await unitsDataLoadingPromise;
    } else {
      // Fallback: start loading now
      console.warn(
        "fetchUnitsData called before units data was processed. Attempting to process now."
      );
      await processUnitsData();
    }

    if (!unitsDataProcessed) {
      throw new Error("Unit data could not be processed.");
    }
  }
  return { units: allUnitsCache || [] };
}

export async function fetchUnitById(unitId: UnitId): Promise<Unit | null> {
  if (!unitsDataProcessed) await fetchUnitsData(); // Ensure data is processed
  return allUnitsCache?.find((unit) => unit.id === unitId) || null;
}

export async function getLessonGuidByPath(
  lessonPath: LessonPath
): Promise<LessonId | null> {
  if (!unitsDataProcessed) await fetchUnitsData();

  // Check if we already have this mapping
  let lessonId = lessonPathToIdMap?.get(lessonPath);

  // If not, load the lesson to build the mapping
  if (!lessonId) {
    const lesson = await fetchLessonData(lessonPath);
    if (lesson) {
      lessonId = lesson.guid;
    }
  }

  return lessonId || null;
}

/**
 * Loads a lesson by courseId and lesson path.
 * This is the new course-aware API for loading lessons.
 * @param courseId - The course ID (e.g., "intro-python")
 * @param lessonPath - The relative lesson path within the course (e.g., "00_intro/lessons/00_intro_python")
 */
export async function loadLesson(
  courseId: CourseId,
  lessonPath: string
): Promise<Lesson> {
  if (!unitsDataProcessed) await fetchUnitsData();

  // Build full path with courseId prefix
  const fullPath = `${courseId}/${lessonPath}` as LessonPath;

  // Check cache
  if (lessonContentCache.has(fullPath)) {
    const cached = lessonContentCache.get(fullPath);
    if (cached) return cached;
    throw new Error(`Failed to load lesson at ${fullPath}`);
  }

  const moduleKey = `../../courses/${fullPath}.ts`;
  const moduleLoader = lessonFileModules[moduleKey];

  if (!moduleLoader) {
    console.error(
      `Lesson module not found for key: '${moduleKey}' (Path: ${fullPath})`
    );
    lessonContentCache.set(fullPath, null);
    throw new Error(`Lesson not found: ${courseId}/${lessonPath}`);
  }

  try {
    const module = await moduleLoader();
    const lessonData = module.default as Lesson;
    const lessonId = lessonData.guid;

    // VALIDATE: Check for duplicate GUIDs
    if (lessonIdToPathMap?.has(lessonId)) {
      const existingPath = lessonIdToPathMap.get(lessonId);
      if (existingPath !== fullPath) {
        console.error(
          `Data Integrity Error: Duplicate LessonId (GUID) found: '${lessonId}'. ` +
            `It exists in both '${existingPath}' and '${fullPath}'. ` +
            `Each lesson GUID must be globally unique.`
        );
        lessonContentCache.set(fullPath, null);
        throw new Error(`Duplicate lesson GUID: ${lessonId}`);
      }
    }

    // BUILD MAPS: Add this lesson's GUID↔Path mappings (globally unique)
    lessonIdToPathMap?.set(lessonId, fullPath);
    lessonPathToIdMap?.set(fullPath, lessonId);

    // Also build course-scoped GUID mapping
    if (!guidToPathMap.has(courseId)) {
      guidToPathMap.set(courseId, new Map());
    }
    guidToPathMap.get(courseId)!.set(lessonId, fullPath);

    // Validate section IDs
    if (lessonData.sections) {
      const seenSectionIds = new Set<SectionId>();
      for (const section of lessonData.sections) {
        if (seenSectionIds.has(section.id)) {
          console.error(
            `Data Integrity Error: Duplicate sectionId '${section.id}' found within lesson file: '${fullPath}.ts'. Section IDs must be unique per lesson.`
          );
        } else {
          seenSectionIds.add(section.id);
        }
      }
    }

    lessonContentCache.set(fullPath, lessonData);
    return lessonData;
  } catch (error) {
    console.error(
      `Error loading lesson module for '${moduleKey}' (Path: ${fullPath}):`,
      error
    );
    lessonContentCache.set(fullPath, null);
    throw error;
  }
}

/**
 * @deprecated Use loadLesson(courseId, lessonPath) instead
 */
export async function fetchLessonData(
  lessonFilePath: LessonPath
): Promise<Lesson | null> {
  if (!unitsDataProcessed) await fetchUnitsData();

  // Check if we already loaded this lesson by path
  if (lessonContentCache.has(lessonFilePath)) {
    return lessonContentCache.get(lessonFilePath) || null;
  }

  const moduleKey = `../../courses/${lessonFilePath}.ts`;
  if (lessonFileModules[moduleKey]) {
    try {
      const moduleLoader = lessonFileModules[moduleKey];
      const module = await moduleLoader();
      const lessonData = module.default as Lesson;
      const lessonId = lessonData.guid;

      // BUILD MAPS: Add this lesson's GUID↔Path mappings
      lessonIdToPathMap?.set(lessonId, lessonFilePath);
      lessonPathToIdMap?.set(lessonFilePath, lessonId);

      // Validate section IDs
      if (lessonData.sections) {
        const seenSectionIds = new Set<SectionId>();
        for (const section of lessonData.sections) {
          if (seenSectionIds.has(section.id)) {
            console.error(
              `Data Integrity Error: Duplicate sectionId '${section.id}' found within lesson file: '${lessonFilePath}.ts'. Section IDs must be unique per lesson.`
            );
          } else {
            seenSectionIds.add(section.id);
          }
        }
      }

      lessonContentCache.set(lessonFilePath, lessonData);
      return lessonData;
    } catch (error) {
      console.error(
        `Error dynamically loading lesson module for key '${moduleKey}' (Path: ${lessonFilePath}):`,
        error
      );
      return null;
    }
  } else {
    console.error(
      `Lesson module importer not found for key: '${moduleKey}' (Path: ${lessonFilePath}).`
    );
    return null;
  }
}

export function getRequiredSectionsForLesson(lesson: Lesson): SectionId[] {
  if (!lesson || !lesson.sections) {
    return [];
  }
  const requiredKinds: Array<AnyLessonSectionData["kind"]> = [
    "Observation",
    "Testing",
    "Prediction",
    "MultipleChoice",
    "MultipleSelection",
    "Turtle",
    "Reflection",
    "Coverage",
    "PRIMM",
    "Debugger",
  ];

  return lesson.sections
    .filter((section) => requiredKinds.includes(section.kind))
    .map((section) => section.id);
}

export async function getLessonPath(
  lessonId: LessonId
): Promise<string | null> {
  if (!unitsDataProcessed) await fetchUnitsData(); // Ensure map is populated
  return lessonIdToPathMap?.get(lessonId) || null;
}

export function hasReviewableAssignments(lesson: Lesson): boolean {
  if (!lesson || !lesson.sections) {
    return false;
  }
  return lesson.sections.some(
    (s) => s.kind === "Reflection" || s.kind === "PRIMM"
  );
}

export function getLessonPathSync(lessonId: LessonId): LessonPath | null {
  if (!lessonIdToPathMap) {
    console.error(
      "dataLoader has not been initialized. Cannot call getLessonPathSync."
    );
    return null;
  }
  return lessonIdToPathMap.get(lessonId) || null;
}

/**
 * Get lesson path from GUID within a specific course.
 * Useful for filtering learning entries by course.
 */
export function getLessonPathFromGuid(
  courseId: CourseId,
  guid: LessonId
): string | undefined {
  return guidToPathMap.get(courseId)?.get(guid);
}
