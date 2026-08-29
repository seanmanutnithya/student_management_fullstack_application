import gsap from "gsap";
export function runLoading(callback, duration = 550) {
  const loadingOverlay = document.getElementById("loadingOverlay");
  if (!loadingOverlay) {
    callback?.();
    return;
  }
  loadingOverlay.style.visibility = "visible";
  gsap.fromTo(loadingOverlay, { opacity: 0 }, { opacity: 1, duration: 0.18 });
  gsap.fromTo(
    ".spinner",
    { rotate: 0 },
    { rotate: 360, duration: 0.7, repeat: 1, ease: "none" },
  );
  setTimeout(() => {
    gsap.to(loadingOverlay, {
      opacity: 0,
      duration: 0.2,
      onComplete: () => {
        loadingOverlay.style.visibility = "hidden";
        callback?.();
      },
    });
  }, duration);
}
