import { useCallback, useMemo, useRef, useState } from "react";
import { BadgeCheck, Mail, Phone, Save, ShieldCheck, User } from "lucide-react";

import { shake } from "@/animation/shake";
import { seedProfile } from "@/assets/data/accountSeed";
import { AvatarUpload, Button, TextField, useToast } from "@/components/ui";
import { useAuther } from "@/context/AuthContext";
import { formatDate } from "@/utils/format";
import { resolveAvatarSrc } from "@/utils/avatar";
import { handleUploadImage } from "@/services/uploadService";

const EDITABLE = ["name", "email", "phone"];

const ProfileSection = ({ teacherId }) => {
  const { toast } = useToast();
  const { isEmailValid, isPhoneValid } = useAuther();

  const [saved, setSaved] = useState(seedProfile);
  const [form, setForm] = useState(seedProfile);
  const [touched, setTouched] = useState({});
  const [saving, setSaving] = useState(false);
  const formRef = useRef(null);

  const nameValid = form.name.trim().length >= 2;
  const emailValid = isEmailValid(form.email);
  const phoneValid = isPhoneValid(form.phone);

  // The Save button stays disabled until something actually differs.
  const isDirty = useMemo(
    () =>
      EDITABLE.some((key) => form[key] !== saved[key]) ||
      form.avatar !== saved.avatar,
    [form, saved],
  );

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleBlur = useCallback((e) => {
    const { name } = e.target;
    setTouched((prev) => (prev[name] ? prev : { ...prev, [name]: true }));
  }, []);

  // AvatarUpload already shows an instant local preview via createObjectURL, so
  // what we keep here is the path the server saved — that one survives a reload.
  const handleAvatar = useCallback(
    async (file) => {
      if (!file) {
        setForm((prev) => ({ ...prev, avatar: null }));
        return;
      }
      if (!teacherId) {
        toast.error("No profile is loaded yet.");
        return;
      }
      try {
        const data = await handleUploadImage(file, teacherId);
        setForm((prev) => ({ ...prev, avatar: data.avatar }));
        toast.success("Photo updated");
      } catch (error) {
        toast.error(
          error.response?.data?.message ?? "Couldn't upload that image.",
        );
      }
    },
    [teacherId, toast],
  );

  const handleSave = () => {
    setTouched({ name: true, email: true, phone: true });
    if (!nameValid || !emailValid || !phoneValid) {
      shake(formRef.current);
      return;
    }
    setSaving(true);
    // No backend — a short delay just so the button state is visible.
    setTimeout(() => {
      setSaved(form);
      setSaving(false);
      toast.success("Profile updated");
    }, 700);
  };

  const handleReset = () => {
    setForm(saved);
    setTouched({});
  };

  return (
    <section className="account-section">
      <header className="account-section-head">
        <div>
          <h2>Personal details</h2>
          <p>Update how your name and contact details appear across the app.</p>
        </div>
      </header>

      <form
        className="profile-form"
        ref={formRef}
        onSubmit={(e) => e.preventDefault()}>
        <div className="profile-identity">
          <AvatarUpload
            onChange={handleAvatar}
            initialSrc={resolveAvatarSrc(form.avatar)}
          />
          <div className="profile-identity-meta">
            <h3>{saved.name}</h3>
            <div className="profile-badges">
              <span className="role-badge">
                <ShieldCheck />
                {saved.role}
              </span>
              <span className="id-badge">
                <BadgeCheck />
                {saved.employeeId}
              </span>
            </div>
            <p className="cell-sub">
              Joined {formatDate(saved.joinedOn)} · read-only fields are set by
              your administrator
            </p>
          </div>
        </div>

        <div className="form-grid">
          <TextField
            id="accName"
            name="name"
            label="Full name"
            className="field--full"
            icon={User}
            statusIcons
            placeholder="e.g. Priscilla Lily"
            value={form.name}
            onChange={handleChange}
            onBlur={handleBlur}
            error={
              touched.name && !nameValid ? "Please enter your full name." : ""
            }
            valid={touched.name && nameValid}
          />

          <TextField
            id="accEmail"
            name="email"
            type="email"
            label="Email address"
            icon={Mail}
            statusIcons
            placeholder="you@iaacademy.edu"
            value={form.email}
            onChange={handleChange}
            onBlur={handleBlur}
            error={
              touched.email && !emailValid ? "Enter a valid email address." : ""
            }
            valid={touched.email && emailValid}
          />

          <TextField
            id="accPhone"
            name="phone"
            type="tel"
            label="Phone number"
            icon={Phone}
            statusIcons
            placeholder="+855 12 345 678"
            value={form.phone}
            onChange={handleChange}
            onBlur={handleBlur}
            error={
              touched.phone && !phoneValid ?
                "Enter a valid phone number (7–15 digits)."
              : ""
            }
            valid={touched.phone && phoneValid}
          />

          <TextField
            id="accRole"
            name="role"
            label="Role"
            value={saved.role}
            readOnly
            disabled
            hint="Managed by your administrator"
          />

          <TextField
            id="accEmployeeId"
            name="employeeId"
            label="Employee ID"
            value={saved.employeeId}
            readOnly
            disabled
            hint="Cannot be changed"
          />
        </div>

        <div className="account-section-foot">
          <Button
            variant="secondary"
            onClick={handleReset}
            disabled={!isDirty || saving}>
            Discard
          </Button>
          <Button
            icon={Save}
            onClick={handleSave}
            loading={saving}
            disabled={!isDirty}>
            Save changes
          </Button>
        </div>
      </form>
    </section>
  );
};

export default ProfileSection;
