import { useMemo, useRef } from "react";
import { useGSAP } from "@gsap/react";

import { useStudent } from "@/context/StudentContext";
import {
  ATTENDANCE_MONTHS,
  START_OFFSET,
  animateAttendance,
  buildMonth,
} from "../../utils/renderCalendar";

const AttendancePanel = () => {
  const { openStudent } = useStudent();
  const panelRef = useRef(null);

  const statuses = useMemo(
    () => buildMonth(openStudent?.id),
    [openStudent?.id],
  );

  useGSAP(animateAttendance, {
    scope: panelRef,
    dependencies: [statuses],
  });

  return (
    <div
      className="detail-panel is-active"
      id="panel-attendance"
      role="tabpanel"
      aria-labelledby="tab-attendance"
      data-panel="attendance"
      ref={panelRef}>
      <div className="attendance-legend">
        <span>
          <i className="legend-dot legend-dot--present"></i>Present
        </span>
        <span>
          <i className="legend-dot legend-dot--late"></i>Late
        </span>
        <span>
          <i className="legend-dot legend-dot--absent"></i>Absent
        </span>
      </div>

      <div className="calendar-grid" id="calendarGrid">
        {Array.from({ length: START_OFFSET }, (_, i) => (
          <span key={`empty-${i}`} className="calendar-cell is-empty" />
        ))}
        {statuses.map((status, i) => (
          <span
            key={i}
            className={`calendar-cell is-${status}`}
            title={`Day ${i + 1}: ${status}`}>
            {i + 1}
          </span>
        ))}
      </div>

      <div className="attendance-bars" id="attendanceBars">
        {ATTENDANCE_MONTHS.map((m) => (
          <div key={m.label} className="attendance-bar-col">
            <div
              className="attendance-bar"
              style={{ height: `${m.pct}%` }}
              title={`${m.label}: ${m.pct}%`}
            />
            <span className="attendance-bar-label">{m.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

/* Hooks can't run after an early return, so the tab check lives in this thin
   wrapper and the panel only mounts while its tab is active. */
const Attandance = ({ activeTab }) =>
  activeTab === "attendance" ? <AttendancePanel /> : null;

export default Attandance;
