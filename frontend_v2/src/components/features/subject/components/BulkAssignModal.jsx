import { useMemo, useRef, useState } from "react";
import { Layers, TriangleAlert } from "lucide-react";

import { shake } from "@/animation/shake";
import { Button, Field, Modal, TextField } from "@/components/ui";
import { useSubjects } from "@/context/SubjectContext";

const BulkAssignModal = () => {
  const {
    bulkOpen,
    setBulkOpen,
    subjects,
    classes,
    teachers,
    selected,
    bulkAssign,
  } = useSubjects();

  const [subjectId, setSubjectId] = useState(selected?.id ?? subjects[0].id);
  const [classIds, setClassIds] = useState([]);
  const [teacher, setTeacher] = useState("");
  const [periods, setPeriods] = useState("4");
  const [touched, setTouched] = useState(false);
  const [wasOpen, setWasOpen] = useState(bulkOpen);
  const formRef = useRef(null);

  // Reset during render so every open starts from the current subject.
  if (bulkOpen !== wasOpen) {
    setWasOpen(bulkOpen);
    if (bulkOpen) {
      setSubjectId(selected?.id ?? subjects[0].id);
      setClassIds([]);
      setTeacher(selected?.primaryTeacher ?? "");
      setPeriods("4");
      setTouched(false);
    }
  }

  const subject = subjects.find((s) => s.id === subjectId);

  const errors = useMemo(() => {
    const next = {};
    if (classIds.length === 0) next.classes = "Pick at least one class.";
    if (!teacher) next.teacher = "Choose the teacher to assign.";
    const count = Number(periods);
    if (!Number.isInteger(count) || count < 1 || count > 10)
      next.periods = "Enter a whole number of periods between 1 and 10.";
    return next;
  }, [classIds, teacher, periods]);

  const isValid = Object.keys(errors).length === 0;
  const err = (key) => (touched ? (errors[key] ?? "") : "");

  const toggleClass = (id) =>
    setClassIds((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id],
    );

  const submit = () => {
    setTouched(true);
    if (!isValid) {
      shake(formRef.current);
      return;
    }
    bulkAssign({
      subjectId,
      classIds,
      teacher,
      periodsPerWeek: Number(periods),
    });
    setBulkOpen(false);
  };

  const replacing = classIds.filter((id) =>
    subject?.mapping.some((m) => m.classId === id),
  );

  return (
    <Modal
      open={bulkOpen}
      onClose={() => setBulkOpen(false)}
      title="Bulk assign to classes"
      titleId="bulkAssignTitle"
      footer={
        <>
          <Button variant="secondary" onClick={() => setBulkOpen(false)}>
            Cancel
          </Button>
          <Button icon={Layers} onClick={submit}>
            Apply to {classIds.length || "selected"} class
            {classIds.length === 1 ? "" : "es"}
          </Button>
        </>
      }>
      <form ref={formRef} onSubmit={(e) => e.preventDefault()}>
        <div className="form-grid">
          <Field label="Subject" htmlFor="bulkSubject" className="field--full">
            <select
              id="bulkSubject"
              value={subjectId}
              onChange={(e) => setSubjectId(e.target.value)}>
              {subjects.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.code} — {s.name}
                </option>
              ))}
            </select>
          </Field>

          <Field
            label="Classes"
            className="field--full"
            error={err("classes")}
            hint="The same teacher and period count applies to every class ticked.">
            <div className="class-picker">
              {classes.map((klass) => {
                const already = subject?.mapping.some(
                  (m) => m.classId === klass.id,
                );
                return (
                  <label
                    key={klass.id}
                    className={`class-chip${
                      classIds.includes(klass.id) ? " is-selected" : ""
                    }`}>
                    <input
                      type="checkbox"
                      checked={classIds.includes(klass.id)}
                      onChange={() => toggleClass(klass.id)}
                    />
                    <span>{klass.id}</span>
                    <span className="cell-sub">
                      {already ? "mapped" : klass.grade}
                    </span>
                  </label>
                );
              })}
            </div>
          </Field>

          <Field label="Teacher" htmlFor="bulkTeacher" error={err("teacher")}>
            <select
              id="bulkTeacher"
              value={teacher}
              onChange={(e) => setTeacher(e.target.value)}>
              <option value="">Select a teacher</option>
              {teachers.map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>
          </Field>

          <TextField
            id="bulkPeriods"
            name="periods"
            type="number"
            min="1"
            max="10"
            label="Periods per week"
            value={periods}
            onChange={(e) => setPeriods(e.target.value)}
            onBlur={() => setTouched(true)}
            error={err("periods")}
          />
        </div>

        {replacing.length > 0 && (
          <p className="bulk-warning">
            <TriangleAlert />
            {replacing.join(", ")} {replacing.length === 1 ? "is" : "are"}{" "}
            already mapped — the existing period count will be overwritten.
          </p>
        )}
      </form>
    </Modal>
  );
};

export default BulkAssignModal;
