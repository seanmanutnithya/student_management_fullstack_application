import { memo } from "react";
import { BellRing, CircleCheck, Clock3 } from "lucide-react";

import { useStaggerReveal } from "@/animation/reveal";
import { Button } from "@/components/ui";
import { useAttendance } from "@/context/AttendanceContext";

const SubmissionRow = memo(function SubmissionRow({ row, onNudge }) {
  return (
    <li
      className={`submission-row${row.submitted ? " is-done" : " is-waiting"}`}
      data-class-id={row.classId}>
      <span
        className={`submission-icon${row.submitted ? " is-done" : ""}`}
        aria-hidden="true">
        {row.submitted ?
          <CircleCheck />
        : <Clock3 />}
      </span>

      <div className="submission-meta">
        <strong>{row.klass?.name ?? row.classId}</strong>
        <span className="cell-sub">
          {row.by} · {row.klass?.size ?? 0} students
        </span>
      </div>

      <span
        className={`status-pill ${
          row.submitted ? "status-pill--green" : "status-pill--amber"
        }`}>
        {row.submitted ? `Submitted ${row.at}` : "Not submitted"}
      </span>

      {!row.submitted && (
        <Button
          size="sm"
          variant="secondary"
          icon={BellRing}
          onClick={() => onNudge(row.classId)}>
          Nudge
        </Button>
      )}
    </li>
  );
});

const TodayPanel = ({ activeTab }) => {
  const { submissionRows, nudge } = useAttendance();
  const isActive = activeTab === "today";

  useStaggerReveal(".submission-row", [isActive], {
    y: 8,
    duration: 0.35,
    stagger: 0.05,
  });

  const done = submissionRows.filter((r) => r.submitted).length;
  const outstanding = submissionRows.length - done;

  return (
    <section
      className={`attendance-panel${isActive ? " is-active" : ""}`}
      id="panel-today"
      role="tabpanel"
      aria-labelledby="tab-today">
      <div className="mark-head">
        <div>
          <h2>Today's submission board</h2>
          <p>
            {done} of {submissionRows.length} registers are in
            {outstanding > 0 ?
              ` — ${outstanding} still outstanding.`
            : " — every class has reported."}
          </p>
        </div>
      </div>

      <div className="submission-progress" aria-hidden="true">
        <span
          className="submission-progress-fill"
          style={{ width: `${(done / submissionRows.length) * 100}%` }}
        />
      </div>

      <ul className="submission-list">
        {submissionRows.map((row) => (
          <SubmissionRow key={row.classId} row={row} onNudge={nudge} />
        ))}
      </ul>
    </section>
  );
};

export default TodayPanel;
