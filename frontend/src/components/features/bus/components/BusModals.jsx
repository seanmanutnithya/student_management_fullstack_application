import { useMemo, useState } from "react";
import { MapPin, Save, TriangleAlert, UserRoundCog, X } from "lucide-react";

import { shake } from "@/animation/shake";
import { SEVERITIES, emptyIncidentForm } from "@/assets/data/busSeed";
import { Button, Field, Modal, TextField } from "@/components/ui";
import { useBus } from "@/context/BusContext";
import { toIsoDate } from "@/utils/format";

const today = toIsoDate(new Date());
const TIME_RE = /^([01]\d|2[0-3]):[0-5]\d$/;

/* Stop form, crew assignment, the rider drawer and the incident log —
   four small dialogs that share the transport flow. */
const BusModals = () => {
  const {
    route,
    stopModal,
    setStopModal,
    saveStop,
    stopFormRef,
    assignStop,
    setAssignStop,
    ridersByStop,
    moveStudentStop,
    removeRider,
    crewModal,
    setCrewModal,
    crewFormRef,
    assignCrew,
    drivers,
    attendants,
    saving,
    incidentOpen,
    setIncidentOpen,
    incidentFormRef,
    logIncident,
    bus,
  } = useBus();

  /* ---------------- Stop form ---------------- */
  const editingStop = stopModal?.stop ?? null;
  const stopOpen = Boolean(stopModal);
  const [stopForm, setStopForm] = useState({ name: "", time: "" });
  const [stopTouched, setStopTouched] = useState(false);
  const [wasStopOpen, setWasStopOpen] = useState(stopOpen);

  if (stopOpen !== wasStopOpen) {
    setWasStopOpen(stopOpen);
    if (stopOpen) {
      setStopForm(
        editingStop ?
          { name: editingStop.name, time: editingStop.time }
        : { name: "", time: "" },
      );
      setStopTouched(false);
    }
  }

  const stopErrors = useMemo(() => {
    const next = {};
    if (stopForm.name.trim().length < 3)
      next.name = "Name the stop so a driver can find it.";
    if (!TIME_RE.test(stopForm.time))
      next.time = "Enter a pickup time as HH:MM.";
    const clash = route?.stops.find(
      (s) => s.id !== editingStop?.id && s.time === stopForm.time,
    );
    if (clash) next.time = `${clash.name} is already picked up at that time.`;
    return next;
  }, [stopForm, route, editingStop]);

  const submitStop = () => {
    setStopTouched(true);
    if (Object.keys(stopErrors).length > 0) {
      shake(stopFormRef.current);
      return;
    }
    saveStop({
      id: editingStop?.id ?? `S-${Date.now().toString().slice(-5)}`,
      name: stopForm.name.trim(),
      time: stopForm.time,
    });
  };

  /* ---------------- Crew ---------------- */
  const crewOpen = Boolean(crewModal);
  const [crew, setCrew] = useState({ driverId: "", attendantId: "" });
  const [crewTouched, setCrewTouched] = useState(false);
  const [wasCrewOpen, setWasCrewOpen] = useState(crewOpen);

  if (crewOpen !== wasCrewOpen) {
    setWasCrewOpen(crewOpen);
    if (crewOpen) {
      setCrew({
        driverId: crewModal.driverId ?? "",
        attendantId: crewModal.attendantId ?? "",
      });
      setCrewTouched(false);
    }
  }

  const crewError =
    !crew.driverId ? "A bus needs a driver before it can run a route." : "";

  const submitCrew = () => {
    setCrewTouched(true);
    if (crewError) {
      shake(crewFormRef.current);
      return;
    }
    assignCrew(crewModal.id, crew);
  };

  /* ---------------- Incident ---------------- */
  const [incident, setIncident] = useState(emptyIncidentForm);
  const [incidentTouched, setIncidentTouched] = useState(false);
  const [wasIncidentOpen, setWasIncidentOpen] = useState(incidentOpen);

  if (incidentOpen !== wasIncidentOpen) {
    setWasIncidentOpen(incidentOpen);
    if (incidentOpen) {
      setIncident({ ...emptyIncidentForm, date: today });
      setIncidentTouched(false);
    }
  }

  const incidentErrors = useMemo(() => {
    const next = {};
    if (!incident.date) next.date = "When did this happen?";
    else if (incident.date > today) next.date = "An incident can't be in the future.";
    if (incident.description.trim().length < 10)
      next.description = "Describe what happened in at least 10 characters.";
    return next;
  }, [incident]);

  const submitIncident = () => {
    setIncidentTouched(true);
    if (Object.keys(incidentErrors).length > 0) {
      shake(incidentFormRef.current);
      return;
    }
    logIncident(bus.id, {
      ...incident,
      description: incident.description.trim(),
    });
  };

  const stopRiders = assignStop ? (ridersByStop[assignStop.id] ?? []) : [];

  return (
    <>
      {/* ---- Stop form ---- */}
      <Modal
        open={stopOpen}
        onClose={() => setStopModal(null)}
        title={editingStop ? `Edit ${editingStop.name}` : "Add a stop"}
        titleId="stopTitle"
        size="sm"
        footer={
          <>
            <Button variant="secondary" onClick={() => setStopModal(null)}>
              Cancel
            </Button>
            <Button icon={Save} onClick={submitStop}>
              Save stop
            </Button>
          </>
        }>
        <form ref={stopFormRef} onSubmit={(e) => e.preventDefault()}>
          <TextField
            id="stopName"
            name="name"
            label="Stop name"
            icon={MapPin}
            placeholder="e.g. Sen Sok market"
            value={stopForm.name}
            onChange={(e) =>
              setStopForm((prev) => ({ ...prev, name: e.target.value }))
            }
            onBlur={() => setStopTouched(true)}
            error={stopTouched ? (stopErrors.name ?? "") : ""}
          />
          <TextField
            id="stopTime"
            name="time"
            type="time"
            label="Pickup time"
            value={stopForm.time}
            onChange={(e) =>
              setStopForm((prev) => ({ ...prev, time: e.target.value }))
            }
            onBlur={() => setStopTouched(true)}
            error={stopTouched ? (stopErrors.time ?? "") : ""}
            hint="Stops are kept in time order on the route."
          />
        </form>
      </Modal>

      {/* ---- Riders at a stop ---- */}
      <Modal
        open={Boolean(assignStop)}
        onClose={() => setAssignStop(null)}
        title={assignStop ? `Riders at ${assignStop.name}` : "Riders"}
        titleId="ridersTitle"
        footer={
          <Button variant="secondary" onClick={() => setAssignStop(null)}>
            Close
          </Button>
        }>
        {assignStop && (
          <div className="rider-body">
            <p className="cell-sub rider-intro">
              {stopRiders.length} boarding at {assignStop.time} ·{" "}
              {route?.assigned}/{route?.capacity} seats used on {route?.name}
            </p>

            {route?.overCapacity && (
              <p className="bus-warning bus-warning--sm">
                <TriangleAlert />
                This route is over capacity — moving riders in will not create
                seats.
              </p>
            )}

            <ul className="rider-list">
              {stopRiders.map((rider) => (
                <li key={rider.id}>
                  <span>
                    <strong>{rider.name}</strong>
                    <span className="cell-sub">{rider.classId}</span>
                  </span>
                  <span className="rider-actions">
                    <select
                      aria-label={`Move ${rider.name} to another stop`}
                      value={rider.stopId}
                      onChange={(e) =>
                        moveStudentStop(rider.id, e.target.value)
                      }>
                      {route?.stops.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.name}
                        </option>
                      ))}
                    </select>
                    <button
                      className="row-action-btn delete"
                      aria-label={`Take ${rider.name} off the route`}
                      onClick={() => removeRider(rider.id)}>
                      <X />
                    </button>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </Modal>

      {/* ---- Crew ---- */}
      <Modal
        open={crewOpen}
        onClose={() => setCrewModal(null)}
        title={crewModal ? `Crew for ${crewModal.number}` : "Assign crew"}
        titleId="crewTitle"
        size="sm"
        footer={
          <>
            <Button variant="secondary" onClick={() => setCrewModal(null)}>
              Cancel
            </Button>
            <Button icon={UserRoundCog} loading={saving} onClick={submitCrew}>
              Save crew
            </Button>
          </>
        }>
        <form ref={crewFormRef} onSubmit={(e) => e.preventDefault()}>
          <Field
            label="Driver"
            htmlFor="crewDriver"
            error={crewTouched ? crewError : ""}>
            <select
              id="crewDriver"
              value={crew.driverId}
              onChange={(e) =>
                setCrew((prev) => ({ ...prev, driverId: e.target.value }))
              }>
              <option value="">No driver</option>
              {drivers.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name} — {d.license}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Attendant" htmlFor="crewAttendant">
            <select
              id="crewAttendant"
              value={crew.attendantId}
              onChange={(e) =>
                setCrew((prev) => ({ ...prev, attendantId: e.target.value }))
              }>
              <option value="">No attendant</option>
              {attendants.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name}
                </option>
              ))}
            </select>
          </Field>
        </form>
      </Modal>

      {/* ---- Incident ---- */}
      <Modal
        open={incidentOpen}
        onClose={() => setIncidentOpen(false)}
        title={bus ? `Log an incident — ${bus.number}` : "Log an incident"}
        titleId="incidentTitle"
        footer={
          <>
            <Button variant="secondary" onClick={() => setIncidentOpen(false)}>
              Cancel
            </Button>
            <Button variant="danger" icon={TriangleAlert} onClick={submitIncident}>
              Log incident
            </Button>
          </>
        }>
        <form ref={incidentFormRef} onSubmit={(e) => e.preventDefault()}>
          <div className="form-grid">
            <TextField
              id="incidentDate"
              name="date"
              type="date"
              label="Date"
              max={today}
              value={incident.date}
              onChange={(e) =>
                setIncident((prev) => ({ ...prev, date: e.target.value }))
              }
              onBlur={() => setIncidentTouched(true)}
              error={incidentTouched ? (incidentErrors.date ?? "") : ""}
            />
            <Field label="Severity" htmlFor="incidentSeverity">
              <select
                id="incidentSeverity"
                value={incident.severity}
                onChange={(e) =>
                  setIncident((prev) => ({ ...prev, severity: e.target.value }))
                }>
                {SEVERITIES.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            </Field>
            <Field
              label="What happened"
              htmlFor="incidentDescription"
              className="field--full"
              error={incidentTouched ? (incidentErrors.description ?? "") : ""}>
              <textarea
                id="incidentDescription"
                rows={3}
                className="bus-textarea"
                placeholder="e.g. Rear door sensor failed on the morning run."
                value={incident.description}
                onChange={(e) =>
                  setIncident((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                onBlur={() => setIncidentTouched(true)}
              />
            </Field>
          </div>
        </form>
      </Modal>
    </>
  );
};

export default BusModals;
