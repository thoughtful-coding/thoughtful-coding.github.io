import React from "react";
import styles from "./Section.module.css";
import { STYLES } from "./turtleTestConstants";
import TestProgressLabel from "./TestProgressLabel";

interface TurtleSideBySideViewProps {
  referenceImage: string;
  description: string;
  currentTestNumber: number;
  totalTests: number;
  turtleCanvasRef: React.RefObject<HTMLDivElement | null>;
  showProgressLabel: boolean;
}

/**
 * Displays the side-by-side view of target drawing and student's turtle canvas
 */
const TurtleSideBySideView: React.FC<TurtleSideBySideViewProps> = ({
  referenceImage,
  description,
  currentTestNumber,
  totalTests,
  turtleCanvasRef,
  showProgressLabel,
}) => {
  return (
    <div>
      {/* Test description above the side-by-side */}
      {showProgressLabel && (
        <TestProgressLabel
          currentTestNumber={currentTestNumber}
          totalTests={totalTests}
          description={description}
        />
      )}

      {/* Headings row - side by side */}
      <div style={STYLES.flexRow}>
        <div style={{ flex: 1 }}>
          <h4 style={STYLES.heading}>Target Drawing:</h4>
        </div>
        <div style={{ flex: 1 }}>
          <h4 style={STYLES.heading}>Your Drawing:</h4>
        </div>
      </div>

      {/* Images row - side by side */}
      <div className={styles.visualTestingContainer}>
        <div className={styles.referenceImageColumn}>
          <img
            src={referenceImage}
            alt={description}
            style={STYLES.referenceImage}
          />
        </div>

        <div className={styles.studentCanvasColumn}>
          <div ref={turtleCanvasRef} className={styles.turtleCanvasContainer}>
            {/* p5.js will inject its canvas here */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TurtleSideBySideView;
