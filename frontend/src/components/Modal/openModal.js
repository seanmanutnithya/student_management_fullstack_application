import gsap from "gsap";
export function openModal(modalOverlay, noticeModal, noticeDate) {
  modalOverlay.style.visibility = "visible";
  if (gsap) {
    gsap.to(modalOverlay, { opacity: 1, duration: 0.2 });
    gsap.fromTo(
      noticeModal,
      { y: 24, opacity: 0, scale: 0.97 },
      { y: 0, opacity: 1, scale: 1, duration: 0.32, ease: "power1.out" },
    );
  } else {
    modalOverlay.style.opacity = 1;
  }
  document.body.style.overflow = "hidden";
  noticeDate.valueAsDate = new Date();
}
