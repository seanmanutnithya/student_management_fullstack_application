import { Pencil, Trash2 } from "lucide-react";

import { AvatarUpload } from "@/components/ui";
import { useTeachers } from "@/context/TeacherContext";
import { resolveAvatarSrc } from "@/utils/avatar";

const TeacherProfileHeader = () => {
  const { openTeacher, openEdit, requestDeleteSingle, handleAvatarChange } =
    useTeachers();

  if (!openTeacher) return null;

  return (
    <section className="card profile-header" id="profileHeader">
      <div className="profile-header-main">
        <div className="profile-avatar-wrap">
          <AvatarUpload
            key={openTeacher.id}
            onChange={handleAvatarChange}
            initialSrc={resolveAvatarSrc(openTeacher.avatar)}
          />
          <span className="status-badge status-badge--active">
            {openTeacher.type === "Part-time" ? "Part-time" : "Active"}
          </span>
        </div>
        <div className="profile-header-info">
          <h2 className="profile-name">{openTeacher.name}</h2>
          <p className="profile-meta">
            #{openTeacher.id} · {openTeacher.subject}
          </p>
          <div className="profile-contact-row">
            <span className="profile-contact">{openTeacher.email}</span>
            <span className="profile-contact">{openTeacher.phone}</span>
            <span className="profile-contact">{openTeacher.address}</span>
            <span className="profile-contact">{openTeacher.dept}</span>
          </div>
        </div>
      </div>
      <div className="profile-header-actions">
        <button
          className="btn btn-secondary"
          id="editTeacherBtn"
          onClick={() => openEdit(openTeacher.id)}>
          <Pencil />
          <span>Edit</span>
        </button>
        <button
          className="btn btn-danger"
          id="deleteTeacherBtn"
          onClick={() => requestDeleteSingle(openTeacher.id)}>
          <Trash2 />
          <span>Delete</span>
        </button>
      </div>
    </section>
  );
};

export default TeacherProfileHeader;
