const Field = ({
  label,
  htmlFor,
  error,
  valid = false,
  hint,
  className = "",
  children,
}) => {
  const stateClass = error ? "is-invalid" : valid ? "is-valid" : "";
  const classes = ["field", stateClass, className].filter(Boolean).join(" ");

  return (
    <div className={classes}>
      {label && <label htmlFor={htmlFor}>{label}</label>}
      {children}
      {hint && !error && <span className="field-hint">{hint}</span>}
      {error && <span className="field-error">{error}</span>}
    </div>
  );
};

export default Field;
