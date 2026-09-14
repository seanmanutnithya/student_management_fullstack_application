import { useEffect } from "react";
import { BedDouble } from "lucide-react";

import { animateBars } from "@/animation/hostelPageAnimation";
import { useHostel } from "@/context/HostelContext";

const OccupancyPanel = ({ activeTab }) => {
  const { blockStats, totals, roomsWithSpace, setRoomId, setActiveTab, selectBlock, setFloor } =
    useHostel();

  const isActive = activeTab === "occupancy";

  useEffect(() => {
    if (isActive) animateBars();
  }, [isActive, blockStats]);

  const jumpToRoom = (room) => {
    selectBlock(room.blockId);
    setFloor(room.floor);
    setRoomId(room.id);
    setActiveTab("rooms");
  };

  return (
    <section
      className={`hostel-panel${isActive ? " is-active" : ""}`}
      id="panel-occupancy"
      role="tabpanel"
      aria-labelledby="tab-occupancy">
      <div className="panel-head">
        <div>
          <h2>Occupancy</h2>
          <p>
            {totals.occupied} of {totals.beds} beds are taken across the site —{" "}
            {totals.vacant} free.
          </p>
        </div>
        <span className="occupancy-headline">
          <strong>{totals.percent}%</strong>
          <span className="cell-sub">site occupancy</span>
        </span>
      </div>

      <ul className="block-stats">
        {blockStats.map((block) => (
          <li className="block-stat" key={block.id}>
            <span className="block-stat-name">
              <strong>{block.name}</strong>
              <span className="cell-sub">{block.rule}</span>
            </span>

            <span className="block-track" aria-hidden="true">
              <span
                className={`hostel-bar-fill${
                  block.percent >= 95 ? " is-full"
                  : block.percent >= 75 ? " is-tight"
                  : ""
                }`}
                data-share={block.percent}
                style={{ width: 0 }}
              />
            </span>

            <span className="block-figures">
              <strong>{block.percent}%</strong>
              <span className="cell-sub">
                {block.occupied}/{block.beds} · {block.vacant} free
              </span>
            </span>
          </li>
        ))}
      </ul>

      <section className="free-beds">
        <h3>
          <BedDouble />
          Rooms with free beds
        </h3>
        {roomsWithSpace.length === 0 ?
          <p className="cell-sub">Every room is full.</p>
        : <div className="free-bed-grid">
            {roomsWithSpace.map((room) => (
              <button
                key={room.id}
                type="button"
                className="free-bed-card"
                onClick={() => jumpToRoom(room)}>
                <strong>Room {room.number}</strong>
                <span className="cell-sub">
                  {room.block.name.split("·")[0].trim()} · floor {room.floor}
                </span>
                <span className="free-bed-count">
                  {room.free} free of {room.beds}
                </span>
              </button>
            ))}
          </div>
        }
      </section>
    </section>
  );
};

export default OccupancyPanel;
