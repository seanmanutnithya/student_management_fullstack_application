import gsap from "gsap";
export function openConfirm() {
  const confirmOverlay = document.getElementById("confirmOverlay");
  if (!confirmOverlay) return;
  confirmOverlay.style.visibility = "visible";
  const dialog = confirmOverlay.querySelector(".modal");

  gsap.to(confirmOverlay, { opacity: 1, duration: 0.2 });
  if (dialog) {
    gsap.fromTo(
      dialog,
      { scale: 0.92, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.28, ease: "back.out(1.6)" },
    );
  }
}
