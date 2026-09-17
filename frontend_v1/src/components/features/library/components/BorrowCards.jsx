import { Undo2 } from "lucide-react";

import { Button } from "@/components/ui";
import { useLibrary } from "@/context/LibraryContext";
import { formatDate, formatMoney } from "@/utils/format";
import StatusPill from "./StatusPill";

const BorrowCards = () => {
  const { pagedRecords, returnBook } = useLibrary();

  return (
    <div className="borrow-cards" id="borrowCards">
      {pagedRecords.map((r) => (
        <div className="borrow-card" key={r.id} data-row-id={r.id}>
          <div className="borrow-card-top">
            <img
              className="student-avatar"
              src={r.student?.avatar}
              alt=""
              loading="lazy"
            />
            <div>
              <div className="borrow-card-name">{r.student?.name}</div>
              <div className="cell-sub">
                {r.student?.std_class} · {r.id}
              </div>
            </div>
            <StatusPill status={r.status} />
          </div>

          <p className="borrow-card-book">
            <strong>{r.book?.title}</strong>
            <span className="cell-sub">{r.book?.author}</span>
          </p>

          <dl className="borrow-card-grid">
            <div>
              <dt>Issued</dt>
              <dd>{formatDate(r.issueDate)}</dd>
            </div>
            <div>
              <dt>Due</dt>
              <dd>{formatDate(r.dueDate)}</dd>
            </div>
            <div>
              <dt>Returned</dt>
              <dd>{formatDate(r.returnDate)}</dd>
            </div>
            <div>
              <dt>Fine</dt>
              <dd className={r.fine > 0 ? "fine-due" : undefined}>
                {formatMoney(r.fine)}
              </dd>
            </div>
          </dl>

          {!r.returnDate && (
            <Button
              size="sm"
              variant="secondary"
              icon={Undo2}
              onClick={() => returnBook(r.id)}>
              Mark returned
            </Button>
          )}
        </div>
      ))}
    </div>
  );
};

export default BorrowCards;
