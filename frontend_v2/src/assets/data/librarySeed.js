/* ============================================================
   LIBRARY SEED DATA — UI only, no backend.
   Dates are generated relative to today so the demo always keeps
   a believable mix of due-soon, overdue and returned loans.
   ============================================================ */

const MS_DAY = 86400000;

const shift = (days) =>
  new Date(Date.now() + days * MS_DAY).toISOString().slice(0, 10);

export const LOAN_DAYS = 14;
export const MAX_ACTIVE_BORROWS = 3;
export const FINE_PER_DAY = 0.5;

export const seedStudents = [
  {
    id: "STU001",
    name: "Sean Manutnithya",
    std_class: "I2-GIC2A",
    avatar: "https://i.pravatar.cc/72?img=12",
  },
  {
    id: "STU002",
    name: "Eleanor Pena",
    std_class: "I2-GIC2A",
    avatar: "https://i.pravatar.cc/72?img=45",
  },
  {
    id: "STU003",
    name: "Robert Rose",
    std_class: "I1-GIC1B",
    avatar: "https://i.pravatar.cc/72?img=15",
  },
  {
    id: "STU004",
    name: "Guy Hawkins",
    std_class: "I3-GIC3A",
    avatar: "https://i.pravatar.cc/72?img=51",
  },
  {
    id: "STU005",
    name: "Brak Somphors",
    std_class: "I1-GIC1B",
    avatar: "https://i.pravatar.cc/72?img=32",
  },
  {
    id: "STU006",
    name: "Jenny Wilson",
    std_class: "I3-GIC3A",
    avatar: "https://i.pravatar.cc/72?img=27",
  },
  {
    id: "STU007",
    name: "Kosal Dara",
    std_class: "I2-GIC2A",
    avatar: "https://i.pravatar.cc/72?img=68",
  },
  {
    id: "STU008",
    name: "Marvin McKinney",
    std_class: "I1-GIC1B",
    avatar: "https://i.pravatar.cc/72?img=60",
  },
];

/* Records only carry raw dates — borrowed / returned / overdue is
   derived from dueDate vs today inside LibraryContext.
   Eleanor Pena (STU002) sits on the 3-borrow limit on purpose. */
export const seedBorrows = [
  {
    id: "LN-1001",
    studentId: "STU002",
    bookId: "BK-002",
    issueDate: shift(-26),
    dueDate: shift(-12),
    returnDate: null,
  },
  {
    id: "LN-1002",
    studentId: "STU002",
    bookId: "BK-004",
    issueDate: shift(-9),
    dueDate: shift(5),
    returnDate: null,
  },
  {
    id: "LN-1003",
    studentId: "STU002",
    bookId: "BK-007",
    issueDate: shift(-4),
    dueDate: shift(10),
    returnDate: null,
  },
  {
    id: "LN-1004",
    studentId: "STU004",
    bookId: "BK-010",
    issueDate: shift(-31),
    dueDate: shift(-17),
    returnDate: null,
  },
  {
    id: "LN-1005",
    studentId: "STU001",
    bookId: "BK-001",
    issueDate: shift(-6),
    dueDate: shift(8),
    returnDate: null,
  },
  {
    id: "LN-1006",
    studentId: "STU003",
    bookId: "BK-009",
    issueDate: shift(-11),
    dueDate: shift(3),
    returnDate: null,
  },
  {
    id: "LN-1007",
    studentId: "STU005",
    bookId: "BK-013",
    issueDate: shift(-2),
    dueDate: shift(12),
    returnDate: null,
  },
  {
    id: "LN-1008",
    studentId: "STU006",
    bookId: "BK-003",
    issueDate: shift(-3),
    dueDate: shift(11),
    returnDate: null,
  },
  {
    id: "LN-1009",
    studentId: "STU007",
    bookId: "BK-014",
    issueDate: shift(-8),
    dueDate: shift(6),
    returnDate: null,
  },
  {
    id: "LN-1010",
    studentId: "STU008",
    bookId: "BK-004",
    issueDate: shift(-13),
    dueDate: shift(1),
    returnDate: null,
  },
  {
    id: "LN-1011",
    studentId: "STU003",
    bookId: "BK-007",
    issueDate: shift(-5),
    dueDate: shift(9),
    returnDate: null,
  },
  {
    id: "LN-1012",
    studentId: "STU005",
    bookId: "BK-002",
    issueDate: shift(-12),
    dueDate: shift(2),
    returnDate: null,
  },
  {
    id: "LN-1013",
    studentId: "STU006",
    bookId: "BK-002",
    issueDate: shift(-7),
    dueDate: shift(7),
    returnDate: null,
  },
  {
    id: "LN-1014",
    studentId: "STU008",
    bookId: "BK-007",
    issueDate: shift(-10),
    dueDate: shift(4),
    returnDate: null,
  },

  /* ---- closed loans: borrowing history ---- */
  {
    id: "LN-0901",
    studentId: "STU001",
    bookId: "BK-005",
    issueDate: shift(-60),
    dueDate: shift(-46),
    returnDate: shift(-49),
  },
  {
    id: "LN-0902",
    studentId: "STU001",
    bookId: "BK-008",
    issueDate: shift(-48),
    dueDate: shift(-34),
    returnDate: shift(-28),
  },
  {
    id: "LN-0903",
    studentId: "STU004",
    bookId: "BK-003",
    issueDate: shift(-70),
    dueDate: shift(-56),
    returnDate: shift(-57),
  },
  {
    id: "LN-0904",
    studentId: "STU006",
    bookId: "BK-011",
    issueDate: shift(-40),
    dueDate: shift(-26),
    returnDate: shift(-30),
  },
  {
    id: "LN-0905",
    studentId: "STU002",
    bookId: "BK-006",
    issueDate: shift(-52),
    dueDate: shift(-38),
    returnDate: shift(-36),
  },
  {
    id: "LN-0906",
    studentId: "STU005",
    bookId: "BK-001",
    issueDate: shift(-35),
    dueDate: shift(-21),
    returnDate: shift(-22),
  },
  {
    id: "LN-0907",
    studentId: "STU007",
    bookId: "BK-012",
    issueDate: shift(-24),
    dueDate: shift(-10),
    returnDate: shift(-11),
  },
  {
    id: "LN-0908",
    studentId: "STU003",
    bookId: "BK-013",
    issueDate: shift(-33),
    dueDate: shift(-19),
    returnDate: shift(-19),
  },
];

/* Queues are ordered by reservedDate — the first in line gets the copy
   that comes back. STU001's hold on BK-010 is "ready": a copy is free. */
export const seedReservations = [
  {
    id: "RS-2001",
    bookId: "BK-002",
    studentId: "STU003",
    reservedDate: shift(-3),
  },
  {
    id: "RS-2002",
    bookId: "BK-002",
    studentId: "STU007",
    reservedDate: shift(-1),
  },
  {
    id: "RS-2003",
    bookId: "BK-010",
    studentId: "STU001",
    reservedDate: shift(-2),
  },
];

const activeLoansFor = (bookId) =>
  seedBorrows.filter((r) => r.bookId === bookId && !r.returnDate).length;

/* copiesAvailable is a real field on every book, but it is seeded from the
   open loans above so the shelf count can never contradict the records. */
const withCopies = (book) => ({
  ...book,
  copiesAvailable: book.copiesTotal - activeLoansFor(book.id),
});

export const seedBooks = [
  {
    id: "BK-001",
    title: "Things Fall Apart",
    author: "Chinua Achebe",
    isbn: "978-0385474542",
    genre: "Fiction",
    copiesTotal: 4,
    pdfUrl: "/pdf/things-fall-apart.pdf",
  },
  {
    id: "BK-002",
    title: "A Brief History of Time",
    author: "Stephen Hawking",
    isbn: "978-0553380163",
    genre: "Science",
    copiesTotal: 3,
    pdfUrl: "/pdf/brief-history-of-time.pdf",
  },
  {
    id: "BK-003",
    title: "Introduction to Algorithms",
    author: "Thomas H. Cormen",
    isbn: "978-0262046305",
    genre: "Computer Science",
    copiesTotal: 5,
    pdfUrl: null,
  },
  {
    id: "BK-004",
    title: "Sapiens: A Brief History of Humankind",
    author: "Yuval Noah Harari",
    isbn: "978-0062316097",
    genre: "History",
    copiesTotal: 4,
    pdfUrl: "/pdf/sapiens.pdf",
  },
  {
    id: "BK-005",
    title: "Pride and Prejudice",
    author: "Jane Austen",
    isbn: "978-0141439518",
    genre: "Fiction",
    copiesTotal: 6,
    pdfUrl: "/pdf/pride-and-prejudice.pdf",
  },
  {
    id: "BK-006",
    title: "The Selfish Gene",
    author: "Richard Dawkins",
    isbn: "978-0198788607",
    genre: "Science",
    copiesTotal: 2,
    pdfUrl: null,
  },
  {
    id: "BK-007",
    title: "Clean Code",
    author: "Robert C. Martin",
    isbn: "978-0132350884",
    genre: "Computer Science",
    copiesTotal: 3,
    pdfUrl: "/pdf/clean-code.pdf",
  },
  {
    id: "BK-008",
    title: "Calculus, Early Transcendentals",
    author: "James Stewart",
    isbn: "978-1285741550",
    genre: "Mathematics",
    copiesTotal: 8,
    pdfUrl: null,
  },
  {
    id: "BK-009",
    title: "The Diary of a Young Girl",
    author: "Anne Frank",
    isbn: "978-0553296983",
    genre: "Biography",
    copiesTotal: 3,
    pdfUrl: "/pdf/diary-of-a-young-girl.pdf",
  },
  {
    id: "BK-010",
    title: "Thinking, Fast and Slow",
    author: "Daniel Kahneman",
    isbn: "978-0374533557",
    genre: "Psychology",
    copiesTotal: 2,
    pdfUrl: null,
  },
  {
    id: "BK-011",
    title: "The Art of War",
    author: "Sun Tzu",
    isbn: "978-1599869773",
    genre: "History",
    copiesTotal: 4,
    pdfUrl: "/pdf/art-of-war.pdf",
  },
  {
    id: "BK-012",
    title: "Norwegian Wood",
    author: "Haruki Murakami",
    isbn: "978-0375704024",
    genre: "Fiction",
    copiesTotal: 3,
    pdfUrl: null,
  },
  {
    id: "BK-013",
    title: "Cosmos",
    author: "Carl Sagan",
    isbn: "978-0345539434",
    genre: "Science",
    copiesTotal: 3,
    pdfUrl: "/pdf/cosmos.pdf",
  },
  {
    id: "BK-014",
    title: "Linear Algebra Done Right",
    author: "Sheldon Axler",
    isbn: "978-3319110790",
    genre: "Mathematics",
    copiesTotal: 2,
    pdfUrl: null,
  },
].map(withCopies);
