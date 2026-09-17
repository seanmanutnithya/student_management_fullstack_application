import gsap from "gsap";
import { useGSAP } from "@gsap/react";

import { wireHoverScale } from "./hover";

const EASE_OUT = "power3.out";

// The mobile topbar sits outside the page wrapper, so this runs unscoped —
// useGSAP still reverts everything it creates on unmount. The sidebar is
// part of the shell and is deliberately left alone.
export function useClassPageAnimation() {
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
        ".class-card-shell",
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

/* Crossfades whichever tab panel just became active. */
export function useTabCrossfade(activeTab) {
  useGSAP(() => {
    const panel = document.querySelector(".class-panel.is-active");
    if (!panel) return;
    gsap.fromTo(
      panel,
      { opacity: 0, y: 10 },
      { opacity: 1, y: 0, duration: 0.32, ease: EASE_OUT },
    );
  }, [activeTab]);
}

/* Sweeps every capacity ring from empty to its fill. */
export function animateRings(selector = ".ring-value") {
  document.querySelectorAll(selector).forEach((ring) => {
    const dash = Number(ring.dataset.dash);
    const circumference = Number(ring.dataset.circumference);
    gsap.fromTo(
      ring,
      { strokeDasharray: `0 ${circumference}` },
      {
        strokeDasharray: `${dash} ${circumference - dash}`,
        duration: 0.8,
        ease: "power2.out",
      },
    );
  });
}

/* The roster drawer slides in from the right; its backdrop fades. */
export function animateDrawerIn(panel, backdrop) {
  if (backdrop) {
    gsap.fromTo(
      backdrop,
      { opacity: 0 },
      { opacity: 1, duration: 0.25, ease: "power1.out" },
    );
  }
  if (panel) {
    gsap.fromTo(
      panel,
      { xPercent: 100 },
      { xPercent: 0, duration: 0.38, ease: "power3.out" },
    );
  }
}
