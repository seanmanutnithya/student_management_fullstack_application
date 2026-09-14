import gsap from "gsap";
import { useGSAP } from "@gsap/react";

import { wireHoverScale } from "./hover";

const EASE_OUT = "power3.out";

// The mobile topbar sits outside the page wrapper, so this runs unscoped —
// useGSAP still reverts everything it creates on unmount. The sidebar is
// part of the shell and is deliberately left alone.
export function useRoutinePageAnimation() {
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
        ".routine-card, .routine-aside",
        { opacity: 0, y: 16 },
        {
          opacity: 1,
          y: 0,
          duration: 0.4,
          stagger: 0.08,
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

/* Re-staggers the grid whenever the lens or the template changes — the
   timetable reads as a fresh sheet rather than a silent swap. */
export function useGridReveal(deps) {
  useGSAP(() => {
    const cells = document.querySelectorAll(".slot-lesson");
    if (!cells.length) return;
    gsap.fromTo(
      cells,
      { opacity: 0, y: 6 },
      { opacity: 1, y: 0, duration: 0.28, stagger: 0.008, ease: EASE_OUT },
    );
  }, deps);
}

/* Pulses the slot a conflict link jumped to, so the eye lands on it. */
export function flashSlot(key) {
  if (!key) return;
  const el = document.querySelector(`[data-slot-key="${key}"]`);
  if (!el) return;
  el.scrollIntoView({ block: "center", inline: "center", behavior: "smooth" });
  gsap.fromTo(
    el,
    { boxShadow: "0 0 0 0 rgba(229, 72, 77, 0.55)" },
    {
      boxShadow: "0 0 0 10px rgba(229, 72, 77, 0)",
      duration: 0.9,
      ease: "power2.out",
      repeat: 1,
    },
  );
}
