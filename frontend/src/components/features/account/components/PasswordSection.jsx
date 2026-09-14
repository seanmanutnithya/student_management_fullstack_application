import { useRef, useState } from "react";
import { KeyRound, Lock, ShieldCheck } from "lucide-react";

import { shake } from "@/animation/shake";
import {
  Button,
  PasswordField,
  PasswordStrength,
  useToast,
} from "@/components/ui";

const MIN_LENGTH = 8;
const emptyForm = { current: "", next: "", confirm: "" };

const PasswordSection = () => {
  const { toast } = useToast();
  const [form, setForm] = useState(emptyForm);
  const [touched, setTouched] = useState({});
  const [saving, setSaving] = useState(false);
  const formRef = useRef(null);

  const currentValid = form.current.length > 0;
  const nextValid = form.next.length >= MIN_LENGTH;
  const matches = form.confirm.length > 0 && form.confirm === form.next;
  const reused = nextValid && form.next === form.current;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleBlur = (e) =>
    setTouched((prev) => ({ ...prev, [e.target.name]: true }));

  const handleSubmit = () => {
    setTouched({ current: true, next: true, confirm: true });
    if (!currentValid || !nextValid || !matches || reused) {
      shake(formRef.current);
      return;
    }
    setSaving(true);
    setTimeout(() => {
      setForm(emptyForm);
      setTouched({});
      setSaving(false);
      toast.success("Password changed successfully");
    }, 700);
  };

  return (
    <section className="account-section">
      <header className="account-section-head">
        <div>
          <h2>
            <KeyRound />
            Change password
          </h2>
          <p>Use at least {MIN_LENGTH} characters, mixing letters and numbers.</p>
        </div>
      </header>

      <form
        className="password-form"
        ref={formRef}
        onSubmit={(e) => e.preventDefault()}>
        <PasswordField
          id="pwCurrent"
          name="current"
          label="Current password"
          icon={Lock}
          placeholder="Enter your current password"
          autoComplete="current-password"
          value={form.current}
          onChange={handleChange}
          onBlur={handleBlur}
          error={
            touched.current && !currentValid ?
              "Enter your current password."
            : ""
          }
        />

        <div className="field-grid">
          <PasswordField
            id="pwNext"
            name="next"
            label="New password"
            icon={Lock}
            placeholder={`Min. ${MIN_LENGTH} characters`}
            autoComplete="new-password"
            value={form.next}
            onChange={handleChange}
            onBlur={handleBlur}
            error={
              touched.next && !nextValid ?
                `Use at least ${MIN_LENGTH} characters.`
              : reused ? "Choose a password you haven't used here before."
              : ""
            }
          />

          <PasswordField
            id="pwConfirm"
            name="confirm"
            label="Confirm new password"
            icon={Lock}
            placeholder="Re-enter new password"
            autoComplete="new-password"
            value={form.confirm}
            onChange={handleChange}
            onBlur={handleBlur}
            /* Live match check — no blur needed once they start typing. */
            error={
              form.confirm.length > 0 && !matches ? "Passwords don't match." : ""
            }
            valid={matches}
          />
        </div>

        <PasswordStrength value={form.next} />

        <div className="account-section-foot">
          <Button icon={ShieldCheck} onClick={handleSubmit} loading={saving}>
            Update password
          </Button>
        </div>
      </form>
    </section>
  );
};

export default PasswordSection;
