import { useEffect, useRef } from "react";
import { X } from "lucide-react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import IconButton from "../Button/IconButton";

const Modal = ({
  open,
  onClose,
  title,
  titleId,
  size = "md",
  footer,
  bodyClassName = "modal-body",
  overlayId,
  role = "dialog",
  children,
}) => {
  const overlayRef = useRef(null);
  const modalRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose?.();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  useGSAP(
    () => {
      if (!open) return;
      gsap.fromTo(
        overlayRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.25, ease: "power1.out" },
      );
      gsap.fromTo(
        modalRef.current,
        { y: 24, opacity: 0, scale: 0.96 },
        { y: 0, opacity: 1, scale: 1, duration: 0.3, ease: "power1.out" },
      );
    },
    { dependencies: [open], scope: overlayRef },
  );

  if (!open) return null;

  return (
    <div
      className="modal-overlay"
      style={{ opacity: 1, visibility: "visible" }}
      id={overlayId}
      ref={overlayRef}
      onClick={onClose}>
      <div
        className={`modal${size === "sm" ? " modal--sm" : ""}${size === "lg" ? " modal--lg" : ""}`}
        ref={modalRef}
        role={role}
        aria-modal="true"
        aria-labelledby={titleId}
        onClick={(e) => e.stopPropagation()}>
        {title && (
          <div className="modal-head">
            <h3 id={titleId}>{title}</h3>
            <IconButton icon={X} label="Close" onClick={onClose} />
          </div>
        )}
        <div className={bodyClassName}>{children}</div>
        {footer && <div className="modal-foot">{footer}</div>}
      </div>
    </div>
  );
};

export default Modal;
