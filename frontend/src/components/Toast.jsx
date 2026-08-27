import { CheckCircle2 } from "lucide-react";
const Toast = () => {
  return (
    <div className="toast" id="toast">
      <CheckCircle2 />
      <span id="toastMsg">Done</span>
    </div>
  );
};

export default Toast;
