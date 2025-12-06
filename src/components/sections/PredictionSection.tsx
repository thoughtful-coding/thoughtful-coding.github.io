import React from "react";
import type {
  PredictionSectionData,
  UnitId,
  LessonId,
  CourseId,
} from "../../types/data";
import InteractiveTableSection from "./InteractiveTableSection";

interface PredictionSectionProps {
  section: PredictionSectionData;
  unitId: UnitId;
  lessonId: LessonId;
  courseId: CourseId;
  lessonPath: string;
}

/**
 * Prediction Section: Students predict outputs for given inputs.
 * This is a wrapper around InteractiveTableSection with mode="prediction".
 */
const PredictionSection: React.FC<PredictionSectionProps> = ({
  section,
  unitId,
  lessonId,
  courseId,
  lessonPath,
}) => {
  return (
    <InteractiveTableSection
      mode="prediction"
      section={section}
      unitId={unitId}
      lessonId={lessonId}
      courseId={courseId}
      lessonPath={lessonPath}
    />
  );
};

export default PredictionSection;
