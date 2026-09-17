import { memo } from "react";

import { STATUSES } from "@/assets/data/attendanceSeed";
import { popMark } from "@/animation/attendancePageAnimation";

/* Memoised on (student, status): changing one student's mark re-renders that
   row alone, so a 40-row register stays responsive. */
const MarkRow = memo(function MarkRow({ student, status, onMark, onFocusRow }) {
  const isException = status !== "present";

  // Row-level keyboard control: P/A/L/E set a status outright, arrows walk
  // the roster, so a whole class can be marked without leaving the keyboard.
  const handleKeyDown = (e) => {
    const key = e.key.toLowerCase();
    const match = STATUSES.find((s) => s.short.toLowerCase() === key);
    if (match) {
      e.preventDefault();
      onMark(student.id, match.value);
      return;
    }
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      const rows = [...document.querySelectorAll(".mark-row")];
      const index = rows.indexOf(e.currentTarget);
      const next = rows[index + (e.key === "ArrowDown" ? 1 : -1)];
      next?.focus();
    }
  };

  return (
    <div
      className={`mark-row${isException ? " is-exception" : ""}`}
      data-student-id={student.id}
      tabIndex={0}
      role="radiogroup"
      aria-label={`Attendance for ${student.name}`}
      onKeyDown={handleKeyDown}
      onFocus={() => onFocusRow?.(student.id)}>
      <span className="mark-roll">{student.roll}</span>
      <img
        className="student-avatar mark-avatar"
        src={student.avatar}
        alt=""
        loading="lazy"
      />
      <span className="mark-name">
        {student.name}
        <span className="cell-sub">{student.id}</span>
      </span>

      <div className="mark-options">
        {STATUSES.map((option) => {
          const active = status === option.value;
          return (
            <button
              key={option.value}
              type="button"
              role="radio"
              aria-checked={active}
              tabIndex={-1}
              className={`mark-chip mark-chip--${option.value}${
                active ? " is-active" : ""
              }`}
              title={`${option.label} (${option.short})`}
              onClick={(e) => {
                onMark(student.id, option.value);
                popMark(e.currentTarget);
              }}>
              <option.icon />
              <span className="mark-chip-label">{option.label}</span>
              <span className="mark-chip-short" aria-hidden="true">
                {option.short}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
});

export default MarkRow;
