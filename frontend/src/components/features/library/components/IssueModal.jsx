import { BookmarkPlus, BookUp, CircleCheck, TriangleAlert } from "lucide-react";

import { Button, Field, Modal } from "@/components/ui";
import { useLibrary } from "@/context/LibraryContext";
import { formatDate } from "@/utils/format";
import StatusPill from "./StatusPill";

const IssueModal = () => {
  const {
    issueOpen,
    issueMode,
    issueBookId,
    setIssueBookId,
    issueStudentId,
    setIssueStudentId,
    closeIssueModal,
    submitIssue,
    books,
    memberRows,
    canBorrow,
    canReserve,
    queueByBook,
    previewDueDate,
    LOAN_DAYS,
    MAX_ACTIVE_BORROWS,
  } = useLibrary();

  const reserving = issueMode === "reserve";
  const book = books.find((b) => b.id === issueBookId) ?? null;
  const student = memberRows.find((m) => m.id === issueStudentId) ?? null;

  const check =
    reserving ?
      canReserve(issueStudentId, issueBookId)
    : canBorrow(issueStudentId, issueBookId);

  const queueLength = (queueByBook[issueBookId] ?? []).length;

  return (
    <Modal
      open={issueOpen}
      onClose={closeIssueModal}
      title={reserving ? "Place a hold" : "Issue a book"}
      titleId="issueModalTitle"
      overlayId="issueModalOverlay"
      footer={
        <>
          <Button variant="secondary" onClick={closeIssueModal}>
            Cancel
          </Button>
          <Button
            icon={reserving ? BookmarkPlus : BookUp}
            disabled={!check.ok}
            onClick={submitIssue}>
            {reserving ? "Place hold" : "Issue book"}
          </Button>
        </>
      }>
      <form id="issueForm" onSubmit={(e) => e.preventDefault()}>
        <div className="form-grid">
          <Field label="Book" htmlFor="issueBook" className="field--full">
            <select
              id="issueBook"
              name="book"
              value={issueBookId}
              onChange={(e) => setIssueBookId(e.target.value)}>
              <option value="">Select a title</option>
              {books.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.title} — {b.author} ({b.copiesAvailable}/{b.copiesTotal})
                </option>
              ))}
            </select>
          </Field>

          <Field label="Student" htmlFor="issueStudent" className="field--full">
            <select
              id="issueStudent"
              name="student"
              value={issueStudentId}
              onChange={(e) => setIssueStudentId(e.target.value)}>
              {memberRows.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name} — {m.std_class} ({m.activeCount}/
                  {MAX_ACTIVE_BORROWS} borrowed)
                </option>
              ))}
            </select>
          </Field>
        </div>

        {book && (
          <dl className="issue-summary">
            <div>
              <dt>Availability</dt>
              <dd>
                <StatusPill status={book.availability} />
              </dd>
            </div>
            <div>
              <dt>On shelf</dt>
              <dd>
                {book.copiesAvailable} of {book.copiesTotal} copies
              </dd>
            </div>
            <div>
              <dt>{reserving ? "Queue" : "Due date"}</dt>
              <dd>
                {reserving ?
                  `#${queueLength + 1} in line`
                : formatDate(previewDueDate)}
              </dd>
            </div>
            <div>
              <dt>Student load</dt>
              <dd>
                {student?.activeCount ?? 0} of {MAX_ACTIVE_BORROWS} active
              </dd>
            </div>
          </dl>
        )}

        {check.ok ?
          <p className="issue-note is-ok">
            <CircleCheck />
            {reserving ?
              `${student?.name} will be queued for "${book?.title}".`
            : `"${book?.title}" will be loaned for ${LOAN_DAYS} days.`}
          </p>
        : <p className="issue-note is-blocked">
            <TriangleAlert />
            {check.reason}
          </p>
        }
      </form>
    </Modal>
  );
};

export default IssueModal;
