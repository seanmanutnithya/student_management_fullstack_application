import gsap from "gsap";
export function animateCounters() {
  document.querySelectorAll(".stat-card-value[data-count]").forEach((el) => {
    const target = Number(el.dataset.count);
    const prefix = el.dataset.prefix || "";
    const suffix = el.dataset.suffix || "";
    const counterObj = { val: 0 };

    gsap.killTweensOf(counterObj);
    gsap.to(counterObj, {
      val: target,
      duration: 1.2,
      ease: "power2.out",
      delay: 0.15,
      onUpdate: function () {
        const v = Math.round(this.targets()[0].val);
        el.textContent = prefix + v.toLocaleString() + suffix;
      },
    });
  });
}
