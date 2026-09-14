import { useEffect } from "react";
import { Coffee, TriangleAlert } from "lucide-react";

import { flashSlot, useGridReveal } from "@/animation/routinePageAnimation";
import { useRoutine } from "@/context/RoutineContext";
import SlotCell from "./SlotCell";

const TimetableGrid = () => {
  const {
    days,
    periods,
    grid,
    lens,
    selectedKey,
    dragging,
    startDrag,
    endDrag,
    previewDrop,
    moveLesson,
    lessonConflicts,
    affectedLessons,
    substituteMode,
    setCoverFor,
    focusedSlot,
    template,
    offTemplate,
  } = useRoutine();

  useGridReveal([lens, selectedKey, template.id]);

  // Pull the eye to whatever the conflict dashboard just jumped to.
  useEffect(() => {
    if (focusedSlot) flashSlot(focusedSlot);
  }, [focusedSlot]);

  return (
    <div className="timetable-wrap">
      {offTemplate.length > 0 && (
        <p className="timetable-note">
          <TriangleAlert />
          {offTemplate.length} period{offTemplate.length === 1 ? "" : "s"} sit
          outside the <strong>{template.name}</strong> bell schedule and are
          hidden from this grid. Switch template or move them.
        </p>
      )}

      <div className="table-wrap">
        <table className="timetable">
          <thead>
            <tr>
              <th className="timetable-corner">Period</th>
              {days.map((day) => (
                <th key={day}>{day}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {periods.map((period) =>
              period.isBreak ?
                <tr className="timetable-break" key={period.id}>
                  <th scope="row">
                    <span className="period-label">
                      <Coffee />
                      {period.label}
                    </span>
                    <span className="period-time">
                      {period.start}–{period.end}
                    </span>
                  </th>
                  <td colSpan={days.length}>{period.label}</td>
                </tr>
              : <tr key={period.id}>
                  <th scope="row">
                    <span className="period-label">{period.label}</span>
                    <span className="period-time">
                      {period.start}–{period.end}
                    </span>
                  </th>

                  {days.map((day) => {
                    const lesson = grid[day]?.[period.id] ?? null;
                    const slotKey = `${day}|${period.id}`;
                    const check =
                      dragging ? previewDrop(dragging, day, period.id) : null;
                    const conflict = lesson ?
                        (lessonConflicts[lesson.id]?.[0] ?? null)
                      : null;
                    const absence =
                      lesson && substituteMode ?
                        (affectedLessons[lesson.id] ?? null)
                      : null;

                    return (
                      <SlotCell
                        key={slotKey}
                        lesson={lesson}
                        day={day}
                        periodId={period.id}
                        slotKey={slotKey}
                        lens={lens}
                        isDragging={Boolean(dragging)}
                        dropState={
                          !dragging ? "idle"
                          : check?.ok ? "valid"
                          : "invalid"
                        }
                        dropReason={check?.reason ?? ""}
                        conflict={conflict}
                        absence={absence}
                        isFocused={focusedSlot === slotKey}
                        onDragStart={startDrag}
                        onDragEnd={endDrag}
                        onDrop={(d, p) => dragging && moveLesson(dragging, d, p)}
                        onCover={setCoverFor}
                      />
                    );
                  })}
                </tr>,
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TimetableGrid;
