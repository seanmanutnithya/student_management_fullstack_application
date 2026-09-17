import {
  CalendarDays,
  ClipboardList,
  GraduationCap,
  RefreshCw,
} from "lucide-react";

/* ============================================================
   EXAM SEED DATA — UI only, no backend.
   Rooms, days and the teaching timetable are pulled from the routine
   seed so paper clashes are checked against the real schedule rather
   than a second copy of it.
   ============================================================ */

export const PASS_MARK = 50; // percent
export const DEFAULT_MAX = 100;

export const examTabButtons = [
  { id: "tab-planner", control: "panel-planner", tab: "planner", label: "Planner" },
  { id: "tab-marks", control: "panel-marks", tab: "marks", label: "Mark entry" },
  { id: "tab-reports", control: "panel-reports", tab: "reports", label: "Report cards" },
  { id: "tab-analytics", control: "panel-analytics", tab: "analytics", label: "Analytics" },
  { id: "tab-seating", control: "panel-seating", tab: "seating", label: "Seating" },
  { id: "tab-retakes", control: "panel-retakes", tab: "retakes", label: "Retakes" },
];

export const summaryCards = [
  { key: "papers", icon: CalendarDays, colorClass: "purple", label: "Papers scheduled" },
  { key: "entered", icon: ClipboardList, colorClass: "blue", label: "Marks entered" },
  { key: "passRate", icon: GraduationCap, colorClass: "green", label: "Pass rate %" },
  { key: "retakes", icon: RefreshCw, colorClass: "amber", label: "Retakes needed" },
];

/* Letter bands, highest first — the first match wins. */
export const GRADE_BANDS = [
  { letter: "A+", min: 90, points: 4, tone: "green" },
  { letter: "A", min: 80, points: 3.7, tone: "green" },
  { letter: "B", min: 70, points: 3, tone: "blue" },
  { letter: "C", min: 60, points: 2.3, tone: "blue" },
  { letter: "D", min: 50, points: 1.7, tone: "amber" },
  { letter: "F", min: 0, points: 0, tone: "red" },
];

export const gradeFor = (percent) =>
  GRADE_BANDS.find((band) => percent >= band.min) ??
  GRADE_BANDS[GRADE_BANDS.length - 1];

/* scheme mirrors the Subject page: assignment / midterm / final weights.
   A Midterm session contributes its `midterm` share of the final grade. */
export const subjects = [
  { code: "MTH", name: "Mathematics", credits: 4, max: 100, scheme: { assignment: 30, midterm: 30, final: 40 } },
  { code: "ENG", name: "English", credits: 3, max: 100, scheme: { assignment: 40, midterm: 25, final: 35 } },
  { code: "PHY", name: "Physics", credits: 4, max: 100, scheme: { assignment: 30, midterm: 30, final: 40 } },
  { code: "CHM", name: "Chemistry", credits: 4, max: 100, scheme: { assignment: 35, midterm: 25, final: 40 } },
  { code: "CSC", name: "Computer Science", credits: 3, max: 100, scheme: { assignment: 50, midterm: 20, final: 30 } },
  { code: "KHM", name: "Khmer Literature", credits: 3, max: 50, scheme: { assignment: 40, midterm: 30, final: 30 } },
];

const FIRST = [
  "Sokha", "Dara", "Bopha", "Chanthou", "Vichea", "Sreyneang",
  "Eleanor", "Robert", "Guy", "Jenny", "Marvin", "Kristin",
];
const LAST = [
  "Chan", "Sok", "Meas", "Keo", "Ly", "Pen",
  "Pena", "Rose", "Hawkins", "Wilson", "McKinney", "Cooper",
];

const rand = (seed) => {
  const x = Math.sin(seed * 12.9898) * 43758.5453;
  return x - Math.floor(x);
};

export const students = Array.from({ length: 12 }, (_, i) => ({
  id: `STU-${String(201 + i).padStart(3, "0")}`,
  name: `${FIRST[i]} ${LAST[i]}`,
  roll: i + 1,
  classId: i < 6 ? "10A" : "10B",
  avatar: `https://i.pravatar.cc/64?img=${i + 21}`,
  attendance: Math.round((84 + rand(i * 7 + 1) * 15) * 10) / 10,
}));

/* Most marks are already in; two subjects are left blank on purpose so the
   grid opens with real work to do and the "entered" count means something. */
export const seedMarks = (() => {
  const marks = {};
  students.forEach((student, i) => {
    const row = {};
    subjects.forEach((subject, j) => {
      if (i === 3 && j > 3) return; // one student part-marked
      if (j === 5 && i > 8) return; // one paper part-marked
      const ability = 0.45 + rand(i * 13 + 3) * 0.5;
      const spread = rand(i * 29 + j * 11) * 0.3 - 0.15;
      const percent = Math.min(
        0.99,
        Math.max(0.24, ability + spread),
      );
      row[subject.code] = Math.round(percent * subject.max);
    });
    marks[student.id] = row;
  });
  return marks;
})();

const MS_DAY = 86400000;
const isoLocal = (d) => {
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${month}-${day}`;
};
const shift = (days) => isoLocal(new Date(Date.now() + days * MS_DAY));

/* Papers sit on a date plus one of the routine's period slots, which is
   what makes a clash against the teaching timetable checkable. */
export const seedSessions = [
  {
    id: "SES-MID",
    name: "Midterm assessment",
    type: "midterm",
    term: "Term 1",
    status: "draft",
    papers: [
      { id: "PP-01", code: "MTH", date: shift(3), periodId: "p1", room: "Room 204", durationMins: 90 },
      { id: "PP-02", code: "ENG", date: shift(3), periodId: "p3", room: "Room 205", durationMins: 90 },
      { id: "PP-03", code: "PHY", date: shift(4), periodId: "p1", room: "Lab 01", durationMins: 90 },
      { id: "PP-04", code: "CHM", date: shift(4), periodId: "p3", room: "Lab 02", durationMins: 90 },
      { id: "PP-05", code: "CSC", date: shift(5), periodId: "p1", room: "IT Suite", durationMins: 60 },
      /* Deliberately double-booked with the English paper above so the
         planner's clash check has a live case. */
      { id: "PP-06", code: "KHM", date: shift(3), periodId: "p3", room: "Room 205", durationMins: 60 },
    ],
  },
  {
    id: "SES-FIN",
    name: "Final examination",
    type: "final",
    term: "Term 1",
    status: "draft",
    papers: [],
  },
];

export const seedRemarks = {
  "STU-201": "Consistent effort across the term; keep it up.",
};

export const seatRooms = [
  { id: "Hall A", rows: 4, cols: 5 },
  { id: "Room 204", rows: 3, cols: 4 },
  { id: "Lab 01", rows: 3, cols: 4 },
];

export const publishAudience = [
  { key: "students", label: "Students", note: "See their own results only" },
  { key: "guardians", label: "Guardians", note: "Emailed a link to the report card" },
  { key: "teachers", label: "Class teachers", note: "Full cohort view, already had draft access" },
];
