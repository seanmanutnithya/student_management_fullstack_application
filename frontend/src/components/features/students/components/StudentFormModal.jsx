import { Save } from "lucide-react";
import { useStudent } from "@/context/StudentContext";
import { Modal, Button, TextField } from "@/components/ui";

const StudentFormModal = () => {
  const {
    formData,
    modalOpen,
    closeModal,
    editingStudent,
    formRef,
    handleChange,
    handleSave,
    errors,
  } = useStudent();
  const fields = [
    {
      id: "studentName",
      name: "name",
      label: "Full name",
      placeholder: "e.g Sean Manutnithya",
      value: formData.name,
      error: errors.name,
    },
    {
      id: "studentGender",
      name: "gender",
      label: "Gender",
      placeholder: "e.g F/M",
      value: formData.gender,
      error: errors.gender,
    },
    {
      id: "studentId",
      name: "id",
      label: "Student ID",
      placeholder: "e.g STU001",
      value: formData.id,
      error: errors.id,
    },
    {
      id: "studentClass",
      name: "std_class",
      label: "Class",
      placeholder: "e.g I2-GIC",
      value: formData.std_class,
      error: errors.std_class,
    },
    {
      id: "studentPhon",
      name: "phone",
      label: "Phone number",
      placeholder: "e.g  +855 123123123",
      value: formData.phone,
      error: errors.phone,
    },
    {
      id: "studentAddress",
      name: "address",
      label: "Address",
      placeholder: "e.g  Tuek Tla, Sen Sok, Phnom Penh",
      value: formData.address,
      error: errors.address,
    },
    {
      id: "studentGuardianName",
      name: "guardianName",
      label: "Guardian name",
      placeholder: "e.g  Brak Somphors",
      value: formData.guardianName,
      error: errors.guardianName,
    },
    {
      id: "studentGuardianPhone",
      name: "guardianPhone",
      label: "Guardian phone",
      placeholder: "e.g  +855 234234234",
      value: formData.guardianPhone,
      error: errors.guardianPhone,
    },
    {
      id: "studentEmail",
      name: "email",
      label: "Email",
      placeholder: "e.g  manutnithya.sean@gmail.com",
      value: formData.email,
      error: errors.email,
    },
  ];
  return (
    <Modal
      open={modalOpen}
      onClose={closeModal}
      title={editingStudent ? "Edit Student" : "Add Student"}
      titleId="modalTitle"
      overlayId="modalOverlay"
      footer={
        <>
          <Button variant="secondary" onClick={closeModal}>
            Cancel
          </Button>
          <Button icon={Save} onClick={handleSave}>
            Save student
          </Button>
        </>
      }>
      <form
        className="form-grid"
        id="studentForm"
        ref={formRef}
        onSubmit={(e) => e.preventDefault()}>
        {fields.map((field, idx) => (
          <TextField
            key={idx}
            id={field.id}
            name={field.name}
            label={field.label}
            placeholder={field.placeholder}
            value={field.value}
            onChange={handleChange}
            error={field.error ? `${field.label} is required.` : null}
          />
        ))}
        <TextField
          id={"studentDob"}
          name={"dob"}
          type="date"
          label={"Date of birth"}
          value={formData.dob}
          onChange={handleChange}
        />
        <TextField
          id="studentRemark"
          name="remark"
          label={
            <>
              Remark <span className="field-hint">(optional)</span>
            </>
          }
          placeholder="e.g. class president"
          value={formData.remark}
          onChange={handleChange}
        />
      </form>
    </Modal>
  );
};

export default StudentFormModal;
