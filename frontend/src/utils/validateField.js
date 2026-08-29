import { setFieldState } from "@/components/Modal/setFeildState";
import { shake } from "@/animation/shake";

export function validateField(fieldEl, validatorFn) {
  const input = fieldEl.querySelector("input, textarea");
  const ok = validatorFn(input.value);
  setFieldState(fieldEl, ok ? "valid" : "invalid");
  if (!ok) shake(input);
  return ok;
}
