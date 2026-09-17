import { memo } from "react";
import { CircleCheck, Clock3, Wallet } from "lucide-react";

import { useStaggerReveal } from "@/animation/reveal";
import { useBus } from "@/context/BusContext";
import { formatMoney } from "@/utils/format";

/* Fee follows the route's zone, so a rider moving route changes what they
   owe — it is never stored on the student. */
const RiderRow = memo(function RiderRow({ rider, fee, onToggle }) {
  return (
    <li className={`fee-row${rider.feePaid ? " is-paid" : ""}`}>
      <span className="fee-who">
        <strong>{rider.name}</strong>
        <span className="cell-sub">{rider.classId}</span>
      </span>
      <span className="fee-amount">{formatMoney(fee)}</span>
      <button
        type="button"
        className={`fee-toggle${rider.feePaid ? " is-paid" : ""}`}
        onClick={() => onToggle(rider.id)}>
        {rider.feePaid ?
          <>
            <CircleCheck />
            Paid
          </>
        : <>
            <Clock3 />
            Due
          </>
        }
      </button>
    </li>
  );
});

const FeesPanel = ({ activeTab }) => {
  const { routeRows, route, routeId, setRouteId, toggleFee, feeTotals, zones } =
    useBus();

  const isActive = activeTab === "fees";
  useStaggerReveal(".fee-row", [isActive, routeId], {
    y: 6,
    duration: 0.3,
    stagger: 0.02,
  });

  if (!route) return null;

  const fee = route.zone?.fee ?? 0;

  return (
    <section
      className={`bus-panel${isActive ? " is-active" : ""}`}
      id="panel-fees"
      role="tabpanel"
      aria-labelledby="tab-fees">
      <div className="panel-head">
        <div>
          <h2>Transport fees</h2>
          <p>
            Each rider pays their route's zone rate. Totals below are this
            month's collection.
          </p>
        </div>
        <span className="fee-totals">
          <span>
            <strong>{formatMoney(feeTotals.collected)}</strong>
            <span className="cell-sub">collected</span>
          </span>
          <span>
            <strong className="is-due">{formatMoney(feeTotals.due)}</strong>
            <span className="cell-sub">outstanding</span>
          </span>
        </span>
      </div>

      <div className="zone-strip">
        {zones.map((zone) => (
          <span
            key={zone.id}
            className={`zone-card${route.zone?.id === zone.id ? " is-active" : ""}`}>
            <span className="zone-pill">{zone.id}</span>
            <span>
              <strong>{formatMoney(zone.fee)}</strong>
              <span className="cell-sub">{zone.label.split("·")[1]?.trim()}</span>
            </span>
          </span>
        ))}
      </div>

      <div className="fee-routes">
        {routeRows.map((row) => (
          <button
            key={row.id}
            type="button"
            className={`fee-route${row.id === routeId ? " is-active" : ""}`}
            onClick={() => setRouteId(row.id)}>
            <strong>{row.name}</strong>
            <span className="cell-sub">
              {row.feePaidCount}/{row.assigned} paid ·{" "}
              {formatMoney(row.feeCollected)} of {formatMoney(row.feeExpected)}
            </span>
            <span className="fee-route-track" aria-hidden="true">
              <span
                className="fee-route-fill"
                style={{
                  width: `${row.assigned ? (row.feePaidCount / row.assigned) * 100 : 0}%`,
                }}
              />
            </span>
          </button>
        ))}
      </div>

      <div className="fee-list-head">
        <Wallet />
        <span>
          <strong>{route.name}</strong> · {formatMoney(fee)} per rider ·{" "}
          {route.feeDueCount} still to pay
        </span>
      </div>

      <ul className="fee-list">
        {route.riders.map((rider) => (
          <RiderRow
            key={rider.id}
            rider={rider}
            fee={fee}
            onToggle={toggleFee}
          />
        ))}
      </ul>
    </section>
  );
};

export default FeesPanel;
