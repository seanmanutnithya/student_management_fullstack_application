export function setFieldState(fieldEl, state) {
  fieldEl.classList.remove("is-valid", "is-invalid");
  if (state === "valid") fieldEl.classList.add("is-valid");
  if (state === "invalid") fieldEl.classList.add("is-invalid");
}
