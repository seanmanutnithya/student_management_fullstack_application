import { Check, CircleCheck, Inbox, MapPin, ShieldAlert, X } from "lucide-react";

import { useStaggerReveal } from "@/animation/reveal";
import { Button } from "@/components/ui";
import { useHostel } from "@/context/HostelContext";
import { formatDate } from "@/utils/format";

const LeavePanel = ({ activeTab }) => {
  const { leaveRows, pendingLeave, approveLeave, rejectLeave } = useHostel();
  const isActive = activeTab === "leave";

  useStaggerReveal(".leave-card", [isActive, pendingLeave.length], {
    y: 10,
    duration: 0.35,
    stagger: 0.05,
  });

  const decided = leaveRows.filter((r) => r.status !== "pending");

  return (
    <section
      className={`hostel-panel${isActive ? " is-active" : ""}`}
      id="panel-leave"
      role="tabpanel"
      aria-labelledby="tab-leave">
      <div className="panel-head">
        <div>
          <h2>Overnight leave</h2>
          <p>
            Approving records the date the resident is expected back through
            the gate. A request without guardian approval can't be signed off.
          </p>
        </div>
        <span className="status-pill status-pill--amber">
          {pendingLeave.length} pending
        </span>
      </div>

      {pendingLeave.length === 0 ?
        <div className="hostel-empty">
          <Inbox />
          <h3>Nothing waiting</h3>
          <p>Every leave request has been decided.</p>
        </div>
      : <div className="leave-grid">
          {pendingLeave.map((request) => (
            <article className="leave-card" key={request.id}>
              <header className="leave-head">
                <img
                  className="student-avatar"
                  src={request.resident?.avatar}
                  alt=""
                  loading="lazy"
                />
                <div>
                  <strong>{request.resident?.name}</strong>
                  <span className="cell-sub">
                    {request.id} · requested {formatDate(request.requestedOn)}
                  </span>
                </div>
                <span
                  className={`status-pill ${
                    request.guardianApproved ?
                      "status-pill--green"
                    : "status-pill--red"
                  }`}>
                  {request.guardianApproved ?
                    <>
                      <CircleCheck />
                      Guardian approved
                    </>
                  : <>
                      <ShieldAlert />
                      Guardian pending
                    </>
                  }
                </span>
              </header>

              <dl className="leave-meta">
                <div>
                  <dt>From</dt>
                  <dd>{formatDate(request.from)}</dd>
                </div>
                <div>
                  <dt>To</dt>
                  <dd>{formatDate(request.to)}</dd>
                </div>
                <div>
                  <dt>Nights</dt>
                  <dd>{request.nights}</dd>
                </div>
              </dl>

              <p className="leave-destination">
                <MapPin />
                {request.destination}
              </p>

              {!request.guardianApproved && (
                <p className="hostel-warning hostel-warning--sm">
                  <ShieldAlert />
                  The guardian hasn't confirmed this trip yet.
                </p>
              )}

              <footer className="leave-actions">
                <Button
                  size="sm"
                  variant="secondary"
                  icon={X}
                  onClick={() => rejectLeave(request.id)}>
                  Reject
                </Button>
                <Button
                  size="sm"
                  icon={Check}
                  onClick={() => approveLeave(request.id)}>
                  Approve
                </Button>
              </footer>
            </article>
          ))}
        </div>
      }

      {decided.length > 0 && (
        <section className="leave-decided">
          <h3>Decided</h3>
          <ul>
            {decided.map((request) => (
              <li key={request.id}>
                <span>
                  <strong>{request.resident?.name}</strong>
                  <span className="cell-sub">
                    {formatDate(request.from)} – {formatDate(request.to)} ·{" "}
                    {request.destination}
                  </span>
                </span>
                <span
                  className={`status-pill ${
                    request.status === "approved" ?
                      "status-pill--green"
                    : "status-pill--red"
                  }`}>
                  {request.status === "approved" ?
                    `Back ${formatDate(request.expectedReturn)}`
                  : "Rejected"}
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </section>
  );
};

export default LeavePanel;
