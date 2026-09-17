import gsap from "gsap";
import { useGSAP } from "@gsap/react";

import { wireHoverScale } from "./hover";

const EASE_OUT = "power3.out";

// The mobile topbar sits outside the page wrapper, so this runs unscoped —
// useGSAP still reverts everything it creates on unmount. The sidebar is
// part of the shell and is deliberately left alone.
export function useBusPageAnimation() {
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
        ".bus-card",
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
   part-built route survives a trip to the fleet tab. */
export function useTabCrossfade(activeTab) {
  useGSAP(() => {
    const panel = document.querySelector(".bus-panel.is-active");
    if (!panel) return;
    gsap.fromTo(
      panel,
      { opacity: 0, y: 10 },
      { opacity: 1, y: 0, duration: 0.32, ease: EASE_OUT },
    );
  }, [activeTab]);
}

/* Grows each occupancy bar to its share once the board is on screen. */
export function animateBars(selector = ".bus-bar-fill") {
  document.querySelectorAll(selector).forEach((bar) => {
    gsap.fromTo(
      bar,
      { width: 0 },
      { width: `${bar.dataset.share}%`, duration: 0.6, ease: "power2.out" },
    );
  });
}

/* Settles the reordered stop list — the row that moved lands rather than
   teleporting, so the new sequence is readable. */
export function settleStops(selector = ".stop-row") {
  const rows = document.querySelectorAll(selector);
  if (!rows.length) return;
  gsap.fromTo(
    rows,
    { opacity: 0.35, y: -4 },
    { opacity: 1, y: 0, duration: 0.3, stagger: 0.03, ease: EASE_OUT },
  );
}
