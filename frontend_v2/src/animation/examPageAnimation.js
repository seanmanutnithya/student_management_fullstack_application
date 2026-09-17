import gsap from "gsap";
import { useGSAP } from "@gsap/react";

import { wireHoverScale } from "./hover";

const EASE_OUT = "power3.out";

// The mobile topbar sits outside the page wrapper, so this runs unscoped —
// useGSAP still reverts everything it creates on unmount. The sidebar is
// part of the shell and is deliberately left alone.
export function useExamPageAnimation() {
  useGSAP(() => {
    const tl = gsap.timeline({ defaults: { ease: EASE_OUT } });

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
        ".exam-card",
        { opacity: 0, y: 16 },
        {
          opacity: 1,
          y: 0,
          duration: 0.4,
          onComplete: () => {
            wireHoverScale(".btn", 1.035);
            wireHoverScale(".icon-btn", 1.08);
            wireHoverScale(".row-action-btn", 1.12);
          },
        },
        "-=0.15",
      );
  }, []);
}

/* Crossfades whichever panel just became active. Panels stay mounted so a
   part-filled mark sheet survives a tab switch. */
export function useTabCrossfade(activeTab) {
  useGSAP(() => {
    const panel = document.querySelector(".exam-panel.is-active");
    if (!panel) return;
    gsap.fromTo(
      panel,
      { opacity: 0, y: 10 },
      { opacity: 1, y: 0, duration: 0.32, ease: EASE_OUT },
    );
  }, [activeTab]);
}

/* Grows each analytics bar to its share once the panel is on screen. */
export function animateBars(selector) {
  document.querySelectorAll(selector).forEach((bar) => {
    gsap.fromTo(
      bar,
      { width: 0 },
      {
        width: `${bar.dataset.share}%`,
        duration: 0.6,
        ease: "power2.out",
      },
    );
  });
}

/* A grade chip that just changed gets a small pop, so a re-graded row is
   visible without re-reading the number. */
export function popGrade(el) {
  if (!el) return;
  gsap.fromTo(
    el,
    { scale: 0.82 },
    { scale: 1, duration: 0.3, ease: "back.out(2.4)" },
  );
}
