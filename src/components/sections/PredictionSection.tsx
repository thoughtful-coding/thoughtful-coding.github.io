import React from "react";
import type { PredictionSectionData, UnitId, LessonId } from "../../types/data";
import InteractiveTableSection from "./InteractiveTableSection";

interface PredictionSectionProps {
  section: PredictionSectionData;
  unitId: UnitId;
  lessonId: LessonId;
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
  lessonPath,
}) => {
  return (
    <InteractiveTableSection
      mode="prediction"
      section={section}
      unitId={unitId}
      lessonId={lessonId}
      lessonPath={lessonPath}
    />
  );
};

export default PredictionSection;
