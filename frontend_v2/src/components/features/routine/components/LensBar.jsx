import { CalendarClock, UserRoundX } from "lucide-react";

import { lenses } from "@/assets/data/routineSeed";
import { Field, SegmentedControl, Switch } from "@/components/ui";
import { useRoutine } from "@/context/RoutineContext";

/* One dataset, three readings — the selector below the toggle swaps to
   whichever entity the chosen lens is keyed by. */
const LensBar = () => {
  const {
    lens,
    setLens,
    classes,
    teachers,
    rooms,
    classId,
    setClassId,
    teacherName,
    setTeacherName,
    roomName,
    setRoomName,
    templates,
    templateId,
    setTemplateId,
    substituteMode,
    setSubstituteMode,
    absences,
    setAbsenceOpen,
    setBellOpen,
  } = useRoutine();

  const options =
    lens === "class" ? classes.map((c) => c.id)
    : lens === "teacher" ? teachers
    : rooms;

  const value =
    lens === "class" ? classId
    : lens === "teacher" ? teacherName
    : roomName;

  const onSelect = (next) => {
    if (lens === "class") setClassId(next);
    else if (lens === "teacher") setTeacherName(next);
    else setRoomName(next);
  };

  return (
    <div className="lens-bar">
      <div className="lens-toggle">
        <span className="lens-caption">View by</span>
        <SegmentedControl
          options={lenses}
          value={lens}
          onChange={setLens}
          label="Timetable lens"
        />
      </div>

      <Field
        label={
          lens === "class" ? "Class"
          : lens === "teacher" ? "Teacher"
          : "Room"
        }
        htmlFor="lensTarget"
        className="lens-field">
        <select
          id="lensTarget"
          value={value}
          onChange={(e) => onSelect(e.target.value)}>
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </Field>

      <Field label="Bell schedule" htmlFor="lensTemplate" className="lens-field">
        <select
          id="lensTemplate"
          value={templateId}
          onChange={(e) => setTemplateId(e.target.value)}>
          {templates.map((t) => (
            <option key={t.id} value={t.id}>
              {t.name}
            </option>
          ))}
        </select>
      </Field>

      <button
        type="button"
        className="lens-link"
        onClick={() => setBellOpen(true)}>
        <CalendarClock />
        Edit schedule
      </button>

      <div className="substitute-toggle">
        <span>
          <strong>Substitute mode</strong>
          <span className="cell-sub">
            {absences.length} teacher{absences.length === 1 ? "" : "s"} marked
            absent
          </span>
        </span>
        <Switch
          id="substituteMode"
          checked={substituteMode}
          onChange={setSubstituteMode}
          label="Substitute mode"
        />
        <button
          type="button"
          className="lens-link"
          onClick={() => setAbsenceOpen(true)}>
          <UserRoundX />
          Mark absent
        </button>
      </div>
    </div>
  );
};

export default LensBar;
