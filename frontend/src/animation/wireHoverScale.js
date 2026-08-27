import gsap from "gsap";

export function wireHoverScale(selector, scale = 1.03) {
  document.querySelectorAll(selector).forEach((el) => {
    el.addEventListener(
      "mouseenter",
      () => gsap && gsap.to(el, { scale, duration: 0.18, ease: "power1.out" }),
    );
    el.addEventListener(
      "mouseleave",
      () =>
        gsap && gsap.to(el, { scale: 1, duration: 0.18, ease: "power1.in" }),
    );
  });
}
