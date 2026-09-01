import { Pencil, Trash2 } from "lucide-react";
import { useStudent } from "../context/StudentContext";
const Actions = ({ name, id }) => {
  const { requestDeleteSingle, openEdit } = useStudent();
  return (
    <td className="col-action">
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
      </div>
    </td>
  );
};

export default Actions;
