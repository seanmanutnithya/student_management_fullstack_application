import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from "react";
import gsap from "gsap";

import {
  FINE_PER_DAY,
  LOAN_DAYS,
  MAX_ACTIVE_BORROWS,
  seedBooks,
  seedBorrows,
  seedReservations,
  seedStudents,
} from "@/assets/data/librarySeed";
import { useToast } from "@/components/ui";
import { shake } from "@/animation/shake";
import { usePagination } from "@/hooks/usePagination";
import { ISBN_RE } from "@/lib/validations";

const LibraryContext = createContext(null);

const MS_DAY = 86400000;
const PAGE_SIZE = 10;
const SAVE_DELAY = 900;

/* Loans are day-grained: compare calendar days, never clock times. */
const toDay = (value) => {
  const d = new Date(value);
  d.setHours(0, 0, 0, 0);
  return d.getTime();
};
const isoDate = (ms) => new Date(ms).toISOString().slice(0, 10);
const nextId = (prefix) => `${prefix}-${Date.now().toString().slice(-6)}`;

/* borrowed / returned / overdue is never stored — always derived from
   dueDate vs today, so a record goes overdue on its own. */
const decorateRecord = (record, todayMs) => {
  const dueMs = toDay(record.dueDate);
  const closedMs = record.returnDate ? toDay(record.returnDate) : todayMs;
  const lateDays = Math.max(0, Math.round((closedMs - dueMs) / MS_DAY));

  return {
    ...record,
    status:
      record.returnDate ? "returned"
      : lateDays > 0 ? "overdue"
      : "borrowed",
    lateDays,
    fine: Number((lateDays * FINE_PER_DAY).toFixed(2)),
    daysLeft: Math.round((dueMs - todayMs) / MS_DAY),
  };
};

/* available  — free copies, nobody waiting
   reserved   — a free copy is being held for the first student in the queue
   checked-out — every copy is out on loan */
const availabilityOf = (book, queueLength) => {
  if (book.copiesAvailable <= 0) return "checked-out";
  return queueLength > 0 ? "reserved" : "available";
};

const emptyBookForm = {
  title: "",
  author: "",
  isbn: "",
  genre: "",
  copiesTotal: "1",
  pdfUrl: "",
};

const isValidIsbn = (value) => {
  const raw = String(value).trim();
  const digits = raw.replace(/[^0-9Xx]/g, "");
  return ISBN_RE.test(raw) && (digits.length === 10 || digits.length === 13);
};

const bookValidators = {
  title: (value) => String(value).trim().length >= 2,
  author: (value) => String(value).trim().length >= 2,
  isbn: isValidIsbn,
  copiesTotal: (value) => Number.isInteger(Number(value)) && Number(value) >= 1,
};

const bookErrorMessages = {
  title: "Enter the book title (2 characters or more).",
  author: "Enter the author's name.",
  isbn: "Enter a valid 10 or 13 digit ISBN.",
  copiesTotal: "Enter how many copies the library holds (1 or more).",
};

export function LibraryProvider({ children }) {
  const { toast } = useToast();

  const [books, setBooks] = useState(seedBooks);
  const [records, setRecords] = useState(seedBorrows);
  const [reservations, setReservations] = useState(seedReservations);
  const [students] = useState(seedStudents);

  const [activeTab, setActiveTab] = useState("catalog");

  /* Catalog filters */
  const [query, setQuery] = useState("");
  const [genre, setGenre] = useState("");
  const [availability, setAvailability] = useState("");

  /* Borrowing filters */
  const [recordQuery, setRecordQuery] = useState("");
  const [recordStatus, setRecordStatus] = useState("");

  /* Members tab */
  const [selectedStudentId, setSelectedStudentId] = useState(seedStudents[0].id);

  /* Issue / hold modal — one form, two modes */
  const [issueOpen, setIssueOpen] = useState(false);
  const [issueMode, setIssueMode] = useState("borrow");
  const [issueBookId, setIssueBookId] = useState("");
  const [issueStudentId, setIssueStudentId] = useState(seedStudents[0].id);

  /* Add-book form */
  const [bookFormOpen, setBookFormOpen] = useState(false);
  const [bookForm, setBookForm] = useState(emptyBookForm);
  const [bookErrors, setBookErrors] = useState({});
  const [savingBook, setSavingBook] = useState(false);

  /* Delete confirmation */
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState(null);

  const tabsRef = useRef(null);
  const tabIndicatorRef = useRef(null);
  const bookFormRef = useRef(null);
  const saveTimerRef = useRef(null);

  const todayMs = toDay(new Date());

  /* ---------------- Lookups ---------------- */
  const bookById = useMemo(
    () => Object.fromEntries(books.map((b) => [b.id, b])),
    [books],
  );
  const studentById = useMemo(
    () => Object.fromEntries(students.map((s) => [s.id, s])),
    [students],
  );

  /* ---------------- Derived records ---------------- */
  const decoratedRecords = useMemo(
    () =>
      records
        .map((r) => decorateRecord(r, todayMs))
        .map((r) => ({
          ...r,
          book: bookById[r.bookId] ?? null,
          student: studentById[r.studentId] ?? null,
        })),
    [records, bookById, studentById, todayMs],
  );

  const activeRecords = useMemo(
    () => decoratedRecords.filter((r) => !r.returnDate),
    [decoratedRecords],
  );

  const queueByBook = useMemo(() => {
    const map = {};
    [...reservations]
      .sort((a, b) => a.reservedDate.localeCompare(b.reservedDate))
      .forEach((r) => {
        (map[r.bookId] ??= []).push({
          ...r,
          student: studentById[r.studentId] ?? null,
        });
      });
    return map;
  }, [reservations, studentById]);

  const activeCountByStudent = useMemo(() => {
    const map = {};
    activeRecords.forEach((r) => {
      map[r.studentId] = (map[r.studentId] ?? 0) + 1;
    });
    return map;
  }, [activeRecords]);

  /* ---------------- Catalog ---------------- */
  const genres = useMemo(
    () => [...new Set(books.map((b) => b.genre))].sort(),
    [books],
  );

  const catalog = useMemo(
    () =>
      books.map((b) => {
        const queue = queueByBook[b.id] ?? [];
        return {
          ...b,
          queue,
          availability: availabilityOf(b, queue.length),
          borrowedCount: b.copiesTotal - b.copiesAvailable,
        };
      }),
    [books, queueByBook],
  );

  const filteredBooks = useMemo(() => {
    const q = query.trim().toLowerCase();
    return catalog.filter(
      (b) =>
        (!genre || b.genre === genre) &&
        (!availability || b.availability === availability) &&
        (!q ||
          b.title.toLowerCase().includes(q) ||
          b.author.toLowerCase().includes(q) ||
          b.isbn.toLowerCase().includes(q) ||
          b.genre.toLowerCase().includes(q)),
    );
  }, [catalog, query, genre, availability]);

  /* ---------------- Borrowing ---------------- */
  const filteredRecords = useMemo(() => {
    const q = recordQuery.trim().toLowerCase();
    return decoratedRecords
      .filter(
        (r) =>
          (!recordStatus || r.status === recordStatus) &&
          (!q ||
            (r.student?.name ?? "").toLowerCase().includes(q) ||
            (r.book?.title ?? "").toLowerCase().includes(q) ||
            r.id.toLowerCase().includes(q)),
      )
      .sort((a, b) => b.issueDate.localeCompare(a.issueDate));
  }, [decoratedRecords, recordQuery, recordStatus]);

  const { page, pageCount, pageStart, pageEnd, setPage } = usePagination({
    total: filteredRecords.length,
    pageSize: PAGE_SIZE,
  });

  const pagedRecords = useMemo(
    () => filteredRecords.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
    [filteredRecords, page],
  );

  /* ---------------- Members ---------------- */
  const memberRows = useMemo(
    () =>
      students.map((s) => {
        const mine = decoratedRecords.filter((r) => r.studentId === s.id);
        const active = mine.filter((r) => !r.returnDate);
        return {
          ...s,
          activeCount: active.length,
          overdueCount: active.filter((r) => r.status === "overdue").length,
          historyCount: mine.length - active.length,
          fineDue: Number(
            active.reduce((sum, r) => sum + r.fine, 0).toFixed(2),
          ),
          atLimit: active.length >= MAX_ACTIVE_BORROWS,
        };
      }),
    [students, decoratedRecords],
  );

  const selectedStudent = useMemo(
    () => memberRows.find((s) => s.id === selectedStudentId) ?? memberRows[0],
    [memberRows, selectedStudentId],
  );

  const studentBorrows = useMemo(() => {
    const mine = decoratedRecords.filter(
      (r) => r.studentId === selectedStudent?.id,
    );
    return {
      current: mine
        .filter((r) => !r.returnDate)
        .sort((a, b) => a.dueDate.localeCompare(b.dueDate)),
      past: mine
        .filter((r) => r.returnDate)
        .sort((a, b) => b.returnDate.localeCompare(a.returnDate)),
    };
  }, [decoratedRecords, selectedStudent]);

  /* ---------------- Summary strip ---------------- */
  const summary = useMemo(
    () => ({
      titles: books.length,
      available: books.reduce((sum, b) => sum + b.copiesAvailable, 0),
      borrowed: activeRecords.length,
      overdue: activeRecords.filter((r) => r.status === "overdue").length,
    }),
    [books, activeRecords],
  );

  const finesOutstanding = useMemo(
    () =>
      Number(activeRecords.reduce((sum, r) => sum + r.fine, 0).toFixed(2)),
    [activeRecords],
  );

  /* ---------------- Rules ---------------- */
  // Checked before the click so the UI can explain the block up front.
  const canBorrow = useCallback(
    (studentId, bookId) => {
      const book = bookById[bookId];
      const student = studentById[studentId];
      if (!book || !student) return { ok: false, reason: "Pick a book and a student first." };

      const active = activeCountByStudent[studentId] ?? 0;
      if (active >= MAX_ACTIVE_BORROWS)
        return {
          ok: false,
          reason: `${student.name} already has ${active} active borrows — the limit is ${MAX_ACTIVE_BORROWS}. A book must be returned first.`,
        };

      const alreadyOut = activeRecords.some(
        (r) => r.studentId === studentId && r.bookId === bookId,
      );
      if (alreadyOut)
        return {
          ok: false,
          reason: `${student.name} already has a copy of "${book.title}" on loan.`,
        };

      if (book.copiesAvailable <= 0)
        return {
          ok: false,
          reason: `All ${book.copiesTotal} copies of "${book.title}" are checked out. Place a hold instead.`,
        };

      const queue = queueByBook[bookId] ?? [];
      if (queue.length > 0 && queue[0].studentId !== studentId)
        return {
          ok: false,
          reason: `The free copy is held for ${queue[0].student?.name ?? "another student"}, next in the queue.`,
        };

      return { ok: true, reason: "" };
    },
    [bookById, studentById, activeCountByStudent, activeRecords, queueByBook],
  );

  const canReserve = useCallback(
    (studentId, bookId) => {
      const book = bookById[bookId];
      const student = studentById[studentId];
      if (!book || !student) return { ok: false, reason: "Pick a book and a student first." };

      const queue = queueByBook[bookId] ?? [];
      if (queue.some((r) => r.studentId === studentId))
        return {
          ok: false,
          reason: `${student.name} is already in the queue for this title.`,
        };

      const alreadyOut = activeRecords.some(
        (r) => r.studentId === studentId && r.bookId === bookId,
      );
      if (alreadyOut)
        return {
          ok: false,
          reason: `${student.name} already has this title on loan.`,
        };

      if (book.copiesAvailable > 0 && queue.length === 0)
        return {
          ok: false,
          reason: "Copies are on the shelf — issue it instead of queuing a hold.",
        };

      return { ok: true, reason: "" };
    },
    [bookById, studentById, queueByBook, activeRecords],
  );

  /* ---------------- Actions ---------------- */
  const borrowBook = useCallback(
    (bookId, studentId) => {
      const check = canBorrow(studentId, bookId);
      if (!check.ok) {
        toast.error(check.reason);
        return false;
      }

      const book = bookById[bookId];
      const student = studentById[studentId];
      const dueMs = todayMs + LOAN_DAYS * MS_DAY;

      setBooks((prev) =>
        prev.map((b) =>
          b.id === bookId ?
            { ...b, copiesAvailable: b.copiesAvailable - 1 }
          : b,
        ),
      );
      setRecords((prev) => [
        {
          id: nextId("LN"),
          studentId,
          bookId,
          issueDate: isoDate(todayMs),
          dueDate: isoDate(dueMs),
          returnDate: null,
        },
        ...prev,
      ]);
      // Issuing to the student at the head of the queue clears their hold.
      setReservations((prev) =>
        prev.filter((r) => !(r.bookId === bookId && r.studentId === studentId)),
      );

      toast.success(
        `"${book.title}" issued to ${student.name} — due ${new Date(dueMs).toLocaleDateString(undefined, { day: "2-digit", month: "short" })}`,
      );
      return true;
    },
    [canBorrow, bookById, studentById, todayMs, toast],
  );

  const returnBook = useCallback(
    (recordId) => {
      const record = decoratedRecords.find((r) => r.id === recordId);
      if (!record || record.returnDate) return false;

      setRecords((prev) =>
        prev.map((r) =>
          r.id === recordId ? { ...r, returnDate: isoDate(todayMs) } : r,
        ),
      );
      setBooks((prev) =>
        prev.map((b) =>
          b.id === record.bookId ?
            {
              ...b,
              copiesAvailable: Math.min(b.copiesTotal, b.copiesAvailable + 1),
            }
          : b,
        ),
      );

      const waiting = (queueByBook[record.bookId] ?? [])[0];
      if (record.fine > 0) {
        toast.info(
          `"${record.book?.title}" returned ${record.lateDays} day(s) late — $${record.fine.toFixed(2)} fine due.`,
        );
      } else if (waiting) {
        toast.success(
          `"${record.book?.title}" returned — hold ready for ${waiting.student?.name}.`,
        );
      } else {
        toast.success(`"${record.book?.title}" returned. Thanks!`);
      }
      return true;
    },
    [decoratedRecords, queueByBook, todayMs, toast],
  );

  const reserveBook = useCallback(
    (bookId, studentId) => {
      const check = canReserve(studentId, bookId);
      if (!check.ok) {
        toast.info(check.reason);
        return false;
      }

      const book = bookById[bookId];
      const student = studentById[studentId];
      const position = (queueByBook[bookId] ?? []).length + 1;

      setReservations((prev) => [
        ...prev,
        {
          id: nextId("RS"),
          bookId,
          studentId,
          reservedDate: isoDate(todayMs),
        },
      ]);

      toast.success(
        `Hold placed for ${student.name} on "${book.title}" — #${position} in the queue.`,
      );
      return true;
    },
    [canReserve, bookById, studentById, queueByBook, todayMs, toast],
  );

  const cancelReservation = useCallback(
    (reservationId) => {
      setReservations((prev) => prev.filter((r) => r.id !== reservationId));
      toast.info("Hold cancelled");
    },
    [toast],
  );

  /* ---------------- Add a book ---------------- */
  const handleBookChange = useCallback(
    (e) => {
      const { name, value } = e.target;
      setBookForm((prev) => ({ ...prev, [name]: value }));
      if (bookErrors[name] && bookValidators[name]?.(value)) {
        setBookErrors((prev) => ({ ...prev, [name]: false }));
      }
    },
    [bookErrors],
  );

  const handleBookBlur = useCallback((e) => {
    const { name, value } = e.target;
    if (!bookValidators[name]) return;
    setBookErrors((prev) => ({ ...prev, [name]: !bookValidators[name](value) }));
  }, []);

  const bookFieldError = useCallback(
    (name) => (bookErrors[name] ? bookErrorMessages[name] : ""),
    [bookErrors],
  );

  const openAddBook = useCallback(() => {
    setBookErrors({});
    setBookForm(emptyBookForm);
    setBookFormOpen(true);
  }, []);

  const closeBookForm = useCallback(() => {
    clearTimeout(saveTimerRef.current);
    setSavingBook(false);
    setBookFormOpen(false);
  }, []);

  const saveBook = useCallback(() => {
    const invalid = Object.keys(bookValidators).filter(
      (key) => !bookValidators[key](bookForm[key] ?? ""),
    );
    if (invalid.length > 0) {
      setBookErrors((prev) => ({
        ...prev,
        ...Object.fromEntries(invalid.map((key) => [key, true])),
      }));
      if (bookFormRef.current) shake(bookFormRef.current);
      return;
    }

    const isbn = bookForm.isbn.trim();
    if (books.some((b) => b.isbn.replace(/\D/g, "") === isbn.replace(/\D/g, ""))) {
      setBookErrors((prev) => ({ ...prev, isbn: true }));
      toast.error("A book with that ISBN is already in the catalog.");
      if (bookFormRef.current) shake(bookFormRef.current);
      return;
    }

    setSavingBook(true);
    saveTimerRef.current = setTimeout(() => {
      const copies = Number(bookForm.copiesTotal);
      const saved = {
        id: nextId("BK"),
        title: bookForm.title.trim(),
        author: bookForm.author.trim(),
        isbn,
        genre: bookForm.genre || "General",
        copiesTotal: copies,
        // A brand new title has every copy on the shelf.
        copiesAvailable: copies,
        pdfUrl: bookForm.pdfUrl.trim() || null,
      };

      setBooks((prev) => [saved, ...prev]);
      closeBookForm();
      toast.success(`"${saved.title}" added to the catalog`);
    }, SAVE_DELAY);
  }, [bookForm, books, closeBookForm, toast]);

  /* ---------------- Delete a book ---------------- */
  // A title on loan can't be removed — the copies still have to come back.
  const canDeleteBook = useCallback(
    (bookId) => {
      const book = bookById[bookId];
      if (!book) return { ok: false, reason: "That book is no longer listed." };

      const onLoan = activeRecords.filter((r) => r.bookId === bookId).length;
      if (onLoan > 0)
        return {
          ok: false,
          reason: `${onLoan} cop${onLoan === 1 ? "y is" : "ies are"} still on loan — they must be returned before "${book.title}" can be removed.`,
        };

      return { ok: true, reason: "" };
    },
    [bookById, activeRecords],
  );

  const requestDeleteBook = useCallback(
    (bookId) => {
      const check = canDeleteBook(bookId);
      if (!check.ok) {
        toast.error(check.reason);
        return;
      }
      setPendingDeleteId(bookId);
      setConfirmOpen(true);
    },
    [canDeleteBook, toast],
  );

  const cancelDelete = useCallback(() => {
    setConfirmOpen(false);
    setPendingDeleteId(null);
  }, []);

  const confirmDelete = useCallback(() => {
    const bookId = pendingDeleteId;
    const book = bookById[bookId];
    setConfirmOpen(false);
    setPendingDeleteId(null);
    if (!book) return;

    const drop = () => {
      setBooks((prev) => prev.filter((b) => b.id !== bookId));
      // Nothing may point at a title that no longer exists.
      setRecords((prev) => prev.filter((r) => r.bookId !== bookId));
      setReservations((prev) => prev.filter((r) => r.bookId !== bookId));
      setIssueBookId((prev) => (prev === bookId ? "" : prev));
      toast.success(`"${book.title}" removed from the catalog`);
    };

    const card = document.querySelector(`[data-book-id="${bookId}"]`);
    if (!card) {
      drop();
      return;
    }
    gsap.to(card, {
      opacity: 0,
      y: -8,
      scale: 0.96,
      duration: 0.3,
      ease: "power2.in",
      onComplete: drop,
    });
  }, [pendingDeleteId, bookById, toast]);

  const pendingDeleteBook = useMemo(() => {
    if (!pendingDeleteId) return null;
    const book = bookById[pendingDeleteId];
    if (!book) return null;
    return {
      ...book,
      historyCount: records.filter((r) => r.bookId === pendingDeleteId).length,
      holdCount: (queueByBook[pendingDeleteId] ?? []).length,
    };
  }, [pendingDeleteId, bookById, records, queueByBook]);

  /* ---------------- Issue / hold modal ---------------- */
  const openIssueModal = useCallback((bookId = "", mode = "borrow") => {
    setIssueBookId(bookId);
    setIssueMode(mode);
    setIssueOpen(true);
  }, []);

  const closeIssueModal = useCallback(() => setIssueOpen(false), []);

  const submitIssue = useCallback(() => {
    const done =
      issueMode === "reserve" ?
        reserveBook(issueBookId, issueStudentId)
      : borrowBook(issueBookId, issueStudentId);
    if (done) setIssueOpen(false);
  }, [issueMode, reserveBook, borrowBook, issueBookId, issueStudentId]);

  /* ---------------- Tab indicator ---------------- */
  const moveIndicator = useCallback((tabEl) => {
    const indicator = tabIndicatorRef.current;
    if (!tabEl || !indicator) return;
    const parentRect = tabEl.parentElement.getBoundingClientRect();
    const rect = tabEl.getBoundingClientRect();
    gsap.to(indicator, {
      x: rect.left - parentRect.left,
      width: rect.width,
      duration: 0.32,
      ease: "power2.out",
    });
  }, []);

  const value = useMemo(
    () => ({
      /* data */
      books: catalog,
      records: decoratedRecords,
      reservations,
      students,
      queueByBook,
      summary,
      finesOutstanding,
      genres,

      /* limits */
      MAX_ACTIVE_BORROWS,
      LOAN_DAYS,
      FINE_PER_DAY,
      // Due date a loan issued right now would get — used for previews.
      previewDueDate: isoDate(todayMs + LOAN_DAYS * MS_DAY),

      /* catalog */
      filteredBooks,
      query,
      setQuery,
      genre,
      setGenre,
      availability,
      setAvailability,

      /* borrowing */
      filteredRecords,
      pagedRecords,
      recordQuery,
      setRecordQuery,
      recordStatus,
      setRecordStatus,
      page,
      pageCount,
      pageStart,
      pageEnd,
      setPage,

      /* members */
      memberRows,
      selectedStudent,
      selectedStudentId: selectedStudent?.id,
      setSelectedStudentId,
      studentBorrows,

      /* rules + actions */
      canBorrow,
      canReserve,
      canDeleteBook,
      borrowBook,
      returnBook,
      reserveBook,
      cancelReservation,

      /* add book */
      bookFormOpen,
      bookForm,
      bookErrors,
      bookFieldError,
      savingBook,
      bookFormRef,
      handleBookChange,
      handleBookBlur,
      openAddBook,
      closeBookForm,
      saveBook,

      /* delete book */
      confirmOpen,
      pendingDeleteBook,
      requestDeleteBook,
      confirmDelete,
      cancelDelete,

      /* issue / hold modal */
      issueOpen,
      issueMode,
      issueBookId,
      setIssueBookId,
      issueStudentId,
      setIssueStudentId,
      openIssueModal,
      closeIssueModal,
      submitIssue,

      /* tabs */
      activeTab,
      setActiveTab,
      tabsRef,
      tabIndicatorRef,
      moveIndicator,
    }),
    [
      todayMs,
      catalog,
      decoratedRecords,
      reservations,
      students,
      queueByBook,
      summary,
      finesOutstanding,
      genres,
      filteredBooks,
      query,
      genre,
      availability,
      filteredRecords,
      pagedRecords,
      recordQuery,
      recordStatus,
      page,
      pageCount,
      pageStart,
      pageEnd,
      setPage,
      memberRows,
      selectedStudent,
      studentBorrows,
      canBorrow,
      canReserve,
      canDeleteBook,
      borrowBook,
      returnBook,
      reserveBook,
      cancelReservation,
      bookFormOpen,
      bookForm,
      bookErrors,
      bookFieldError,
      savingBook,
      handleBookChange,
      handleBookBlur,
      openAddBook,
      closeBookForm,
      saveBook,
      confirmOpen,
      pendingDeleteBook,
      requestDeleteBook,
      confirmDelete,
      cancelDelete,
      issueOpen,
      issueMode,
      issueBookId,
      issueStudentId,
      openIssueModal,
      closeIssueModal,
      submitIssue,
      activeTab,
      moveIndicator,
    ],
  );

  return (
    <LibraryContext.Provider value={value}>{children}</LibraryContext.Provider>
  );
}

export function useLibrary() {
  const ctx = useContext(LibraryContext);
  if (!ctx) throw new Error("useLibrary must be used inside <LibraryProvider>");
  return ctx;
}
