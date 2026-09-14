import gsap from "gsap";
import { useGSAP } from "@gsap/react";

import { wireHoverScale } from "./hover";

const EASE_OUT = "power3.out";

/* Replays whenever `deps` change — e.g. filtering the library catalog
   re-staggers the cards that survived the filter. */
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
