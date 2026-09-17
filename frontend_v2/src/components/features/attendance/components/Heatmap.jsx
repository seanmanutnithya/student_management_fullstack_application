import { useMemo } from "react";

import { STATUSES } from "@/assets/data/attendanceSeed";
import { useAttendance } from "@/context/AttendanceContext";
import { formatDate, parseDate } from "@/utils/format";

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri"];
const SHORT = Object.fromEntries(STATUSES.map((s) => [s.value, s.short]));
const LABEL = Object.fromEntries(STATUSES.map((s) => [s.value, s.label]));

/* Lay the weekday history out as calendar weeks so a column reads as
   "every Monday" at a glance. */
const toWeeks = (days) => {
  const weeks = [];
  let current = Array(5).fill(null);
  let started = false;

  days.forEach((day) => {
    const weekday = parseDate(day.date).getDay(); // 1..5 for Mon..Fri
    const column = weekday - 1;
    if (started && column === 0) {
      weeks.push(current);
      current = Array(5).fill(null);
    }
    current[column] = day;
    started = true;
  });
  if (started) weeks.push(current);
  return weeks;
};

const Heatmap = () => {
  const { focusedStudent, focusedHistory, students, setFocusedStudentId } =
    useAttendance();

  const weeks = useMemo(() => toWeeks(focusedHistory), [focusedHistory]);

  /* Per-weekday tally — the numbers behind the colours, which also serve as
     the non-colour reading of the pattern. */
  const byWeekday = useMemo(() => {
    const tally = WEEKDAYS.map(() => ({ absent: 0, total: 0 }));
    focusedHistory.forEach((day) => {
      const column = parseDate(day.date).getDay() - 1;
      if (column < 0 || column > 4) return;
      tally[column].total += 1;
      if (day.status === "absent") tally[column].absent += 1;
    });
    return tally;
  }, [focusedHistory]);

  const worstDay = useMemo(() => {
    let index = -1;
    let worst = 0;
    byWeekday.forEach((d, i) => {
      if (d.absent > worst) {
        worst = d.absent;
        index = i;
      }
    });
    return worst >= 2 ? { day: WEEKDAYS[index], count: worst } : null;
  }, [byWeekday]);

  return (
    <div className="heatmap-card">
      <div className="heatmap-head">
        <div>
          <h3>Attendance pattern</h3>
          <p className="cell-sub">
            Last {focusedHistory.length} school days ·{" "}
            {focusedStudent?.percent}% attendance
          </p>
        </div>
        <label className="heatmap-picker">
          <span className="visually-hidden">Choose a student</span>
          <select
            className="select-field"
            aria-label="Choose a student"
            value={focusedStudent?.id ?? ""}
            onChange={(e) => setFocusedStudentId(e.target.value)}>
            {students.map((s) => (
              <option key={s.id} value={s.id}>
                {s.roll}. {s.name}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="heatmap-grid">
        <div className="heatmap-row heatmap-row--head" aria-hidden="true">
          {WEEKDAYS.map((day) => (
            <span key={day} className="heatmap-weekday">
              {day}
            </span>
          ))}
        </div>

        {weeks.map((week, weekIndex) => (
          <div className="heatmap-row" key={weekIndex}>
            {week.map((day, columnIndex) =>
              day ?
                <span
                  key={day.date}
                  className={`heatmap-cell heatmap-cell--${day.status}`}
                  title={`${formatDate(day.date)} — ${LABEL[day.status]}${
                    day.reason ? ` (${day.reason})` : ""
                  }`}>
                  {SHORT[day.status]}
                </span>
              : <span
                  key={`${weekIndex}-${columnIndex}`}
                  className="heatmap-cell is-empty"
                  aria-hidden="true"
                />,
            )}
          </div>
        ))}
      </div>

      <ul className="heatmap-legend">
        {STATUSES.map((status) => (
          <li key={status.value}>
            <span
              className={`legend-swatch heatmap-cell--${status.value}`}
              aria-hidden="true"
            />
            {status.label}
            <span className="legend-count">
              {
                focusedHistory.filter((d) => d.status === status.value).length
              }
            </span>
          </li>
        ))}
      </ul>

      {worstDay && (
        <p className="heatmap-insight">
          Pattern: absent on <strong>{worstDay.count}</strong> of the last{" "}
          {byWeekday[WEEKDAYS.indexOf(worstDay.day)].total}{" "}
          <strong>{worstDay.day}s</strong>.
        </p>
      )}
    </div>
  );
};

export default Heatmap;
