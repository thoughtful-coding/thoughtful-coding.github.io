import React from "react";
import type { CoverageSectionData, LessonId, UnitId } from "../../types/data";
import InteractiveTableSection from "./InteractiveTableSection";

interface CoverageSectionProps {
  section: CoverageSectionData;
  unitId: UnitId;
  lessonId: LessonId;
}

/**
 * Coverage Section: Students fill in inputs to match expected outputs.
 * This is a wrapper around InteractiveTableSection with mode="coverage".
 */
const CoverageSection: React.FC<CoverageSectionProps> = ({
  section,
  unitId,
  lessonId,
}) => {
  return (
    <InteractiveTableSection
      mode="coverage"
      section={section}
      unitId={unitId}
      lessonId={lessonId}
    />
  );
};

export default CoverageSection;
