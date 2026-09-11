import { AlertCircle, CheckCircle2 } from "lucide-react";
import Field from "./Field";
import { useStudent } from "@/context/StudentContext";

const TextField = ({
  id,
  name,
  label,
  type = "text",
  icon: Icon,
  statusIcons = false,
  error,
  valid,
  hint,
  className,
  ...rest
}) => {
  const { handleChange } = useStudent();
  const inputId = id ?? name;
  const input = <input id={inputId} name={name} type={type} {...rest} />;

  return (
    <Field
      label={label}
      htmlFor={inputId}
      error={error}
      valid={valid}
      hint={hint}
      className={className}
      onChange={handleChange}>
      {Icon || statusIcons ?
        <div className="input-wrap">
          {Icon && <Icon className="input-icon" />}
          {input}
          {statusIcons && (
            <>
              <CheckCircle2 className="status-icon status-valid" />
              <AlertCircle className="status-icon status-invalid" />
            </>
          )}
        </div>
      : input}
    </Field>
  );
};

export default TextField;
