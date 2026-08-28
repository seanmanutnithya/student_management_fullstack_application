import gsap from "gsap";

export function navbarLoadAnimation() {
  if (!gsap) return;
  const tl = gsap.timeline({ defaults: { ease: "power1.out" } });
  tl.fromTo(
    ".sidebar-brand, .sidebar-nav .nav-item, .sidebar-nav .nav-group",
    { opacity: 0, x: -10 },
    { opacity: 1, x: 0, duration: 0.3, stagger: 0.03 },
  );
}
