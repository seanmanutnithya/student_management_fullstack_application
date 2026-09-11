import React from "react";
import { Save, Phone, Pencil, Trash2, Mail } from "lucide-react";
import { Modal } from "@/components/ui";
import { useStudent } from "@/context/StudentContext";
import { Button } from "@/components/ui";
import StudentDetailFormModal from "./StudentDetailFormModal";
import stu001 from "@/./assets/imgs/stu001.jpg";
const ProfileHeader = () => {
  const {
    modalOpen,
    openEdit,
    closeModal,
    handleSave,
    setIsDetailForm,
    requestDeleteSingle,
    openStudent,
    detailOpen,
  } = useStudent();
  const handleDelete = () => {
    requestDeleteSingle(openStudent.id);
  };

  if (!openStudent) return null;

  return (
    <>
      <section className="card profile-header" id="profileHeader">
        <div className="profile-header-main">
          <div className="profile-avatar-wrap">
            <img
              src={stu001}
              alt=""
              className="profile-avatar"
              id="profileAvatar"
            />
            <span className="status-badge status-badge--active">Active</span>
          </div>
          <div className="profile-header-info">
            <h2 className="profile-name">{openStudent.name}</h2>
            <p className="profile-meta">{openStudent.std_class}</p>
            <div className="profile-contact-row">
              <span className="profile-contact">{openStudent.email}</span>
              <span className="profile-contact">{openStudent.phone}</span>
              <span className="profile-contact">{openStudent.address}</span>
              <span className="profile-contact">
                {openStudent.guardianName}
              </span>
              <span className="profile-contact">
                {openStudent.guardianPhone}
              </span>
            </div>
          </div>
        </div>
        <div className="profile-header-actions">
          <button
            className="btn btn-secondary"
            id="editStudentBtn"
            onClick={() => {
              setIsDetailForm(true);
              openEdit(openStudent.id);
            }}>
            <Pencil />
            <span>Edit</span>
          </button>
          <button
            className="btn btn-danger"
            id="deleteStudentBtn"
            onClick={handleDelete}>
            <Trash2 />
            <span>Delete</span>
          </button>
        </div>
      </section>
      <Modal
        open={modalOpen}
        onClose={closeModal}
        title={"Editing Student"}
        size="md"
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
        <StudentDetailFormModal student={openStudent} />
      </Modal>
    </>
  );
};

export default ProfileHeader;
