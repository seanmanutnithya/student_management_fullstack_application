import { SquareArrowOutUpRight, Pencil, Trash2 } from "lucide-react";
import { useStudent } from "@/context/StudentContext";
import { useNavigate } from "react-router-dom";
const Actions = ({ name, id }) => {
  const { requestDeleteSingle, openEdit } = useStudent();
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
        className="row-action-btn delete"
        title={`Delete ${name}`}
        aria-label={`Delete ${name}`}
        onClick={() => requestDeleteSingle(id)}>
        <Trash2 />
      </button>
      <button
        className="row-action-btn openDetail"
        title={`Open detail ${name}`}
        aria-label={`Open detail ${name}`}
        onClick={() => navigate(`/allstudents/studentdetail/${id}`)}>
        <SquareArrowOutUpRight />
      </button>
    </div>
  );
};

export default Actions;
