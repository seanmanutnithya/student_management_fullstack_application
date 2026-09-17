import { useLayoutEffect } from "react";

/* Hides the native scrollbar while the calling page is mounted — the page
   still scrolls by wheel, trackpad, touch and keyboard.
   The viewport scrollbar is painted against <html>, not <body>, so both
   have to carry the class for every browser to honour it.

   useLayoutEffect, not useEffect: effects are deferred until after the
   browser paints, so the first frame after a refresh would render the tall
   page with its scrollbar and only lose it on the next frame — a visible
   blink. Layout effects flush inside the commit, before that first paint. */
export function useHideScrollbar() {
  useLayoutEffect(() => {
    const { documentElement, body } = document;
    documentElement.classList.add("hide-scrollbar");
    body.classList.add("hide-scrollbar");
    return () => {
      documentElement.classList.remove("hide-scrollbar");
      body.classList.remove("hide-scrollbar");
    };
  }, []);
}
