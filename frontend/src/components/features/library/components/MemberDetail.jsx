import { useMemo } from "react";
import { BookUp, TriangleAlert, Undo2, X } from "lucide-react";

import { Button } from "@/components/ui";
import { useLibrary } from "@/context/LibraryContext";
import { formatDate, formatMoney } from "@/utils/format";
import StatusPill from "./StatusPill";

const MemberDetail = () => {
  const {
    selectedStudent,
    studentBorrows,
    queueByBook,
    books,
    returnBook,
    cancelReservation,
    openIssueModal,
    setIssueStudentId,
    MAX_ACTIVE_BORROWS,
  } = useLibrary();

  // Holds this student is queued for, with their place in each queue.
  const holds = useMemo(() => {
    if (!selectedStudent) return [];
    return Object.entries(queueByBook).flatMap(([bookId, queue]) => {
      const index = queue.findIndex((r) => r.studentId === selectedStudent.id);
      if (index === -1) return [];
      return [
        {
          ...queue[index],
          position: index + 1,
          book: books.find((b) => b.id === bookId) ?? null,
        },
      ];
    });
  }, [queueByBook, books, selectedStudent]);

  if (!selectedStudent) return null;

  const { activeCount, atLimit, fineDue, historyCount } = selectedStudent;

  const issueForStudent = () => {
    setIssueStudentId(selectedStudent.id);
    openIssueModal("", "borrow");
  };

  return (
    <div className="member-detail">
      <header className="member-head">
        <img
          className="student-avatar member-avatar"
          src={selectedStudent.avatar}
          alt=""
        />
        <div className="member-head-text">
          <h3>{selectedStudent.name}</h3>
          <p className="cell-sub">
            {selectedStudent.id} · {selectedStudent.std_class} · {historyCount}{" "}
            past loans
          </p>
        </div>
        <Button size="sm" icon={BookUp} onClick={issueForStudent}>
          Issue book
        </Button>
      </header>

      <div className="limit-meter">
        <div className="limit-meter-head">
          <span>
            <strong>{activeCount}</strong> of {MAX_ACTIVE_BORROWS} active
            borrows
          </span>
          {fineDue > 0 && (
            <span className="fine-due">{formatMoney(fineDue)} in fines</span>
          )}
        </div>
        <div className="limit-track" aria-hidden="true">
          {Array.from({ length: MAX_ACTIVE_BORROWS }, (_, i) => (
            <span
              key={i}
              className={`limit-slot${i < activeCount ? " is-filled" : ""}${
                atLimit ? " is-limit" : ""
              }`}
            />
          ))}
        </div>
        {atLimit && (
          <p className="limit-warning">
            <TriangleAlert />
            Borrowing limit reached — {selectedStudent.name.split(" ")[0]} must
            return a book before another can be issued.
          </p>
        )}
      </div>

      <section className="member-section">
        <h4>Currently borrowed</h4>
        {studentBorrows.current.length === 0 ?
          <p className="cell-sub">Nothing on loan right now.</p>
        : <ul className="loan-list">
            {studentBorrows.current.map((r) => (
              <li className="loan-row" key={r.id}>
                <span className="loan-title">
                  {r.book?.title}
                  <span className="cell-sub">
                    Due {formatDate(r.dueDate)}
                    {r.fine > 0 && ` · ${formatMoney(r.fine)} fine`}
                  </span>
                </span>
                <StatusPill status={r.status} />
                <button
                  className="row-action-btn edit"
                  title={`Return ${r.book?.title}`}
                  aria-label={`Return ${r.book?.title}`}
                  onClick={() => returnBook(r.id)}>
                  <Undo2 />
                </button>
              </li>
            ))}
          </ul>
        }
      </section>

      {holds.length > 0 && (
        <section className="member-section">
          <h4>Holds queued</h4>
          <ul className="loan-list">
            {holds.map((h) => (
              <li className="loan-row" key={h.id}>
                <span className="loan-title">
                  {h.book?.title}
                  <span className="cell-sub">
                    #{h.position} in queue · placed {formatDate(h.reservedDate)}
                  </span>
                </span>
                <StatusPill status="reserved" />
                <button
                  className="row-action-btn delete"
                  title="Cancel hold"
                  aria-label={`Cancel hold on ${h.book?.title}`}
                  onClick={() => cancelReservation(h.id)}>
                  <X />
                </button>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="member-section">
        <h4>Borrowing history</h4>
        {studentBorrows.past.length === 0 ?
          <p className="cell-sub">No returned loans yet.</p>
        : <ul className="loan-list">
            {studentBorrows.past.map((r) => (
              <li className="loan-row" key={r.id}>
                <span className="loan-title">
                  {r.book?.title}
                  <span className="cell-sub">
                    {formatDate(r.issueDate)} → {formatDate(r.returnDate)}
                    {r.lateDays > 0 ?
                      ` · ${r.lateDays} day(s) late · ${formatMoney(r.fine)}`
                    : " · on time"}
                  </span>
                </span>
                <StatusPill status="returned" />
              </li>
            ))}
          </ul>
        }
      </section>
    </div>
  );
};

export default MemberDetail;
