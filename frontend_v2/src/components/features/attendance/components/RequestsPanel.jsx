import { useRef, useState } from "react";
import { Check, Inbox, Paperclip, X } from "lucide-react";

import { shake } from "@/animation/shake";
import { useStaggerReveal } from "@/animation/reveal";
import { ABSENCE_REASONS } from "@/assets/data/attendanceSeed";
import { Button, Field, Modal, useToast } from "@/components/ui";
import { useAttendance } from "@/context/AttendanceContext";
import { formatDate } from "@/utils/format";

const REASON_LABEL = Object.fromEntries(
  ABSENCE_REASONS.map((r) => [r.key, r.label]),
);

const RequestsPanel = ({ activeTab }) => {
  const { pendingRequests, approveRequest, rejectRequest } = useAttendance();
  const { toast } = useToast();

  const [rejecting, setRejecting] = useState(null);
  const [note, setNote] = useState("");
  const [noteTouched, setNoteTouched] = useState(false);
  const noteFormRef = useRef(null);

  const isActive = activeTab === "requests";
  useStaggerReveal(".request-card", [isActive, pendingRequests.length], {
    y: 10,
    duration: 0.35,
    stagger: 0.05,
  });

  const noteValid = note.trim().length >= 5;

  const closeReject = () => {
    setRejecting(null);
    setNote("");
    setNoteTouched(false);
  };

  const confirmReject = () => {
    setNoteTouched(true);
    if (!noteValid) {
      shake(noteFormRef.current);
      return;
    }
    rejectRequest(rejecting.id, note.trim());
    closeReject();
  };

  const openAttachment = (name) =>
    toast.info(`${name} — preview is a UI placeholder, no file attached.`);

  return (
    <section
      className={`attendance-panel${isActive ? " is-active" : ""}`}
      id="panel-requests"
      role="tabpanel"
      aria-labelledby="tab-requests">
      <div className="mark-head">
        <div>
          <h2>Leave requests</h2>
          <p>
            Approving writes <strong>Excused</strong> onto every school day in
            the range, so the student's percentage isn't penalised.
          </p>
        </div>
        <span className="status-pill status-pill--amber">
          {pendingRequests.length} pending
        </span>
      </div>

      {pendingRequests.length === 0 ?
        <div className="attendance-empty">
          <Inbox />
          <h3>The queue is clear</h3>
          <p>Every leave request has been decided.</p>
        </div>
      : <div className="request-grid">
          {pendingRequests.map((request) => (
            <article
              className="request-card"
              key={request.id}
              data-request-id={request.id}>
              <header className="request-head">
                <img
                  className="student-avatar"
                  src={request.student?.avatar}
                  alt=""
                  loading="lazy"
                />
                <div className="request-who">
                  <strong>{request.student?.name}</strong>
                  <span className="cell-sub">
                    {request.id} · submitted {formatDate(request.submittedOn)}
                  </span>
                </div>
                <span className="status-pill status-pill--purple">
                  {REASON_LABEL[request.reason] ?? request.reason}
                </span>
              </header>

              <dl className="request-meta">
                <div>
                  <dt>From</dt>
                  <dd>{formatDate(request.from)}</dd>
                </div>
                <div>
                  <dt>To</dt>
                  <dd>{formatDate(request.to)}</dd>
                </div>
                <div>
                  <dt>School days</dt>
                  <dd>{request.days}</dd>
                </div>
              </dl>

              <p className="request-note">{request.note}</p>

              {request.attachment && (
                <button
                  type="button"
                  className="request-attachment"
                  onClick={() => openAttachment(request.attachment)}>
                  <Paperclip />
                  {request.attachment}
                </button>
              )}

              <footer className="request-actions">
                <Button
                  size="sm"
                  variant="secondary"
                  icon={X}
                  onClick={() => setRejecting(request)}>
                  Reject
                </Button>
                <Button
                  size="sm"
                  icon={Check}
                  onClick={() => approveRequest(request.id)}>
                  Approve
                </Button>
              </footer>
            </article>
          ))}
        </div>
      }

      <Modal
        open={Boolean(rejecting)}
        onClose={closeReject}
        title="Reject leave request"
        titleId="rejectTitle"
        size="sm"
        footer={
          <>
            <Button variant="secondary" onClick={closeReject}>
              Cancel
            </Button>
            <Button variant="danger" icon={X} onClick={confirmReject}>
              Reject request
            </Button>
          </>
        }>
        <form ref={noteFormRef} onSubmit={(e) => e.preventDefault()}>
          <p className="reject-intro">
            {rejecting?.student?.name}'s guardian will see this reason, so make
            it specific.
          </p>
          <Field
            label="Reason for rejection"
            htmlFor="rejectNote"
            error={
              noteTouched && !noteValid ?
                "Give the guardian a reason of at least 5 characters."
              : ""
            }>
            <textarea
              id="rejectNote"
              rows={3}
              className="reject-textarea"
              placeholder="e.g. Medical certificate does not cover these dates."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              onBlur={() => setNoteTouched(true)}
            />
          </Field>
        </form>
      </Modal>
    </section>
  );
};

export default RequestsPanel;
