import { CalendarClock, Layers, TriangleAlert, UserRoundX } from "lucide-react";

/* ============================================================
   ROUTINE (TIMETABLE) SEED DATA — UI only, no backend.
   The base grid is generated conflict-free, then a few clashes are
   injected on purpose so the conflict dashboard has real work to do.
   ============================================================ */

/* 90 scheduled periods across six teaching staff is 15 each, so that is
   the honest default target — a figure nobody could hit would paint every
   row red and say nothing. The panel's input re-tests other targets. */
export const WORKLOAD_TARGET = 15; // periods per week
export const WORKLOAD_TOLERANCE = 2;

export const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
export const DAY_SHORT = ["Mon", "Tue", "Wed", "Thu", "Fri"];

export const summaryCards = [
  { key: "lessons", icon: Layers, colorClass: "purple", label: "Scheduled periods" },
  {
    key: "conflicts",
    icon: TriangleAlert,
    colorClass: "amber",
    label: "Open conflicts",
  },
  { key: "absences", icon: UserRoundX, colorClass: "blue", label: "Marked absent" },
  {
    key: "periodsPerDay",
    icon: CalendarClock,
    colorClass: "green",
    label: "Periods per day",
  },
];

export const lenses = [
  { value: "class", label: "Class" },
  { value: "teacher", label: "Teacher" },
  { value: "room", label: "Room" },
];

/* Only tokens already in the design system — every block also prints its
   subject code, so identity never rests on colour alone. */
export const subjects = [
  { code: "MTH", name: "Mathematics", tone: "purple", teacher: "Dr. Alan Turner" },
  { code: "ENG", name: "English", tone: "blue", teacher: "Sarah Kim" },
  { code: "PHY", name: "Physics", tone: "green", teacher: "Helen Vong", room: "Lab 01" },
  { code: "CHM", name: "Chemistry", tone: "amber", teacher: "Sokun Chea", room: "Lab 02" },
  { code: "CSC", name: "Computer Science", tone: "violet", teacher: "Priscilla Lily", room: "IT Suite" },
  { code: "KHM", name: "Khmer Literature", tone: "slate", teacher: "Dara Pich" },
];

export const teachers = [
  "Dr. Alan Turner",
  "Sarah Kim",
  "Helen Vong",
  "Sokun Chea",
  "Priscilla Lily",
  "Dara Pich",
  "Marcus Reed",
];

export const rooms = [
  "Room 204",
  "Room 205",
  "Room 301",
  "Lab 01",
  "Lab 02",
  "IT Suite",
];

export const classes = [
  { id: "10A", homeRoom: "Room 204" },
  { id: "10B", homeRoom: "Room 205" },
  { id: "11A", homeRoom: "Room 301" },
];

/* ---------------- Bell schedule templates ---------------- */
const period = (id, label, start, end, isBreak = false) => ({
  id,
  label,
  start,
  end,
  isBreak,
});

export const seedTemplates = [
  {
    id: "tpl-regular",
    name: "Regular day",
    periods: [
      period("p1", "Period 1", "07:30", "08:20"),
      period("p2", "Period 2", "08:20", "09:10"),
      period("b1", "Morning break", "09:10", "09:30", true),
      period("p3", "Period 3", "09:30", "10:20"),
      period("p4", "Period 4", "10:20", "11:10"),
      period("b2", "Lunch", "11:10", "12:10", true),
      period("p5", "Period 5", "12:10", "13:00"),
      period("p6", "Period 6", "13:00", "13:50"),
    ],
  },
  {
    id: "tpl-half",
    name: "Half day",
    periods: [
      period("p1", "Period 1", "07:30", "08:15"),
      period("p2", "Period 2", "08:15", "09:00"),
      period("b1", "Break", "09:00", "09:15", true),
      period("p3", "Period 3", "09:15", "10:00"),
      period("p4", "Period 4", "10:00", "10:45"),
    ],
  },
  {
    id: "tpl-exam",
    name: "Exam day",
    periods: [
      period("p1", "Session 1", "08:00", "09:30"),
      period("b1", "Break", "09:30", "10:00", true),
      period("p3", "Session 2", "10:00", "11:30"),
      period("b2", "Lunch", "11:30", "12:30", true),
      period("p5", "Session 3", "12:30", "14:00"),
    ],
  },
];

const TEACHING_PERIODS = seedTemplates[0].periods.filter((p) => !p.isBreak);

const roomFor = (subject, klass) => subject.room ?? klass.homeRoom;

/* Each class is offset in the subject rotation, so at any one slot the
   three sections are in different subjects — a conflict-free baseline. */
const baseLessons = () => {
  const lessons = [];
  classes.forEach((klass, classIndex) => {
    DAYS.forEach((day, dayIndex) => {
      TEACHING_PERIODS.forEach((slot, periodIndex) => {
        const subject =
          subjects[
            (dayIndex * TEACHING_PERIODS.length +
              periodIndex +
              classIndex * 2) %
              subjects.length
          ];
        lessons.push({
          id: `${klass.id}-${dayIndex}-${slot.id}`,
          classId: klass.id,
          day,
          periodId: slot.id,
          code: subject.code,
          subject: subject.name,
          tone: subject.tone,
          teacher: subject.teacher,
          room: roomFor(subject, klass),
        });
      });
    });
  });
  return lessons;
};

/* Deliberate clashes so the dashboard, the drag preview and the
   substitute flow all have something real to point at. */
const injectConflicts = (lessons) => {
  const find = (classId, day, periodId) =>
    lessons.find(
      (l) => l.classId === classId && l.day === day && l.periodId === periodId,
    );

  const a = find("10A", "Monday", "p3");
  const b = find("10B", "Monday", "p3");
  if (a && b) b.teacher = a.teacher; // double-booked teacher

  const c = find("10A", "Tuesday", "p2");
  const d = find("11A", "Tuesday", "p2");
  if (c && d) d.room = c.room; // double-booked room

  const e = find("10B", "Thursday", "p5");
  const f = find("11A", "Thursday", "p5");
  if (e && f) f.teacher = e.teacher; // second teacher clash

  return lessons;
};

export const seedLessons = injectConflicts(baseLessons());

/* The next school day, in local time — a date-only string built from UTC
   would land on the wrong day west of the meridian. */
const nextSchoolDay = () => {
  const d = new Date();
  do {
    d.setDate(d.getDate() + 1);
  } while (d.getDay() === 0 || d.getDay() === 6);
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return { date: `${d.getFullYear()}-${month}-${day}`, day: DAYS[d.getDay() - 1] };
};

/* One teacher is already out, so substitute mode has a live case. */
const absenceDay = nextSchoolDay();

export const seedAbsences = [
  {
    id: "ABS-01",
    teacher: "Sarah Kim",
    date: absenceDay.date,
    day: absenceDay.day,
    reason: "Medical leave",
  },
];
