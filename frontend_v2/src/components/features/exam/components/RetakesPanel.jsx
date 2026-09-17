import { memo, useMemo, useState } from "react";
import { CalendarPlus, CircleCheck, RefreshCw } from "lucide-react";

import { shake } from "@/animation/shake";
import { useStaggerReveal } from "@/animation/reveal";
import { rooms } from "@/assets/data/routineSeed";
import { Button, Field, Modal, TextField } from "@/components/ui";
import { useExams } from "@/context/ExamContext";
import { formatDate, parseDate, toIsoDate } from "@/utils/format";

const today = toIsoDate(new Date());

/* The original mark is never overwritten — the retake sits beside it so the
   history stays auditable. */
const RetakeRow = memo(function RetakeRow({
  entry,
  max,
  onSchedule,
  onRecord,
}) {
  const [score, setScore] = useState("");

  return (
    <li className="retake-row">
      <img className="student-avatar" src={entry.student.avatar} alt="" loading="lazy" />
      <span className="retake-who">
        <strong>{entry.student.name}</strong>
        <span className="cell-sub">
          {entry.student.classId} · {entry.subject}
        </span>
      </span>

      <span className="retake-original">
        <span className="cell-sub">Original</span>
        <strong className="is-failing-mark">
          {entry.original.score}/{entry.original.max}
        </strong>
        <span className="cell-sub">{entry.original.percent}%</span>
      </span>

      <span className="retake-result">
        {entry.retake?.status === "recorded" ?
          <>
            <span className="cell-sub">Retake</span>
            <strong className="is-retake-mark">
              {entry.retake.score}/{max}
            </strong>
            <span className="cell-sub">{entry.retake.percent}%</span>
          </>
        : entry.retake?.status === "scheduled" ?
          <>
            <span className="cell-sub">
              Scheduled {formatDate(entry.retake.date)} · {entry.retake.room}
            </span>
            <span className="retake-entry">
              <input
                type="number"
                min="0"
                max={max}
                aria-label={`Retake mark for ${entry.student.name}`}
                placeholder={`0–${max}`}
                value={score}
                onChange={(e) => setScore(e.target.value)}
              />
              <Button
                size="sm"
                onClick={() => {
                  if (onRecord(entry.id, score, max)) setScore("");
                }}>
                Record
              </Button>
            </span>
          </>
        : <Button
            size="sm"
            variant="secondary"
            icon={CalendarPlus}
            onClick={() => onSchedule(entry)}>
            Schedule makeup
          </Button>
        }
      </span>
    </li>
  );
});

const RetakesPanel = ({ activeTab }) => {
  const {
    retakeList,
    retakeFor,
    setRetakeFor,
    scheduleRetake,
    recordRetakeResult,
    retakeFormRef,
    subjectByCode,
    passMark,
  } = useExams();

  const [form, setForm] = useState({ date: today, room: rooms[0] });
  const [touched, setTouched] = useState(false);
  const [wasOpen, setWasOpen] = useState(Boolean(retakeFor));

  const open = Boolean(retakeFor);
  if (open !== wasOpen) {
    setWasOpen(open);
    if (open) {
      setForm({ date: today, room: rooms[0] });
      setTouched(false);
    }
  }

  const isActive = activeTab === "retakes";
  useStaggerReveal(".retake-row", [isActive, retakeList.length], {
    y: 8,
    duration: 0.32,
    stagger: 0.04,
  });

  const errors = useMemo(() => {
    const next = {};
    if (!form.date) next.date = "Pick a date for the makeup paper.";
    else {
      const weekday = parseDate(form.date).getDay();
      if (weekday === 0 || weekday === 6)
        next.date = "Makeup papers run Monday to Friday.";
      else if (form.date < today) next.date = "That date has already passed.";
    }
    return next;
  }, [form]);

  const submit = () => {
    setTouched(true);
    if (Object.keys(errors).length > 0) {
      shake(retakeFormRef.current);
      return;
    }
    scheduleRetake(retakeFor.id, form);
  };

  return (
    <section
      className={`exam-panel${isActive ? " is-active" : ""}`}
      id="panel-retakes"
      role="tabpanel"
      aria-labelledby="tab-retakes">
      <div className="panel-head">
        <div>
          <h2>Retakes</h2>
          <p>
            Every paper below {passMark}%, worst first. Recording a makeup mark
            stores it next to the original rather than replacing it.
          </p>
        </div>
        <span className="status-pill status-pill--amber">
          <RefreshCw />
          {retakeList.length} to sit
        </span>
      </div>

      {retakeList.length === 0 ?
        <div className="exam-empty">
          <CircleCheck />
          <h3>Nobody is below the pass mark</h3>
          <p>No makeup papers are needed for this session.</p>
        </div>
      : <ul className="retake-list">
          {retakeList.map((entry) => (
            <RetakeRow
              key={entry.id}
              entry={entry}
              max={subjectByCode[entry.code]?.max ?? 100}
              onSchedule={setRetakeFor}
              onRecord={recordRetakeResult}
            />
          ))}
        </ul>
      }

      <Modal
        open={open}
        onClose={() => setRetakeFor(null)}
        title="Schedule makeup paper"
        titleId="retakeTitle"
        size="sm"
        footer={
          <>
            <Button variant="secondary" onClick={() => setRetakeFor(null)}>
              Cancel
            </Button>
            <Button icon={CalendarPlus} onClick={submit}>
              Schedule
            </Button>
          </>
        }>
        {retakeFor && (
          <form ref={retakeFormRef} onSubmit={(e) => e.preventDefault()}>
            <p className="cell-sub retake-intro">
              {retakeFor.student.name} · {retakeFor.subject} · scored{" "}
              {retakeFor.original.percent}% first time.
            </p>
            <div className="form-grid">
              <TextField
                id="retakeDate"
                name="date"
                type="date"
                label="Date"
                min={today}
                value={form.date}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, date: e.target.value }))
                }
                onBlur={() => setTouched(true)}
                error={touched ? (errors.date ?? "") : ""}
              />
              <Field label="Room" htmlFor="retakeRoom">
                <select
                  id="retakeRoom"
                  value={form.room}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, room: e.target.value }))
                  }>
                  {rooms.map((room) => (
                    <option key={room} value={room}>
                      {room}
                    </option>
                  ))}
                </select>
              </Field>
            </div>
          </form>
        )}
      </Modal>
    </section>
  );
};

export default RetakesPanel;
