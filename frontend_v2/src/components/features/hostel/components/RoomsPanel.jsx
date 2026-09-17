import { memo } from "react";
import { BedDouble, ChevronRight, ShieldCheck, UserPlus, UserRoundX } from "lucide-react";

import { useTileReveal } from "@/animation/hostelPageAnimation";
import { Button } from "@/components/ui";
import { useHostel } from "@/context/HostelContext";

/* Memoised per room so drilling into one tile doesn't re-render the floor. */
const RoomTile = memo(function RoomTile({ room, isOpen, onOpen }) {
  return (
    <button
      type="button"
      className={`room-tile room-tile--${room.state}${isOpen ? " is-open" : ""}`}
      onClick={() => onOpen(isOpen ? null : room.id)}
      aria-pressed={isOpen}>
      <span className="room-number">{room.number}</span>
      {/* The count is printed, so the tile colour is a second reading. */}
      <span className="room-count">
        {room.occupied}/{room.beds}
      </span>
      <span className="room-beds" aria-hidden="true">
        {Array.from({ length: room.beds }, (_, i) => (
          <span
            key={i}
            className={`bed-pip${i < room.occupied ? " is-taken" : ""}`}
          />
        ))}
      </span>
      <span className="room-state">
        {room.state === "full" ? "Full"
        : room.state === "empty" ? "Empty"
        : `${room.free} free`}
      </span>
    </button>
  );
});

const RoomsPanel = ({ activeTab }) => {
  const {
    blocks,
    blockId,
    block,
    selectBlock,
    floor,
    setFloor,
    floorRooms,
    roomId,
    setRoomId,
    room,
    setAllocateFor,
    unassign,
    unassigned,
  } = useHostel();

  const isActive = activeTab === "rooms";
  useTileReveal([isActive, blockId, floor]);

  return (
    <section
      className={`hostel-panel${isActive ? " is-active" : ""}`}
      id="panel-rooms"
      role="tabpanel"
      aria-labelledby="tab-rooms">
      <div className="panel-head">
        <div>
          <h2>Room navigator</h2>
          <p>
            Block, then floor, then room. Tiles show how many beds are taken —
            allocation checks the block's own rule before it lets anyone in.
          </p>
        </div>
        {unassigned.length > 0 && (
          <span className="status-pill status-pill--amber">
            <UserRoundX />
            {unassigned.length} without a room
          </span>
        )}
      </div>

      {/* Breadcrumb drill-down */}
      <nav className="drill-trail" aria-label="Location">
        <div className="drill-level">
          {blocks.map((b) => (
            <button
              key={b.id}
              type="button"
              className={`drill-chip${b.id === blockId ? " is-active" : ""}`}
              onClick={() => selectBlock(b.id)}>
              {b.name.split("·")[0].trim()}
            </button>
          ))}
        </div>
        <ChevronRight className="drill-arrow" aria-hidden="true" />
        <div className="drill-level">
          {block.floors.map((f) => (
            <button
              key={f}
              type="button"
              className={`drill-chip${f === floor ? " is-active" : ""}`}
              onClick={() => {
                setFloor(f);
                setRoomId(null);
              }}>
              Floor {f}
            </button>
          ))}
        </div>
      </nav>

      <p className="block-rule">
        <ShieldCheck />
        {block.rule}
      </p>

      <div className="room-grid">
        {floorRooms.map((r) => (
          <RoomTile
            key={r.id}
            room={r}
            isOpen={r.id === roomId}
            onOpen={setRoomId}
          />
        ))}
      </div>

      <div className="room-key">
        <span>
          <span className="legend-swatch room-tile--empty" />
          Empty
        </span>
        <span>
          <span className="legend-swatch room-tile--partial" />
          Partly filled
        </span>
        <span>
          <span className="legend-swatch room-tile--full" />
          Full
        </span>
      </div>

      {room && (
        <section className="room-detail">
          <header className="room-detail-head">
            <div>
              <h3>
                Room {room.number}
                <span className="cell-sub">
                  {room.block.name} · floor {room.floor} · {room.occupied} of{" "}
                  {room.beds} beds
                </span>
              </h3>
            </div>
            <Button
              size="sm"
              icon={UserPlus}
              disabled={room.free <= 0}
              onClick={() => setAllocateFor(room)}>
              {room.free > 0 ? `Allocate (${room.free} free)` : "Room full"}
            </Button>
          </header>

          {room.occupants.length === 0 ?
            <p className="cell-sub">
              Nobody is in this room yet — all {room.beds} beds are free.
            </p>
          : <ul className="occupant-list">
              {room.occupants.map((person) => (
                <li className="occupant-row" key={person.id}>
                  <img
                    className="student-avatar"
                    src={person.avatar}
                    alt=""
                    loading="lazy"
                  />
                  <span className="occupant-meta">
                    <strong>{person.name}</strong>
                    <span className="cell-sub">
                      {person.id} · Grade {person.grade} · {person.classId}
                    </span>
                  </span>
                  <span className="occupant-bed">
                    <BedDouble />
                    Bed {room.occupants.indexOf(person) + 1}
                  </span>
                  <button
                    className="row-action-btn delete"
                    aria-label={`Check ${person.name} out of the room`}
                    onClick={() => unassign(person.id)}>
                    <UserRoundX />
                  </button>
                </li>
              ))}
            </ul>
          }
        </section>
      )}
    </section>
  );
};

export default RoomsPanel;
