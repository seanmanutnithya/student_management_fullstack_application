import { CircleCheck, Gauge, Plus, TriangleAlert, Wrench } from "lucide-react";

import { useStaggerReveal } from "@/animation/reveal";
import { SEVERITIES } from "@/assets/data/busSeed";
import { Button, Field } from "@/components/ui";
import { useBus } from "@/context/BusContext";
import { formatDate } from "@/utils/format";

const MaintenancePanel = ({ activeTab }) => {
  const { fleet, bus, busId, setBusId, busMaintenance, setIncidentOpen } =
    useBus();

  const isActive = activeTab === "maintenance";
  useStaggerReveal(".service-row, .incident-row", [isActive, busId], {
    y: 8,
    duration: 0.32,
    stagger: 0.04,
  });

  if (!bus) return null;

  const { services, incidents, nextServiceDue, nextServiceOdometer, due } =
    busMaintenance;
  const overdue = due.state === "expired";

  return (
    <section
      className={`bus-panel${isActive ? " is-active" : ""}`}
      id="panel-maintenance"
      role="tabpanel"
      aria-labelledby="tab-maintenance">
      <div className="panel-head">
        <div>
          <h2>Maintenance &amp; incidents</h2>
          <p>
            Service history and anything logged against the vehicle, newest
            first.
          </p>
        </div>
        <div className="panel-head-actions">
          <Field label="Vehicle" htmlFor="maintBus" className="bus-field">
            <select
              id="maintBus"
              value={busId}
              onChange={(e) => setBusId(e.target.value)}>
              {fleet.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.number} — {b.plate}
                </option>
              ))}
            </select>
          </Field>
          <Button icon={Plus} onClick={() => setIncidentOpen(true)}>
            Log incident
          </Button>
        </div>
      </div>

      <div className="service-banner">
        <span className={`service-due service-due--${overdue ? "expired" : due.state}`}>
          {overdue ? <TriangleAlert /> : <CircleCheck />}
          <span>
            <strong>
              {overdue ?
                `Service overdue by ${Math.abs(due.days)} days`
              : `Next service in ${due.days} days`}
            </strong>
            <span className="cell-sub">
              Due {formatDate(nextServiceDue)} or at{" "}
              {nextServiceOdometer?.toLocaleString()} km
            </span>
          </span>
        </span>
        <span className="odometer">
          <Gauge />
          <span>
            <strong>{bus.odometer?.toLocaleString()} km</strong>
            <span className="cell-sub">
              {Math.max(0, nextServiceOdometer - bus.odometer).toLocaleString()}{" "}
              km to go
            </span>
          </span>
        </span>
      </div>

      <div className="maintenance-grid">
        <section className="maintenance-block">
          <h3>
            <Wrench />
            Service history
          </h3>
          {services.length === 0 ?
            <p className="cell-sub">Nothing logged for this vehicle yet.</p>
          : <ul className="service-list">
              {services.map((service) => (
                <li className="service-row" key={service.id}>
                  <span className="service-date">
                    <strong>{formatDate(service.date)}</strong>
                    <span className="cell-sub">
                      {service.odometer.toLocaleString()} km
                    </span>
                  </span>
                  <span className="service-meta">
                    <strong>{service.type}</strong>
                    <span className="cell-sub">{service.note}</span>
                  </span>
                </li>
              ))}
            </ul>
          }
        </section>

        <section className="maintenance-block">
          <h3>
            <TriangleAlert />
            Incidents
            {incidents.length > 0 && (
              <span className="status-pill status-pill--amber">
                {incidents.length}
              </span>
            )}
          </h3>
          {incidents.length === 0 ?
            <p className="cell-sub">
              No incidents recorded — keep it that way.
            </p>
          : <ul className="incident-list">
              {incidents.map((incident) => {
                const severity =
                  SEVERITIES.find((s) => s.value === incident.severity) ??
                  SEVERITIES[0];
                return (
                  <li className="incident-row" key={incident.id}>
                    <span className={`severity-pill severity-pill--${severity.tone}`}>
                      {severity.label}
                    </span>
                    <span className="incident-meta">
                      <strong>{formatDate(incident.date)}</strong>
                      <span className="cell-sub">{incident.description}</span>
                    </span>
                  </li>
                );
              })}
            </ul>
          }
        </section>
      </div>
    </section>
  );
};

export default MaintenancePanel;
