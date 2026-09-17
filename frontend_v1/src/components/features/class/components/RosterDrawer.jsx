import { memo, useEffect, useRef } from "react";
import { GripVertical, Lock, X } from "lucide-react";

import { animateDrawerIn } from "@/animation/classPageAnimation";
import { IconButton } from "@/components/ui";
import { useClasses } from "@/context/ClassContext";
import HealthSnapshot from "./HealthSnapshot";
import SubjectMatrix from "./SubjectMatrix";
import TeacherCard from "./TeacherCard";

/* Memoised per student so dragging one row leaves the other 30 alone. */
const RosterRow = memo(function RosterRow({
  student,
  classId,
  locked,
  attendanceThreshold,
  gradeThreshold,
  onDragStart,
  onDragEnd,
}) {
  const flagged =
    student.attendance < attendanceThreshold || student.grade < gradeThreshold;

  return (
    <li
      className={`roster-row${flagged ? " is-flagged" : ""}${
        locked ? " is-locked" : ""
      }`}
      draggable={!locked}
      onDragStart={() => onDragStart(student, classId)}
      onDragEnd={onDragEnd}>
      {locked ?
        <Lock className="roster-grip" aria-hidden="true" />
      : <GripVertical className="roster-grip" aria-hidden="true" />}
      <span className="roster-roll">{student.roll}</span>
      <img className="student-avatar" src={student.avatar} alt="" loading="lazy" />
      <span className="roster-meta">
        <strong>{student.name}</strong>
        <span className="cell-sub">{student.id}</span>
      </span>
      <span className="roster-figures">
        <span className={student.attendance < attendanceThreshold ? "is-low" : ""}>
          {student.attendance}%
        </span>
        <span className={student.grade < gradeThreshold ? "is-low" : ""}>
          {student.grade}%
        </span>
      </span>
    </li>
  );
});

const RosterDrawer = () => {
  const {
    drawerClass,
    closeDrawer,
    startDrag,
    endDrag,
    attendanceThreshold,
    gradeThreshold,
    filterView,
    filteredStudents,
    closeFilter,
  } = useClasses();

  const panelRef = useRef(null);
  const backdropRef = useRef(null);

  useEffect(() => {
    if (drawerClass) animateDrawerIn(panelRef.current, backdropRef.current);
  }, [drawerClass]);

  useEffect(() => {
    if (!drawerClass) return;
    const onKey = (e) => {
      if (e.key === "Escape") closeDrawer();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [drawerClass, closeDrawer]);

  if (!drawerClass) return null;

  const locked = drawerClass.archived;
  const list = filterView ? filteredStudents : drawerClass.students;

  return (
    <div className="drawer-layer">
      <div
        className="drawer-backdrop"
        ref={backdropRef}
        onClick={closeDrawer}
        aria-hidden="true"
      />
      <aside
        className={`roster-drawer${locked ? " is-locked" : ""}`}
        ref={panelRef}
        role="dialog"
        aria-modal="false"
        aria-label={`Roster for ${drawerClass.id}`}>
        <header className="drawer-head">
          <div>
            <h2>
              {drawerClass.id}
              {locked && (
                <span className="status-pill status-pill--muted">
                  <Lock />
                  Archived · read-only
                </span>
              )}
            </h2>
            <p className="cell-sub">
              {drawerClass.grade} · {drawerClass.enrolled} of{" "}
              {drawerClass.capacity} seats · {drawerClass.room}
            </p>
          </div>
          <IconButton icon={X} label="Close roster" onClick={closeDrawer} />
        </header>

        <div className="drawer-body">
          <TeacherCard />
          <HealthSnapshot />
          <SubjectMatrix />

          <section className="drawer-block">
            <h3>
              Roster
              {filterView && (
                <button
                  type="button"
                  className="filter-clear"
                  onClick={closeFilter}>
                  Showing {list.length} filtered · clear
                </button>
              )}
            </h3>

            {locked ?
              <p className="drawer-locked-note">
                <Lock />
                This class was archived on {drawerClass.archivedOn}. Its roster
                and results stay viewable, but nothing here can be edited or
                transferred.
              </p>
            : <p className="cell-sub drawer-drag-hint">
                Drag a row onto another section card to transfer that student.
              </p>
            }

            <ul className="roster-list">
              {list.map((student) => (
                <RosterRow
                  key={student.id}
                  student={student}
                  classId={drawerClass.id}
                  locked={locked}
                  attendanceThreshold={attendanceThreshold}
                  gradeThreshold={gradeThreshold}
                  onDragStart={startDrag}
                  onDragEnd={endDrag}
                />
              ))}
            </ul>
          </section>
        </div>
      </aside>
    </div>
  );
};

export default RosterDrawer;
