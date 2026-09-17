import { useAuther } from "@/context/AuthContext";

/* The meter the signup form already used, lifted into ui/ so the account
   page and auth share one implementation. Scoring stays in AuthContext. */
const PasswordStrength = ({ value }) => {
  const { getPasswordStrength } = useAuther();
  const strength = getPasswordStrength(value);

  return (
    <div className="password-strength">
      <div className="password-strength-bar">
        <span
          style={{
            width: `${strength.percent}%`,
            backgroundColor: strength.color,
          }}
        />
      </div>
      <span className="password-strength-label">{strength.label}</span>
    </div>
  );
};

export default PasswordStrength;
