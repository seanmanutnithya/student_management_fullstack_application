import students from "../../../../../../database/data.json";
import { Pencil, Trash2 } from "lucide-react";

const StudentCards = () => {
  return (
    <div className="student-cards" id="studentCards">
      {students.map((s, idx) => (
        <div className="student-card" data-index={idx} key={idx}>
          <div className="student-card-top">
            <input
              type="checkbox"
              className="row-check"
              aria-label={`Select ${s.name}`}
            />
            <div>
              <div className="student-card-name">{s.name}</div>
              <div className="student-card-roll">
                Roll {s.std_class} · Class {s.std_class}
              </div>
            </div>
            <div className="row-actions">
              <button
                className="row-action-btn edit"
                title={`Edit ${s.name}`}
                aria-label={`Edit ${s.name}`}>
                <Pencil />
              </button>
              <button
                className="row-action-btn delete"
                title={`Delete ${s.name}`}
                aria-label={`Delete ${s.name}`}>
                <Trash2 />
              </button>
            </div>
          </div>
          <dl className="student-card-grid">
            <div>
              <dt>Address</dt>
              <dd>{s.gender}</dd>
            </div>
            <div>
              <dt>Date of birth</dt>
              <dd>{s.phone}</dd>
            </div>
            <div>
              <dt>Phone</dt>
              <dd>{s.remark ?? ""}</dd>
            </div>
          </dl>
        </div>
      ))}
    </div>
  );
};

export default StudentCards;
