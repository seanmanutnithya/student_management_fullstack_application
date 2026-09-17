import { memo } from "react";
import { TriangleAlert, UserRoundX } from "lucide-react";

/* One grid cell. Memoised on the handful of primitives that actually change,
   so dragging across a 5x6 grid re-renders only the cells under the cursor. */
const SlotCell = memo(function SlotCell({
  lesson,
  day,
  periodId,
  slotKey,
  lens,
  isDragging,
  dropState,
  dropReason,
  conflict,
  absence,
  isFocused,
  onDragStart,
  onDragEnd,
  onDragOver,
  onDrop,
  onCover,
}) {
  const classes = [
    "slot-cell",
    isDragging && dropState === "invalid" && "is-blocked",
    isDragging && dropState === "valid" && "is-open",
    isFocused && "is-focused",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <td
      className={classes}
      data-slot-key={slotKey}
      onDragOver={(e) => {
        if (!isDragging) return;
        // preventDefault is what makes a cell a legal drop target
        if (dropState !== "invalid") e.preventDefault();
        onDragOver?.(day, periodId);
      }}
      onDrop={(e) => {
        e.preventDefault();
        onDrop(day, periodId);
      }}>
      {lesson ?
        <div
          className={`slot-lesson slot-lesson--${lesson.tone}${
            conflict ? " has-conflict" : ""
          }${absence ? " is-uncovered" : ""}`}
          draggable
          onDragStart={() => onDragStart(lesson)}
          onDragEnd={onDragEnd}
          title={`${lesson.subject} · ${lesson.teacher} · ${lesson.room}`}>
          <span className="slot-code">{lesson.code}</span>
          <span className="slot-meta">
            {lens === "class" ?
              lesson.teacher
            : lens === "teacher" ? lesson.classId
            : `${lesson.classId} · ${lesson.teacher}`}
          </span>
          <span className="slot-meta slot-meta--dim">
            {lens === "room" ? lesson.subject : lesson.room}
          </span>

          {conflict && (
            <span className="slot-flag slot-flag--conflict">
              <TriangleAlert />
              {conflict.type}
            </span>
          )}
          {absence && (
            <button
              type="button"
              className="slot-flag slot-flag--cover"
              onClick={(e) => {
                e.stopPropagation();
                onCover(lesson);
              }}>
              <UserRoundX />
              {lesson.coveredBy ? "Covered" : "Find cover"}
            </button>
          )}
        </div>
      : <span className="slot-empty">
          {isDragging && dropState === "invalid" ?
            <span className="slot-blocked-reason">{dropReason}</span>
          : "—"}
        </span>
      }
    </td>
  );
});

export default SlotCell;
