import { memo } from "react";
import { DoorOpen, Phone, Search, SearchX, UserRoundX } from "lucide-react";

import { useStaggerReveal } from "@/animation/reveal";
import { Field } from "@/components/ui";
import { useHostel } from "@/context/HostelContext";

const ResidentRow = memo(function ResidentRow({ resident, isOut }) {
  return (
    <li className="resident-row" data-resident-id={resident.id}>
      <img className="student-avatar" src={resident.avatar} alt="" loading="lazy" />

      <span className="resident-meta">
        <strong>
          {resident.name}
          {isOut && (
            <span className="status-pill status-pill--amber">
              <DoorOpen />
              Out
            </span>
          )}
        </strong>
        <span className="cell-sub">
          {resident.id} · Grade {resident.grade} · {resident.classId}
        </span>
      </span>

      <span className="resident-room">
        {resident.room ?
          <>
            <strong>Room {resident.room.number}</strong>
            <span className="cell-sub">
              {resident.room.block.name.split("·")[0].trim()} · floor{" "}
              {resident.room.floor}
            </span>
          </>
        : <>
            <strong className="is-unassigned">
              <UserRoundX />
              No room
            </strong>
            <span className="cell-sub">Awaiting allocation</span>
          </>
        }
      </span>

      <span className="resident-guardian">
        <strong>{resident.guardianName}</strong>
        <span className="cell-sub">
          <Phone />
          {resident.guardianPhone}
        </span>
      </span>
    </li>
  );
});

const ResidentsPanel = ({ activeTab }) => {
  const {
    directory,
    residents,
    query,
    setQuery,
    blockFilter,
    setBlockFilter,
    statusFilter,
    setStatusFilter,
    blocks,
    gateState,
  } = useHostel();

  const isActive = activeTab === "residents";
  useStaggerReveal(".resident-row", [isActive, query, blockFilter, statusFilter], {
    y: 6,
    duration: 0.3,
    stagger: 0.02,
  });

  return (
    <section
      className={`hostel-panel${isActive ? " is-active" : ""}`}
      id="panel-residents"
      role="tabpanel"
      aria-labelledby="tab-residents">
      <div className="panel-head">
        <div>
          <h2>Resident directory</h2>
          <p>Everyone living on site, with their room and guardian contact.</p>
        </div>
      </div>

      <div className="hostel-toolbar">
        <div className="search-field search-field--sm">
          <Search />
          <input
            type="text"
            placeholder="Search name, ID, class or room"
            aria-label="Search residents"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        <Field label="Block" htmlFor="residentBlock" className="hostel-field">
          <select
            id="residentBlock"
            value={blockFilter}
            onChange={(e) => setBlockFilter(e.target.value)}>
            <option value="">All blocks</option>
            {blocks.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Status" htmlFor="residentStatus" className="hostel-field">
          <select
            id="residentStatus"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="">Everyone</option>
            <option value="housed">Has a room</option>
            <option value="unassigned">No room yet</option>
            <option value="out">Currently out</option>
          </select>
        </Field>

        <span className="results-note">
          <strong>{directory.length}</strong> of {residents.length} residents
        </span>
      </div>

      {directory.length === 0 ?
        <div className="hostel-empty">
          <SearchX />
          <h3>Nobody matches</h3>
          <p>Try a different name, or clear the block and status filters.</p>
        </div>
      : <ul className="resident-list">
          {directory.map((resident) => (
            <ResidentRow
              key={resident.id}
              resident={resident}
              isOut={gateState[resident.id]?.type === "out"}
            />
          ))}
        </ul>
      }
    </section>
  );
};

export default ResidentsPanel;
