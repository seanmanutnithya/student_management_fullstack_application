import { useEffect, useMemo } from "react";

import { animateDonutSegments } from "@/animation/attendancePageAnimation";
import { useAttendance } from "@/context/AttendanceContext";

const RADIUS = 60;
const CENTER = 80;
const STROKE = 18;
const GAP = 2; // surface gap between segments, in path units
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

const ReasonChart = ({ activeTab }) => {
  const { reasonBreakdown } = useAttendance();
  const { total, segments } = reasonBreakdown;

  /* Arcs are laid out in the palette's fixed order — colour follows the
     reason, never its rank, so a quiet month never repaints the chart. */
  const arcs = useMemo(
    () =>
      segments.reduce((acc, segment) => {
        const share = total ? segment.value / total : 0;
        const dash = Math.max(0, share * CIRCUMFERENCE - GAP);
        const cumulative = acc.reduce(
          (sum, prior) => sum + prior.share * CIRCUMFERENCE,
          0,
        );
        acc.push({
          ...segment,
          share,
          dash,
          gap: CIRCUMFERENCE - dash,
          offset: -cumulative,
        });
        return acc;
      }, []),
    [segments, total],
  );

  useEffect(() => {
    if (activeTab === "insights") animateDonutSegments();
  }, [activeTab, arcs]);

  return (
    <div className="reason-card">
      <div className="heatmap-head">
        <div>
          <h3>Why students are absent</h3>
          <p className="cell-sub">
            {total} absences across the last 30 school days
          </p>
        </div>
      </div>

      <div className="reason-body">
        <div className="donut-wrap">
          <svg viewBox="0 0 160 160" className="donut-chart" role="img"
            aria-label="Absences split by reason">
            <circle
              cx={CENTER}
              cy={CENTER}
              r={RADIUS}
              fill="none"
              stroke="var(--color-border)"
              strokeWidth={STROKE}
            />
            {arcs.map((arc) => (
              <circle
                key={arc.key}
                className="reason-arc"
                data-dash={arc.dash}
                data-gap={arc.gap}
                cx={CENTER}
                cy={CENTER}
                r={RADIUS}
                fill="none"
                stroke={arc.color}
                strokeWidth={STROKE}
                strokeDasharray={`${arc.dash} ${arc.gap}`}
                strokeDashoffset={arc.offset}
              />
            ))}
          </svg>
          <div className="donut-center">
            <span className="donut-center-value">{total}</span>
            <span className="donut-center-label">Absences</span>
          </div>
        </div>

        {/* Legend doubles as the table view: every slice carries its own
            count and share, so nothing depends on colour alone. */}
        <ul className="donut-legend reason-legend">
          {segments.map((segment) => (
            <li key={segment.key}>
              <span
                className="legend-swatch"
                style={{ background: segment.color }}
                aria-hidden="true"
              />
              <span className="legend-name">{segment.label}</span>
              <span className="legend-count">{segment.value}</span>
              <span className="legend-pct">{segment.percent}%</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ReasonChart;
