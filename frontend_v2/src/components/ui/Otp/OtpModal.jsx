import { useEffect, useRef, useState } from "react";
import { ShieldCheck } from "lucide-react";

import { shake } from "@/animation/shake";
import Button from "../Button/Button";
import Modal from "../Modal/Modal";

/* One box per digit: typing advances, backspace walks back, and a pasted
   code fills every box at once. `onVerify` returns true to accept. */
const OtpModal = ({
  open,
  onClose,
  onVerify,
  length = 4,
  title = "Verify it's you",
  description,
  hint,
  confirmLabel = "Verify",
}) => {
  const [digits, setDigits] = useState(() => Array(length).fill(""));
  const [error, setError] = useState("");
  const [wasOpen, setWasOpen] = useState(open);
  const inputsRef = useRef([]);
  const boxesRef = useRef(null);

  // Reset during render rather than in an effect — every open starts blank
  // without a second render pass.
  if (open !== wasOpen) {
    setWasOpen(open);
    if (open) {
      setDigits(Array(length).fill(""));
      setError("");
    }
  }

  useEffect(() => {
    if (!open) return;
    // Wait for the modal's open animation to put the inputs on screen.
    const id = requestAnimationFrame(() => inputsRef.current[0]?.focus());
    return () => cancelAnimationFrame(id);
  }, [open]);

  const code = digits.join("");

  const setDigitAt = (index, value) =>
    setDigits((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });

  const handleChange = (index, raw) => {
    const value = raw.replace(/\D/g, "");
    if (!value) {
      setDigitAt(index, "");
      return;
    }
    setError("");
    setDigitAt(index, value[value.length - 1]);
    if (index < length - 1) inputsRef.current[index + 1]?.focus();
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      e.preventDefault();
      setDigitAt(index - 1, "");
      inputsRef.current[index - 1]?.focus();
    }
    if (e.key === "ArrowLeft" && index > 0) inputsRef.current[index - 1]?.focus();
    if (e.key === "ArrowRight" && index < length - 1)
      inputsRef.current[index + 1]?.focus();
    if (e.key === "Enter") submit();
  };

  const handlePaste = (e) => {
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "");
    if (!pasted) return;
    e.preventDefault();
    setError("");
    const next = Array(length)
      .fill("")
      .map((_, i) => pasted[i] ?? "");
    setDigits(next);
    inputsRef.current[Math.min(pasted.length, length - 1)]?.focus();
  };

  const submit = () => {
    if (code.length < length) {
      setError(`Enter all ${length} digits.`);
      if (boxesRef.current) shake(boxesRef.current);
      return;
    }
    if (onVerify?.(code)) return;

    setError("That code isn't right. Try again.");
    setDigits(Array(length).fill(""));
    if (boxesRef.current) shake(boxesRef.current);
    inputsRef.current[0]?.focus();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      titleId="otpModalTitle"
      size="sm"
      overlayId="otpOverlay"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button icon={ShieldCheck} onClick={submit}>
            {confirmLabel}
          </Button>
        </>
      }>
      <div className="otp-body">
        <div className="otp-icon">
          <ShieldCheck />
        </div>
        {description && <p className="otp-description">{description}</p>}

        <div className="otp-boxes" ref={boxesRef} onPaste={handlePaste}>
          {digits.map((digit, index) => (
            <input
              key={index}
              ref={(el) => (inputsRef.current[index] = el)}
              className={`otp-box${error ? " is-invalid" : ""}`}
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={1}
              aria-label={`Digit ${index + 1}`}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
            />
          ))}
        </div>

        {error ?
          <p className="otp-error">{error}</p>
        : hint && <p className="otp-hint">{hint}</p>}
      </div>
    </Modal>
  );
};

export default OtpModal;
