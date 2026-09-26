import gsap from "gsap";

// Placeholder until the API serves a student's marks.
export const RESULTS = [
  {
    subject: "Mathematics",
    term: "Term 2",
    marks: "88 / 100",
    grade: "A",
    pct: 88,
  },
  {
    subject: "English",
    term: "Term 2",
    marks: "76 / 100",
    grade: "B+",
    pct: 76,
  },
  {
    subject: "Science",
    term: "Term 2",
    marks: "91 / 100",
    grade: "A+",
    pct: 91,
  },
  {
    subject: "History",
    term: "Term 2",
    marks: "69 / 100",
    grade: "B-",
    pct: 69,
  },
  {
    subject: "Computer Studies",
    term: "Term 2",
    marks: "95 / 100",
    grade: "A+",
    pct: 95,
  },
];

// Call inside useGSAP so the selector stays scoped to the panel.
// Widths are set inline, so `from` grows each fill up to its value.
export const animateResults = () => {
  gsap.from(".progress-bar-fill", {
    width: 0,
    duration: 0.7,
    stagger: 0.06,
    ease: "power2.out",
    delay: 0.15,
  });
};
