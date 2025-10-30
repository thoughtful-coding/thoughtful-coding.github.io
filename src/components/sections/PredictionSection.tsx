import React from "react";
import type { PredictionSectionData, UnitId, LessonId } from "../../types/data";
import InteractiveTableSection from "./InteractiveTableSection";

interface PredictionSectionProps {
  section: PredictionSectionData;
  unitId: UnitId;
  lessonId: LessonId;
}

/**
 * Prediction Section: Students predict outputs for given inputs.
 * This is a wrapper around InteractiveTableSection with mode="prediction".
 */
const PredictionSection: React.FC<PredictionSectionProps> = ({
  section,
  unitId,
  lessonId,
}) => {
  return (
    <InteractiveTableSection
      mode="prediction"
      section={section}
      unitId={unitId}
      lessonId={lessonId}
    />
  );
};

export default PredictionSection;
