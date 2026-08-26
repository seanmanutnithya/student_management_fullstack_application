import gsap from "gsap";
import { setFieldState } from "./setFeildState";

export function closeModal(
  modalOverlay,
  noticeModal,
  noticeForm,
  fields = [],
  onClose,
) {
  const finishClose = () => {
    modalOverlay.style.visibility = "hidden";
    noticeForm.reset();
    fields.forEach((field) => setFieldState(field, null));
    document.body.style.overflow = "";
    onClose?.();
  };

  if (gsap) {
    gsap.to(noticeModal, {
      y: 16,
      opacity: 0,
      scale: 0.98,
      duration: 0.2,
      ease: "power2.in",
    });
    gsap.to(modalOverlay, {
      opacity: 0,
      duration: 0.22,
      delay: 0.03,
      onComplete: finishClose,
    });
  } else {
    modalOverlay.style.opacity = 0;
    finishClose();
  }
}
