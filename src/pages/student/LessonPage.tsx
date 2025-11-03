// src/pages/LessonPage.tsx
import React, { useState, useEffect, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  fetchLessonData,
  fetchUnitsData,
  getLessonGuidByPath,
} from "../../lib/dataLoader";
import type {
  Lesson,
  AnyLessonSectionData,
  UnitId,
  LessonReference,
  LessonPath,
  LessonId,
  SectionId,
} from "../../types/data";

import InformationSection from "../../components/sections/InformationSection";
import ObservationSection from "../../components/sections/ObservationSection";
import TestingSection from "../../components/sections/TestingSection";
import PredictionSection from "../../components/sections/PredictionSection";
import MultipleChoiceSection from "../../components/sections/MultipleChoiceSection";
import MultipleSelectionSection from "../../components/sections/MultipleSelectionSection";
import ReflectionSection from "../../components/sections/ReflectionSection";
import CoverageSection from "../../components/sections/CoverageSection";
import PRIMMSection from "../../components/sections/PRIMMSection";
import DebuggerSection from "../../components/sections/DebuggerSection";

import LessonNavigation from "../../components/LessonNavigation";
import LessonSidebar from "../../components/LessonSidebar";
import LoadingSpinner from "../../components/LoadingSpinner";

import styles from "./LessonPage.module.css";
import { useCompletedSectionsForLesson } from "../../stores/progressStore";
import MatchingSection from "../../components/sections/MatchingSection";

const LessonPage: React.FC = () => {
  const params = useParams();
  const lessonPath = params["*"] as LessonPath;

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [lessonGuid, setLessonGuid] = useState<LessonId | null>(null); // State for the resolved GUID
  const [unitLessons, setUnitLessons] = useState<LessonReference[]>([]);
  const [currentIndexInUnit, setCurrentIndexInUnit] = useState<number>(-1);
  const [parentUnitId, setParentUnitId] = useState<UnitId | null>(null);

  const completedSectionsMap = useCompletedSectionsForLesson(
    parentUnitId,
    lessonGuid
  );

  useEffect(() => {
    let isMounted = true;
    const loadData = async () => {
      if (!lessonPath) {
        if (isMounted) {
          setError("No Lesson Path provided in URL.");
          setIsLoading(false);
        }
        return;
      }

      setIsLoading(true);
      setError(null);
      setLesson(null);
      setLessonGuid(null);
      setUnitLessons([]);
      setCurrentIndexInUnit(-1);
      setParentUnitId(null);

      try {
        const guid = await getLessonGuidByPath(lessonPath);
        if (!isMounted) return;

        if (!guid) {
          setError(
            `Lesson not found for path: '${lessonPath}'. Please check the URL or unit manifest.`
          );
          setIsLoading(false);
          return;
        }

        setLessonGuid(guid);
        const [fetchedLesson, unitsData] = await Promise.all([
          fetchLessonData(lessonPath),
          fetchUnitsData(),
        ]);

        if (!isMounted) return;

        setLesson(fetchedLesson);
        document.title = `${fetchedLesson.title} - Python Lesson`;

        // Handle hash fragment scrolling after lesson loads
        if (window.location.hash) {
          const hash = window.location.hash.substring(1); // Remove the '#'
          // Use setTimeout to ensure DOM has rendered
          setTimeout(() => {
            const element = document.getElementById(hash);
            if (element) {
              element.scrollIntoView({ behavior: "smooth", block: "start" });
            }
          }, 100);
        }

        let foundUnitLessons: LessonReference[] | null = null;
        let foundIndex = -1;
        let foundUnitId: UnitId | null = null;

        for (const unit of unitsData.units) {
          const index = unit.lessons.findIndex(
            (lessonRef) => lessonRef.path === lessonPath
          );
          if (index !== -1) {
            foundUnitLessons = unit.lessons;
            foundIndex = index;
            foundUnitId = unit.id;
            break;
          }
        }

        if (foundUnitLessons) {
          setUnitLessons(foundUnitLessons);
          setCurrentIndexInUnit(foundIndex);
          setParentUnitId(foundUnitId);
        } else {
          console.warn(`Could not find unit context for lesson ${lessonPath}`);
        }
      } catch (err) {
        console.error(`LessonPage Error fetching data for ${lessonPath}:`, err);
        if (isMounted) {
          setError(
            err instanceof Error
              ? err.message
              : `An unknown error occurred loading lesson ${lessonPath}`
          );
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };
    loadData();
    return () => {
      isMounted = false;
    };
  }, [lessonPath]);

  const completedSectionsSet: Set<SectionId> = useMemo(() => {
    if (!completedSectionsMap) {
      return new Set<SectionId>();
    }
    const sectionIdStrings: string[] = Object.keys(completedSectionsMap);
    const sectionIds: SectionId[] = sectionIdStrings.map(
      (key) => key as SectionId
    );
    return new Set<SectionId>(sectionIds);
  }, [completedSectionsMap]);

  const informationSections: Set<SectionId> = useMemo(() => {
    if (!lesson) return new Set<SectionId>();
    return new Set(
      lesson.sections.filter((s) => s.kind === "Information").map((s) => s.id)
    );
  }, [lesson]);

  const prevLessonReference =
    currentIndexInUnit > 0 ? unitLessons[currentIndexInUnit - 1] : null;
  const nextLessonReference =
    currentIndexInUnit !== -1 && currentIndexInUnit < unitLessons.length - 1
      ? unitLessons[currentIndexInUnit + 1]
      : null;
  const currentPositionInUnit = currentIndexInUnit + 1;
  const totalLessonsInUnit = unitLessons.length;

  const renderSection = (sectionData: AnyLessonSectionData) => {
    const currentUnitGuid = parentUnitId || ("unknown" as UnitId);
    const currentLessonGuid = lessonGuid || ("unknown" as LessonId);
    switch (sectionData.kind) {
      case "Information":
        return (
          <InformationSection key={sectionData.id} section={sectionData} />
        );
      case "Observation":
        return (
          <ObservationSection
            key={sectionData.id}
            unitId={currentUnitGuid}
            lessonId={currentLessonGuid}
            section={sectionData}
          />
        );
      case "Testing":
        return (
          <TestingSection
            key={sectionData.id}
            unitId={currentUnitGuid}
            lessonId={currentLessonGuid}
            section={sectionData}
            lessonPath={lessonPath}
          />
        );
      case "Prediction":
        return (
          <PredictionSection
            key={sectionData.id}
            unitId={currentUnitGuid}
            lessonId={currentLessonGuid}
            section={sectionData}
          />
        );
      case "MultipleChoice":
        return (
          <MultipleChoiceSection
            key={sectionData.id}
            unitId={currentUnitGuid}
            lessonId={currentLessonGuid}
            section={sectionData}
          />
        );
      case "MultipleSelection":
        return (
          <MultipleSelectionSection
            key={sectionData.id}
            unitId={currentUnitGuid}
            lessonId={currentLessonGuid}
            section={sectionData}
          />
        );
      case "Matching":
        return (
          <MatchingSection
            key={sectionData.id}
            unitId={currentUnitGuid}
            lessonId={currentLessonGuid}
            section={sectionData}
          />
        );
      case "Reflection":
        return (
          <ReflectionSection
            key={sectionData.id}
            unitId={currentUnitGuid}
            lessonId={currentLessonGuid}
            section={sectionData}
          />
        );
      case "Coverage":
        return (
          <CoverageSection
            key={sectionData.id}
            unitId={currentUnitGuid}
            lessonId={currentLessonGuid}
            section={sectionData}
          />
        );
      case "PRIMM":
        return (
          <PRIMMSection
            key={sectionData.id}
            unitId={currentUnitGuid}
            lessonId={currentLessonGuid}
            section={sectionData}
          />
        );
      case "Debugger":
        return (
          <DebuggerSection
            key={sectionData.id}
            unitId={currentUnitGuid}
            lessonId={currentLessonGuid}
            section={sectionData}
          />
        );
      default:
        const _exhaustiveCheck: never = sectionData;
        console.warn(`Unknown section kind: ${(_exhaustiveCheck as any).kind}`);
        return (
          <div key={(_exhaustiveCheck as any).id} className={styles.error}>
            Unsupported section kind: {(_exhaustiveCheck as any).kind}
          </div>
        );
    }
  };

  if (isLoading) {
    return (
      <LoadingSpinner
        message={`Loading lesson content for '${lessonPath}'...`}
      />
    );
  }
  if (error) {
    return (
      <div className={styles.error}>
        <h2>Error Loading Lesson</h2>
        <p>{error}</p>
        {parentUnitId ? (
          <Link to={`/unit/${parentUnitId}`} className={styles.backLink}>
            &larr; Back to Unit
          </Link>
        ) : (
          <Link to="/" className={styles.backLink}>
            &larr; Back to Home
          </Link>
        )}
      </div>
    );
  }
  if (!lesson) {
    return (
      <div className={styles.error}>
        <h2>Lesson Not Found</h2>
        <p>Could not find data for lesson '{lessonPath}'.</p>
        {parentUnitId ? (
          <Link to={`/unit/${parentUnitId}`} className={styles.backLink}>
            &larr; Back to Unit
          </Link>
        ) : (
          <Link to="/" className={styles.backLink}>
            &larr; Back to Home
          </Link>
        )}
      </div>
    );
  }

  return (
    <div className={styles.lessonContainer}>
      <aside className={styles.lessonSidebar}>
        {parentUnitId && (
          <Link
            to={`/python/unit/${parentUnitId}`}
            className={styles.backToUnitLink}
          >
            &larr; Back to Unit Overview
          </Link>
        )}
        <LessonSidebar
          sections={lesson.sections}
          completedSections={completedSectionsSet}
          informationSections={informationSections}
        />
      </aside>
      <div className={styles.lessonContent}>
        <div className={styles.lessonHeader}>
          <h1 className={styles.lessonTitle}>
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {lesson.title}
            </ReactMarkdown>
          </h1>
          {totalLessonsInUnit > 0 && (
            <LessonNavigation
              prevLessonPath={prevLessonReference?.path}
              nextLessonPath={nextLessonReference?.path}
              currentPosition={currentPositionInUnit}
              totalInUnit={totalLessonsInUnit}
            />
          )}
        </div>

        {lesson.sections.map((sectionItem) => (
          <div key={sectionItem.id} id={sectionItem.id}>
            {renderSection(sectionItem)}
          </div>
        ))}

        {totalLessonsInUnit > 0 && (
          <div
            className={styles.lessonHeader}
            style={{
              marginTop: "2rem",
              borderTop: "2px solid #eee",
              borderBottom: "none",
              paddingBottom: 0,
            }}
          >
            <div style={{ flexGrow: 1 }}></div>
            <LessonNavigation
              prevLessonPath={prevLessonReference?.path}
              nextLessonPath={nextLessonReference?.path}
              currentPosition={currentPositionInUnit}
              totalInUnit={totalLessonsInUnit}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default LessonPage;
