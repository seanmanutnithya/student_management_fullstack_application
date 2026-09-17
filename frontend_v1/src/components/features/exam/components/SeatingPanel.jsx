import { CircleCheck, LayoutGrid, TriangleAlert } from "lucide-react";

import { useStaggerReveal } from "@/animation/reveal";
import { Field, Switch } from "@/components/ui";
import { useExams } from "@/context/ExamContext";

const SeatingPanel = ({ activeTab }) => {
  const {
    seating,
    seatRooms,
    seatingRoomId,
    setSeatingRoomId,
    spaceOutClasses,
    setSpaceOutClasses,
  } = useExams();

  const isActive = activeTab === "seating";
  useStaggerReveal(".seat", [isActive, seatingRoomId, spaceOutClasses], {
    y: 6,
    duration: 0.28,
    stagger: 0.01,
  });

  const { room, seats, capacity, seated, adjacentSameClass } = seating;
  const overflow = seated > capacity;

  return (
    <section
      className={`exam-panel${isActive ? " is-active" : ""}`}
      id="panel-seating"
      role="tabpanel"
      aria-labelledby="tab-seating">
      <div className="panel-head">
        <div>
          <h2>Seating plan</h2>
          <p>
            {room.rows} rows × {room.cols} columns · {capacity} seats.
            Interleaving the sections keeps neighbours from the same class
            apart.
          </p>
        </div>
        <div className="panel-head-actions">
          <Field label="Room" htmlFor="seatRoom" className="lens-field">
            <select
              id="seatRoom"
              value={seatingRoomId}
              onChange={(e) => setSeatingRoomId(e.target.value)}>
              {seatRooms.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.id} ({r.rows * r.cols} seats)
                </option>
              ))}
            </select>
          </Field>
          <label className="seat-toggle">
            <span>
              <strong>Space out classes</strong>
              <span className="cell-sub">Alternate 10A and 10B</span>
            </span>
            <Switch
              id="spaceOut"
              checked={spaceOutClasses}
              onChange={setSpaceOutClasses}
              label="Space out classes"
            />
          </label>
        </div>
      </div>

      <div className="seating-status">
        <span
          className={`status-pill ${
            adjacentSameClass === 0 ? "status-pill--green" : "status-pill--amber"
          }`}>
          {adjacentSameClass === 0 ?
            <>
              <CircleCheck />
              No same-class neighbours
            </>
          : <>
              <TriangleAlert />
              {adjacentSameClass} same-class neighbour
              {adjacentSameClass === 1 ? "" : "s"}
            </>
          }
        </span>
        <span className="cell-sub">
          {Math.min(seated, capacity)} of {capacity} seats filled
          {overflow && ` · ${seated - capacity} student(s) need another room`}
        </span>
      </div>

      {overflow && (
        <p className="seating-warning">
          <TriangleAlert />
          {room.id} seats {capacity}, but {seated} students are sitting this
          paper. Pick a larger room or split the cohort.
        </p>
      )}

      <div
        className="seat-grid"
        style={{ gridTemplateColumns: `repeat(${room.cols}, minmax(0, 1fr))` }}>
        {seats.map((seat) => (
          <div
            className={`seat${seat.student ? "" : " is-empty"}${
              seat.student ? ` seat--${seat.student.classId.toLowerCase()}` : ""
            }`}
            key={seat.seat}>
            <span className="seat-number">{seat.seat}</span>
            {seat.student ?
              <>
                <span className="seat-name">{seat.student.name}</span>
                <span className="seat-class">{seat.student.classId}</span>
              </>
            : <span className="seat-empty-label">
                <LayoutGrid />
                Free
              </span>
            }
          </div>
        ))}
      </div>

      <div className="seat-key">
        <span>
          <span className="legend-swatch seat--10a" />
          10A
        </span>
        <span>
          <span className="legend-swatch seat--10b" />
          10B
        </span>
        <span>
          <span className="legend-swatch seat-key-empty" />
          Free seat
        </span>
      </div>
    </section>
  );
};

export default SeatingPanel;
