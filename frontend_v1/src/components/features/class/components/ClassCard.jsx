import { memo, useState } from "react";
import { DoorOpen, TriangleAlert, UserRound } from "lucide-react";

import CapacityRing from "./CapacityRing";

const STATE_COPY = {
  ok: "Room to spare",
  near: "Nearly full",
  over: "Over capacity",
};

/* Memoised so dragging a student over one card doesn't re-render the grid. */
const ClassCard = memo(function ClassCard({
  klass,
  isDropTarget,
  doubleHomeroom,
  onOpen,
  onDropStudent,
  onDragOverCard,
}) {
  const [isOver, setIsOver] = useState(false);

  const handleDragOver = (e) => {
    if (!isDropTarget) return;
    e.preventDefault(); // required for the drop to fire
    onDragOverCard?.(klass.id);
    setIsOver(true);
  };

  return (
    <article
      className={`class-card-shell${isOver ? " is-drop-target" : ""}${
        klass.archived ? " is-archived" : ""
      }`}
      data-class-id={klass.id}
      onDragOver={handleDragOver}
      onDragLeave={() => setIsOver(false)}
      onDrop={(e) => {
        e.preventDefault();
        setIsOver(false);
        onDropStudent?.(klass.id);
      }}>
      <button
        type="button"
        className="class-card"
        onClick={() => onOpen(klass.id)}
        aria-label={`Open roster for ${klass.id}`}>
        <header className="class-card-head">
          <div>
            <span className="class-card-id">{klass.id}</span>
            <span className="cell-sub">{klass.grade}</span>
          </div>
          <span className={`status-pill status-pill--${
            klass.capacityState === "over" ? "red"
            : klass.capacityState === "near" ? "amber"
            : "green"
          }`}>
            {STATE_COPY[klass.capacityState]}
          </span>
        </header>

        <CapacityRing
          enrolled={klass.enrolled}
          capacity={klass.capacity}
          fill={klass.fill}
          state={klass.capacityState}
        />

        <dl className="class-card-meta">
          <div>
            <dt>Homeroom</dt>
            <dd className="class-card-teacher">
              <UserRound />
              {klass.homeroom}
              {doubleHomeroom && (
                <TriangleAlert
                  className="class-card-warn"
                  aria-label="Holds more than one homeroom"
                />
              )}
            </dd>
          </div>
          <div>
            <dt>Room</dt>
            <dd>
              <DoorOpen />
              {klass.room}
            </dd>
          </div>
          <div>
            <dt>Attendance</dt>
            <dd>{klass.attendance}%</dd>
          </div>
          <div>
            <dt>Average grade</dt>
            <dd>{klass.averageGrade}%</dd>
          </div>
        </dl>

        <footer className="class-card-foot">
          {klass.seatsLeft > 0 ?
            `${klass.seatsLeft} seat${klass.seatsLeft === 1 ? "" : "s"} free`
          : klass.seatsLeft === 0 ? "Full"
          : `${Math.abs(klass.seatsLeft)} over capacity`}
          {klass.unassignedSubjects > 0 && (
            <span className="class-card-gap">
              <TriangleAlert />
              {klass.unassignedSubjects} subject
              {klass.unassignedSubjects === 1 ? "" : "s"} unassigned
            </span>
          )}
        </footer>
      </button>
    </article>
  );
});

export default ClassCard;
