import { Bus, TriangleAlert, Users, Wallet } from "lucide-react";

/* ============================================================
   BUS / TRANSPORT SEED DATA — UI only, no backend.
   Occupancy, route duration and fee totals are all derived from the
   rosters below, so a card can never disagree with its own detail.
   ============================================================ */

export const EXPIRY_WARN_DAYS = 30;

export const busTabButtons = [
  { id: "tab-routes", control: "panel-routes", tab: "routes", label: "Routes" },
  { id: "tab-fleet", control: "panel-fleet", tab: "fleet", label: "Fleet" },
  {
    id: "tab-occupancy",
    control: "panel-occupancy",
    tab: "occupancy",
    label: "Occupancy",
  },
  { id: "tab-fees", control: "panel-fees", tab: "fees", label: "Fees" },
  {
    id: "tab-maintenance",
    control: "panel-maintenance",
    tab: "maintenance",
    label: "Maintenance",
  },
];

export const summaryCards = [
  { key: "routes", icon: Bus, colorClass: "purple", label: "Active routes" },
  { key: "riders", icon: Users, colorClass: "blue", label: "Students riding" },
  {
    key: "alerts",
    icon: TriangleAlert,
    colorClass: "amber",
    label: "Fleet alerts",
  },
  { key: "feesDue", icon: Wallet, colorClass: "green", label: "Fees due" },
];

/* Fee is a function of the zone, not the individual — one place to change. */
export const ZONES = [
  { id: "A", label: "Zone A · inner city", fee: 18 },
  { id: "B", label: "Zone B · suburban", fee: 26 },
  { id: "C", label: "Zone C · outer", fee: 34 },
];

export const SEVERITIES = [
  { value: "low", label: "Low", tone: "blue" },
  { value: "medium", label: "Medium", tone: "amber" },
  { value: "high", label: "High", tone: "red" },
];

const MS_DAY = 86400000;
const pad = (n) => String(n).padStart(2, "0");
const isoLocal = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const shift = (days) => isoLocal(new Date(Date.now() + days * MS_DAY));

const rand = (seed) => {
  const x = Math.sin(seed * 12.9898) * 43758.5453;
  return x - Math.floor(x);
};

export const staff = [
  { id: "ST-01", name: "Sok Piseth", role: "driver", license: "DL-882140", licenseExpiry: shift(240), phone: "+855 12 810 441" },
  { id: "ST-02", name: "Chan Vuthy", role: "driver", license: "DL-773915", licenseExpiry: shift(18), phone: "+855 12 810 442" },
  { id: "ST-03", name: "Meas Sopheak", role: "driver", license: "DL-661208", licenseExpiry: shift(-12), phone: "+855 12 810 443" },
  { id: "ST-04", name: "Keo Sreymom", role: "attendant", license: "AT-4410", licenseExpiry: shift(310), phone: "+855 12 810 451" },
  { id: "ST-05", name: "Ly Chanda", role: "attendant", license: "AT-4418", licenseExpiry: shift(120), phone: "+855 12 810 452" },
  { id: "ST-06", name: "Pen Dara", role: "driver", license: "DL-559043", licenseExpiry: shift(400), phone: "+855 12 810 444" },
];

/* One expired insurance, one inspection inside the 30-day window, and one
   bus with no crew — the three states the fleet panel has to surface. */
export const seedBuses = [
  {
    id: "BUS-01",
    number: "Bus 01",
    plate: "PP-1842",
    model: "Hyundai County 2019",
    capacity: 28,
    insuranceExpiry: shift(210),
    inspectionExpiry: shift(96),
    driverId: "ST-01",
    attendantId: "ST-04",
    odometer: 84210,
  },
  {
    id: "BUS-02",
    number: "Bus 02",
    plate: "PP-2207",
    model: "Toyota Coaster 2021",
    capacity: 24,
    insuranceExpiry: shift(22), // amber — inside the warning window
    inspectionExpiry: shift(150),
    driverId: "ST-02",
    attendantId: "ST-05",
    odometer: 61980,
  },
  {
    id: "BUS-03",
    number: "Bus 03",
    plate: "PP-3391",
    model: "Isuzu Journey 2017",
    capacity: 32,
    insuranceExpiry: shift(-9), // red — already expired
    inspectionExpiry: shift(41),
    driverId: "ST-03",
    attendantId: null,
    odometer: 132455,
  },
  {
    id: "BUS-04",
    number: "Bus 04",
    plate: "PP-4076",
    model: "Hyundai County 2022",
    capacity: 28,
    insuranceExpiry: shift(280),
    inspectionExpiry: shift(19), // amber
    driverId: null, // no crew assigned at all
    attendantId: null,
    odometer: 23870,
  },
];

const stop = (id, name, time) => ({ id, name, time });

export const seedRoutes = [
  {
    id: "RT-01",
    name: "North line",
    zone: "A",
    busId: "BUS-01",
    stops: [
      stop("S-101", "Tuek Thla roundabout", "06:20"),
      stop("S-102", "Sen Sok market", "06:34"),
      stop("S-103", "Boeung Kak corner", "06:48"),
      stop("S-104", "Toul Kork gate", "07:02"),
    ],
  },
  {
    id: "RT-02",
    name: "River line",
    zone: "B",
    busId: "BUS-02",
    stops: [
      stop("S-201", "Chroy Changvar bridge", "06:05"),
      stop("S-202", "Riverside park", "06:22"),
      stop("S-203", "Wat Phnom", "06:40"),
      stop("S-204", "Central market", "06:55"),
      stop("S-205", "Olympic stadium", "07:08"),
    ],
  },
  {
    id: "RT-03",
    name: "South line",
    zone: "C",
    busId: "BUS-03",
    stops: [
      stop("S-301", "Chbar Ampov ferry", "05:50"),
      stop("S-302", "Doeum Kor market", "06:15"),
      stop("S-303", "Hun Sen boulevard", "06:36"),
      stop("S-304", "Chak Angre school", "06:58"),
    ],
  },
];

const FIRST = [
  "Sokha", "Dara", "Bopha", "Chanthou", "Vichea", "Sreyneang", "Rithy", "Kanha",
  "Pisey", "Makara", "Sopheak", "Eleanor", "Robert", "Guy", "Jenny", "Marvin",
  "Devon", "Kristin", "Cameron", "Bessie", "Jerome", "Arlene", "Dianne", "Nara",
  "Veasna", "Sothea", "Chenda", "Leakhena", "Phalla", "Ravy", "Sovann", "Theary",
  "Vanna", "Wesley", "Annette", "Floyd", "Courtney", "Ralph", "Hattie", "Sean",
  "Kosal", "Sina", "Rotha", "Mealea", "Piseth", "Chetra", "Soklang", "Vandy",
];
const LAST = [
  "Chan", "Sok", "Meas", "Keo", "Ly", "Pen", "Sam", "Nhem", "Yim", "Tep",
  "Pena", "Rose", "Hawkins", "Wilson", "McKinney", "Lane", "Watson", "Cooper",
  "Black", "Fisher", "Bell", "Nguyen", "Flores", "Miles", "Warren", "Howard",
  "Reed", "Cole", "Fox", "Webb", "Hunt", "Price", "Shaw", "Ross", "Gray",
  "Dean", "Ford", "Hart", "Lamb", "Vong", "Chea", "Pich", "Kim", "Turner",
  "Mao", "Neang", "Phan", "Sre",
];
const CLASSES = ["10A", "10B", "11A", "11B", "12A"];

/* Riders are spread across the stops of each route. Bus 03 is deliberately
   oversubscribed so the occupancy board has an over-capacity case. */
const RIDERS_PER_ROUTE = { "RT-01": 26, "RT-02": 23, "RT-03": 35 };

export const seedStudents = (() => {
  const rows = [];
  let index = 0;

  seedRoutes.forEach((route) => {
    const total = RIDERS_PER_ROUTE[route.id];
    for (let i = 0; i < total; i++) {
      const stopIndex = i % route.stops.length;
      rows.push({
        id: `RD-${String(index + 1).padStart(3, "0")}`,
        name: `${FIRST[index % FIRST.length]} ${LAST[(index * 5) % LAST.length]}`,
        classId: CLASSES[index % CLASSES.length],
        routeId: route.id,
        stopId: route.stops[stopIndex].id,
        /* ~72% have paid this month. */
        feePaid: rand(index * 7.3 + 2) < 0.72,
      });
      index += 1;
    }
  });

  return rows;
})();

export const seedMaintenance = {
  "BUS-01": {
    nextServiceDue: shift(34),
    nextServiceOdometer: 90000,
    services: [
      { id: "SV-11", date: shift(-56), type: "Full service", odometer: 80120, note: "Brake pads and oil change." },
      { id: "SV-12", date: shift(-160), type: "Tyre replacement", odometer: 74300, note: "Front pair replaced." },
    ],
    incidents: [
      { id: "IN-11", date: shift(-24), severity: "low", description: "Wing mirror clipped in the school car park; no injuries." },
    ],
  },
  "BUS-02": {
    nextServiceDue: shift(8),
    nextServiceOdometer: 64000,
    services: [
      { id: "SV-21", date: shift(-90), type: "Full service", odometer: 57400, note: "Coolant flush, air filter." },
    ],
    incidents: [],
  },
  "BUS-03": {
    nextServiceDue: shift(-6), // overdue
    nextServiceOdometer: 130000,
    services: [
      { id: "SV-31", date: shift(-210), type: "Gearbox repair", odometer: 121500, note: "Clutch assembly replaced." },
      { id: "SV-32", date: shift(-340), type: "Full service", odometer: 112000, note: "Routine." },
    ],
    incidents: [
      { id: "IN-31", date: shift(-11), severity: "high", description: "Engine overheated on Hun Sen boulevard; route completed by relief bus." },
      { id: "IN-32", date: shift(-72), severity: "medium", description: "Rear door sensor failed intermittently." },
    ],
  },
  "BUS-04": {
    nextServiceDue: shift(120),
    nextServiceOdometer: 30000,
    services: [
      { id: "SV-41", date: shift(-30), type: "Pre-delivery check", odometer: 21000, note: "New vehicle handover." },
    ],
    incidents: [],
  },
};

export const emptyStopForm = { name: "", time: "" };
export const emptyIncidentForm = { date: "", severity: "low", description: "" };
