import { Pencil, SquareArrowOutUpRight, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { useTeachers } from "@/context/TeacherContext";

const Actions = ({ name, id }) => {
  const { openEdit, requestDeleteSingle } = useTeachers();
  const navigate = useNavigate();

  return (
    <div className="row-actions">
      <button
        className="row-action-btn edit"
        title={`Edit ${name}`}
        aria-label={`Edit ${name}`}
        onClick={() => openEdit(id)}>
        <Pencil />
      </button>
      <button
        className="row-action-btn openDetail edit"
        title={`Open detail ${name}`}
        aria-label={`Open detail ${name}`}
        onClick={() => navigate(`/allteachers/teacherdetail/${id}`)}>
        <SquareArrowOutUpRight />
      </button>
      <button
        className="row-action-btn delete"
        title={`Delete ${name}`}
        aria-label={`Delete ${name}`}
        onClick={() => requestDeleteSingle(id)}>
        <Trash2 />
      </button>
    </div>
  );
};

export default Actions;
