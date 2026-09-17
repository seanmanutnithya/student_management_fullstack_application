import { memo } from "react";
import {
  BadgeCheck,
  CircleCheck,
  IdCard,
  Phone,
  TriangleAlert,
  UserRoundCog,
  UserRoundX,
} from "lucide-react";

import { useStaggerReveal } from "@/animation/reveal";
import { Button } from "@/components/ui";
import { useBus } from "@/context/BusContext";
import { formatDate } from "@/utils/format";

/* One chip for every dated document — the wording carries the state so it
   never reads by colour alone. */
const ExpiryChip = ({ label, date, status }) => {
  const { state, days } = status;
  const copy =
    state === "expired" ? `Expired ${Math.abs(days)}d ago`
    : state === "soon" ? `${days}d left`
    : `Valid · ${days}d`;

  return (
    <span className={`expiry-chip expiry-chip--${state}`}>
      {state === "ok" ? <CircleCheck /> : <TriangleAlert />}
      <span>
        <strong>{label}</strong>
        <span className="cell-sub">
          {formatDate(date)} · {copy}
        </span>
      </span>
    </span>
  );
};

const BusCard = memo(function BusCard({ bus, onCrew, warnDays }) {
  return (
    <article
      className={`fleet-card fleet-card--${bus.worst}`}
      data-bus-id={bus.id}>
      <header className="fleet-head">
        <div>
          <strong>{bus.number}</strong>
          <span className="cell-sub">
            {bus.plate} · {bus.model}
          </span>
        </div>
        <span className="fleet-capacity">
          <strong>{bus.capacity}</strong>
          <span className="cell-sub">seats</span>
        </span>
      </header>

      <div className="expiry-row">
        <ExpiryChip
          label="Insurance"
          date={bus.insuranceExpiry}
          status={bus.insurance}
        />
        <ExpiryChip
          label="Inspection"
          date={bus.inspectionExpiry}
          status={bus.inspection}
        />
      </div>

      <div className="crew-block">
        <div className="crew-row">
          <span className="crew-icon">
            <UserRoundCog />
          </span>
          {bus.driver ?
            <span className="crew-meta">
              <strong>{bus.driver.name}</strong>
              <span className="cell-sub">
                <IdCard />
                {bus.driver.license} · licence{" "}
                {bus.licence.state === "expired" ?
                  `expired ${Math.abs(bus.licence.days)}d ago`
                : `valid ${bus.licence.days}d`}
              </span>
              <span className="cell-sub">
                <Phone />
                {bus.driver.phone}
              </span>
            </span>
          : <span className="crew-meta crew-meta--empty">
              <strong>
                <UserRoundX />
                No driver assigned
              </strong>
              <span className="cell-sub">
                This bus can't run a route until a driver is set.
              </span>
            </span>
          }
        </div>

        <div className="crew-row">
          <span className="crew-icon">
            <BadgeCheck />
          </span>
          {bus.attendant ?
            <span className="crew-meta">
              <strong>{bus.attendant.name}</strong>
              <span className="cell-sub">
                Attendant · {bus.attendant.phone}
              </span>
            </span>
          : <span className="crew-meta crew-meta--empty">
              <strong>
                <UserRoundX />
                No attendant assigned
              </strong>
            </span>
          }
        </div>
      </div>

      {bus.licence?.state === "expired" && (
        <p className="bus-warning bus-warning--sm">
          <TriangleAlert />
          {bus.driver.name}'s licence has expired — they cannot legally drive
          this route.
        </p>
      )}

      <footer className="fleet-foot">
        <span className="cell-sub">
          Documents flag amber {warnDays} days out
        </span>
        <Button size="sm" variant="secondary" onClick={() => onCrew(bus)}>
          Assign crew
        </Button>
      </footer>
    </article>
  );
});

const FleetPanel = ({ activeTab }) => {
  const { fleet, setCrewModal, warnDays } = useBus();
  const isActive = activeTab === "fleet";

  useStaggerReveal(".fleet-card", [isActive], {
    y: 12,
    duration: 0.35,
    stagger: 0.05,
  });

  const alerts = fleet.filter((b) => b.worst !== "ok").length;
  const crewless = fleet.filter((b) => b.unassigned).length;

  return (
    <section
      className={`bus-panel${isActive ? " is-active" : ""}`}
      id="panel-fleet"
      role="tabpanel"
      aria-labelledby="tab-fleet">
      <div className="panel-head">
        <div>
          <h2>Fleet registry</h2>
          <p>
            Insurance, inspection and driving licences all flag amber{" "}
            {warnDays} days before they lapse, and red once they have.
          </p>
        </div>
        <div className="fleet-tally">
          <span className={`status-pill ${alerts ? "status-pill--red" : "status-pill--green"}`}>
            {alerts} document alert{alerts === 1 ? "" : "s"}
          </span>
          <span className={`status-pill ${crewless ? "status-pill--amber" : "status-pill--green"}`}>
            {crewless} unassigned
          </span>
        </div>
      </div>

      <div className="fleet-grid">
        {fleet.map((bus) => (
          <BusCard
            key={bus.id}
            bus={bus}
            warnDays={warnDays}
            onCrew={(b) => setCrewModal(b)}
          />
        ))}
      </div>
    </section>
  );
};

export default FleetPanel;
