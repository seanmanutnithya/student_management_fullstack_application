import { CircleCheck, Phone, ShieldCheck, TriangleAlert, UserRoundX } from "lucide-react";

import { useStaggerReveal } from "@/animation/reveal";
import { useHostel } from "@/context/HostelContext";

/* A block × shift grid: an empty cell is a stretch of hours with nobody on
   duty, which is the thing worth seeing. */
const WardensPanel = ({ activeTab }) => {
  const { wardenGrid, uncovered, shifts } = useHostel();
  const isActive = activeTab === "wardens";

  useStaggerReveal(".warden-cell", [isActive], {
    y: 8,
    duration: 0.32,
    stagger: 0.04,
  });

  return (
    <section
      className={`hostel-panel${isActive ? " is-active" : ""}`}
      id="panel-wardens"
      role="tabpanel"
      aria-labelledby="tab-wardens">
      <div className="panel-head">
        <div>
          <h2>Warden roster</h2>
          <p>
            Every block needs cover on both shifts. Gaps are flagged — a block
            with no night warden has nobody on site overnight.
          </p>
        </div>
        <span
          className={`status-pill ${uncovered.length ? "status-pill--red" : "status-pill--green"}`}>
          {uncovered.length ?
            <>
              <TriangleAlert />
              {uncovered.length} shift{uncovered.length === 1 ? "" : "s"}{" "}
              uncovered
            </>
          : <>
              <CircleCheck />
              Fully covered
            </>
          }
        </span>
      </div>

      {uncovered.length > 0 && (
        <p className="hostel-warning">
          <TriangleAlert />
          No warden on duty for{" "}
          {uncovered
            .map((u) => `${u.block.name.split("·")[0].trim()} ${u.shift.label.toLowerCase()}`)
            .join(", ")}
          .
        </p>
      )}

      <div className="warden-grid">
        <div className="warden-head" aria-hidden="true">
          <span>Block</span>
          {shifts.map((s) => (
            <span key={s.value}>
              {s.label}
              <span className="cell-sub">{s.window}</span>
            </span>
          ))}
        </div>

        {wardenGrid.map((block) => (
          <div className="warden-row" key={block.id}>
            <span className="warden-block">
              <strong>{block.name}</strong>
              <span className="cell-sub">
                <ShieldCheck />
                {block.rule}
              </span>
            </span>

            {block.shifts.map((shift) => (
              <div
                className={`warden-cell${shift.warden ? "" : " is-empty"}`}
                key={shift.value}>
                {shift.warden ?
                  <>
                    <strong>{shift.warden.name}</strong>
                    <span className="cell-sub">
                      {shift.warden.start} – {shift.warden.end}
                    </span>
                    <span className="cell-sub">
                      <Phone />
                      {shift.warden.phone}
                    </span>
                  </>
                : <>
                    <strong className="is-unassigned">
                      <UserRoundX />
                      No warden
                    </strong>
                    <span className="cell-sub">{shift.window} uncovered</span>
                  </>
                }
              </div>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
};

export default WardensPanel;
