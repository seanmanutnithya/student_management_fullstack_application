import { Archive, LayoutGrid, TriangleAlert, Users } from "lucide-react";

/* ============================================================
   CLASS SEED DATA — UI only, no backend.
   Rosters are generated from a fixed seed, and every headcount is
   derived from its roster so a card can never disagree with the
   drawer behind it.
   ============================================================ */

export const ATTENDANCE_THRESHOLD = 90; // %
export const GRADE_THRESHOLD = 60; // %
export const CAPACITY_WARN = 0.9; // ring turns amber at 90% full

export const classTabButtons = [
  {
    id: "tab-sections",
    control: "panel-sections",
    tab: "sections",
    label: "Sections",
  },
  {
    id: "tab-compare",
    control: "panel-compare",
    tab: "compare",
    label: "Compare",
  },
  {
    id: "tab-archive",
    control: "panel-archive",
    tab: "archive",
    label: "Archive",
  },
];

export const summaryCards = [
  { key: "sections", icon: LayoutGrid, colorClass: "purple", label: "Sections" },
  { key: "students", icon: Users, colorClass: "blue", label: "Students" },
  {
    key: "nearCapacity",
    icon: TriangleAlert,
    colorClass: "amber",
    label: "At or over capacity",
  },
  { key: "archived", icon: Archive, colorClass: "green", label: "Archived" },
];

const FIRST = [
  "Sokha", "Dara", "Bopha", "Chanthou", "Vichea", "Sreyneang", "Rithy", "Kanha",
  "Pisey", "Makara", "Sopheak", "Eleanor", "Robert", "Guy", "Jenny", "Marvin",
  "Devon", "Kristin", "Cameron", "Bessie", "Jerome", "Arlene", "Dianne", "Nara",
  "Veasna", "Sothea", "Chenda", "Leakhena", "Phalla", "Ravy", "Sovann", "Theary",
  "Vanna", "Wesley", "Annette", "Floyd", "Courtney", "Ralph", "Hattie", "Sean",
];
const LAST = [
  "Chan", "Sok", "Meas", "Keo", "Ly", "Pen", "Sam", "Nhem", "Yim", "Tep",
  "Pena", "Rose", "Hawkins", "Wilson", "McKinney", "Lane", "Watson", "Cooper",
  "Black", "Fisher", "Bell", "Nguyen", "Flores", "Miles", "Warren", "Howard",
  "Reed", "Cole", "Fox", "Webb", "Hunt", "Price", "Shaw", "Ross", "Gray",
  "Dean", "Ford", "Hart", "Lamb", "Vong",
];

/* Deterministic 0..1 — same inputs, same value, every run. */
const rand = (seed) => {
  const x = Math.sin(seed * 12.9898) * 43758.5453;
  return x - Math.floor(x);
};

export const teachers = [
  { name: "Dr. Alan Turner", email: "alan.turner@iaacademy.edu", phone: "+855 12 400 118" },
  { name: "Sarah Kim", email: "sarah.kim@iaacademy.edu", phone: "+855 12 400 119" },
  { name: "Marcus Reed", email: "marcus.reed@iaacademy.edu", phone: "+855 12 400 120" },
  { name: "Helen Vong", email: "helen.vong@iaacademy.edu", phone: "+855 12 400 121" },
  { name: "Priscilla Lily", email: "priscilla.lily@iaacademy.edu", phone: "+855 12 400 122" },
  { name: "Sokun Chea", email: "sokun.chea@iaacademy.edu", phone: "+855 12 400 123" },
  { name: "Dara Pich", email: "dara.pich@iaacademy.edu", phone: "+855 12 400 124" },
];

export const subjects = [
  { code: "MTH-101", name: "Mathematics" },
  { code: "ENG-101", name: "English Language" },
  { code: "PHY-201", name: "Physics" },
  { code: "CHM-201", name: "Chemistry" },
  { code: "KHM-101", name: "Khmer Literature" },
  { code: "CSC-110", name: "Computer Science" },
];

/* Sarah Kim deliberately holds two homerooms — that is what the double
   homeroom badge on the teacher card is for. Sizes are spread so the grid
   shows all three ring states at once: 10C is over capacity, 10B nearly
   full, the rest have room. */
const classShells = [
  { id: "10A", grade: "Grade 10", room: "Room 204", capacity: 32, homeroom: "Sarah Kim", size: 26, quality: 0.86 },
  { id: "10B", grade: "Grade 10", room: "Room 205", capacity: 32, homeroom: "Sarah Kim", size: 31, quality: 0.7 },
  { id: "10C", grade: "Grade 10", room: "Room 206", capacity: 28, homeroom: "Marcus Reed", size: 30, quality: 0.78 },
  { id: "11A", grade: "Grade 11", room: "Lab 02", capacity: 30, homeroom: "Helen Vong", size: 24, quality: 0.83 },
  { id: "11B", grade: "Grade 11", room: "Room 112", capacity: 28, homeroom: "Sokun Chea", size: 22, quality: 0.74 },
  { id: "12A", grade: "Grade 12", room: "Room 301", capacity: 30, homeroom: "Dr. Alan Turner", size: 26, quality: 0.88 },
];

const makeStudents = (classId, size, quality, salt) =>
  Array.from({ length: size }, (_, i) => {
    const seed = salt * 97 + i * 31 + 5;
    const attendance =
      Math.round((78 + rand(seed) * 20 + (quality - 0.75) * 26) * 10) / 10;
    const grade =
      Math.round((48 + rand(seed + 3.3) * 44 + (quality - 0.75) * 30) * 10) / 10;
    return {
      id: `${classId}-${String(i + 1).padStart(2, "0")}`,
      name: `${FIRST[(salt * 7 + i) % FIRST.length]} ${LAST[(salt * 11 + i) % LAST.length]}`,
      roll: i + 1,
      avatar: `https://i.pravatar.cc/64?img=${((salt * 13 + i) % 70) + 1}`,
      attendance: Math.min(100, Math.max(52, attendance)),
      grade: Math.min(98, Math.max(31, grade)),
    };
  });

/* Every subject gets a teacher except two deliberate gaps, so the matrix
   has something to flag. */
const subjectTeachers = (classId, salt) =>
  subjects.map((subject, index) => {
    const unassigned =
      (classId === "10B" && subject.code === "CHM-201") ||
      (classId === "11B" && subject.code === "CSC-110");
    return {
      ...subject,
      teacher:
        unassigned ? null : (
          teachers[(salt * 3 + index) % teachers.length].name
        ),
    };
  });

export const seedClasses = classShells.map((shell, index) => ({
  id: shell.id,
  name: `${shell.grade} · ${shell.id}`,
  grade: shell.grade,
  room: shell.room,
  capacity: shell.capacity,
  homeroom: shell.homeroom,
  archived: false,
  year: "2026",
  students: makeStudents(shell.id, shell.size, shell.quality, index + 1),
  subjects: subjectTeachers(shell.id, index + 1),
}));

/* Archived sections keep their roster and results but are locked. */
export const seedArchived = [
  {
    id: "9A-2025",
    name: "Grade 9 · 9A",
    grade: "Grade 9",
    room: "Room 104",
    capacity: 30,
    homeroom: "Dara Pich",
    archived: true,
    year: "2025",
    archivedOn: "2025-07-18",
    students: makeStudents("9A-2025", 29, 0.8, 21),
    subjects: subjectTeachers("9A-2025", 21),
  },
  {
    id: "9B-2025",
    name: "Grade 9 · 9B",
    grade: "Grade 9",
    room: "Room 105",
    capacity: 30,
    homeroom: "Sokun Chea",
    archived: true,
    year: "2025",
    archivedOn: "2025-07-18",
    students: makeStudents("9B-2025", 27, 0.72, 22),
    subjects: subjectTeachers("9B-2025", 22),
  },
];

export const promotionSteps = [
  { key: "select", label: "Select class" },
  { key: "review", label: "Review students" },
  { key: "confirm", label: "Confirm" },
];
