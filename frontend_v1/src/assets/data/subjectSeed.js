import { BookMarked, GraduationCap, Layers, Users } from "lucide-react";

/* ============================================================
   SUBJECT SEED DATA — UI only, no backend.
   ============================================================ */

export const PERIOD_MINUTES = 50;
export const PASS_TARGET = 75; // % pass rate a class is expected to clear

export const detailTabButtons = [
  {
    id: "tab-overview",
    control: "panel-overview",
    tab: "overview",
    label: "Overview",
  },
  {
    id: "tab-grading",
    control: "panel-grading",
    tab: "grading",
    label: "Grading",
  },
  {
    id: "tab-prereq",
    control: "panel-prereq",
    tab: "prereq",
    label: "Prerequisites",
  },
  {
    id: "tab-difficulty",
    control: "panel-difficulty",
    tab: "difficulty",
    label: "Difficulty",
  },
  {
    id: "tab-syllabus",
    control: "panel-syllabus",
    tab: "syllabus",
    label: "Syllabus",
  },
];

export const summaryCards = [
  { key: "total", icon: BookMarked, colorClass: "purple", label: "Subjects" },
  { key: "core", icon: GraduationCap, colorClass: "blue", label: "Core" },
  { key: "elective", icon: Layers, colorClass: "green", label: "Electives" },
  {
    key: "uncovered",
    icon: Users,
    colorClass: "amber",
    label: "No substitute",
  },
];

export const classes = [
  { id: "I1-GIC1A", grade: "Grade 10" },
  { id: "I1-GIC1B", grade: "Grade 10" },
  { id: "I2-GIC2A", grade: "Grade 11" },
  { id: "I2-GIC2B", grade: "Grade 11" },
  { id: "I3-GIC3A", grade: "Grade 12" },
];

export const teachers = [
  "Dr. Alan Turner",
  "Sarah Kim",
  "Marcus Reed",
  "Helen Vong",
  "Priscilla Lily",
  "Sokun Chea",
  "Dara Pich",
];

export const departments = [
  "Science",
  "Mathematics",
  "Languages",
  "Humanities",
  "Arts",
  "Technology",
];

/* grading weights must total 100 before a scheme can be saved */
const scheme = (assignment, midterm, final) => ({ assignment, midterm, final });

export const seedSubjects = [
  {
    id: "SUB-01",
    code: "MTH-101",
    name: "Mathematics I",
    type: "core",
    department: "Mathematics",
    credits: 4,
    primaryTeacher: "Dr. Alan Turner",
    substitutes: ["Marcus Reed"],
    prerequisites: [],
    grading: scheme(30, 30, 40),
    mapping: [
      { classId: "I1-GIC1A", periodsPerWeek: 5 },
      { classId: "I1-GIC1B", periodsPerWeek: 5 },
    ],
    passRates: { "I1-GIC1A": 82, "I1-GIC1B": 68 },
    syllabus: [
      {
        version: "v3.1",
        uploadedOn: "2026-08-12",
        uploader: "Dr. Alan Turner",
        file: "mth-101-syllabus-v3.1.pdf",
        note: "Added a probability unit to term 2.",
      },
      {
        version: "v3.0",
        uploadedOn: "2026-02-03",
        uploader: "Dr. Alan Turner",
        file: "mth-101-syllabus-v3.0.pdf",
        note: "Annual review — reordered algebra chapters.",
      },
      {
        version: "v2.4",
        uploadedOn: "2025-08-19",
        uploader: "Marcus Reed",
        file: "mth-101-syllabus-v2.4.pdf",
        note: "Aligned assessment weights with the board framework.",
      },
    ],
  },
  {
    id: "SUB-02",
    code: "MTH-201",
    name: "Mathematics II",
    type: "core",
    department: "Mathematics",
    credits: 4,
    primaryTeacher: "Dr. Alan Turner",
    substitutes: [],
    prerequisites: ["SUB-01"],
    grading: scheme(25, 35, 40),
    mapping: [
      { classId: "I2-GIC2A", periodsPerWeek: 5 },
      { classId: "I2-GIC2B", periodsPerWeek: 4 },
    ],
    passRates: { "I2-GIC2A": 74, "I2-GIC2B": 61 },
    syllabus: [
      {
        version: "v2.0",
        uploadedOn: "2026-08-14",
        uploader: "Dr. Alan Turner",
        file: "mth-201-syllabus-v2.0.pdf",
        note: "Calculus introduced a term earlier.",
      },
      {
        version: "v1.6",
        uploadedOn: "2026-01-22",
        uploader: "Sarah Kim",
        file: "mth-201-syllabus-v1.6.pdf",
        note: "Clarified the coursework brief.",
      },
    ],
  },
  {
    id: "SUB-03",
    code: "MTH-301",
    name: "Mathematics III",
    type: "core",
    department: "Mathematics",
    credits: 5,
    primaryTeacher: "Marcus Reed",
    substitutes: ["Dr. Alan Turner"],
    prerequisites: ["SUB-02"],
    grading: scheme(20, 30, 50),
    mapping: [{ classId: "I3-GIC3A", periodsPerWeek: 6 }],
    passRates: { "I3-GIC3A": 58 },
    syllabus: [
      {
        version: "v1.2",
        uploadedOn: "2026-08-20",
        uploader: "Marcus Reed",
        file: "mth-301-syllabus-v1.2.pdf",
        note: "Exam board update for linear algebra.",
      },
    ],
  },
  {
    id: "SUB-04",
    code: "ENG-101",
    name: "English Language",
    type: "core",
    department: "Languages",
    credits: 3,
    primaryTeacher: "Sarah Kim",
    substitutes: ["Helen Vong", "Priscilla Lily"],
    prerequisites: [],
    grading: scheme(40, 25, 35),
    mapping: [
      { classId: "I1-GIC1A", periodsPerWeek: 4 },
      { classId: "I1-GIC1B", periodsPerWeek: 4 },
      { classId: "I2-GIC2A", periodsPerWeek: 3 },
      { classId: "I2-GIC2B", periodsPerWeek: 3 },
    ],
    passRates: {
      "I1-GIC1A": 91,
      "I1-GIC1B": 88,
      "I2-GIC2A": 85,
      "I2-GIC2B": 79,
    },
    syllabus: [
      {
        version: "v4.0",
        uploadedOn: "2026-07-30",
        uploader: "Sarah Kim",
        file: "eng-101-syllabus-v4.0.pdf",
        note: "New speaking assessment rubric.",
      },
      {
        version: "v3.2",
        uploadedOn: "2026-01-15",
        uploader: "Helen Vong",
        file: "eng-101-syllabus-v3.2.pdf",
        note: "Reading list refresh.",
      },
    ],
  },
  {
    id: "SUB-05",
    code: "PHY-201",
    name: "Physics",
    type: "core",
    department: "Science",
    credits: 4,
    primaryTeacher: "Helen Vong",
    substitutes: [],
    prerequisites: ["SUB-01"],
    grading: scheme(30, 30, 40),
    mapping: [
      { classId: "I2-GIC2A", periodsPerWeek: 4 },
      { classId: "I3-GIC3A", periodsPerWeek: 5 },
    ],
    passRates: { "I2-GIC2A": 71, "I3-GIC3A": 66 },
    syllabus: [
      {
        version: "v2.1",
        uploadedOn: "2026-08-02",
        uploader: "Helen Vong",
        file: "phy-201-syllabus-v2.1.pdf",
        note: "Practical hours increased to six per term.",
      },
    ],
  },
  {
    id: "SUB-06",
    code: "CHM-201",
    name: "Chemistry",
    type: "core",
    department: "Science",
    credits: 4,
    primaryTeacher: "Sokun Chea",
    substitutes: ["Helen Vong"],
    prerequisites: [],
    grading: scheme(35, 25, 40),
    mapping: [
      { classId: "I2-GIC2B", periodsPerWeek: 4 },
      { classId: "I3-GIC3A", periodsPerWeek: 4 },
    ],
    passRates: { "I2-GIC2B": 77, "I3-GIC3A": 73 },
    syllabus: [
      {
        version: "v1.8",
        uploadedOn: "2026-06-11",
        uploader: "Sokun Chea",
        file: "chm-201-syllabus-v1.8.pdf",
        note: "Lab safety module added.",
      },
    ],
  },
  {
    id: "SUB-07",
    code: "KHM-101",
    name: "Khmer Literature",
    type: "core",
    department: "Languages",
    credits: 3,
    primaryTeacher: "Dara Pich",
    substitutes: ["Sokun Chea"],
    prerequisites: [],
    grading: scheme(40, 30, 30),
    mapping: [
      { classId: "I1-GIC1A", periodsPerWeek: 3 },
      { classId: "I2-GIC2A", periodsPerWeek: 3 },
      { classId: "I3-GIC3A", periodsPerWeek: 2 },
    ],
    passRates: { "I1-GIC1A": 93, "I2-GIC2A": 90, "I3-GIC3A": 87 },
    syllabus: [
      {
        version: "v2.3",
        uploadedOn: "2026-05-09",
        uploader: "Dara Pich",
        file: "khm-101-syllabus-v2.3.pdf",
        note: "Two modern poets added to the set texts.",
      },
    ],
  },
  {
    id: "SUB-08",
    code: "CSC-110",
    name: "Computer Science",
    type: "elective",
    department: "Technology",
    credits: 3,
    primaryTeacher: "Priscilla Lily",
    substitutes: ["Marcus Reed"],
    prerequisites: ["SUB-01"],
    grading: scheme(50, 20, 30),
    mapping: [
      { classId: "I2-GIC2A", periodsPerWeek: 3 },
      { classId: "I3-GIC3A", periodsPerWeek: 3 },
    ],
    passRates: { "I2-GIC2A": 88, "I3-GIC3A": 84 },
    syllabus: [
      {
        version: "v5.0",
        uploadedOn: "2026-08-25",
        uploader: "Priscilla Lily",
        file: "csc-110-syllabus-v5.0.pdf",
        note: "Switched the project unit to React.",
      },
      {
        version: "v4.2",
        uploadedOn: "2026-03-04",
        uploader: "Priscilla Lily",
        file: "csc-110-syllabus-v4.2.pdf",
        note: "Version control basics added.",
      },
    ],
  },
  {
    id: "SUB-09",
    code: "ROB-210",
    name: "Robotics",
    type: "elective",
    department: "Technology",
    credits: 2,
    primaryTeacher: "Marcus Reed",
    substitutes: [],
    /* Deliberately circular with SUB-10 — the visualiser is meant to
       surface exactly this kind of data problem. */
    prerequisites: ["SUB-10"],
    grading: scheme(60, 10, 30),
    mapping: [{ classId: "I2-GIC2B", periodsPerWeek: 2 }],
    passRates: { "I2-GIC2B": 81 },
    syllabus: [
      {
        version: "v1.0",
        uploadedOn: "2026-04-18",
        uploader: "Marcus Reed",
        file: "rob-210-syllabus-v1.0.pdf",
        note: "First issue.",
      },
    ],
  },
  {
    id: "SUB-10",
    code: "ROB-310",
    name: "Advanced Robotics",
    type: "elective",
    department: "Technology",
    credits: 3,
    primaryTeacher: "Marcus Reed",
    substitutes: [],
    prerequisites: ["SUB-09"],
    grading: scheme(55, 15, 30),
    mapping: [{ classId: "I3-GIC3A", periodsPerWeek: 2 }],
    passRates: { "I3-GIC3A": 76 },
    syllabus: [
      {
        version: "v1.1",
        uploadedOn: "2026-04-20",
        uploader: "Marcus Reed",
        file: "rob-310-syllabus-v1.1.pdf",
        note: "Sensor fusion unit expanded.",
      },
    ],
  },
  {
    id: "SUB-11",
    code: "ART-120",
    name: "Art & Design",
    type: "elective",
    department: "Arts",
    credits: 2,
    primaryTeacher: "Dara Pich",
    substitutes: [],
    prerequisites: [],
    grading: scheme(70, 0, 30),
    mapping: [
      { classId: "I1-GIC1A", periodsPerWeek: 2 },
      { classId: "I1-GIC1B", periodsPerWeek: 2 },
    ],
    passRates: { "I1-GIC1A": 95, "I1-GIC1B": 92 },
    syllabus: [
      {
        version: "v2.0",
        uploadedOn: "2026-02-27",
        uploader: "Dara Pich",
        file: "art-120-syllabus-v2.0.pdf",
        note: "Portfolio requirements clarified.",
      },
    ],
  },
  {
    id: "SUB-12",
    code: "HIS-210",
    name: "World History",
    type: "elective",
    department: "Humanities",
    credits: 3,
    primaryTeacher: "Sokun Chea",
    substitutes: ["Dara Pich"],
    /* Points at a subject that is not in this term's catalogue — the
       visualiser flags it as a broken link rather than hiding it. */
    prerequisites: ["SUB-99"],
    grading: scheme(35, 30, 35),
    mapping: [{ classId: "I2-GIC2B", periodsPerWeek: 3 }],
    passRates: { "I2-GIC2B": 69 },
    syllabus: [
      {
        version: "v1.4",
        uploadedOn: "2026-01-31",
        uploader: "Sokun Chea",
        file: "his-210-syllabus-v1.4.pdf",
        note: "Source-analysis unit rewritten.",
      },
    ],
  },
];
