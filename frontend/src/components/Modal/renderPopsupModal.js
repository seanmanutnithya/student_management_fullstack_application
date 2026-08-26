import { showToast } from "../../hooks/useToast";
import { closeModal } from "./closeModal";
import { openModal } from "./openModal";
import { wireLiveValidation } from "../../helper/wireLiveValidation";
import { validateField } from "../../helper/validateField";
export function renderPopsupModal(onClose) {
  const noticeTitleField = document.querySelector('[data-field="noticeTitle"]');
  const noticeMessageField = document.querySelector(
    '[data-field="noticeMessage"]',
  );
  /* ---------------- Notice modal open/close ---------------- */
  const modalOverlay = document.getElementById("modalOverlay");
  const noticeModal = document.getElementById("noticeModal");
  const modalCloseBtn = document.getElementById("modalCloseBtn");
  const modalCancelBtn = document.getElementById("modalCancelBtn");
  const modalPublishBtn = document.getElementById("modalPublishBtn");
  const noticeForm = document.getElementById("noticeForm");
  const noticeDate = document.getElementById("noticeDate");

  const clearTitleValidation = wireLiveValidation(
    noticeTitleField,
    (v) => v.trim().length >= 4,
  );
  const clearMessageValidation = wireLiveValidation(
    noticeMessageField,
    (v) => v.trim().length >= 10,
  );

  const close = () =>
    closeModal(
      modalOverlay,
      noticeModal,
      noticeForm,
      [noticeTitleField, noticeMessageField],
      onClose,
    );
  const handleOverlayClick = (e) => {
    if (e.target === modalOverlay)
      close();
  };

  const publish = () => {
    const titleOk = validateField(
      noticeTitleField,
      (v) => v.trim().length >= 4,
    );
    const messageOk = validateField(
      noticeMessageField,
      (v) => v.trim().length >= 10,
    );
    if (!titleOk || !messageOk) return;

    modalPublishBtn.classList.add("is-loading");
    modalPublishBtn.disabled = true;

    setTimeout(() => {
      modalPublishBtn.classList.remove("is-loading");
      modalPublishBtn.disabled = false;
      showToast("Notice published successfully");
      close();
    }, 900);
  };

  modalCloseBtn.addEventListener("click", close);
  modalCancelBtn.addEventListener("click", close);
  modalOverlay.addEventListener("click", handleOverlayClick);
  modalPublishBtn.addEventListener("click", publish);
  openModal(modalOverlay, noticeModal, noticeDate);

  return () => {
    clearTitleValidation();
    clearMessageValidation();
    modalCloseBtn.removeEventListener("click", close);
    modalCancelBtn.removeEventListener("click", close);
    modalOverlay.removeEventListener("click", handleOverlayClick);
    modalPublishBtn.removeEventListener("click", publish);
  };
}
