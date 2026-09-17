import { useMemo, useState } from "react";
import { UserRoundCheck, UserRoundX, X } from "lucide-react";

import { shake } from "@/animation/shake";
import { Button, Field, Modal, TextField } from "@/components/ui";
import { useRoutine } from "@/context/RoutineContext";
import { parseDate, toIsoDate } from "@/utils/format";

const DAY_BY_INDEX = [
  null,
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  null,
];

/* Marking a teacher absent, and picking cover for one period — two small
   dialogs that share the substitute flow. */
const SubstituteModals = () => {
  const {
    absenceOpen,
    setAbsenceOpen,
    absenceFormRef,
    teachers,
    addAbsence,
    absences,
    clearAbsence,
    coverFor,
    setCoverFor,
    freeTeachers,
    assignCover,
    periods,
  } = useRoutine();

  const [teacher, setTeacher] = useState(teachers[0]);
  const [date, setDate] = useState(toIsoDate(new Date()));
  const [reason, setReason] = useState("");
  const [touched, setTouched] = useState(false);

  const day = useMemo(
    () => DAY_BY_INDEX[parseDate(date).getDay()] ?? null,
    [date],
  );

  const errors = useMemo(() => {
    const next = {};
    if (!teacher) next.teacher = "Choose the teacher who is out.";
    if (!date) next.date = "Pick the date of the absence.";
    else if (!day) next.date = "School only runs Monday to Friday.";
    if (reason.trim().length < 3)
      next.reason = "Give a short reason (3 characters or more).";
    return next;
  }, [teacher, date, day, reason]);

  const isValid = Object.keys(errors).length === 0;
  const err = (key) => (touched ? (errors[key] ?? "") : "");

  const closeAbsence = () => {
    setAbsenceOpen(false);
    setReason("");
    setTouched(false);
  };

  const submitAbsence = () => {
    setTouched(true);
    if (!isValid) {
      shake(absenceFormRef.current);
      return;
    }
    addAbsence({ teacher, date, day, reason: reason.trim() });
    closeAbsence();
  };

  const candidates =
    coverFor ? freeTeachers(coverFor.day, coverFor.periodId, coverFor.teacher) : [];
  const periodLabel =
    coverFor ?
      (periods.find((p) => p.id === coverFor.periodId)?.label ?? coverFor.periodId)
    : "";

  return (
    <>
      <Modal
        open={absenceOpen}
        onClose={closeAbsence}
        title="Mark a teacher absent"
        titleId="absenceTitle"
        footer={
          <>
            <Button variant="secondary" onClick={closeAbsence}>
              Cancel
            </Button>
            <Button icon={UserRoundX} onClick={submitAbsence}>
              Mark absent
            </Button>
          </>
        }>
        <form ref={absenceFormRef} onSubmit={(e) => e.preventDefault()}>
          <div className="form-grid">
            <Field label="Teacher" htmlFor="absTeacher" error={err("teacher")}>
              <select
                id="absTeacher"
                value={teacher}
                onChange={(e) => setTeacher(e.target.value)}>
                {teachers.map((name) => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))}
              </select>
            </Field>

            <TextField
              id="absDate"
              name="date"
              type="date"
              label="Date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              onBlur={() => setTouched(true)}
              error={err("date")}
              hint={day ? `Falls on ${day}` : undefined}
            />

            <TextField
              id="absReason"
              name="reason"
              label="Reason"
              className="field--full"
              placeholder="e.g. Medical leave"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              onBlur={() => setTouched(true)}
              error={err("reason")}
            />
          </div>

          {absences.length > 0 && (
            <div className="absence-list">
              <h4>Currently marked absent</h4>
              <ul>
                {absences.map((absence) => (
                  <li key={absence.id}>
                    <span>
                      <strong>{absence.teacher}</strong>
                      <span className="cell-sub">
                        {absence.day}, {absence.date} · {absence.reason}
                      </span>
                    </span>
                    <button
                      type="button"
                      className="row-action-btn delete"
                      aria-label={`Clear absence for ${absence.teacher}`}
                      onClick={() => clearAbsence(absence.id)}>
                      <X />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </form>
      </Modal>

      <Modal
        open={Boolean(coverFor)}
        onClose={() => setCoverFor(null)}
        title="Assign cover"
        titleId="coverTitle"
        size="sm"
        footer={
          <Button variant="secondary" onClick={() => setCoverFor(null)}>
            Close
          </Button>
        }>
        {coverFor && (
          <div className="cover-body">
            <p className="cover-intro">
              <strong>{coverFor.classId} · {coverFor.subject}</strong>
              <span className="cell-sub">
                {coverFor.day}, {periodLabel} · {coverFor.room}
              </span>
            </p>

            {/* Only teachers with nothing else in this slot, and not
                themselves absent, are offered. */}
            {candidates.length === 0 ?
              <p className="cover-empty">
                Nobody is free in this slot. Move the period or split the class.
              </p>
            : <ul className="cover-list">
                {candidates.map((name) => (
                  <li key={name}>
                    <span>{name}</span>
                    <Button
                      size="sm"
                      icon={UserRoundCheck}
                      onClick={() => assignCover(coverFor.id, name)}>
                      Assign
                    </Button>
                  </li>
                ))}
              </ul>
            }
          </div>
        )}
      </Modal>
    </>
  );
};

export default SubstituteModals;
