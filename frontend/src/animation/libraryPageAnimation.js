import gsap from "gsap";
import { useGSAP } from "@gsap/react";

import { wireHoverScale } from "./hover";

const EASE_OUT = "power3.out";

/* Replays whenever `deps` change — filtering the catalog re-staggers the
   cards that survived the filter. */
export function useStaggerReveal(selector, deps = [], options = {}) {
  const { y = 12, duration = 0.4, stagger = 0.04, hoverScale } = options;

  useGSAP(() => {
    const targets = document.querySelectorAll(selector);
    if (!targets.length) return;

    gsap.fromTo(
      targets,
      { opacity: 0, y },
      {
        opacity: 1,
        y: 0,
        duration,
        stagger,
        ease: EASE_OUT,
        onComplete: () => {
          if (hoverScale) wireHoverScale(selector, hoverScale);
        },
      },
    );
  }, deps);
}

// The mobile topbar sits outside the page wrapper, so this runs unscoped —
// useGSAP still reverts everything it creates on unmount.
export function useLibraryPageAnimation() {
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
        ".library-card",
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
          },
        },
        "-=0.15",
      );
  }, []);
}
