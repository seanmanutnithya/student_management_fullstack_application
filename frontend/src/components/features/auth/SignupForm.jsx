import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Lock, Phone, User, Mail } from "lucide-react";
import { useAuther } from "@/context/AuthContext";
import { Button, TextField, PasswordField, useToast } from "@/components/ui";
import { shake } from "@/animation/shake";
import RoleSwitch from "./RoleSwitch";

const SignupForm = ({ isActive, onSwitchToLogin, role, onRoleChange }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const formRef = useRef(null);
  const {
    handleSignup,
    signupLoading,
    authError,
    clearAuthError,
    isEmailValid,
    isPhoneValid,
    getPasswordStrength,
  } = useAuther();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [touched, setTouched] = useState({
    name: false,
    email: false,
    phone: false,
    password: false,
    confirm: false,
    terms: false,
  });

  const strength = getPasswordStrength(password);
  const nameValid = name.trim().length > 0;
  const emailValid = isEmailValid(email);
  const phoneValid = isPhoneValid(phone);
  const passwordValid = password.length >= 8;
  const confirmValid = confirm.length > 0 && confirm === password;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setTouched({
      name: true,
      email: true,
      phone: true,
      password: true,
      confirm: true,
      terms: true,
    });
    if (
      !nameValid ||
      !emailValid ||
      !phoneValid ||
      !passwordValid ||
      !confirmValid ||
      !agreedToTerms
    ) {
      shake(formRef.current);
      return;
    }
    const { success, message } = await handleSignup(
      name,
      email,
      phone,
      password,
      role,
    );
    if (success) {
      toast.success("Account created successfully");
      navigate("/");
    } else {
      shake(formRef.current);
      toast.error(message || "Cannot create account");
    }
  };

  return (
    <form
      ref={formRef}
      className={`auth-panel${isActive ? " is-active" : ""}`}
      noValidate
      onSubmit={handleSubmit}
    >
      <h1 className="auth-title">Create your account</h1>
      <p className="auth-subtitle">Set up access for an admin or teacher.</p>

      <RoleSwitch value={role} onChange={onRoleChange} formName="signup" />

      <TextField
        name="signupName"
        label="Full name"
        icon={User}
        statusIcons
        placeholder="e.g. Robert Pena"
        autoComplete="name"
        value={name}
        onChange={(e) => {
          setName(e.target.value);
          clearAuthError();
        }}
        onBlur={() => setTouched((t) => ({ ...t, name: true }))}
        error={touched.name && !nameValid ? "Please enter your full name." : null}
        valid={touched.name && nameValid}
      />

      <div className="field-grid">
        <TextField
          name="signupEmail"
          label="Email address"
          type="email"
          icon={Mail}
          statusIcons
          placeholder="you@iaacademy.edu"
          autoComplete="email"
          inputMode="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            clearAuthError();
          }}
          onBlur={() => setTouched((t) => ({ ...t, email: true }))}
          error={
            touched.email && !emailValid ? "Enter a valid email address." : null
          }
          valid={touched.email && emailValid}
        />

        <TextField
          name="signupPhone"
          label="Phone number"
          type="tel"
          icon={Phone}
          statusIcons
          placeholder="+123 6988 567"
          autoComplete="tel"
          inputMode="tel"
          value={phone}
          onChange={(e) => {
            setPhone(e.target.value);
            clearAuthError();
          }}
          onBlur={() => setTouched((t) => ({ ...t, phone: true }))}
          error={
            touched.phone && !phoneValid
              ? "Enter a valid phone number (7–15 digits)."
              : null
          }
          valid={touched.phone && phoneValid}
        />
      </div>

      <div className="field-grid">
        <PasswordField
          name="signupPassword"
          label="Password"
          icon={Lock}
          placeholder="Min. 8 characters"
          autoComplete="new-password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            clearAuthError();
          }}
          onBlur={() => setTouched((t) => ({ ...t, password: true }))}
          error={
            touched.password && !passwordValid
              ? "Use at least 8 characters."
              : null
          }
        />

        <PasswordField
          name="signupConfirm"
          label="Confirm password"
          icon={Lock}
          placeholder="Re-enter password"
          autoComplete="new-password"
          value={confirm}
          onChange={(e) => {
            setConfirm(e.target.value);
            clearAuthError();
          }}
          onBlur={() => setTouched((t) => ({ ...t, confirm: true }))}
          error={
            touched.confirm && !confirmValid ? "Passwords don't match." : null
          }
        />
      </div>

      <div className="password-strength">
        <div className="password-strength-bar">
          <span
            style={{
              width: `${strength.percent}%`,
              backgroundColor: strength.color,
              display: "block",
              height: "100%",
              transition: "width 0.3s, background-color 0.3s",
            }}
          />
        </div>
        <span className="password-strength-label">{strength.label}</span>
      </div>

      <label className="checkbox-field checkbox-field--terms">
        <input
          type="checkbox"
          id="agreeTerms"
          checked={agreedToTerms}
          onChange={(e) => setAgreedToTerms(e.target.checked)}
        />
        <span>
          I agree to the{" "}
          <a href="#" className="auth-link">
            Terms of Service
          </a>{" "}
          and{" "}
          <a href="#" className="auth-link">
            Privacy Policy
          </a>
        </span>
      </label>
      {touched.terms && !agreedToTerms && (
        <span className="field-error" style={{ display: "block" }}>
          Please accept the terms to continue.
        </span>
      )}

      {authError && (
        <p className="field-error" style={{ display: "block" }}>
          {authError}
        </p>
      )}

      <Button type="submit" block loading={signupLoading}>
        {signupLoading ? "Creating account…" : "Create account"}
      </Button>

      <p className="auth-switch">
        Already have an account?{" "}
        <button type="button" className="auth-link" onClick={onSwitchToLogin}>
          Log in
        </button>
      </p>
    </form>
  );
};

export default SignupForm;
