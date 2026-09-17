import { memo } from "react";
import { CircleCheck, TriangleAlert } from "lucide-react";

import { useAttendance } from "@/context/AttendanceContext";

/* Severity drives the bar colour, so the list reads top-down as worst-first
   even before the numbers are parsed. */
const severityOf = (percent, threshold) => {
  if (percent < threshold - 15) return "critical";
  if (percent < threshold - 7) return "serious";
  return "warning";
};

const WatchRow = memo(function WatchRow({ student, threshold, onSelect }) {
  const severity = severityOf(student.percent, threshold);

  return (
    <li className="watch-row" data-student-id={student.id}>
      <button
        type="button"
        className="watch-button"
        onClick={() => onSelect(student.id)}
        title={`Show ${student.name}'s attendance pattern`}>
        <img className="student-avatar" src={student.avatar} alt="" loading="lazy" />
        <span className="watch-meta">
          <strong>{student.name}</strong>
          <span className="cell-sub">
            {student.absent} absent · {student.late} late · {student.excused}{" "}
            excused
          </span>
        </span>
        <span className="watch-figures">
          <span className={`watch-percent watch-percent--${severity}`}>
            {student.percent}%
          </span>
          <span className="cell-sub">
            {student.deficit} pts below · {student.shortfall} day
            {student.shortfall === 1 ? "" : "s"} to recover
          </span>
        </span>
      </button>
      <span className="watch-track" aria-hidden="true">
        <span
          className={`watch-fill watch-fill--${severity}`}
          style={{ width: `${student.percent}%` }}
        />
      </span>
    </li>
  );
});

const WatchList = () => {
  const { atRisk, threshold, setFocusedStudentId } = useAttendance();

  return (
    <div className="watch-card">
      <div className="heatmap-head">
        <div>
          <h3>
            <TriangleAlert />
            At-risk watchlist
          </h3>
          <p className="cell-sub">
            Below the {threshold}% threshold, worst first
          </p>
        </div>
        <span className="status-pill status-pill--amber">
          {atRisk.length} student{atRisk.length === 1 ? "" : "s"}
        </span>
      </div>

      {atRisk.length === 0 ?
        <p className="watch-clear">
          <CircleCheck />
          Every student is above {threshold}%.
        </p>
      : <ul className="watch-list">
          {atRisk.map((student) => (
            <WatchRow
              key={student.id}
              student={student}
              threshold={threshold}
              onSelect={setFocusedStudentId}
            />
          ))}
        </ul>
      }
    </div>
  );
};

export default WatchList;
