import { memo } from "react";

/* Native checkbox under a styled track, so it keeps keyboard focus,
   space-to-toggle and form semantics for free. */
const Switch = ({
  checked,
  onChange,
  label,
  disabled = false,
  size = "md",
  id,
  name,
}) => (
  <label
    className={`switch${size === "sm" ? " switch--sm" : ""}${
      disabled ? " is-disabled" : ""
    }`}>
    <input
      type="checkbox"
      role="switch"
      id={id}
      name={name}
      checked={checked}
      disabled={disabled}
      aria-label={label}
      onChange={(e) => onChange?.(e.target.checked)}
    />
    <span className="switch-track" aria-hidden="true">
      <span className="switch-thumb" />
    </span>
  </label>
);

export default memo(Switch);
