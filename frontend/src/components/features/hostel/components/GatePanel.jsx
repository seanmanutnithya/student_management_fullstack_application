import { memo } from "react";
import { ArrowLeftRight, DoorOpen, LogIn, LogOut } from "lucide-react";

import { useStaggerReveal } from "@/animation/reveal";
import { Button } from "@/components/ui";
import { useHostel } from "@/context/HostelContext";

const timeOf = (stamp) =>
  new Date(stamp).toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
  });

const dayOf = (stamp) =>
  new Date(stamp).toLocaleDateString(undefined, {
    day: "2-digit",
    month: "short",
  });

const GateRow = memo(function GateRow({ entry }) {
  return (
    <li className={`gate-row gate-row--${entry.type}`}>
      <span className={`gate-icon gate-icon--${entry.type}`}>
        {entry.type === "out" ? <LogOut /> : <LogIn />}
      </span>
      <span className="gate-meta">
        <strong>{entry.resident?.name ?? "Unknown resident"}</strong>
        <span className="cell-sub">{entry.reason}</span>
      </span>
      <span className="gate-time">
        <strong>{timeOf(entry.at)}</strong>
        <span className="cell-sub">{dayOf(entry.at)}</span>
      </span>
      <span className={`gate-tag gate-tag--${entry.type}`}>
        {entry.type === "out" ? "Checked out" : "Checked in"}
      </span>
    </li>
  );
});

const GatePanel = ({ activeTab }) => {
  const { gateRows, currentlyOut, setGateOpen } = useHostel();
  const isActive = activeTab === "gate";

  useStaggerReveal(".gate-row", [isActive, gateRows.length], {
    y: 6,
    duration: 0.3,
    stagger: 0.02,
  });

  return (
    <section
      className={`hostel-panel${isActive ? " is-active" : ""}`}
      id="panel-gate"
      role="tabpanel"
      aria-labelledby="tab-gate">
      <div className="panel-head">
        <div>
          <h2>Gate log</h2>
          <p>
            Whoever is in or out is worked out from the latest entry per
            resident — there's no separate flag to fall out of step.
          </p>
        </div>
        <Button icon={ArrowLeftRight} onClick={() => setGateOpen(true)}>
          Record movement
        </Button>
      </div>

      <section className="currently-out">
        <h3>
          <DoorOpen />
          Currently out
          <span
            className={`status-pill ${currentlyOut.length ? "status-pill--amber" : "status-pill--green"}`}>
            {currentlyOut.length}
          </span>
        </h3>

        {currentlyOut.length === 0 ?
          <p className="cell-sub">Everyone is signed back in.</p>
        : <ul className="out-list">
            {currentlyOut.map((person) => (
              <li className="out-row" key={person.id}>
                <img
                  className="student-avatar"
                  src={person.avatar}
                  alt=""
                  loading="lazy"
                />
                <span className="out-meta">
                  <strong>{person.name}</strong>
                  <span className="cell-sub">
                    {person.entry.reason} · out since {timeOf(person.entry.at)}
                  </span>
                </span>
                <span className="cell-sub out-since">
                  {dayOf(person.entry.at)}
                </span>
              </li>
            ))}
          </ul>
        }
      </section>

      <section className="gate-history">
        <h3>Recent movements</h3>
        <ul className="gate-list">
          {gateRows.slice(0, 20).map((entry) => (
            <GateRow key={entry.id} entry={entry} />
          ))}
        </ul>
      </section>
    </section>
  );
};

export default GatePanel;
