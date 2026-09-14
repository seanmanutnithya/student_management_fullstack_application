import { useMemo, useState } from "react";
import { Coffee, Plus, Save, Trash2, TriangleAlert } from "lucide-react";

import { shake } from "@/animation/shake";
import { Button, Field, Modal, TextField } from "@/components/ui";
import { useRoutine } from "@/context/RoutineContext";

const toMinutes = (time) => {
  const [h, m] = String(time).split(":").map(Number);
  return Number.isFinite(h) && Number.isFinite(m) ? h * 60 + m : NaN;
};

const BellScheduleModal = () => {
  const { bellOpen, setBellOpen, templates, template, saveTemplate, bellFormRef } =
    useRoutine();

  const [name, setName] = useState(template.name);
  const [rows, setRows] = useState(template.periods);
  const [editingId, setEditingId] = useState(template.id);
  const [touched, setTouched] = useState(false);
  const [wasOpen, setWasOpen] = useState(bellOpen);

  // Reset during render so each open starts from the active template.
  if (bellOpen !== wasOpen) {
    setWasOpen(bellOpen);
    if (bellOpen) {
      setName(template.name);
      setRows(template.periods);
      setEditingId(template.id);
      setTouched(false);
    }
  }

  const errors = useMemo(() => {
    const next = { rows: {} };
    if (name.trim().length < 3) next.name = "Give the schedule a name.";
    if (rows.length === 0) next.list = "A schedule needs at least one period.";

    rows.forEach((row, index) => {
      const start = toMinutes(row.start);
      const end = toMinutes(row.end);
      if (!row.label.trim()) next.rows[row.id] = "Label required.";
      else if (Number.isNaN(start) || Number.isNaN(end))
        next.rows[row.id] = "Enter both times.";
      else if (end <= start) next.rows[row.id] = "End must be after start.";
      else if (index > 0 && start < toMinutes(rows[index - 1].end))
        next.rows[row.id] = `Overlaps ${rows[index - 1].label}.`;
    });

    if (Object.keys(next.rows).length === 0) delete next.rows;
    return next;
  }, [name, rows]);

  const isValid = Object.keys(errors).length === 0;

  const updateRow = (id, patch) =>
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, ...patch } : r)));

  const addRow = (isBreak = false) =>
    setRows((prev) => {
      const last = prev[prev.length - 1];
      return [
        ...prev,
        {
          id: `${isBreak ? "b" : "p"}${Date.now().toString().slice(-4)}`,
          label: isBreak ? "Break" : `Period ${prev.filter((r) => !r.isBreak).length + 1}`,
          start: last?.end ?? "07:30",
          end: last?.end ?? "08:20",
          isBreak,
        },
      ];
    });

  const removeRow = (id) => setRows((prev) => prev.filter((r) => r.id !== id));

  const submit = () => {
    setTouched(true);
    if (!isValid) {
      shake(bellFormRef.current);
      return;
    }
    saveTemplate({ id: editingId, name: name.trim(), periods: rows });
    setBellOpen(false);
  };

  return (
    <Modal
      open={bellOpen}
      onClose={() => setBellOpen(false)}
      title="Bell schedule"
      titleId="bellTitle"
      size="lg"
      footer={
        <>
          <Button variant="secondary" onClick={() => setBellOpen(false)}>
            Cancel
          </Button>
          <Button icon={Save} onClick={submit}>
            Save schedule
          </Button>
        </>
      }>
      <form ref={bellFormRef} onSubmit={(e) => e.preventDefault()}>
        <div className="form-grid">
          <Field label="Editing" htmlFor="bellTemplate">
            <select
              id="bellTemplate"
              value={editingId}
              onChange={(e) => {
                const next = templates.find((t) => t.id === e.target.value);
                if (!next) return;
                setEditingId(next.id);
                setName(next.name);
                setRows(next.periods);
                setTouched(false);
              }}>
              {templates.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
          </Field>

          <TextField
            id="bellName"
            name="name"
            label="Schedule name"
            placeholder="e.g. Exam day"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onBlur={() => setTouched(true)}
            error={touched ? (errors.name ?? "") : ""}
          />
        </div>

        <div className="bell-rows">
          {rows.map((row) => (
            <div
              className={`bell-row${row.isBreak ? " is-break" : ""}`}
              key={row.id}>
              <input
                className="bell-label"
                aria-label="Period label"
                value={row.label}
                onChange={(e) => updateRow(row.id, { label: e.target.value })}
              />
              <input
                type="time"
                aria-label={`${row.label} start`}
                value={row.start}
                onChange={(e) => updateRow(row.id, { start: e.target.value })}
              />
              <span className="bell-dash">–</span>
              <input
                type="time"
                aria-label={`${row.label} end`}
                value={row.end}
                onChange={(e) => updateRow(row.id, { end: e.target.value })}
              />
              <label className="bell-break-toggle">
                <input
                  type="checkbox"
                  checked={row.isBreak}
                  onChange={(e) =>
                    updateRow(row.id, { isBreak: e.target.checked })
                  }
                />
                <Coffee />
                Break
              </label>
              <button
                type="button"
                className="row-action-btn delete"
                aria-label={`Remove ${row.label}`}
                onClick={() => removeRow(row.id)}>
                <Trash2 />
              </button>

              {touched && errors.rows?.[row.id] && (
                <span className="bell-row-error">{errors.rows[row.id]}</span>
              )}
            </div>
          ))}
        </div>

        {touched && errors.list && (
          <p className="bell-error">
            <TriangleAlert />
            {errors.list}
          </p>
        )}

        <div className="bell-actions">
          <Button size="sm" variant="secondary" icon={Plus} onClick={() => addRow(false)}>
            Add period
          </Button>
          <Button size="sm" variant="secondary" icon={Coffee} onClick={() => addRow(true)}>
            Add break
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default BellScheduleModal;
