import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { EMAIL_RE, PHONE_RE } from "@/lib/validations";

const AuthContext = createContext(null);

const STRENGTH_LABELS = [
  "Too short",
  "Weak",
  "Fair",
  "Good",
  "Strong",
  "Very strong",
];
const STRENGTH_COLORS = [
  "var(--color-danger)",
  "var(--color-danger)",
  "var(--color-warning)",
  "var(--color-warning)",
  "var(--color-success)",
  "var(--color-success)",
];

function isEmailValid(value) {
  return EMAIL_RE.test(value.trim());
}
function isPhoneValid(value) {
  const digit = value.replace(/[^\d]/g, "");
  return digit.length >= 7 && digit.length <= 15 && PHONE_RE.test(value.trim());
}

function scorePassword(value) {
  let score = 0;
  if (value.length >= 8) score++;
  if (value.length >= 12) score++;
  if (/[A-Z]/.test(value)) score++;
  if (/[0-9]/.test(value)) score++;
  if (/[^A-Za-z0-9]/.test(value)) score++;
  return score;
}

export function AuthProvider({ children }) {
  const [loginLoading, setLoginLoading] = useState(false);
  const [signupLoading, setSignupLoading] = useState(false);
  const [authError, setAuthError] = useState(null);
  const [isAuthericated, setIsAuthericated] = useState(
    () => !!localStorage.getItem("token"),
  );

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    setIsAuthericated(false);
  }, []);

  // Returns { success, message }
  const handleLogin = useCallback(async (email, password, role) => {
    setLoginLoading(true);
    setAuthError(null);
    try {
      // TEMP: frontend-only test login, no backend required. Remove once /api/auth/login is live.
      if (email === "admin@gmail.com" && password === "123") {
        localStorage.setItem("token", "test-token");
        setIsAuthericated(true);
        return { success: true };
      }
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, role }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Login failed");
      localStorage.setItem("token", data.token);
      setIsAuthericated(true);
      return { success: true };
    } catch (err) {
      setAuthError(err.message);
      return { success: false, message: err.message };
    } finally {
      setLoginLoading(false);
    }
  }, []);

  // Returns { success, message }
  const handleSignup = useCallback(async (name, email, phone, password, role) => {
    setSignupLoading(true);
    setAuthError(null);
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone, password, role }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Sign up failed");
      localStorage.setItem("token", data.token);
      setIsAuthericated(true);
      return { success: true };
    } catch (err) {
      setAuthError(err.message);
      return { success: false, message: err.message };
    } finally {
      setSignupLoading(false);
    }
  }, []);

  const getPasswordStrength = useCallback((value) => {
    const score = scorePassword(value);
    return {
      score,
      percent: value ? Math.min(100, (score / 5) * 100) : 0,
      label: value ? STRENGTH_LABELS[score] : "Password strength",
      color: STRENGTH_COLORS[score],
    };
  }, []);

  const clearAuthError = useCallback(() => setAuthError(null), []);

  const value = useMemo(
    () => ({
      isAuthericated,
      loginLoading,
      signupLoading,
      authError,
      isEmailValid,
      isPhoneValid,
      getPasswordStrength,
      clearAuthError,
      handleLogin,
      handleSignup,
      logout,
    }),
    [
      isAuthericated,
      loginLoading,
      signupLoading,
      authError,
      getPasswordStrength,
      clearAuthError,
      handleLogin,
      handleSignup,
      logout,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuther() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider/>");
  return ctx;
}
