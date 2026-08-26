import gsap from "gsap";
export function shake(el) {
  if (!gsap) return;
  gsap.fromTo(
    el,
    { x: 0 },
    {
      x: 8,
      duration: 0.06,
      repeat: 5,
      yoyo: true,
      ease: "power1.inOut",
      onComplete: () => gsap.set(el, { x: 0 }),
    },
  );
}
