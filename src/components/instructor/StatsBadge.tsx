/**
 * StatsBadge Component
 *
 * Displays difficulty statistics (p50/p95) with color coding for quick visual assessment.
 * Used in instructor dashboard to identify challenging sections at a glance.
 */

import React from "react";
import styles from "./StatsBadge.module.css";

interface StatsBadgeProps {
  /** Median attempts (50th percentile) */
  p50: number;
  /** 95th percentile attempts */
  p95: number;
  /** Show compact inline version (for table headers) */
  compact?: boolean;
  /** Number of students who completed the section (for tooltip) */
  totalCompletions?: number;
}

/**
 * Color coding for difficulty assessment:
 * - Green: Easy (1-2 attempts) - Most students get it quickly
 * - Yellow: Medium (3-4 attempts) - Some struggle but manageable
 * - Red: Hard (5+ attempts) - Many students struggling, may need revision
 */
const getColorClass = (attempts: number): "green" | "yellow" | "red" => {
  if (attempts <= 2) return "green";
  if (attempts <= 4) return "yellow";
  return "red";
};

/**
 * StatsBadge - Displays difficulty statistics with color coding
 *
 * @example
 * // Compact mode for table headers
 * <StatsBadge p50={2} p95={4} compact totalCompletions={42} />
 *
 * @example
 * // Full mode for detailed views
 * <StatsBadge p50={3} p95={8} totalCompletions={38} />
 */
const StatsBadge: React.FC<StatsBadgeProps> = ({
  p50,
  p95,
  compact = false,
  totalCompletions,
}) => {
  const p50Color = getColorClass(p50);
  const p95Color = getColorClass(p95);

  const p50Tooltip = `50% of students completed in ${p50} or fewer attempt${p50 === 1 ? "" : "s"}`;
  const p95Tooltip = `95% of students completed in ${p95} or fewer attempt${p95 === 1 ? "" : "s"}`;

  if (compact) {
    return (
      <div className={styles.compactBadge}>
        <span className={styles[`badge-${p50Color}`]} title={p50Tooltip}>
          p50: {p50}
        </span>
        <span className={styles[`badge-${p95Color}`]} title={p95Tooltip}>
          p95: {p95}
        </span>
      </div>
    );
  }

  return (
    <div className={styles.badge}>
      <div className={styles.stat} title={p50Tooltip}>
        <span className={styles.label}>Median:</span>
        <span className={styles[`value-${p50Color}`]}>{p50}</span>
      </div>
      <div className={styles.stat} title={p95Tooltip}>
        <span className={styles.label}>p95:</span>
        <span className={styles[`value-${p95Color}`]}>{p95}</span>
      </div>
      {totalCompletions && (
        <div className={styles.total}>({totalCompletions} students)</div>
      )}
    </div>
  );
};

export default StatsBadge;
