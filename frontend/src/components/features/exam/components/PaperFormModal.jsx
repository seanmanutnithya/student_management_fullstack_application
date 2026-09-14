import { useMemo, useState } from "react";
import { CalendarPlus, TriangleAlert } from "lucide-react";

import { shake } from "@/animation/shake";
import { rooms } from "@/assets/data/routineSeed";
import { Button, Field, Modal, TextField } from "@/components/ui";
import { useExams } from "@/context/ExamContext";
import { parseDate, toIsoDate } from "@/utils/format";

const today = toIsoDate(new Date());

const PaperFormModal = () => {
  const {
    paperModal,
    setPaperModal,
    subjects,
    periods,
    savePaper,
    paperFormRef,
    papers,
  } = useExams();

  const editing = paperModal?.paper ?? null;
  const open = Boolean(paperModal);

  const [form, setForm] = useState({
    code: subjects[0].code,
    date: today,
    periodId: periods[0].id,
    room: rooms[0],
    durationMins: "90",
  });
  const [touched, setTouched] = useState(false);
  const [wasOpen, setWasOpen] = useState(open);

  // Reset during render so each open starts from the paper being edited.
  if (open !== wasOpen) {
    setWasOpen(open);
    if (open) {
      setForm(
        editing ?
          { ...editing, durationMins: String(editing.durationMins) }
        : {
            code: subjects[0].code,
            date: today,
            periodId: periods[0].id,
            room: rooms[0],
            durationMins: "90",
          },
      );
      setTouched(false);
    }
  }

  const errors = useMemo(() => {
    const next = {};
    if (!form.code) next.code = "Choose the subject being examined.";
    if (!form.date) next.date = "Pick the paper date.";
    else {
      const weekday = parseDate(form.date).getDay();
      if (weekday === 0 || weekday === 6)
        next.date = "Exams run Monday to Friday.";
      else if (form.date < today) next.date = "The date has already passed.";
    }
    const duration = Number(form.durationMins);
    if (!Number.isInteger(duration) || duration < 15 || duration > 240)
      next.durationMins = "Enter a duration between 15 and 240 minutes.";

    const duplicate = papers.find(
      (p) =>
        p.id !== editing?.id &&
        p.code === form.code &&
        p.date === form.date &&
        p.periodId === form.periodId,
    );
    if (duplicate) next.code = `${form.code} is already scheduled in that slot.`;

    return next;
  }, [form, papers, editing]);

  const isValid = Object.keys(errors).length === 0;
  const err = (key) => (touched ? (errors[key] ?? "") : "");

  /* Warn about the clash before saving — the planner will flag it too, but
     the writer should see it at the point of decision. */
  const liveClash = useMemo(() => {
    const other = papers.find(
      (p) =>
        p.id !== editing?.id &&
        p.date === form.date &&
        p.periodId === form.periodId &&
        p.room === form.room,
    );
    return other ? `${other.code} already has ${form.room} in that slot.` : "";
  }, [papers, form, editing]);

  const submit = () => {
    setTouched(true);
    if (!isValid) {
      shake(paperFormRef.current);
      return;
    }
    savePaper({
      ...form,
      id: editing?.id ?? `PP-${Date.now().toString().slice(-5)}`,
      durationMins: Number(form.durationMins),
    });
  };

  const update = (patch) => setForm((prev) => ({ ...prev, ...patch }));

  return (
    <Modal
      open={open}
      onClose={() => setPaperModal(null)}
      title={editing ? `Edit ${editing.code} paper` : "Schedule a paper"}
      titleId="paperTitle"
      footer={
        <>
          <Button variant="secondary" onClick={() => setPaperModal(null)}>
            Cancel
          </Button>
          <Button icon={CalendarPlus} onClick={submit}>
            {editing ? "Save paper" : "Add paper"}
          </Button>
        </>
      }>
      <form ref={paperFormRef} onSubmit={(e) => e.preventDefault()}>
        <div className="form-grid">
          <Field label="Subject" htmlFor="paperSubject" error={err("code")}>
            <select
              id="paperSubject"
              value={form.code}
              onChange={(e) => update({ code: e.target.value })}>
              {subjects.map((s) => (
                <option key={s.code} value={s.code}>
                  {s.code} — {s.name}
                </option>
              ))}
            </select>
          </Field>

          <TextField
            id="paperDate"
            name="date"
            type="date"
            label="Date"
            min={today}
            value={form.date}
            onChange={(e) => update({ date: e.target.value })}
            onBlur={() => setTouched(true)}
            error={err("date")}
          />

          <Field label="Period" htmlFor="paperPeriod">
            <select
              id="paperPeriod"
              value={form.periodId}
              onChange={(e) => update({ periodId: e.target.value })}>
              {periods.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.label} ({p.start}–{p.end})
                </option>
              ))}
            </select>
          </Field>

          <Field label="Room" htmlFor="paperRoom">
            <select
              id="paperRoom"
              value={form.room}
              onChange={(e) => update({ room: e.target.value })}>
              {rooms.map((room) => (
                <option key={room} value={room}>
                  {room}
                </option>
              ))}
            </select>
          </Field>

          <TextField
            id="paperDuration"
            name="durationMins"
            type="number"
            min="15"
            max="240"
            label="Duration (minutes)"
            value={form.durationMins}
            onChange={(e) => update({ durationMins: e.target.value })}
            onBlur={() => setTouched(true)}
            error={err("durationMins")}
          />
        </div>

        {liveClash && (
          <p className="paper-live-clash">
            <TriangleAlert />
            {liveClash} Save anyway and the planner will keep flagging it.
          </p>
        )}
      </form>
    </Modal>
  );
};

export default PaperFormModal;
