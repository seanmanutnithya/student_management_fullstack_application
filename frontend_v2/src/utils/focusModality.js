/* Chromium keeps matching :focus-visible on a checkbox that was clicked with
   the mouse for as long as the keyboard was used earlier on the page — tab
   through the report form, then tick a class chip, and the chip's 18px box
   keeps a focus ring nobody asked for. CSS cannot tell pointer focus from
   keyboard focus, so record the last input modality on <html> and let
   stylesheets opt out of the ring when the pointer put it there. */
export function trackFocusModality() {
  const set = (mode) => {
    document.documentElement.dataset.focusModality = mode;
  };

  // Capture phase: the flag has to be set before focus moves.
  document.addEventListener("keydown", () => set("keyboard"), true);
  document.addEventListener("pointerdown", () => set("pointer"), true);

  // Default to keyboard so a ring is never hidden on a guess.
  set("keyboard");
}
