import { memo, useEffect } from "react";
import {
  Clock3,
  GripVertical,
  MapPin,
  Pencil,
  Plus,
  TriangleAlert,
  Trash2,
  Users,
} from "lucide-react";

import { settleStops } from "@/animation/busPageAnimation";
import { Button, Field } from "@/components/ui";
import { useBus } from "@/context/BusContext";

/* Memoised so dragging one stop doesn't re-render the whole sequence. */
const StopRow = memo(function StopRow({
  stop,
  index,
  isLast,
  isDragging,
  onDragStart,
  onDrop,
  onEdit,
  onRemove,
  onAssign,
}) {
  return (
    <li
      className={`stop-row${isDragging ? " is-dragging" : ""}`}
      data-stop-id={stop.id}
      draggable
      onDragStart={() => onDragStart(stop.id)}
      onDragOver={(e) => e.preventDefault()}
      onDrop={() => onDrop(stop.id)}>
      <span className="stop-rail" aria-hidden="true">
        <span className="stop-dot">{index + 1}</span>
        {!isLast && <span className="stop-line" />}
      </span>

      <GripVertical className="stop-grip" aria-hidden="true" />

      <span className="stop-meta">
        <strong>{stop.name}</strong>
        <span className="cell-sub">
          <Clock3 />
          {stop.time}
        </span>
      </span>

      <button
        type="button"
        className={`stop-boarding${stop.boarding >= 10 ? " is-heavy" : ""}`}
        onClick={() => onAssign(stop)}
        title={`${stop.boarding} students board here`}>
        <Users />
        {stop.boarding}
      </button>

      <span className="stop-actions">
        <button
          className="row-action-btn edit"
          aria-label={`Edit ${stop.name}`}
          onClick={() => onEdit(stop)}>
          <Pencil />
        </button>
        <button
          className="row-action-btn delete"
          aria-label={`Remove ${stop.name}`}
          onClick={() => onRemove(stop.id)}>
          <Trash2 />
        </button>
      </span>
    </li>
  );
});

const RoutesPanel = ({ activeTab }) => {
  const {
    routeRows,
    route,
    routeId,
    setRouteId,
    setStopModal,
    removeStop,
    reorderStops,
    draggingStopId,
    setDraggingStopId,
    setAssignStop,
    zones,
  } = useBus();

  const isActive = activeTab === "routes";

  // The sequence settles after any reorder so the new order reads clearly.
  useEffect(() => {
    if (isActive) settleStops();
  }, [isActive, route?.stops]);

  if (!route) return null;

  return (
    <section
      className={`bus-panel${isActive ? " is-active" : ""}`}
      id="panel-routes"
      role="tabpanel"
      aria-labelledby="tab-routes">
      <div className="panel-head">
        <div>
          <h2>Route builder</h2>
          <p>
            Stops run in sequence — drag a row to reorder, and the total
            duration recalculates from the first and last pickup.
          </p>
        </div>
        <div className="panel-head-actions">
          <Field label="Route" htmlFor="routePick" className="bus-field">
            <select
              id="routePick"
              value={routeId}
              onChange={(e) => setRouteId(e.target.value)}>
              {routeRows.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name} — {r.assigned}/{r.capacity}
                </option>
              ))}
            </select>
          </Field>
          <Button icon={Plus} onClick={() => setStopModal({ mode: "create" })}>
            Add stop
          </Button>
        </div>
      </div>

      <div className="route-stats">
        <span className="route-stat">
          <MapPin />
          <span>
            <strong>{route.stops.length}</strong>
            <span className="cell-sub">stops</span>
          </span>
        </span>
        <span className="route-stat">
          <Clock3 />
          <span>
            <strong>{route.durationLabel}</strong>
            <span className="cell-sub">
              {route.stops[0]?.time} – {route.stops.at(-1)?.time}
            </span>
          </span>
        </span>
        <span className="route-stat">
          <Users />
          <span>
            <strong>
              {route.assigned}/{route.capacity}
            </strong>
            <span className="cell-sub">
              {route.bus ? route.bus.number : "No bus assigned"}
            </span>
          </span>
        </span>
        <span className="route-stat">
          <span className="zone-pill">{route.zone?.id}</span>
          <span>
            <strong>{route.zone?.label.split("·")[1]?.trim()}</strong>
            <span className="cell-sub">
              {zones.find((z) => z.id === route.zone?.id)?.fee} per month
            </span>
          </span>
        </span>
      </div>

      {route.overCapacity && (
        <p className="bus-warning">
          <TriangleAlert />
          {route.assigned} students are on a {route.capacity}-seat bus —{" "}
          {route.assigned - route.capacity} have no seat. Move riders to another
          route or assign a larger vehicle.
        </p>
      )}

      <ol className="stop-list">
        {route.stops.map((stop, index) => (
          <StopRow
            key={stop.id}
            stop={stop}
            index={index}
            isLast={index === route.stops.length - 1}
            isDragging={draggingStopId === stop.id}
            onDragStart={setDraggingStopId}
            onDrop={(toId) => reorderStops(draggingStopId, toId)}
            onEdit={(s) => setStopModal({ mode: "edit", stop: s })}
            onRemove={removeStop}
            onAssign={setAssignStop}
          />
        ))}
      </ol>
    </section>
  );
};

export default RoutesPanel;
