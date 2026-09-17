import { parseDate, toIsoDate as iso } from "@/utils/format";
import {
  CalendarCheck,
  CircleCheck,
  Clock3,
  FileText,
  TriangleAlert,
  UserMinus,
} from "lucide-react";

/* ============================================================
   ATTENDANCE SEED DATA — UI only, no backend.
   History is generated from a fixed seed so the heatmap shows the
   same patterns on every load (one student really is always out on
   Mondays), and so the derived percentages never drift mid-session.
   ============================================================ */

export const ATTENDANCE_THRESHOLD = 90; // % below which a student is at risk
export const HISTORY_DAYS = 30;

export const attendanceTabButtons = [
  { id: "tab-mark", control: "panel-mark", tab: "mark", label: "Mark" },
  { id: "tab-today", control: "panel-today", tab: "today", label: "Today" },
  {
    id: "tab-insights",
    control: "panel-insights",
    tab: "insights",
    label: "Insights",
  },
  {
    id: "tab-requests",
    control: "panel-requests",
    tab: "requests",
    label: "Leave requests",
  },
  {
    id: "tab-reports",
    control: "panel-reports",
    tab: "reports",
    label: "Reports",
  },
];

export const STATUSES = [
  { value: "present", label: "Present", short: "P", icon: CircleCheck },
  { value: "absent", label: "Absent", short: "A", icon: UserMinus },
  { value: "late", label: "Late", short: "L", icon: Clock3 },
  { value: "excused", label: "Excused", short: "E", icon: FileText },
];

/* Reasons are a categorical set: the hue order below is the one that
   passes adjacent-pair CVD separation, so keep it. */
export const ABSENCE_REASONS = [
  { key: "unexcused", label: "Unexcused", color: "var(--color-primary)" },
  { key: "family", label: "Family", color: "#1FAA59" },
  { key: "sick", label: "Sick", color: "#3B82F6" },
  { key: "activity", label: "School activity", color: "#F5A524" },
];

export const summaryCards = [
  {
    key: "presentToday",
    icon: CircleCheck,
    colorClass: "green",
    label: "Present today",
  },
  {
    key: "absentToday",
    icon: UserMinus,
    colorClass: "amber",
    label: "Absent today",
  },
  {
    key: "submitted",
    icon: CalendarCheck,
    colorClass: "purple",
    label: "Registers submitted",
  },
  {
    key: "atRisk",
    icon: TriangleAlert,
    colorClass: "blue",
    label: "Students at risk",
  },
];

const FIRST = [
  "Sokha", "Dara", "Sean", "Bopha", "Chanthou", "Vichea", "Sreyneang", "Rithy",
  "Kanha", "Pisey", "Makara", "Sopheak", "Eleanor", "Robert", "Guy", "Jenny",
  "Marvin", "Devon", "Kristin", "Cameron", "Bessie", "Jerome", "Arlene", "Dianne",
  "Nara", "Veasna", "Sothea", "Chenda", "Leakhena", "Phalla", "Ravy", "Sovann",
  "Theary", "Vanna", "Wesley", "Annette", "Floyd", "Courtney", "Ralph", "Hattie",
];
const LAST = [
  "Chan", "Sok", "Meas", "Keo", "Ly", "Pen", "Sam", "Nhem", "Yim", "Tep",
  "Pena", "Rose", "Hawkins", "Wilson", "McKinney", "Lane", "Watson", "Williamson",
  "Cooper", "Black", "Fisher", "Bell", "Nguyen", "Flores", "Miles", "Warren",
  "Howard", "Reed", "Cole", "Fox", "Webb", "Hunt", "Price", "Shaw", "Ross",
  "Gray", "Dean", "Ford", "Hart", "Lamb",
];

/* Deterministic 0..1 generator — same inputs, same value, every run. */
const rand = (seed) => {
  const x = Math.sin(seed * 12.9898) * 43758.5453;
  return x - Math.floor(x);
};

export const classes = [
  { id: "I2-GIC2A", name: "I2-GIC2A", teacher: "Priscilla Lily", size: 40 },
  { id: "I1-GIC1B", name: "I1-GIC1B", teacher: "Sarah Kim", size: 36 },
  { id: "I3-GIC3A", name: "I3-GIC3A", teacher: "Dr. Alan Turner", size: 34 },
  { id: "I1-GIC1A", name: "I1-GIC1A", teacher: "Marcus Reed", size: 38 },
  { id: "I2-GIC2B", name: "I2-GIC2B", teacher: "Helen Vong", size: 35 },
];

export const MARKING_CLASS = "I2-GIC2A";

/* The roster being marked. Each student carries a behaviour profile that
   drives their generated history — that's what makes patterns readable. */
export const students = Array.from({ length: 40 }, (_, i) => {
  const id = `STU-${String(101 + i).padStart(3, "0")}`;
  return {
    id,
    name: `${FIRST[i]} ${LAST[i]}`,
    roll: i + 1,
    classId: MARKING_CLASS,
    avatar: `https://i.pravatar.cc/64?img=${(i % 70) + 1}`,
    /* 0 = reliable, 1 = occasional, 2 = every Monday, 3 = struggling */
    profile: i === 3 ? 2 : i === 7 ? 3 : i === 12 ? 2 : i % 9 === 0 ? 1 : 0,
  };
});

const MS_DAY = 86400000;

/* Weekday dates for the last HISTORY_DAYS days, oldest first. */
export const historyDates = (() => {
  const out = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  for (let back = HISTORY_DAYS; back >= 1; back--) {
    const d = new Date(today.getTime() - back * MS_DAY);
    const day = d.getDay();
    if (day === 0 || day === 6) continue; // school runs Mon–Fri
    out.push(iso(d));
  }
  return out;
})();

export const todayIso = (() => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return iso(d);
})();

const reasonFor = (seed) => {
  const r = rand(seed + 7.1);
  if (r < 0.34) return "sick";
  if (r < 0.58) return "family";
  if (r < 0.74) return "activity";
  return "unexcused";
};

/* history[studentId][date] = { status, reason? } */
export const seedHistory = (() => {
  const history = {};

  students.forEach((student, index) => {
    const perStudent = {};

    historyDates.forEach((date, dayIndex) => {
      const weekday = parseDate(date).getDay();
      const seed = index * 131 + dayIndex * 17 + 3;
      const roll = rand(seed);

      let status = "present";
      if (student.profile === 2 && weekday === 1) {
        // The Monday pattern the heatmap is meant to expose.
        status = roll < 0.8 ? "absent" : "late";
      } else if (student.profile === 3) {
        status =
          roll < 0.26 ? "absent"
          : roll < 0.36 ? "late"
          : roll < 0.42 ? "excused"
          : "present";
      } else if (student.profile === 1) {
        status =
          roll < 0.1 ? "absent"
          : roll < 0.16 ? "late"
          : roll < 0.2 ? "excused"
          : "present";
      } else {
        status =
          roll < 0.035 ? "absent"
          : roll < 0.06 ? "late"
          : roll < 0.075 ? "excused"
          : "present";
      }

      perStudent[date] =
        status === "absent" ?
          { status, reason: reasonFor(seed) }
        : { status };
    });

    history[student.id] = perStudent;
  });

  return history;
})();

export const seedSubmissions = [
  {
    classId: "I2-GIC2A",
    submitted: false,
    at: null,
    by: "Priscilla Lily",
  },
  { classId: "I1-GIC1B", submitted: true, at: "08:12", by: "Sarah Kim" },
  {
    classId: "I3-GIC3A",
    submitted: true,
    at: "08:05",
    by: "Dr. Alan Turner",
  },
  { classId: "I1-GIC1A", submitted: false, at: null, by: "Marcus Reed" },
  { classId: "I2-GIC2B", submitted: true, at: "08:31", by: "Helen Vong" },
];

const shift = (days) => iso(new Date(Date.now() + days * MS_DAY));

export const seedLeaveRequests = [
  {
    id: "LR-3001",
    studentId: "STU-104",
    reason: "sick",
    note: "Dengue fever — hospital advised five days of rest.",
    from: shift(1),
    to: shift(5),
    attachment: "medical-certificate.pdf",
    submittedOn: shift(-1),
    status: "pending",
  },
  {
    id: "LR-3002",
    studentId: "STU-108",
    reason: "family",
    note: "Grandmother's funeral in Battambang.",
    from: shift(2),
    to: shift(3),
    attachment: null,
    submittedOn: shift(-1),
    status: "pending",
  },
  {
    id: "LR-3003",
    studentId: "STU-113",
    reason: "activity",
    note: "National mathematics olympiad, representing the school.",
    from: shift(4),
    to: shift(6),
    attachment: "olympiad-invitation.pdf",
    submittedOn: shift(-2),
    status: "pending",
  },
  {
    id: "LR-3004",
    studentId: "STU-119",
    reason: "sick",
    note: "Minor surgery, follow-up appointment the next morning.",
    from: shift(7),
    to: shift(8),
    attachment: "referral-letter.pdf",
    submittedOn: shift(-3),
    status: "pending",
  },
];

export const groupings = [
  { value: "class", label: "Group by class" },
  { value: "student", label: "Group by student" },
  { value: "day", label: "Group by day" },
];
