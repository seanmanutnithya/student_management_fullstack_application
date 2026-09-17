import { memo, useEffect } from "react";
import { CircleCheck, TriangleAlert } from "lucide-react";

import { animateBars } from "@/animation/busPageAnimation";
import { useBus } from "@/context/BusContext";

/* Each bar prints its own headcount, so the fill is a second reading of the
   number rather than the only one. */
const OccupancyRow = memo(function OccupancyRow({ row, max }) {
  const state =
    row.overCapacity ? "over"
    : row.fill >= 0.9 ? "tight"
    : "ok";

  return (
    <li className={`occupancy-row occupancy-row--${state}`}>
      <span className="occupancy-name">
        <strong>{row.name}</strong>
        <span className="cell-sub">
          {row.bus ? `${row.bus.number} · ${row.bus.plate}` : "No bus assigned"}
        </span>
      </span>

      <span className="occupancy-track" aria-hidden="true">
        <span
          className={`bus-bar-fill bus-bar-fill--${state}`}
          data-share={Math.min(100, (row.assigned / max) * 100)}
          style={{ width: 0 }}
        />
        <span
          className="occupancy-cap"
          style={{ left: `${Math.min(100, (row.capacity / max) * 100)}%` }}
          title={`Capacity ${row.capacity}`}
        />
      </span>

      <span className="occupancy-figures">
        <strong>
          {row.assigned}/{row.capacity}
        </strong>
        <span className="cell-sub">
          {row.overCapacity ?
            `${row.assigned - row.capacity} over`
          : `${row.seatsLeft} seat${row.seatsLeft === 1 ? "" : "s"} free`}
        </span>
      </span>
    </li>
  );
});

const OccupancyPanel = ({ activeTab }) => {
  const { occupancy } = useBus();
  const isActive = activeTab === "occupancy";

  useEffect(() => {
    if (isActive) animateBars();
  }, [isActive, occupancy]);

  const over = occupancy.filter((r) => r.overCapacity);
  const max = Math.max(...occupancy.map((r) => Math.max(r.assigned, r.capacity)), 1);

  return (
    <section
      className={`bus-panel${isActive ? " is-active" : ""}`}
      id="panel-occupancy"
      role="tabpanel"
      aria-labelledby="tab-occupancy">
      <div className="panel-head">
        <div>
          <h2>Occupancy</h2>
          <p>
            Assigned riders against seats on the bus. Over-capacity routes sort
            to the top — every rider past the line has nowhere to sit.
          </p>
        </div>
        <span
          className={`status-pill ${over.length ? "status-pill--red" : "status-pill--green"}`}>
          {over.length ?
            <>
              <TriangleAlert />
              {over.length} over capacity
            </>
          : <>
              <CircleCheck />
              All within capacity
            </>
          }
        </span>
      </div>

      <ul className="occupancy-list">
        {occupancy.map((row) => (
          <OccupancyRow key={row.id} row={row} max={max} />
        ))}
      </ul>

      <p className="occupancy-key cell-sub">
        The notch on each bar marks that bus's seat count.
      </p>
    </section>
  );
};

export default OccupancyPanel;
