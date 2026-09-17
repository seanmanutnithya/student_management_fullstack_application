import { useState } from "react";
import { Award, ClipboardCheck, Save, Trophy } from "lucide-react";

import { shake } from "@/animation/shake";
import { useStaggerReveal } from "@/animation/reveal";
import { Button, Field } from "@/components/ui";
import { useExams } from "@/context/ExamContext";

const ReportsPanel = ({ activeTab }) => {
  const {
    rows,
    reportRow,
    reportStudentId,
    setReportStudentId,
    remarks,
    saveRemark,
    remarkFormRef,
    session,
    subjectByCode,
    passMark,
  } = useExams();

  const [draft, setDraft] = useState(remarks[reportStudentId] ?? "");
  const [touched, setTouched] = useState(false);
  const [lastStudent, setLastStudent] = useState(reportStudentId);
  const isActive = activeTab === "reports";

  // Swap the draft when the selected student changes, without an effect.
  if (reportStudentId !== lastStudent) {
    setLastStudent(reportStudentId);
    setDraft(remarks[reportStudentId] ?? "");
    setTouched(false);
  }

  useStaggerReveal(".report-line", [isActive, reportStudentId], {
    y: 6,
    duration: 0.3,
    stagger: 0.03,
  });

  const remarkValid = draft.trim().length >= 10;

  const submitRemark = () => {
    setTouched(true);
    if (!saveRemark(reportStudentId, draft)) shake(remarkFormRef.current);
  };

  if (!reportRow) return null;

  return (
    <section
      className={`exam-panel${isActive ? " is-active" : ""}`}
      id="panel-reports"
      role="tabpanel"
      aria-labelledby="tab-reports">
      <div className="panel-head">
        <div>
          <h2>Report card</h2>
          <p>
            Exactly what the student and their guardian see once this session
            is published.
          </p>
        </div>
        <label className="session-picker">
          <span className="visually-hidden">Student</span>
          <select
            className="select-field"
            aria-label="Student"
            value={reportStudentId}
            onChange={(e) => setReportStudentId(e.target.value)}>
            {rows.map((row) => (
              <option key={row.id} value={row.id}>
                {row.roll}. {row.name}
              </option>
            ))}
          </select>
        </label>
      </div>

      <article className="report-card">
        <header className="report-head">
          <img className="student-avatar" src={reportRow.avatar} alt="" />
          <div className="report-identity">
            <h3>{reportRow.name}</h3>
            <p className="cell-sub">
              {reportRow.id} · {reportRow.classId} · {session.name}
            </p>
          </div>
          <div className="report-headline">
            <span className="report-figure">
              <strong>{reportRow.weighted ?? "—"}%</strong>
              <span>Weighted</span>
            </span>
            <span className="report-figure">
              <strong>{reportRow.gpa ?? "—"}</strong>
              <span>GPA</span>
            </span>
            <span className="report-figure">
              <strong>
                {reportRow.rank ? `#${reportRow.rank}` : "—"}
                {reportRow.rank && (
                  <span className="report-of">/{reportRow.cohort}</span>
                )}
              </strong>
              <span>Rank</span>
            </span>
          </div>
        </header>

        <ul className="report-lines">
          {reportRow.cells.map((cell) => {
            const subject = subjectByCode[cell.code];
            return (
              <li className="report-line" key={cell.code}>
                <span className="report-subject">
                  <strong>{subject?.name ?? cell.code}</strong>
                  <span className="cell-sub">
                    {cell.code} · {subject?.credits} credits · this paper is{" "}
                    {subject?.scheme[session.type] ?? 0}% of the final grade
                  </span>
                </span>
                <span className="report-mark">
                  {cell.percent === null ?
                    <span className="cell-sub">Not marked</span>
                  : <>
                      {cell.score}/{cell.max}
                      <span className="cell-sub">{cell.percent}%</span>
                    </>
                  }
                </span>
                {cell.grade ?
                  <span className={`mark-grade mark-grade--${cell.grade.tone}`}>
                    {cell.grade.letter}
                  </span>
                : <span className="mark-grade mark-grade--muted">—</span>}
              </li>
            );
          })}
        </ul>

        <div className="report-extras">
          <div className="report-extra">
            <ClipboardCheck />
            <span>
              <strong>{reportRow.attendance}%</strong>
              <span className="cell-sub">Attendance this term</span>
            </span>
          </div>
          <div className="report-extra">
            <Trophy />
            <span>
              <strong>
                {reportRow.rank ? `${reportRow.rank} of ${reportRow.cohort}` : "Unranked"}
              </strong>
              <span className="cell-sub">Cohort position</span>
            </span>
          </div>
          <div className="report-extra">
            <Award />
            <span>
              <strong>
                {reportRow.failing.length === 0 ?
                  "All passed"
                : `${reportRow.failing.length} below ${passMark}%`}
              </strong>
              <span className="cell-sub">
                {reportRow.failing.join(", ") || "No retakes needed"}
              </span>
            </span>
          </div>
        </div>

        <form
          className="remark-form"
          ref={remarkFormRef}
          onSubmit={(e) => e.preventDefault()}>
          <Field
            label="Teacher remark"
            htmlFor="reportRemark"
            error={touched && !remarkValid ? "Write at least 10 characters." : ""}
            hint="Printed on the report card the guardian receives.">
            <textarea
              id="reportRemark"
              rows={3}
              className="exam-textarea"
              placeholder="e.g. Strong term in the sciences; needs steadier work in English."
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onBlur={() => setTouched(true)}
            />
          </Field>
          <Button size="sm" icon={Save} onClick={submitRemark}>
            Save remark
          </Button>
        </form>
      </article>
    </section>
  );
};

export default ReportsPanel;
