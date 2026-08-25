import React from "react";

const Toast = () => {
  return (
    <div className="toast" id="toast">
      <i data-lucide="check-circle-2"></i>
      <span id="toastMsg">Done</span>
    </div>
  );
};

export default Toast;
