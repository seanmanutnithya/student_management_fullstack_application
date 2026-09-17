import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import Field from "./Field";

const PasswordField = ({
  id,
  name,
  label,
  icon: Icon,
  error,
  valid,
  hint,
  className,
  ...rest
}) => {
  const [visible, setVisible] = useState(false);
  const inputId = id ?? name;

  return (
    <Field
      label={label}
      htmlFor={inputId}
      error={error}
      valid={valid}
      hint={hint}
      className={className}>
      <div className="input-wrap">
        {Icon && <Icon className="input-icon" />}
        <input
          id={inputId}
          name={name}
          type={visible ? "text" : "password"}
          {...rest}
        />
        <button
          type="button"
          className="visibility-toggle"
          aria-label={visible ? "Hide password" : "Show password"}
          onClick={() => setVisible((v) => !v)}>
          {visible ? <EyeOff /> : <Eye />}
        </button>
      </div>
    </Field>
  );
};

export default PasswordField;
