import { useEffect, useReducer, useRef } from "react";
import { MinusCircle, Send, X } from "lucide-react";

import { renderPopsupModal } from "../Modal/renderPopsupModal";

const NoticeModal = ({ isOpen, onClose }) => {
  const overlayRef = useRef(null);
  const modalRef = useRef(null);

  useEffect(() => {
    const overlay = overlayRef.current;
    const modal = modalRef.current;

    if (!overlay || !modal) return;

    if (isOpen) {
      overlay.style.visibility = "visible";
      overlay.style.pointer = "auto";
      document.body.style.overflow = "hidden";

      gsap.to(overlay, { opacity: 1, duration: 0.2, overwrite: "auto" });
      gsap.fromTo(
        modal,
        { y: 24, opacity: 0, scale: 0.97 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.32,
          ease: "power1.out",
          overwrite: "auto",
        },
      );
    } else {
      document.body.style.overflow = "";
      gsap.to(modal, {
        y: 16,
        opacity: 0,
        scale: 0.98,
        duration: 0.2,
        ease: "power2.in",
        overwrite: "auto",
      });
      gsap.to(overlay, {
        opacity: 0,
        duration: 0.22,
        delay: 0.03,
        overwrite: "auto",
        onComplete: () => {
          overlay.style.visibility = "hidden";
          overlay.style.pointerEvents = "none";
        },
      });
    }
  }, [isOpen]);

  if (!isOpen) return null;
  return (
    <div className="modal-overlay" id="modalOverlay">
      <div
        className="modal"
        id="noticeModal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="noticeModalTitle">
        <div className="modal-head">
          <h3 id="noticeModalTitle">Create Notice</h3>
          <button className="icon-btn" id="modalCloseBtn" aria-label="Close">
            <X />
          </button>
        </div>

        <form className="modal-body" id="noticeForm" noValidate>
          <div className="form-grid">
            <div className="field field--full" data-field="noticeTitle">
              <label htmlFor="noticeTitle">Notice title</label>
              <input
                type="text"
                id="noticeTitle"
                placeholder="e.g. Term 3 fee due date reminder"
              />
              <span className="field-error">
                Please enter a title (min. 4 characters).
              </span>
            </div>

            <div className="field">
              <label htmlFor="noticeAudience">Audience</label>
              <select id="noticeAudience">
                <option value="all">Everyone</option>
                <option value="students">Students only</option>
                <option value="teachers">Teachers only</option>
                <option value="parents">Parents only</option>
              </select>
            </div>

            <div className="field">
              <label htmlFor="noticeDate">Publish date</label>
              <input type="date" id="noticeDate" />
            </div>

            <div className="field field--full" data-field="noticeMessage">
              <label htmlFor="noticeMessage">Message</label>
              <textarea
                id="noticeMessage"
                rows="4"
                placeholder="Write the notice details…"></textarea>
              <span className="field-error">
                Please enter a message (min. 10 characters).
              </span>
            </div>
          </div>
        </form>

        <div className="modal-foot">
          <button
            className="btn btn-secondary"
            id="modalCancelBtn"
            type="button">
            Cancel
          </button>
          <button
            className="btn btn-primary"
            id="modalPublishBtn"
            type="button">
            <span className="btn-label flex items-center gap-2">
              <Send />
              <span>Publish notice</span>
            </span>
            <span className="btn-spinner"></span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default NoticeModal;
