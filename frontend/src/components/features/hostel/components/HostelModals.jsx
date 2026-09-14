import { useMemo, useState } from "react";
import {
  ArrowLeftRight,
  CircleCheck,
  Plus,
  ShieldCheck,
  TriangleAlert,
  UserPlus,
} from "lucide-react";

import { shake } from "@/animation/shake";
import {
  MAINTENANCE_STAFF,
  TICKET_CATEGORIES,
  TICKET_PRIORITIES,
  emptyTicket,
} from "@/assets/data/hostelSeed";
import { Button, Field, Modal, TextField } from "@/components/ui";
import { useHostel } from "@/context/HostelContext";

/* Allocation, gate movement and ticket raising — three dialogs that share
   the hostel flow. */
const HostelModals = () => {
  const {
    allocateFor,
    setAllocateFor,
    residents,
    canAllocate,
    allocate,
    allocateFormRef,
    saving,
    gateOpen,
    setGateOpen,
    gateFormRef,
    logGate,
    gateState,
    ticketOpen,
    setTicketOpen,
    ticketFormRef,
    addTicket,
    roomRows,
  } = useHostel();

  /* ---------------- Allocation ---------------- */
  const open = Boolean(allocateFor);
  const [residentId, setResidentId] = useState("");
  const [touched, setTouched] = useState(false);
  const [wasOpen, setWasOpen] = useState(open);

  if (open !== wasOpen) {
    setWasOpen(open);
    if (open) {
      setResidentId("");
      setTouched(false);
    }
  }

  const candidate = residents.find((r) => r.id === residentId) ?? null;
  const check = useMemo(
    () =>
      residentId ?
        canAllocate(candidate, allocateFor)
      : { ok: false, reason: "Choose who is moving in." },
    [residentId, candidate, allocateFor, canAllocate],
  );

  const submitAllocate = () => {
    setTouched(true);
    if (!check.ok) {
      shake(allocateFormRef.current);
      return;
    }
    allocate(residentId, allocateFor.id);
  };

  /* ---------------- Gate ---------------- */
  const [gateResident, setGateResident] = useState("");
  const [gateReason, setGateReason] = useState("");
  const [gateTouched, setGateTouched] = useState(false);
  const [wasGateOpen, setWasGateOpen] = useState(gateOpen);

  if (gateOpen !== wasGateOpen) {
    setWasGateOpen(gateOpen);
    if (gateOpen) {
      setGateResident("");
      setGateReason("");
      setGateTouched(false);
    }
  }

  /* The direction is implied by where they are now — you can't sign out
     somebody who is already out. */
  const gateDirection =
    gateResident && gateState[gateResident]?.type === "out" ? "in" : "out";
  const gateError = !gateResident ? "Choose a resident." : "";

  const submitGate = () => {
    setGateTouched(true);
    if (gateError) {
      shake(gateFormRef.current);
      return;
    }
    logGate(gateResident, gateDirection, gateReason);
  };

  /* ---------------- Ticket ---------------- */
  const [ticket, setTicket] = useState(emptyTicket);
  const [ticketTouched, setTicketTouched] = useState(false);
  const [wasTicketOpen, setWasTicketOpen] = useState(ticketOpen);

  if (ticketOpen !== wasTicketOpen) {
    setWasTicketOpen(ticketOpen);
    if (ticketOpen) {
      setTicket(emptyTicket);
      setTicketTouched(false);
    }
  }

  const ticketErrors = useMemo(() => {
    const next = {};
    if (!ticket.roomId) next.roomId = "Which room is this about?";
    if (ticket.description.trim().length < 10)
      next.description = "Describe the issue in at least 10 characters.";
    return next;
  }, [ticket]);

  const submitTicket = () => {
    setTicketTouched(true);
    if (Object.keys(ticketErrors).length > 0) {
      shake(ticketFormRef.current);
      return;
    }
    addTicket({ ...ticket, description: ticket.description.trim() });
  };

  return (
    <>
      {/* ---- Allocate ---- */}
      <Modal
        open={open}
        onClose={() => setAllocateFor(null)}
        title={allocateFor ? `Allocate to room ${allocateFor.number}` : "Allocate"}
        titleId="allocateTitle"
        size="sm"
        footer={
          <>
            <Button variant="secondary" onClick={() => setAllocateFor(null)}>
              Cancel
            </Button>
            <Button icon={UserPlus} loading={saving} onClick={submitAllocate}>
              Move in
            </Button>
          </>
        }>
        {allocateFor && (
          <form ref={allocateFormRef} onSubmit={(e) => e.preventDefault()}>
            <p className="allocate-rule">
              <ShieldCheck />
              {allocateFor.block.rule} · {allocateFor.free} of{" "}
              {allocateFor.beds} beds free
            </p>

            <Field
              label="Resident"
              htmlFor="allocateResident"
              error={touched && !check.ok ? check.reason : ""}>
              <select
                id="allocateResident"
                value={residentId}
                onChange={(e) => {
                  setResidentId(e.target.value);
                  setTouched(false);
                }}>
                <option value="">Select a resident</option>
                {residents.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name} — Grade {r.grade}, {r.gender}
                    {r.roomId ? " (housed)" : " (no room)"}
                  </option>
                ))}
              </select>
            </Field>

            {/* The check runs as soon as somebody is picked, so the refusal
                arrives before the button is pressed. */}
            {residentId &&
              (check.ok ?
                <p className="allocate-note is-ok">
                  <CircleCheck />
                  {candidate.name} meets this block's rule — bed{" "}
                  {allocateFor.occupied + 1} of {allocateFor.beds}.
                </p>
              : <p className="allocate-note is-blocked">
                  <TriangleAlert />
                  {check.reason}
                </p>)}
          </form>
        )}
      </Modal>

      {/* ---- Gate ---- */}
      <Modal
        open={gateOpen}
        onClose={() => setGateOpen(false)}
        title="Record a movement"
        titleId="gateTitle"
        size="sm"
        footer={
          <>
            <Button variant="secondary" onClick={() => setGateOpen(false)}>
              Cancel
            </Button>
            <Button icon={ArrowLeftRight} onClick={submitGate}>
              Sign {gateDirection}
            </Button>
          </>
        }>
        <form ref={gateFormRef} onSubmit={(e) => e.preventDefault()}>
          <Field
            label="Resident"
            htmlFor="gateResident"
            error={gateTouched ? gateError : ""}>
            <select
              id="gateResident"
              value={gateResident}
              onChange={(e) => setGateResident(e.target.value)}>
              <option value="">Select a resident</option>
              {residents.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name}
                  {gateState[r.id]?.type === "out" ? " — currently out" : ""}
                </option>
              ))}
            </select>
          </Field>

          {gateResident && (
            <p className="allocate-note is-ok">
              <CircleCheck />
              They are currently{" "}
              {gateDirection === "in" ? "out — this signs them back in" : "in — this signs them out"}
              .
            </p>
          )}

          <TextField
            id="gateReason"
            name="reason"
            label="Reason (optional)"
            placeholder="e.g. Medical appointment"
            value={gateReason}
            onChange={(e) => setGateReason(e.target.value)}
          />
        </form>
      </Modal>

      {/* ---- Ticket ---- */}
      <Modal
        open={ticketOpen}
        onClose={() => setTicketOpen(false)}
        title="Raise a maintenance ticket"
        titleId="ticketTitle"
        footer={
          <>
            <Button variant="secondary" onClick={() => setTicketOpen(false)}>
              Cancel
            </Button>
            <Button icon={Plus} onClick={submitTicket}>
              Raise ticket
            </Button>
          </>
        }>
        <form ref={ticketFormRef} onSubmit={(e) => e.preventDefault()}>
          <div className="form-grid">
            <Field
              label="Room"
              htmlFor="ticketRoom"
              error={ticketTouched ? (ticketErrors.roomId ?? "") : ""}>
              <select
                id="ticketRoom"
                value={ticket.roomId}
                onChange={(e) =>
                  setTicket((prev) => ({ ...prev, roomId: e.target.value }))
                }>
                <option value="">Select a room</option>
                {roomRows.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.block.name.split("·")[0].trim()} · room {r.number}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Category" htmlFor="ticketCategory">
              <select
                id="ticketCategory"
                value={ticket.category}
                onChange={(e) =>
                  setTicket((prev) => ({ ...prev, category: e.target.value }))
                }>
                {TICKET_CATEGORIES.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Priority" htmlFor="ticketPriority">
              <select
                id="ticketPriority"
                value={ticket.priority}
                onChange={(e) =>
                  setTicket((prev) => ({ ...prev, priority: e.target.value }))
                }>
                {TICKET_PRIORITIES.map((p) => (
                  <option key={p.value} value={p.value}>
                    {p.label}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Assign to" htmlFor="ticketAssignee">
              <select
                id="ticketAssignee"
                value={ticket.assignee}
                onChange={(e) =>
                  setTicket((prev) => ({ ...prev, assignee: e.target.value }))
                }>
                {MAINTENANCE_STAFF.map((name) => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))}
              </select>
            </Field>

            <Field
              label="What's wrong"
              htmlFor="ticketDescription"
              className="field--full"
              error={ticketTouched ? (ticketErrors.description ?? "") : ""}>
              <textarea
                id="ticketDescription"
                rows={3}
                className="hostel-textarea"
                placeholder="e.g. Tap in the shared bathroom won't shut off."
                value={ticket.description}
                onChange={(e) =>
                  setTicket((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                onBlur={() => setTicketTouched(true)}
              />
            </Field>
          </div>
        </form>
      </Modal>
    </>
  );
};

export default HostelModals;
