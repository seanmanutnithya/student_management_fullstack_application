import {
  AlertTriangle,
  Archive,
  Megaphone,
  Send,
  Users,
} from "lucide-react";

/* ============================================================
   NOTICE SEED DATA — UI only, no backend.
   The audience counter reads a real roster rather than a made-up
   number, so "reaches 247 people" is something you can count.
   ============================================================ */

export const noticeTabButtons = [
  { id: "tab-compose", control: "panel-compose", tab: "compose", label: "Compose" },
  { id: "tab-board", control: "panel-board", tab: "board", label: "Notice board" },
  { id: "tab-templates", control: "panel-templates", tab: "templates", label: "Templates" },
  { id: "tab-archive", control: "panel-archive", tab: "archive", label: "Archive" },
];

export const summaryCards = [
  { key: "live", icon: Megaphone, colorClass: "purple", label: "Live notices" },
  { key: "scheduled", icon: Send, colorClass: "blue", label: "Scheduled" },
  { key: "avgRead", icon: Users, colorClass: "green", label: "Average read %" },
  { key: "archived", icon: Archive, colorClass: "amber", label: "Archived" },
];

export const PRIORITIES = [
  {
    value: "normal",
    label: "Normal",
    tone: "slate",
    note: "Sits in the chronological feed.",
  },
  {
    value: "important",
    label: "Important",
    tone: "amber",
    note: "Highlighted, but stays in date order.",
  },
  {
    value: "urgent",
    label: "Urgent",
    tone: "red",
    icon: AlertTriangle,
    note: "Pinned to the top of the board until it expires.",
  },
];

export const CATEGORIES = [
  { value: "general", label: "General" },
  { value: "academic", label: "Academic" },
  { value: "fees", label: "Fees" },
  { value: "event", label: "Event" },
  { value: "holiday", label: "Holiday" },
  { value: "emergency", label: "Emergency" },
];

export const ROLES = [
  { value: "student", label: "Students" },
  { value: "teacher", label: "Teachers" },
  { value: "guardian", label: "Guardians" },
];

export const CLASSES = ["10A", "10B", "11A", "11B", "12A"];

const FIRST = [
  "Sokha", "Dara", "Bopha", "Chanthou", "Vichea", "Sreyneang", "Rithy", "Kanha",
  "Pisey", "Makara", "Sopheak", "Eleanor", "Robert", "Guy", "Jenny", "Marvin",
  "Devon", "Kristin", "Cameron", "Bessie", "Jerome", "Arlene", "Dianne", "Nara",
  "Veasna", "Sothea", "Chenda", "Leakhena", "Phalla", "Ravy", "Sovann", "Theary",
];
const LAST = [
  "Chan", "Sok", "Meas", "Keo", "Ly", "Pen", "Sam", "Nhem", "Yim", "Tep",
  "Pena", "Rose", "Hawkins", "Wilson", "McKinney", "Lane", "Watson", "Cooper",
  "Black", "Fisher", "Bell", "Nguyen", "Flores", "Miles", "Warren", "Howard",
  "Reed", "Cole", "Fox", "Webb", "Hunt", "Price",
];

const rand = (seed) => {
  const x = Math.sin(seed * 12.9898) * 43758.5453;
  return x - Math.floor(x);
};

const nameFor = (i) =>
  `${FIRST[i % FIRST.length]} ${LAST[(i * 7) % LAST.length]}`;

/* 180 students across five sections, 24 teachers, 43 guardians = 247. */
const STUDENTS_PER_CLASS = 36;

const studentPeople = CLASSES.flatMap((classId, classIndex) =>
  Array.from({ length: STUDENTS_PER_CLASS }, (_, i) => {
    const index = classIndex * STUDENTS_PER_CLASS + i;
    return {
      id: `P-S${String(index + 1).padStart(3, "0")}`,
      name: nameFor(index),
      role: "student",
      classId,
    };
  }),
);

const teacherPeople = Array.from({ length: 24 }, (_, i) => ({
  id: `P-T${String(i + 1).padStart(3, "0")}`,
  name: nameFor(i + 5),
  role: "teacher",
  classId: CLASSES[i % CLASSES.length],
}));

const guardianPeople = Array.from({ length: 43 }, (_, i) => ({
  id: `P-G${String(i + 1).padStart(3, "0")}`,
  name: nameFor(i + 11),
  role: "guardian",
  classId: CLASSES[i % CLASSES.length],
}));

export const people = [...studentPeople, ...teacherPeople, ...guardianPeople];

const MS_DAY = 86400000;
const isoLocal = (d) => {
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
};
const shiftDate = (days) => isoLocal(new Date(Date.now() + days * MS_DAY));
const shiftStamp = (days, hour = 9) => {
  const d = new Date(Date.now() + days * MS_DAY);
  d.setHours(hour, 0, 0, 0);
  return d.toISOString();
};

/* Deterministic reader set — the same people have opened each notice on
   every run, so the read bars don't dance between reloads. */
const readersFor = (audienceIds, share, salt) =>
  audienceIds.filter((_, i) => rand(i * 3.7 + salt) < share);

export const audienceAll = () => ({
  scope: "all",
  roles: [],
  classes: [],
  individuals: [],
});

export const emptyComposer = {
  title: "",
  body: "",
  category: "general",
  priority: "normal",
  audience: audienceAll(),
  scheduleMode: "now",
  publishAt: "",
  expiresAt: "",
};

const allIds = people.map((p) => p.id);
const studentIds = studentPeople.map((p) => p.id);
const classIds = (classId) =>
  people.filter((p) => p.classId === classId).map((p) => p.id);

export const seedNotices = [
  {
    id: "N-001",
    title: "Campus closed Friday — burst water main",
    body: "Maintenance need the full day to repair the main supply line. All classes on Friday are cancelled and will be made up in the following week. Buses will not run. Boarding students should report to the west hall by 08:00.",
    category: "emergency",
    priority: "urgent",
    status: "published",
    audience: audienceAll(),
    publishedAt: shiftStamp(-1, 7),
    expiresAt: shiftDate(3),
    author: "Priscilla Lily",
    readBy: readersFor(allIds, 0.78, 3),
  },
  {
    id: "N-002",
    title: "Term 2 fees due 28th",
    body: "Term 2 tuition is payable by the 28th. Payment can be made at the bursar's office or by bank transfer using your child's student ID as the reference. A late fee applies after the due date.",
    category: "fees",
    priority: "important",
    status: "published",
    audience: { scope: "role", roles: ["guardian"], classes: [], individuals: [] },
    publishedAt: shiftStamp(-3, 9),
    expiresAt: shiftDate(14),
    author: "Priscilla Lily",
    readBy: readersFor(
      guardianPeople.map((p) => p.id),
      0.54,
      11,
    ),
  },
  {
    id: "N-003",
    title: "Midterm timetable published",
    body: "The midterm examination timetable is now on the exam board and in each classroom. Papers begin at 07:30 sharp. Bring your student card; calculators are permitted for mathematics and physics only.",
    category: "academic",
    priority: "normal",
    status: "published",
    audience: { scope: "role", roles: ["student", "teacher"], classes: [], individuals: [] },
    publishedAt: shiftStamp(-5, 10),
    expiresAt: shiftDate(10),
    author: "Dr. Alan Turner",
    readBy: readersFor(studentIds, 0.66, 17),
  },
  {
    id: "N-004",
    title: "Grade 12 university guidance evening",
    body: "An evening session on university applications runs next Thursday at 18:00 in the main hall. Representatives from four universities will answer questions. Guardians of Grade 12 students are encouraged to attend.",
    category: "event",
    priority: "normal",
    status: "published",
    audience: { scope: "class", roles: [], classes: ["12A"], individuals: [] },
    publishedAt: shiftStamp(-7, 14),
    expiresAt: shiftDate(6),
    author: "Sarah Kim",
    readBy: readersFor(classIds("12A"), 0.71, 23),
  },
  {
    id: "N-005",
    title: "Water festival holiday — no classes",
    body: "The school will be closed for the water festival. Classes resume on the Monday following the holiday. Library and boarding services continue as normal throughout.",
    category: "holiday",
    priority: "normal",
    status: "archived",
    audience: audienceAll(),
    publishedAt: shiftStamp(-40, 9),
    expiresAt: shiftDate(-25),
    author: "Priscilla Lily",
    readBy: readersFor(allIds, 0.88, 31),
  },
  {
    id: "N-006",
    title: "Sports day results and photographs",
    body: "Congratulations to all who took part in sports day. Final standings and the photograph gallery are now available from the school office. Medals will be presented at Monday assembly.",
    category: "event",
    priority: "normal",
    status: "archived",
    audience: audienceAll(),
    publishedAt: shiftStamp(-62, 15),
    expiresAt: shiftDate(-48),
    author: "Marcus Reed",
    readBy: readersFor(allIds, 0.63, 41),
  },
  {
    id: "N-007",
    title: "Parent–teacher meeting slots open",
    body: "Booking is now open for parent–teacher meetings. Each slot runs fifteen minutes. Choose a time through the guardian portal; unbooked slots will be allocated automatically a week beforehand.",
    category: "academic",
    priority: "important",
    status: "scheduled",
    audience: { scope: "role", roles: ["guardian"], classes: [], individuals: [] },
    publishAt: shiftStamp(2, 8),
    expiresAt: shiftDate(20),
    author: "Priscilla Lily",
    readBy: [],
  },
];

/* {{placeholders}} are filled in on each send rather than edited by hand. */
/* Published but past its expiry and never archived by hand — it should
   drop off the board on its own and turn up in the archive. */
seedNotices.push({
  id: "N-008",
  title: "Library stocktake — short loans suspended",
  body: "Short-loan borrowing is suspended while the annual stocktake runs. Reference material stays available in the reading room throughout. Normal borrowing resumes afterwards.",
  category: "general",
  priority: "normal",
  status: "published",
  audience: { scope: "role", roles: ["student", "teacher"], classes: [], individuals: [] },
  publishedAt: shiftStamp(-20, 11),
  expiresAt: shiftDate(-6),
  author: "Sokun Chea",
  readBy: readersFor(studentIds, 0.49, 53),
});

export const seedTemplates = [
  {
    id: "TPL-FEE",
    name: "Fee reminder",
    category: "fees",
    priority: "important",
    title: "{{term}} fees due {{dueDate}}",
    body: "{{term}} tuition of {{amount}} is payable by {{dueDate}}. Payment can be made at the bursar's office or by bank transfer using your child's student ID as the reference. A late fee applies after the due date.",
    fields: [
      { key: "term", label: "Term", placeholder: "e.g. Term 3" },
      { key: "amount", label: "Amount", placeholder: "e.g. $420" },
      { key: "dueDate", label: "Due date", placeholder: "e.g. 28 October" },
    ],
  },
  {
    id: "TPL-HOL",
    name: "Holiday closure",
    category: "holiday",
    priority: "normal",
    title: "{{holiday}} holiday — school closed",
    body: "The school will be closed for {{holiday}} from {{from}} to {{to}}. Classes resume on {{resume}}. Boarding and library services continue as normal.",
    fields: [
      { key: "holiday", label: "Holiday name", placeholder: "e.g. Water festival" },
      { key: "from", label: "From", placeholder: "e.g. 12 November" },
      { key: "to", label: "To", placeholder: "e.g. 14 November" },
      { key: "resume", label: "Classes resume", placeholder: "e.g. Monday 17 November" },
    ],
  },
  {
    id: "TPL-EXM",
    name: "Exam schedule",
    category: "academic",
    priority: "important",
    title: "{{session}} timetable published",
    body: "The {{session}} timetable is now on the exam board and in each classroom. Papers begin at {{startTime}} sharp. Bring your student card; calculators are permitted for mathematics and physics only.",
    fields: [
      { key: "session", label: "Session", placeholder: "e.g. Final examination" },
      { key: "startTime", label: "Start time", placeholder: "e.g. 07:30" },
    ],
  },
];
