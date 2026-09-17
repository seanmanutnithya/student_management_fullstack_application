import gsap from "gsap";
import { useGSAP } from "@gsap/react";

import { wireHoverScale } from "./hover";

const EASE_OUT = "power3.out";

// The mobile topbar sits outside the page wrapper, so this runs unscoped —
// useGSAP still reverts everything it creates on unmount. The sidebar is
// part of the shell and is deliberately left alone.
export function useHostelPageAnimation() {
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
        ".hostel-card",
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
   drill-down position survives a trip to another tab. */
export function useTabCrossfade(activeTab) {
  useGSAP(() => {
    const panel = document.querySelector(".hostel-panel.is-active");
    if (!panel) return;
    gsap.fromTo(
      panel,
      { opacity: 0, y: 10 },
      { opacity: 1, y: 0, duration: 0.32, ease: EASE_OUT },
    );
  }, [activeTab]);
}

/* Room tiles deal in whenever the block or floor changes, so a drill-down
   reads as a new set rather than a silent swap. */
export function useTileReveal(deps) {
  useGSAP(() => {
    const tiles = document.querySelectorAll(".room-tile");
    if (!tiles.length) return;
    gsap.fromTo(
      tiles,
      { opacity: 0, y: 10, scale: 0.97 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.3,
        stagger: 0.025,
        ease: EASE_OUT,
      },
    );
  }, deps);
}

/* Grows each occupancy bar to its share once the dashboard is on screen. */
export function animateBars(selector = ".hostel-bar-fill") {
  document.querySelectorAll(selector).forEach((bar) => {
    gsap.fromTo(
      bar,
      { width: 0 },
      { width: `${bar.dataset.share}%`, duration: 0.6, ease: "power2.out" },
    );
  });
}
