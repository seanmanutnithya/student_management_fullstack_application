import React, { useState } from "react";
import { useStudent } from "@/context/StudentContext";
import { Field, TextField } from "@/components/ui";
import stu001 from "@/./assets/imgs/stu001.jpg";
const StudentDetailFormModal = ({ student }) => {
  const { formRef, formData, handleChange, errors } = useStudent();
  const fields = [
    {
      id: "eiditName",
      name: "name",
      label: "Full name",
      className: "field--full",
      placeholder: "e.g Sean Manutnithya",
      value: formData.name,
      error: errors.name,
    },
    {
      id: "editId",
      name: "id",
      label: "Id",
      className: "field",
      placeholder: "e.g STU001",
      value: formData.id,
      error: errors.id,
    },
    {
      id: "editGender",
      name: "gender",
      label: "Gender",
      className: "field",
      placeholder: "e.g F/M",
      value: formData.gender,
      error: errors.gender,
    },
    {
      id: "editClass",
      name: "std_class",
      label: "Class",
      className: "field",
      placeholder: "e.g I2-GIC2A",
      value: formData.std_class,
      error: errors.std_class,
    },
    {
      id: "editPhone",
      name: "phone",
      label: "Phone number",
      className: "field",
      placeholder: "e.g +855 123 123 123",
      value: formData.phone,
      error: errors.phone,
    },
    {
      id: "editEmail",
      name: "email",
      label: "Email address",
      className: "field--full",
      placeholder: "e.g manutnithya.sean@gmail.com",
      value: formData.email,
      error: errors.email,
    },
    {
      id: "editAddress",
      name: "address",
      label: "Address",
      className: "field--full",
      placeholder: "e.g Tuek Tla, Sek Sok, Phnom Penh",
      value: formData.address,
      error: errors.address,
    },
    {
      id: "editGuardianName",
      name: "guardianName",
      label: "Guardian name",
      className: "field",
      placeholder: "e.g Brak Somphors",
      value: formData.guardianName,
      error: errors.guardianName,
    },
    {
      id: "editGuardianPhone",
      name: "guardianPhone",
      label: "Guardian phone",
      className: "field",
      placeholder: "e.g +855 234 234 234",
      value: formData.guardianPhone,
      error: errors.guardianPhone,
    },
  ];
  return (
    <form
      className="modal-body"
      id="editForm"
      noValidate
      ref={formRef}
      onSubmit={(e) => e.preventDefault()}>
      <div className="upload-field">
        <div className="upload-preview" id="uploadPreview">
          <img src={stu001} alt="" />
        </div>
        <div className="upload-controls">
          <label className="btn btn-secondary btn-sm" htmlFor="editPhoto">
            <span>Upload photo</span>
          </label>
          <input type="file" id="editPhoto" accept="image/*" hidden />
          <p className="field-hint">PNG or JPG, up to 5MB</p>
        </div>
      </div>
      <div className="form-grid">
        {fields.map((field, idx) => (
          <TextField
            key={idx}
            id={field.id}
            name={field.name}
            label={field.label}
            placeholder={field.placeholder}
            className={field.className}
            value={field.value}
            onChange={handleChange}
            error={field.error ? `${field.label} is required.` : ""}
          />
        ))}
        <TextField
          id={"editStudentDob"}
          name={"dob"}
          label={"Date of birth"}
          type="date"
          value={formData.dob}
          error={errors.dob ? "Date of birth is requried" : ""}
          onChange={handleChange}
        />
      </div>
    </form>
  );
};

export default StudentDetailFormModal;
