import { Undo2 } from "lucide-react";

import { useLibrary } from "@/context/LibraryContext";
import { formatDate, formatMoney } from "@/utils/format";
import StatusPill from "./StatusPill";

const dueNote = (record) => {
  if (record.status === "returned") return `Returned ${formatDate(record.returnDate)}`;
  if (record.status === "overdue") return `${record.lateDays} day(s) late`;
  if (record.daysLeft === 0) return "Due today";
  return `${record.daysLeft} day(s) left`;
};

const BorrowTable = () => {
  const { pagedRecords, returnBook } = useLibrary();

  return (
    <div className="table-wrap">
      <table className="table" id="borrowTable">
        <thead>
          <tr>
            <th>Student</th>
            <th>Book</th>
            <th>Issued</th>
            <th>Due</th>
            <th>Status</th>
            <th>Fine</th>
            <th className="col-action">Action</th>
          </tr>
        </thead>
        <tbody id="borrowTbody">
          {pagedRecords.map((r) => (
            <tr key={r.id} data-row-id={r.id} className="borrow-row">
              <td>
                <div className="student-name-cell">
                  <img
                    className="student-avatar"
                    src={r.student?.avatar}
                    alt=""
                    loading="lazy"
                  />
                  <span>
                    <span className="student-name">{r.student?.name}</span>
                    <span className="cell-sub">{r.student?.std_class}</span>
                  </span>
                </div>
              </td>
              <td>
                <span className="student-name">{r.book?.title}</span>
                <span className="cell-sub">{r.book?.author}</span>
              </td>
              <td>{formatDate(r.issueDate)}</td>
              <td>
                {formatDate(r.dueDate)}
                <span className="cell-sub">{dueNote(r)}</span>
              </td>
              <td>
                <StatusPill status={r.status} />
              </td>
              <td className={r.fine > 0 ? "fine-due" : undefined}>
                {formatMoney(r.fine)}
              </td>
              <td className="col-action">
                {r.returnDate ?
                  <span className="cell-sub">—</span>
                : <button
                    className="row-action-btn edit"
                    title={`Return ${r.book?.title}`}
                    aria-label={`Return ${r.book?.title}`}
                    onClick={() => returnBook(r.id)}>
                    <Undo2 />
                  </button>
                }
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BorrowTable;
