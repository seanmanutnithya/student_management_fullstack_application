import gsap from "gsap";
export function pageLoadAnimation(onComplete) {
  if (!gsap) return;
  const tl = gsap.timeline({ defaults: { ease: "power1.out" }, onComplete });
  tl.fromTo(
    ".sidebar-brand, .sidebar-nav .nav-item, .sidebar-nav .nav-group",
    { opacity: 0, x: -10 },
    { opacity: 1, x: 0, duration: 0.3, stagger: 0.03 },
  )
    .fromTo(
      ".topbar, .mobile-topbar",
      { opacity: 0, y: -8 },
      { opacity: 1, y: 0, duration: 0.3 },
      "-=0.2",
    )
    .fromTo(
      ".greeting-bar",
      { opacity: 0, y: 14 },
      { opacity: 1, y: 0, duration: 0.4 },
      "-=0.1",
    )
    .fromTo(
      ".stat-card",
      { opacity: 0, y: 14 },
      { opacity: 1, y: 0, duration: 0.35, stagger: 0.06 },
      "-=0.2",
    )
    .fromTo(
      ".chart-card",
      { opacity: 0, y: 16 },
      { opacity: 1, y: 0, duration: 0.4, stagger: 0.08 },
      "-=0.15",
    )
    .fromTo(
      ".quicklist-card",
      { opacity: 0, y: 16 },
      { opacity: 1, y: 0, duration: 0.35, stagger: 0.06 },
      "-=0.2",
    )
    .fromTo(
      ".activity-card, .events-card",
      { opacity: 0, y: 16 },
      { opacity: 1, y: 0, duration: 0.4, stagger: 0.08 },
      "-=0.5",
    );
}
