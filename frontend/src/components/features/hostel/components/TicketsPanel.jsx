import { memo } from "react";
import { CircleCheck, Clock3, Plus, UserRoundCog, Wrench } from "lucide-react";

import { useStaggerReveal } from "@/animation/reveal";
import {
  TICKET_CATEGORIES,
  TICKET_PRIORITIES,
  TICKET_STATUSES,
} from "@/assets/data/hostelSeed";
import { Button, Field } from "@/components/ui";
import { useHostel } from "@/context/HostelContext";
import { formatDate } from "@/utils/format";

const labelOf = (list, value) =>
  list.find((item) => item.value === value) ?? list[0];

const TicketRow = memo(function TicketRow({ ticket, onState }) {
  const priority = labelOf(TICKET_PRIORITIES, ticket.priority);
  const status = labelOf(TICKET_STATUSES, ticket.status);
  const category = labelOf(TICKET_CATEGORIES, ticket.category);

  /* Age is the thing that turns a small job into a complaint, so it is
     always visible rather than buried in the date. */
  const stale = ticket.status !== "resolved" && ticket.age >= 7;

  return (
    <li className={`ticket-row${stale ? " is-stale" : ""}`}>
      <span className={`ticket-priority ticket-priority--${priority.tone}`}>
        {priority.label}
      </span>

      <span className="ticket-meta">
        <strong>
          Room {ticket.room?.number ?? ticket.roomId} · {category.label}
        </strong>
        <span className="cell-sub">{ticket.description}</span>
        <span className="cell-sub">
          <UserRoundCog />
          {ticket.assignee} · opened {formatDate(ticket.openedOn)}
        </span>
      </span>

      <span className={`ticket-age${stale ? " is-stale" : ""}`}>
        <Clock3 />
        {ticket.age}d
      </span>

      <span className="ticket-actions">
        <span className={`status-pill status-pill--${status.tone}`}>
          {status.label}
        </span>
        {ticket.status !== "resolved" && (
          <select
            aria-label={`Change status for ${ticket.id}`}
            value={ticket.status}
            onChange={(e) => onState(ticket.id, e.target.value)}>
            {TICKET_STATUSES.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        )}
      </span>
    </li>
  );
});

const TicketsPanel = ({ activeTab }) => {
  const {
    ticketRows,
    openTickets,
    ticketStatus,
    setTicketStatus,
    setTicketState,
    setTicketOpen,
  } = useHostel();

  const isActive = activeTab === "tickets";
  useStaggerReveal(".ticket-row", [isActive, ticketStatus, ticketRows.length], {
    y: 8,
    duration: 0.32,
    stagger: 0.04,
  });

  const stale = openTickets.filter((t) => {
    const age = ticketRows.find((r) => r.id === t.id)?.age ?? 0;
    return age >= 7;
  }).length;

  return (
    <section
      className={`hostel-panel${isActive ? " is-active" : ""}`}
      id="panel-tickets"
      role="tabpanel"
      aria-labelledby="tab-tickets">
      <div className="panel-head">
        <div>
          <h2>
            <Wrench />
            Maintenance
          </h2>
          <p>
            Open tickets first, oldest at the top. Anything unresolved for a
            week is flagged.
          </p>
        </div>
        <div className="panel-head-actions">
          <Field label="Status" htmlFor="ticketFilter" className="hostel-field">
            <select
              id="ticketFilter"
              value={ticketStatus}
              onChange={(e) => setTicketStatus(e.target.value)}>
              <option value="">All tickets</option>
              {TICKET_STATUSES.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </Field>
          <Button icon={Plus} onClick={() => setTicketOpen(true)}>
            Raise ticket
          </Button>
        </div>
      </div>

      <div className="ticket-tally">
        <span
          className={`status-pill ${openTickets.length ? "status-pill--red" : "status-pill--green"}`}>
          {openTickets.length ? `${openTickets.length} unresolved` : "Nothing open"}
        </span>
        {stale > 0 && (
          <span className="status-pill status-pill--amber">
            {stale} over a week old
          </span>
        )}
      </div>

      {ticketRows.length === 0 ?
        <div className="hostel-empty">
          <CircleCheck />
          <h3>No tickets here</h3>
          <p>Nothing matches that status filter.</p>
        </div>
      : <ul className="ticket-list">
          {ticketRows.map((ticket) => (
            <TicketRow
              key={ticket.id}
              ticket={ticket}
              onState={setTicketState}
            />
          ))}
        </ul>
      }
    </section>
  );
};

export default TicketsPanel;
