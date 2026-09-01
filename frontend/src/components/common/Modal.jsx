import { Save, X } from "lucide-react";
import React, { useEffect, useState } from "react";

import { useStudent } from "../features/students/context/StudentContext";
const Modal = () => {
  const { modalOpen, closeModal, saveStudent, editingStudent } = useStudent();
  const [form, setForm] = useState({
    name: "",
    gender: "",
    ids: "",
    std_class: "",
    phone: "",
    remark: "",
  });
  useEffect(() => {
    if (editingStudent) {
      setForm({
        name: editingStudent.name ?? "",
        gender: editingStudent.gender ?? "",
        ids: editingStudent.id ?? "",
        std_class: editingStudent.std_class ?? "",
        phone: editingStudent.phone ?? "",
        remark: editingStudent.remark ?? "",
      });
    } else {
      setForm({
        name: "",
        gender: "",
        ids: "",
        std_class: "",
        phone: "",
        remark: "",
      });
      setForm({
        name: "",
        gender: "",
        ids: "",
        std_class: "",
        phone: "",
        remark: "",
      });
    }
  }, [editingStudent, modalOpen]);

  if (!modalOpen) return null;

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSave = () => {
    saveStudent(form);
  };

  return (
    <div
      className="modal-overlay visible opacity-100"
      id="modalOverlay"
      style={{ visibility: "visible", opacity: 1 }}
      onClick={closeModal}>
      <div
        className="modal"
        id="studentModal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modalTitle"
        onClick={(e) => e.stopPropagation()}>
        <div className="modal-head">
          <h3 id="modalTitle">
            {editingStudent ? "Edit Student" : "Add Student"}
          </h3>
          <button
            className="icon-btn"
            id="modalCloseBtn"
            aria-label="Close"
            type="button"
            onClick={closeModal}>
            <X />
          </button>
        </div>

        <form className="modal-body" id="studentForm">
          <div className="form-grid">
            <div className="field">
              <label htmlFor="studentName">Full name</label>
              <input
                type="text"
                id="studentName"
                name="name"
                placeholder="e.g. Eleanor Pena"
                value={form.name}
                onChange={handleChange}
              />
            </div>
            <div className="field">
              <label htmlFor="studentGender">Gender</label>
              <input
                type="text"
                id="studentGender"
                name="gender"
                placeholder="e.g. M/F"
                value={form.gender}
                onChange={handleChange}
              />
            </div>
            <div className="field">
              <label htmlFor="studentId">Student ID</label>
              <input
                type="text"
                id="studentId"
                name="ids"
                placeholder="e.g. #01"
                value={form.ids}
                onChange={handleChange}
              />
            </div>
            <div className="field">
              <label htmlFor="studentclassName">Class</label>
              <input
                type="text"
                id="studentclassName"
                name="std_class"
                placeholder="e.g. 12A"
                value={form.std_class}
                onChange={handleChange}
              />
            </div>
            <div className="field">
              <label htmlFor="studentPhone">Phone number</label>
              <input
                type="tel"
                id="studentPhone"
                name="phone"
                placeholder="+123 0000000"
                value={form.phone}
                onChange={handleChange}
              />
            </div>
            <div className="field">
              <label htmlFor="studentRemark">Remark</label>
              <input
                type="text"
                id="studentRemark"
                name="remark"
                placeholder="e.g. class president"
                value={form.remark}
                onChange={handleChange}
              />
            </div>
          </div>
        </form>

        <div className="modal-foot">
          <button
            className="btn btn-secondary"
            id="modalCancelBtn"
            type="button"
            onClick={closeModal}>
            Cancel
          </button>
          <button
            className="btn btn-primary"
            id="modalSaveBtn"
            type="button"
            onClick={handleSave}>
            <Save />
            <span>Save student</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
