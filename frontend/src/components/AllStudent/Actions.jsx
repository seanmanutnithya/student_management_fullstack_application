import { Pencil, Trash2 } from "lucide-react";
const Actions = ({ name }) => {
  return (
    <td className="col-action">
      <div className="row-actions">
        <button
          className="row-action-btn edit"
          title={`Edit ${name}`}
          aria-label={`Edit ${name}`}>
          <Pencil />
        </button>
        <button
          className="row-action-btn delete"
          title={`Delete ${name}`}
          aria-label={`Delete ${name}`}>
          <Trash2 />
        </button>
      </div>
    </td>
  );
};

export default Actions;
