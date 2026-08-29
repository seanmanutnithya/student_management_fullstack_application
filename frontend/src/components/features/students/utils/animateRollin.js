import gsap from "gsap";
export function animateRowsIn() {
  if (!gsap) return;
  const rows = document.querySelectorAll("#studentsTbody tr, .student-card");
  gsap.fromTo(
    rows,
    { opacity: 0, y: 10 },
    { opacity: 1, y: 0, duration: 0.45, ease: "power2.out", stagger: 0.045 },
  );
}
