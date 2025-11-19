import type { Unit, Lesson, LessonId } from "../types/data";
import type {
  UnitProgressProfile,
  LessonProgressProfile,
} from "../types/apiServiceTypes";
import * as dataHelpers from "./dataHelpers";

/**
 * Fetches all lesson data from units and builds a map of LessonId -> Lesson
 * This is used to map GUIDs to human-readable titles and section data
 */
export async function buildLessonDataMap(
  units: Unit[]
): Promise<Map<LessonId, Lesson & { guid: LessonId }>> {
  const lessonMap = new Map<LessonId, Lesson & { guid: LessonId }>();

  for (const unit of units) {
    const lessons = await dataHelpers.loadLessonsForUnit(unit);
    lessons.forEach((lesson) => {
      lessonMap.set(lesson.guid, lesson);
    });
  }

  return lessonMap;
}

/**
 * Enriches student progress profile with human-readable titles from lesson data
 */
export function enrichStudentProfile(
  profile: UnitProgressProfile[],
  units: Unit[],
  lessonDataMap: Map<LessonId, Lesson & { guid: LessonId }>
): UnitProgressProfile[] {
  const enriched: UnitProgressProfile[] = profile.map((unit) => {
    const unitData = units.find((u) => u.id === unit.unitId);

    return {
      ...unit,
      unitTitle: unitData?.title || unit.unitTitle || unit.unitId,
      lessons: unit.lessons.map((lesson) => {
        const lessonData = lessonDataMap.get(lesson.lessonId as LessonId);

        return {
          ...lesson,
          lessonTitle:
            lessonData?.title || lesson.lessonTitle || lesson.lessonId,
          sections: lesson.sections.map((section) => {
            const sectionData = lessonData?.sections.find(
              (s) => s.id === section.sectionId
            );

            return {
              ...section,
              sectionTitle:
                sectionData?.title || section.sectionTitle || section.sectionId,
            };
          }),
        };
      }),
    };
  });

  return enriched;
}

/**
 * Sorts units by curriculum order (matching the order in the units array)
 */
export function sortUnitsByCurriculumOrder(
  profile: UnitProgressProfile[],
  units: Unit[]
): UnitProgressProfile[] {
  const unitOrderMap = new Map<string, number>();
  units.forEach((unit, index) => {
    unitOrderMap.set(unit.id, index);
  });

  return [...profile].sort((a, b) => {
    const orderA = unitOrderMap.get(a.unitId) ?? 999;
    const orderB = unitOrderMap.get(b.unitId) ?? 999;
    return orderA - orderB;
  });
}

/**
 * Builds a map of LessonId -> lesson title for quick lookups
 */
export async function buildLessonTitleMap(
  units: Unit[]
): Promise<Map<LessonId, string>> {
  const titleMap = new Map<LessonId, string>();

  for (const unit of units) {
    const lessons = await dataHelpers.loadLessonsForUnit(unit);
    lessons.forEach((lesson) => {
      titleMap.set(lesson.guid, lesson.title);
    });
  }

  return titleMap;
}
