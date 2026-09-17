import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Lock, Mail } from "lucide-react";
import { useAuther } from "@/context/AuthContext";
import { Button, TextField, PasswordField, useToast } from "@/components/ui";
import { shake } from "@/animation/shake";
import RoleSwitch from "./RoleSwitch";

const LoginForm = ({ isActive, onSwitchToSignup, role, onRoleChange }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const formRef = useRef(null);
  const { handleLogin, loginLoading, authError, clearAuthError, isEmailValid } =
    useAuther();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [touched, setTouched] = useState({ email: false, password: false });

  const emailValid = isEmailValid(email);
  const passwordValid = password.length > 0;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setTouched({ email: true, password: true });
    if (!emailValid || !passwordValid) {
      shake(formRef.current);
      return;
    }
    const { success, message } = await handleLogin(email, password, role);
    if (success) {
      toast.success("Logged in successfully");
      navigate("/");
    } else {
      shake(formRef.current);
      toast.error(message || "Login failed. Please try again!");
    }
  };

  return (
    <form
      ref={formRef}
      className={`auth-panel${isActive ? " is-active" : ""}`}
      noValidate
      onSubmit={handleSubmit}
    >
      <h1 className="auth-title">Welcome back</h1>
      <p className="auth-subtitle">Log in to your ia Academy workspace.</p>

      <RoleSwitch value={role} onChange={onRoleChange} formName="login" />

      <TextField
        name="loginEmail"
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

      <PasswordField
        name="loginPassword"
        label="Password"
        icon={Lock}
        placeholder="Enter your password"
        autoComplete="current-password"
        value={password}
        onChange={(e) => {
          setPassword(e.target.value);
          clearAuthError();
        }}
        onBlur={() => setTouched((t) => ({ ...t, password: true }))}
        error={touched.password && !passwordValid ? "Password is required." : null}
      />

      {authError && (
        <p className="field-error" style={{ display: "block" }}>
          {authError}
        </p>
      )}

      <div className="auth-row">
        <label className="checkbox-field">
          <input
            type="checkbox"
            id="rememberMe"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
          />
          <span>Remember me</span>
        </label>
        <a href="/forgot-password" className="auth-link">
          Forgot password?
        </a>
      </div>

      <Button type="submit" block loading={loginLoading}>
        {loginLoading ? "Logging in…" : "Log in"}
      </Button>

      <p className="auth-switch">
        Don&apos;t have an account?{" "}
        <button type="button" className="auth-link" onClick={onSwitchToSignup}>
          Sign up
        </button>
      </p>
    </form>
  );
};

export default LoginForm;
