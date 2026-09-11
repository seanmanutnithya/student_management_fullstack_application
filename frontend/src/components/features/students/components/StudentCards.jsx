import { useStudent } from "@/context/StudentContext";
import Actions from "./Actions";

const StudentCards = () => {
  const { students, selectedIds, toggleSelect } = useStudent();

  return (
    <div className="student-cards" id="studentCards">
      {students.map((s) => (
        <div className="student-card" key={s.id}>
          <div className="student-card-top">
            <input
              type="checkbox"
              className="row-check"
              aria-label={`Select ${s.name}`}
              checked={selectedIds.includes(s.id)}
              onChange={() => toggleSelect(s.id)}
            />
            <div>
              <div className="student-card-name">{s.name}</div>
              <div className="student-card-roll">
                Roll {s.id} · Class {s.std_class}
              </div>
            </div>
            <Actions name={s.name} id={s.id} />
          </div>
          <dl className="student-card-grid">
            <div>
              <dt>Gender</dt>
              <dd>{s.gender}</dd>
            </div>
            <div>
              <dt>Phone</dt>
              <dd>{s.phone}</dd>
            </div>
            <div>
              <dt>Remark</dt>
              <dd>{s.remark ?? ""}</dd>
            </div>
          </dl>
        </div>
      ))}
    </div>
  );
};

export default StudentCards;
