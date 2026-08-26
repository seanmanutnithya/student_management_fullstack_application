import gsap from "gsap";

let toastTimer = null;
export function showToast(message) {
  const toastEl = document.getElementById("toast");
  const toastMsg = document.getElementById("toastMsg");

  if (!toastEl || !toastMsg) return;

  toastMsg.textContent = message;
  clearTimeout(toastTimer);

  if (gsap) {
    gsap.killTweensOf(toastEl);
    gsap.fromTo(
      toastEl,
      { y: 24, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.32, ease: "back.out(1.6)" },
    );
  } else {
    toastEl.style.opacity = 1;
  }
  toastTimer = setTimeout(() => {
    if (gsap) {
      gsap.to(toastEl, {
        y: 24,
        opacity: 0,
        duration: 0.25,
        ease: "power2.in",
      });
    } else {
      toastEl.style.opacity = 0;
    }
  }, 2600);
}
