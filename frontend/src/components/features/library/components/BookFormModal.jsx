import { BookOpen, FileDown, Hash, Save } from "lucide-react";

import { Button, Field, Modal, TextField } from "@/components/ui";
import { useLibrary } from "@/context/LibraryContext";

const GENRES = [
  "Fiction",
  "Science",
  "Computer Science",
  "Mathematics",
  "History",
  "Biography",
  "Psychology",
  "General",
];

const BookFormModal = () => {
  const {
    bookFormOpen,
    closeBookForm,
    bookForm,
    bookErrors,
    bookFieldError,
    savingBook,
    bookFormRef,
    handleBookChange,
    handleBookBlur,
    saveBook,
  } = useLibrary();

  const isValid = (name) => Boolean(bookForm[name]) && !bookErrors[name];

  return (
    <Modal
      open={bookFormOpen}
      onClose={closeBookForm}
      title="Add Book"
      titleId="bookModalTitle"
      overlayId="bookModalOverlay"
      footer={
        <>
          <Button variant="secondary" onClick={closeBookForm}>
            Cancel
          </Button>
          <Button icon={Save} loading={savingBook} onClick={saveBook}>
            Save book
          </Button>
        </>
      }>
      <form id="bookForm" ref={bookFormRef} onSubmit={(e) => e.preventDefault()}>
        <div className="form-grid">
          <TextField
            id="bTitle"
            name="title"
            label="Title"
            className="field--full"
            icon={BookOpen}
            statusIcons
            placeholder="e.g. The Old Man and the Sea"
            value={bookForm.title}
            onChange={handleBookChange}
            onBlur={handleBookBlur}
            error={bookFieldError("title")}
            valid={isValid("title")}
          />

          <TextField
            id="bAuthor"
            name="author"
            label="Author"
            className="field--full"
            placeholder="e.g. Ernest Hemingway"
            value={bookForm.author}
            onChange={handleBookChange}
            onBlur={handleBookBlur}
            error={bookFieldError("author")}
            valid={isValid("author")}
          />

          <TextField
            id="bIsbn"
            name="isbn"
            label="ISBN"
            icon={Hash}
            statusIcons
            placeholder="978-0684801223"
            value={bookForm.isbn}
            onChange={handleBookChange}
            onBlur={handleBookBlur}
            error={bookFieldError("isbn")}
            valid={isValid("isbn")}
          />

          <Field label="Genre" htmlFor="bGenre">
            <select
              id="bGenre"
              name="genre"
              value={bookForm.genre}
              onChange={handleBookChange}>
              <option value="">Select genre</option>
              {GENRES.map((g) => (
                <option key={g}>{g}</option>
              ))}
            </select>
          </Field>

          <TextField
            id="bCopies"
            name="copiesTotal"
            type="number"
            min="1"
            max="99"
            label="Copies held"
            hint="All copies start on the shelf"
            value={bookForm.copiesTotal}
            onChange={handleBookChange}
            onBlur={handleBookBlur}
            error={bookFieldError("copiesTotal")}
          />

          <TextField
            id="bPdf"
            name="pdfUrl"
            label="PDF link (optional)"
            icon={FileDown}
            placeholder="/pdf/old-man-and-the-sea.pdf"
            hint="Leave empty if there is no digital copy"
            value={bookForm.pdfUrl}
            onChange={handleBookChange}
          />
        </div>
      </form>
    </Modal>
  );
};

export default BookFormModal;
