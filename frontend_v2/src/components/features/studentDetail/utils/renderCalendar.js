import gsap from "gsap";

export const DAYS_IN_MONTH = 30;
export const START_OFFSET = 3; // month starts on a Thursday, for visual variety

// Placeholder until the API serves per-student attendance.
export const ATTENDANCE_MONTHS = [
  { label: "Mar", pct: 88 },
  { label: "Apr", pct: 94 },
  { label: "May", pct: 79 },
  { label: "Jun", pct: 97 },
  { label: "Jul", pct: 91 },
  { label: "Aug", pct: 96 },
];

/* Seeded from the student id rather than Math.random(), so a student's month
   looks the same every time the tab is opened, and differs between students. */
const seededRandom = (seed) => {
  let h = 2166136261;
  for (const ch of String(seed)) h = Math.imul(h ^ ch.charCodeAt(0), 16777619);
  return () => {
    h = Math.imul(h ^ (h >>> 15), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    return ((h ^= h >>> 16) >>> 0) / 4294967296;
  };
};

export const buildMonth = (seed) => {
  const random = seededRandom(seed);
  return Array.from({ length: DAYS_IN_MONTH }, () => {
    const r = random();
    return (
      r > 0.9 ? "absent"
      : r > 0.8 ? "late"
      : "present"
    );
  });
};

// Call inside useGSAP so the selectors stay scoped to the panel.
export const animateAttendance = () => {
  gsap.fromTo(
    ".calendar-cell:not(.is-empty)",
    { opacity: 0, scale: 0.7 },
    {
      opacity: 1,
      scale: 1,
      duration: 0.35,
      stagger: 0.012,
      ease: "back.out(2)",
      delay: 0.2,
    },
  );
  // Heights are set inline, so `from` grows each bar up to its value.
  gsap.from(".attendance-bar", {
    height: 0,
    duration: 0.8,
    stagger: 0.08,
    ease: "power2.out",
    delay: 0.2,
  });
};
