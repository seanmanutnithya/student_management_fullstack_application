import gsap from "gsap";
import { useGSAP } from "@gsap/react";

import { wireHoverScale } from "./hover";

const EASE_OUT = "power3.out";

export function animateSummaryCounters() {
  document.querySelectorAll(".summary-value[data-count]").forEach((el) => {
    const target = Number(el.dataset.count);
    const counter = { val: 0 };

    gsap.killTweensOf(counter);
    gsap.to(counter, {
      val: target,
      duration: 1,
      ease: "power2.out",
      delay: 0.15,
      onUpdate: function () {
        el.textContent = Math.round(this.targets()[0].val).toLocaleString();
      },
    });
  });
}

export function animateTeacherRowsIn() {
  const rows = document.querySelectorAll("#teachersTbody tr, .teacher-card");
  if (!rows.length) return;
  gsap.fromTo(
    rows,
    { opacity: 0, y: 10 },
    { opacity: 1, y: 0, duration: 0.45, ease: EASE_OUT, stagger: 0.045 },
  );
}

// The mobile topbar sits outside the page wrapper, so this runs unscoped —
// useGSAP still reverts everything it creates on unmount.
export function useTeachersPageAnimation() {
  useGSAP(() => {
    const tl = gsap.timeline({ defaults: { ease: EASE_OUT } });

    // The sidebar is part of the shell, not the page — it stays put across
    // navigation instead of re-playing an intro on every visit.
    tl.fromTo(
      ".topbar, .mobile-topbar",
      { opacity: 0, y: -8 },
      { opacity: 1, y: 0, duration: 0.3 },
    )
      .fromTo(
        ".page-head",
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.35 },
        "-=0.1",
      )
      .fromTo(
        ".summary-card",
        { opacity: 0, y: 14 },
        {
          opacity: 1,
          y: 0,
          duration: 0.35,
          stagger: 0.06,
          onComplete: () => wireHoverScale(".summary-card", 1.015),
        },
        "-=0.2",
      )
      .fromTo(
        ".card",
        { opacity: 0, y: 16 },
        {
          opacity: 1,
          y: 0,
          duration: 0.4,
          onComplete: () => {
            wireHoverScale(".btn", 1.035);
            wireHoverScale(".icon-btn", 1.08);
            wireHoverScale(".row-action-btn", 1.12);
            wireHoverScale(".page-btn", 1.08);
            animateTeacherRowsIn();
          },
        },
        "-=0.15",
      );
  }, []);
}
