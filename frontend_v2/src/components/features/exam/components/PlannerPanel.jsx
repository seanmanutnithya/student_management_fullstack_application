import { memo } from "react";
import { CalendarPlus, CircleCheck, Pencil, Trash2, TriangleAlert } from "lucide-react";

import { useStaggerReveal } from "@/animation/reveal";
import { Button } from "@/components/ui";
import { useExams } from "@/context/ExamContext";
import { formatDate } from "@/utils/format";

const PaperRow = memo(function PaperRow({
  paper,
  subject,
  periodLabel,
  issues,
  onEdit,
  onRemove,
}) {
  return (
    <li className={`paper-row${issues ? " has-clash" : ""}`}>
      <span className="paper-date">
        <strong>{formatDate(paper.date)}</strong>
        <span className="cell-sub">{periodLabel}</span>
      </span>

      <span className="paper-subject">
        <strong>
          {paper.code} · {subject?.name ?? paper.code}
        </strong>
        <span className="cell-sub">
          {paper.room} · {paper.durationMins} min
        </span>
      </span>

      {issues ?
        <span className="paper-clash">
          <TriangleAlert />
          {issues.map((issue) => issue.detail).join(" ")}
        </span>
      : <span className="paper-ok">
          <CircleCheck />
          No clash
        </span>
      }

      <span className="paper-actions">
        <button
          className="row-action-btn edit"
          aria-label={`Edit ${paper.code} paper`}
          onClick={() => onEdit(paper)}>
          <Pencil />
        </button>
        <button
          className="row-action-btn delete"
          aria-label={`Remove ${paper.code} paper`}
          onClick={() => onRemove(paper.id)}>
          <Trash2 />
        </button>
      </span>
    </li>
  );
});

const PlannerPanel = ({ activeTab }) => {
  const {
    sessions,
    session,
    sessionId,
    setSessionId,
    papers,
    paperConflicts,
    conflictCount,
    subjectByCode,
    periodLabel,
    setPaperModal,
    removePaper,
  } = useExams();

  const isActive = activeTab === "planner";
  useStaggerReveal(".paper-row", [isActive, papers.length], {
    y: 8,
    duration: 0.32,
    stagger: 0.04,
  });

  const sorted = [...papers].sort(
    (a, b) => a.date.localeCompare(b.date) || a.periodId.localeCompare(b.periodId),
  );

  return (
    <section
      className={`exam-panel${isActive ? " is-active" : ""}`}
      id="panel-planner"
      role="tabpanel"
      aria-labelledby="tab-planner">
      <div className="panel-head">
        <div>
          <h2>Session planner</h2>
          <p>
            Every paper is checked against the teaching timetable and the rest
            of the session, so a room can't be booked twice.
          </p>
        </div>
        <div className="panel-head-actions">
          <label className="session-picker">
            <span className="visually-hidden">Exam session</span>
            <select
              className="select-field"
              aria-label="Exam session"
              value={sessionId}
              onChange={(e) => setSessionId(e.target.value)}>
              {sessions.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </label>
          <Button
            icon={CalendarPlus}
            onClick={() => setPaperModal({ mode: "create" })}>
            Schedule paper
          </Button>
        </div>
      </div>

      <div className="planner-status">
        <span
          className={`status-pill ${
            conflictCount ? "status-pill--red" : "status-pill--green"
          }`}>
          {conflictCount ?
            <>
              <TriangleAlert />
              {conflictCount} clash{conflictCount === 1 ? "" : "es"}
            </>
          : <>
              <CircleCheck />
              Schedule is clear
            </>
          }
        </span>
        <span className="cell-sub">
          {papers.length} paper{papers.length === 1 ? "" : "s"} in{" "}
          {session.name}
        </span>
      </div>

      {papers.length === 0 ?
        <div className="exam-empty">
          <CalendarPlus />
          <h3>No papers scheduled yet</h3>
          <p>Add the first paper to start building this session.</p>
        </div>
      : <ul className="paper-list">
          {sorted.map((paper) => (
            <PaperRow
              key={paper.id}
              paper={paper}
              subject={subjectByCode[paper.code]}
              periodLabel={periodLabel(paper.periodId)}
              issues={paperConflicts[paper.id] ?? null}
              onEdit={(p) => setPaperModal({ mode: "edit", paper: p })}
              onRemove={removePaper}
            />
          ))}
        </ul>
      }
    </section>
  );
};

export default PlannerPanel;
