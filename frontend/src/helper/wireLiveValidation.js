import { validateField } from "./validateField";
import { setFieldState } from "@/components/Modal/setFeildState";
export function wireLiveValidation(fieldEl, validatorFn) {
  const input = fieldEl.querySelector("input, textarea");
  const validateOnBlur = () => validateField(fieldEl, validatorFn);
  const validateOnInput = () => {
    if (fieldEl.classList.contains("is-invalid") && validatorFn(input.value))
      setFieldState(fieldEl, "valid");
  };

  input.addEventListener("blur", validateOnBlur);
  input.addEventListener("input", validateOnInput);

  return () => {
    input.removeEventListener("blur", validateOnBlur);
    input.removeEventListener("input", validateOnInput);
  };
}
