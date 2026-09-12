import { useRef } from "react";
import { Mail, Phone, Save } from "lucide-react";
import gsap from "gsap";

import { AvatarUpload, Button, Field, Modal, TextField } from "@/components/ui";
import { useTeachers } from "@/context/TeacherContext";
import { resolveAvatarSrc } from "@/utils/avatar";

const SUBJECTS = [
  "Mathematics",
  "English",
  "Science",
  "History",
  "Computer Studies",
  "Physical Education",
];
const DEPARTMENTS = ["Science", "Humanities", "Languages", "Arts"];
const TYPES = ["Full-time", "Part-time"];

const TeacherFormModal = () => {
  const {
    modalOpen,
    closeModal,
    editingTeacher,
    formData,
    errors,
    fieldError,
    saving,
    formRef,
    handleChange,
    handleBlur,
    handleAvatarUpload,
    saveTeacher,
  } = useTeachers();

  const uploadRef = useRef(null);

  const onAvatarChange = (file) => {
    handleAvatarUpload(file);
    if (file && uploadRef.current) {
      gsap.fromTo(
        uploadRef.current,
        { scale: 0.8, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.3, ease: "back.out(1.7)" },
      );
    }
  };

  const isValid = (name) => Boolean(formData[name]) && !errors[name];

  return (
    <Modal
      open={modalOpen}
      onClose={closeModal}
      title={editingTeacher ? "Edit Teacher" : "Add Teacher"}
      titleId="modalTitle"
      overlayId="modalOverlay"
      footer={
        <>
          <Button variant="secondary" onClick={closeModal}>
            Cancel
          </Button>
          <Button icon={Save} loading={saving} onClick={saveTeacher}>
            Save teacher
          </Button>
        </>
      }>
      <form id="teacherForm" ref={formRef} onSubmit={(e) => e.preventDefault()}>
        <div className="upload-field" ref={uploadRef}>
          <AvatarUpload
            onChange={onAvatarChange}
            initialSrc={resolveAvatarSrc(formData.avatar)}
          />
          <p className="field-hint">PNG or JPG, up to 5MB</p>
        </div>

        <div className="form-grid">
          <TextField
            id="fName"
            name="name"
            label="Full name"
            className="field--full"
            placeholder="e.g. Dr. Alan Turner"
            value={formData.name}
            onChange={handleChange}
            onBlur={handleBlur}
            error={fieldError("name")}
            valid={isValid("name")}
          />

          <TextField
            id="fEmail"
            name="email"
            type="email"
            label="Email address"
            icon={Mail}
            statusIcons
            placeholder="you@iaacademy.edu"
            value={formData.email}
            onChange={handleChange}
            onBlur={handleBlur}
            error={fieldError("email")}
            valid={isValid("email")}
          />

          <TextField
            id="fPhone"
            name="phone"
            type="tel"
            label="Phone number"
            icon={Phone}
            statusIcons
            placeholder="+123 0000000"
            value={formData.phone}
            onChange={handleChange}
            onBlur={handleBlur}
            error={fieldError("phone")}
            valid={isValid("phone")}
          />

          <Field label="Subject" htmlFor="fSubject">
            <select
              id="fSubject"
              name="subject"
              value={formData.subject}
              onChange={handleChange}>
              <option value="">Select subject</option>
              {SUBJECTS.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </Field>

          <Field label="Department" htmlFor="fDept">
            <select
              id="fDept"
              name="dept"
              value={formData.dept}
              onChange={handleChange}>
              <option value="">Select department</option>
              {DEPARTMENTS.map((d) => (
                <option key={d}>{d}</option>
              ))}
            </select>
          </Field>

          <TextField
            id="fExp"
            name="exp"
            label="Experience"
            placeholder="e.g. 8 yrs"
            value={formData.exp}
            onChange={handleChange}
          />

          <Field label="Employment type" htmlFor="fType">
            <select
              id="fType"
              name="type"
              value={formData.type}
              onChange={handleChange}>
              {TYPES.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </Field>

          <TextField
            id="fQualification"
            name="qualification"
            label="Qualification"
            placeholder="e.g. M.Ed, B.Sc"
            value={formData.qualification}
            onChange={handleChange}
          />

          <TextField
            id="fJoinDate"
            name="joinDate"
            type="date"
            label="Joining date"
            value={formData.joinDate}
            onChange={handleChange}
          />

          <TextField
            id="fAddress"
            name="address"
            label="Address"
            className="field--full"
            placeholder="e.g. TA-107, New York"
            value={formData.address}
            onChange={handleChange}
          />
        </div>
      </form>
    </Modal>
  );
};

export default TeacherFormModal;
