import { Trash2 } from "lucide-react";
import React, { useRef, useEffect } from "react";
import gsap from "gsap";
import { useStudent } from "../context/StudentContext";
const ConfimDialog = () => {
  const {
    confirmOpen,
    pendingDeleteIndex,
    selectedIndex,
    confirmDelete,
    cancelDelete,
  } = useStudent();
  const dialogRef = useRef(null);

  useEffect(() => {
    if (confirmOpen && dialogRef.current) {
      gsap.fromTo(
        dialogRef.current,
        { scale: 0.92, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.28, ease: "back.out(1.6)" },
      );
    }
  }, [confirmOpen]);

  if (!confirmOpen) return null;
  // const isBulk = pendingDeleteIndex === null;
  // const count = selectedIndex.length;

  return (
    <div
      className="modal-overlay visible opacity-100"
      id="confirmOverlay"
      style={{ visibility: "visible", opacity: 1 }}>
      <div
        className="modal modal--sm"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirmTitle"
        ref={dialogRef}>
        <div className="confirm-body">
          <div className="confirm-icon">
            <Trash2 />
          </div>
          <h3 id="confirmTitle">Delete this student?</h3>
          <p>
            This action can't be undone. The student record will be permanently
            removed.
          </p>
        </div>
        <div className="modal-foot">
          <button
            className="btn btn-secondary"
            id="confirmCancelBtn"
            type="button"
            onClick={cancelDelete}>
            Cancel
          </button>
          <button
            className="btn btn-danger"
            id="confirmDeleteBtn"
            type="button"
            onClick={confirmDelete}>
            <Trash2 />
            <span>Delete</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfimDialog;
