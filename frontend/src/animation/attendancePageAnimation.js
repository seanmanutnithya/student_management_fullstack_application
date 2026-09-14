import gsap from "gsap";
import { useGSAP } from "@gsap/react";

import { wireHoverScale } from "./hover";

const EASE_OUT = "power3.out";

// The mobile topbar sits outside the page wrapper, so this runs unscoped —
// useGSAP still reverts everything it creates on unmount. The sidebar is
// part of the shell and is deliberately left alone.
export function useAttendancePageAnimation() {
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
        ".attendance-card",
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
   part-marked register survives a trip to another tab. */
export function useTabCrossfade(activeTab) {
  useGSAP(() => {
    const panel = document.querySelector(".attendance-panel.is-active");
    if (!panel) return;
    gsap.fromTo(
      panel,
      { opacity: 0, y: 10 },
      { opacity: 1, y: 0, duration: 0.32, ease: EASE_OUT },
    );
  }, [activeTab]);
}

/* A short pop on the chip that was just chosen — confirms the tap without
   costing a re-render. */
export function popMark(el) {
  if (!el) return;
  gsap.fromTo(
    el,
    { scale: 0.86 },
    { scale: 1, duration: 0.28, ease: "back.out(2.2)" },
  );
}

/* Draws each donut arc on from zero, matching the Home page donut. */
export function animateDonutSegments(selector = ".reason-arc") {
  const arcs = document.querySelectorAll(selector);
  arcs.forEach((arc) => {
    const dash = Number(arc.dataset.dash);
    const gap = Number(arc.dataset.gap);
    gsap.fromTo(
      arc,
      { strokeDasharray: `0 ${dash + gap}` },
      {
        strokeDasharray: `${dash} ${gap}`,
        duration: 0.9,
        ease: "power2.out",
        delay: 0.15,
      },
    );
  });
}
