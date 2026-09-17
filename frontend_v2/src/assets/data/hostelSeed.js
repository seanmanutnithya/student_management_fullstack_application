import { BedDouble, DoorOpen, TriangleAlert, Users } from "lucide-react";

/* ============================================================
   HOSTEL SEED DATA — UI only, no backend.
   Room occupancy is never stored: it is counted from where the
   residents actually are, so a tile can't disagree with its beds.
   ============================================================ */

export const hostelTabButtons = [
  { id: "tab-rooms", control: "panel-rooms", tab: "rooms", label: "Rooms" },
  {
    id: "tab-occupancy",
    control: "panel-occupancy",
    tab: "occupancy",
    label: "Occupancy",
  },
  {
    id: "tab-residents",
    control: "panel-residents",
    tab: "residents",
    label: "Residents",
  },
  { id: "tab-wardens", control: "panel-wardens", tab: "wardens", label: "Wardens" },
  { id: "tab-gate", control: "panel-gate", tab: "gate", label: "Gate log" },
  { id: "tab-leave", control: "panel-leave", tab: "leave", label: "Leave" },
  {
    id: "tab-tickets",
    control: "panel-tickets",
    tab: "tickets",
    label: "Maintenance",
  },
];

export const summaryCards = [
  { key: "beds", icon: BedDouble, colorClass: "purple", label: "Total beds" },
  { key: "occupied", icon: Users, colorClass: "blue", label: "Occupied" },
  { key: "out", icon: DoorOpen, colorClass: "green", label: "Currently out" },
  {
    key: "issues",
    icon: TriangleAlert,
    colorClass: "amber",
    label: "Open tickets",
  },
];

/* Each block carries its own admission rule — the allocation check reads
   these rather than hard-coding conditions. */
export const blocks = [
  {
    id: "A",
    name: "Block A · Rosewood",
    gender: "female",
    minGrade: 10,
    floors: [1, 2],
    rule: "Female residents, Grade 10 and above.",
  },
  {
    id: "B",
    name: "Block B · Ironwood",
    gender: "male",
    minGrade: 10,
    floors: [1, 2],
    rule: "Male residents, Grade 10 and above.",
  },
  {
    id: "C",
    name: "Block C · Senior wing",
    gender: "any",
    minGrade: 12,
    floors: [1],
    rule: "Grade 12 only, any gender.",
  },
];

export const TICKET_CATEGORIES = [
  { value: "plumbing", label: "Plumbing" },
  { value: "electrical", label: "Electrical" },
  { value: "furniture", label: "Furniture" },
  { value: "cleaning", label: "Cleaning" },
  { value: "internet", label: "Internet" },
];

export const TICKET_PRIORITIES = [
  { value: "low", label: "Low", tone: "blue" },
  { value: "medium", label: "Medium", tone: "amber" },
  { value: "high", label: "High", tone: "red" },
];

export const TICKET_STATUSES = [
  { value: "open", label: "Open", tone: "red" },
  { value: "progress", label: "In progress", tone: "amber" },
  { value: "resolved", label: "Resolved", tone: "green" },
];

export const MAINTENANCE_STAFF = [
  "Chan Sopheap",
  "Kim Vuthy",
  "Ros Chanthy",
  "Unassigned",
];

const MS_DAY = 86400000;
const pad = (n) => String(n).padStart(2, "0");
const isoLocal = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const shiftDate = (days) => isoLocal(new Date(Date.now() + days * MS_DAY));
const stampAt = (days, hour, minute = 0) => {
  const d = new Date(Date.now() + days * MS_DAY);
  d.setHours(hour, minute, 0, 0);
  return d.toISOString();
};

/* 4 rooms per floor, 4 beds each. Block C is a small senior wing. */
export const rooms = blocks.flatMap((block) =>
  block.floors.flatMap((floor) =>
    Array.from({ length: block.id === "C" ? 3 : 4 }, (_, i) => ({
      id: `${block.id}-${floor}0${i + 1}`,
      blockId: block.id,
      floor,
      number: `${floor}0${i + 1}`,
      beds: block.id === "C" ? 2 : 4,
    })),
  ),
);

const FIRST_F = [
  "Bopha", "Sreyneang", "Kanha", "Pisey", "Chenda", "Leakhena", "Phalla",
  "Theary", "Sina", "Mealea", "Sokha", "Ravy", "Dara", "Chanthou", "Nary",
  "Sophea", "Meng", "Reaksmey",
];
const FIRST_M = [
  "Vichea", "Rithy", "Makara", "Sopheak", "Veasna", "Sovann", "Vanna", "Kosal",
  "Rotha", "Piseth", "Chetra", "Vandy", "Sambath", "Borey", "Rithya", "Panha",
];
const LAST = [
  "Chan", "Sok", "Meas", "Keo", "Ly", "Pen", "Sam", "Nhem", "Yim", "Tep",
  "Vong", "Chea", "Pich", "Mao", "Neang", "Phan", "Sre", "Hout",
];

const GRADES = [10, 11, 12];

/* Residents are dealt into rooms that satisfy their block's rule, leaving
   one room full, one empty and the rest partial so every tile state shows. */
export const seedResidents = (() => {
  const list = [];
  let index = 0;

  const push = (gender, grade, roomId) => {
    const pool = gender === "female" ? FIRST_F : FIRST_M;
    list.push({
      id: `HR-${String(index + 1).padStart(3, "0")}`,
      name: `${pool[index % pool.length]} ${LAST[(index * 5) % LAST.length]}`,
      gender,
      grade,
      classId: `${grade}${["A", "B"][index % 2]}`,
      guardianName: `${LAST[(index * 3) % LAST.length]} ${pool[(index + 4) % pool.length]}`,
      guardianPhone: `+855 12 ${300 + index} ${100 + (index % 90)}`,
      avatar: `https://i.pravatar.cc/64?img=${(index % 70) + 1}`,
      roomId,
      joinedOn: shiftDate(-90 + (index % 60)),
    });
    index += 1;
  };

  const fill = (roomId, count, gender, gradePick) => {
    for (let i = 0; i < count; i++) push(gender, gradePick(i), roomId);
  };

  // Block A — female, grade 10+
  fill("A-101", 4, "female", () => 10); // full
  fill("A-102", 2, "female", (i) => GRADES[i % 2]);
  fill("A-103", 3, "female", () => 11);
  // A-104 deliberately left empty
  fill("A-201", 2, "female", () => 12);
  fill("A-202", 3, "female", () => 10);
  fill("A-203", 1, "female", () => 11);

  // Block B — male, grade 10+
  fill("B-101", 4, "male", () => 11); // full
  fill("B-102", 3, "male", () => 10);
  fill("B-103", 2, "male", () => 12);
  fill("B-201", 3, "male", () => 10);
  fill("B-202", 2, "male", () => 11);

  // Block C — grade 12 only, mixed
  fill("C-101", 2, "female", () => 12); // full (2 beds)
  fill("C-102", 1, "male", () => 12);

  return list;
})();

export const wardens = [
  { id: "W-01", name: "Srey Mom", blockId: "A", shift: "day", start: "06:00", end: "18:00", phone: "+855 12 700 101" },
  { id: "W-02", name: "Chea Kunthea", blockId: "A", shift: "night", start: "18:00", end: "06:00", phone: "+855 12 700 102" },
  { id: "W-03", name: "Pich Samnang", blockId: "B", shift: "day", start: "06:00", end: "18:00", phone: "+855 12 700 103" },
  /* Neither Block B nor Block C has anyone overnight — the roster grid is
     meant to make those two empty cells obvious. */
  { id: "W-04", name: "Hout Vibol", blockId: "C", shift: "day", start: "06:00", end: "18:00", phone: "+855 12 700 104" },
];

export const SHIFTS = [
  { value: "day", label: "Day", window: "06:00 – 18:00" },
  { value: "night", label: "Night", window: "18:00 – 06:00" },
];

/* The most recent entry per resident decides whether they are in or out. */
export const seedGateLog = (() => {
  const entries = [];
  const pick = (i) => seedResidents[i % seedResidents.length];

  // Returned earlier today
  [0, 3, 7, 11].forEach((i, n) => {
    entries.push({ id: `G-${100 + n * 2}`, residentId: pick(i).id, type: "out", at: stampAt(0, 7, 20), reason: "Class" });
    entries.push({ id: `G-${101 + n * 2}`, residentId: pick(i).id, type: "in", at: stampAt(0, 16, 45), reason: "Returned" });
  });

  // Still out — no matching check-in
  [5, 9, 14].forEach((i, n) => {
    entries.push({
      id: `G-${200 + n}`,
      residentId: pick(i).id,
      type: "out",
      at: stampAt(0, 8 + n, 15),
      reason: ["Medical appointment", "Family visit", "Sports fixture"][n],
    });
  });

  // Yesterday, closed out
  [2, 6].forEach((i, n) => {
    entries.push({ id: `G-${300 + n * 2}`, residentId: pick(i).id, type: "out", at: stampAt(-1, 9, 0), reason: "Errand" });
    entries.push({ id: `G-${301 + n * 2}`, residentId: pick(i).id, type: "in", at: stampAt(-1, 17, 30), reason: "Returned" });
  });

  return entries.sort((a, b) => new Date(b.at) - new Date(a.at));
})();

export const seedLeave = [
  {
    id: "LV-01",
    residentId: seedResidents[1].id,
    from: shiftDate(2),
    to: shiftDate(4),
    destination: "Family home, Battambang",
    guardianApproved: true,
    status: "pending",
    requestedOn: shiftDate(-1),
  },
  {
    id: "LV-02",
    residentId: seedResidents[8].id,
    from: shiftDate(1),
    to: shiftDate(2),
    destination: "Cousin's wedding, Siem Reap",
    guardianApproved: false,
    status: "pending",
    requestedOn: shiftDate(-2),
  },
  {
    id: "LV-03",
    residentId: seedResidents[16].id,
    from: shiftDate(5),
    to: shiftDate(8),
    destination: "Medical treatment, Phnom Penh",
    guardianApproved: true,
    status: "pending",
    requestedOn: shiftDate(-3),
  },
];

export const seedTickets = [
  {
    id: "TK-01",
    roomId: "A-102",
    category: "plumbing",
    priority: "high",
    status: "open",
    assignee: "Unassigned",
    openedOn: shiftDate(-9),
    description: "Shower drain blocked; water pooling in the bathroom.",
  },
  {
    id: "TK-02",
    roomId: "B-201",
    category: "electrical",
    priority: "medium",
    status: "progress",
    assignee: "Kim Vuthy",
    openedOn: shiftDate(-4),
    description: "Two ceiling lights flickering after 21:00.",
  },
  {
    id: "TK-03",
    roomId: "A-201",
    category: "furniture",
    priority: "low",
    status: "open",
    assignee: "Ros Chanthy",
    openedOn: shiftDate(-2),
    description: "Bed frame joint loose on the upper bunk.",
  },
  {
    id: "TK-04",
    roomId: "C-101",
    category: "internet",
    priority: "medium",
    status: "resolved",
    assignee: "Chan Sopheap",
    openedOn: shiftDate(-16),
    description: "Wi-Fi drops out in the far corner of the wing.",
  },
];

export const emptyTicket = {
  roomId: "",
  category: "plumbing",
  priority: "medium",
  assignee: "Unassigned",
  description: "",
};
