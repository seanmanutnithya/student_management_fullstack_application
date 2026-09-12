import { BookmarkPlus, BookOpen, BookUp, FileDown, Trash2 } from "lucide-react";

import { Button, useToast } from "@/components/ui";
import { useLibrary } from "@/context/LibraryContext";
import StatusPill from "./StatusPill";

const BookCard = ({ book }) => {
  const { openIssueModal, requestDeleteBook } = useLibrary();
  const { toast } = useToast();

  const soldOut = book.copiesAvailable <= 0;
  const holdReady = book.availability === "reserved";

  return (
    <article className="book-card" data-book-id={book.id}>
      <div className="book-card-top">
        <div className="book-cover" aria-hidden="true">
          <BookOpen />
        </div>
        <div className="book-card-heading">
          <h3 className="book-title" title={book.title}>
            {book.title}
          </h3>
          <p className="book-author">{book.author}</p>
        </div>
        <StatusPill status={book.availability} />
      </div>

      <dl className="book-meta">
        <div>
          <dt>Genre</dt>
          <dd>{book.genre}</dd>
        </div>
        <div>
          <dt>ISBN</dt>
          <dd>{book.isbn}</dd>
        </div>
        <div>
          <dt>On shelf</dt>
          <dd>
            {book.copiesAvailable} of {book.copiesTotal} copies
          </dd>
        </div>
        <div>
          <dt>Holds</dt>
          <dd>
            {book.queue.length ? `${book.queue.length} waiting` : "None queued"}
          </dd>
        </div>
      </dl>

      {holdReady && (
        <p className="book-note">
          Copy held for <strong>{book.queue[0]?.student?.name}</strong>, first
          in the queue.
        </p>
      )}

      <div className="book-card-foot">
        <Button
          size="sm"
          icon={BookUp}
          disabled={soldOut}
          onClick={() => openIssueModal(book.id, "borrow")}>
          Borrow
        </Button>
        <Button
          size="sm"
          variant="secondary"
          icon={BookmarkPlus}
          disabled={!soldOut && book.queue.length === 0}
          onClick={() => openIssueModal(book.id, "reserve")}>
          Reserve
        </Button>
        <div className="book-card-tools">
          {book.pdfUrl && (
            <button
              className="row-action-btn edit"
              title={`Download ${book.title}`}
              aria-label={`Download ${book.title}`}
              onClick={() =>
                toast.info(
                  "PDF download is a UI placeholder - no file attached.",
                )
              }>
              <FileDown />
            </button>
          )}

          <button
            className="row-action-btn delete"
            title={`Delete ${book.title}`}
            aria-label={`Delete ${book.title}`}
            onClick={() => requestDeleteBook(book.id)}>
            <Trash2 />
          </button>
        </div>
      </div>
    </article>
  );
};

export default BookCard;
