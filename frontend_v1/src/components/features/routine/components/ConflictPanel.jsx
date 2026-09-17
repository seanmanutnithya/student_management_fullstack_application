import { memo } from "react";
import { CircleCheck, CornerUpRight, TriangleAlert } from "lucide-react";

import { useStaggerReveal } from "@/animation/reveal";
import { useRoutine } from "@/context/RoutineContext";

const TYPE_COPY = {
  teacher: "Teacher double-booked",
  room: "Room double-booked",
  class: "Class double-booked",
};

const ConflictRow = memo(function ConflictRow({ conflict, periodLabel, onJump }) {
  return (
    <li className={`conflict-row conflict-row--${conflict.type}`}>
      <span className="conflict-icon">
        <TriangleAlert />
      </span>
      <div className="conflict-meta">
        <strong>{TYPE_COPY[conflict.type]}</strong>
        <span className="cell-sub">
          {conflict.value} · {conflict.day}, {periodLabel}
        </span>
        <span className="conflict-lessons">
          {conflict.lessons
            .map((l) => `${l.classId} ${l.code}`)
            .join("  vs  ")}
        </span>
      </div>
      <button
        type="button"
        className="conflict-jump"
        onClick={() => onJump(conflict)}>
        <CornerUpRight />
        Jump to slot
      </button>
    </li>
  );
});

const ConflictPanel = () => {
  const { conflicts, periods, jumpToSlot } = useRoutine();

  useStaggerReveal(".conflict-row", [conflicts.length], {
    y: 8,
    duration: 0.32,
    stagger: 0.04,
  });

  const labelOf = (periodId) =>
    periods.find((p) => p.id === periodId)?.label ?? periodId;

  return (
    <section className="routine-aside">
      <header className="aside-head">
        <h3>
          <TriangleAlert />
          Conflicts
        </h3>
        <span
          className={`status-pill ${
            conflicts.length ? "status-pill--red" : "status-pill--green"
          }`}>
          {conflicts.length}
        </span>
      </header>

      {conflicts.length === 0 ?
        <p className="conflict-clear">
          <CircleCheck />
          No clashes anywhere in the week.
        </p>
      : <ul className="conflict-list">
          {conflicts.map((conflict) => (
            <ConflictRow
              key={conflict.id}
              conflict={conflict}
              periodLabel={labelOf(conflict.periodId)}
              onJump={jumpToSlot}
            />
          ))}
        </ul>
      }
    </section>
  );
};

export default ConflictPanel;
