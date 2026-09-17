import { useTeachers } from "@/context/TeacherContext";
import { resolveAvatarSrc } from "@/utils/avatar";
import Actions from "./Actions";

const TeacherCards = () => {
  const { pagedTeachers, selectedIds, toggleSelect } = useTeachers();

  return (
    <div className="teacher-cards" id="teacherCards">
      {pagedTeachers.map((t) => (
        <div
          className={`teacher-card${selectedIds.includes(t.id) ? " is-selected" : ""}`}
          key={t.id}
          data-row-id={t.id}>
          <div className="teacher-card-top">
            <input
              type="checkbox"
              className="row-check"
              aria-label={`Select ${t.name}`}
              checked={selectedIds.includes(t.id)}
              onChange={() => toggleSelect(t.id)}
            />
            <img
              className="student-avatar"
              src={resolveAvatarSrc(t.avatar)}
              alt=""
              loading="lazy"
            />
            <div>
              <div className="teacher-card-name">{t.name}</div>
              <div className="teacher-card-id">
                #{t.id} · {t.dept}
              </div>
            </div>
            <Actions name={t.name} id={t.id} />
          </div>
          <dl className="teacher-card-grid">
            <div>
              <dt>Subject</dt>
              <dd>{t.subject}</dd>
            </div>
            <div>
              <dt>Experience</dt>
              <dd>{t.exp}</dd>
            </div>
            <div>
              <dt>Phone</dt>
              <dd>{t.phone}</dd>
            </div>
          </dl>
        </div>
      ))}
    </div>
  );
};

export default TeacherCards;
