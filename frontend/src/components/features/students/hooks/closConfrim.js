import gsap from "gsap";
export function closeConfirm() {
  const confirmOverlay = document.getElementById("confirmOverlay");
  if (!confirmOverlay) return;
  gsap.to(confirmOverlay, {
    opacity: 0,
    duration: 0.2,
    onComplete: () => (confirmOverlay.style.visibility = "hidden"),
  });
}
