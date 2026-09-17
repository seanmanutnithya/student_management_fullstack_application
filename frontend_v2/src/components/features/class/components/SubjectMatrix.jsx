import { TriangleAlert, UserRound } from "lucide-react";

import { useClasses } from "@/context/ClassContext";

const SubjectMatrix = () => {
  const { drawerClass } = useClasses();
  if (!drawerClass) return null;

  const gaps = drawerClass.subjects.filter((s) => !s.teacher).length;

  return (
    <section className="drawer-block">
      <h3>
        Subject &amp; teacher
        {gaps > 0 && (
          <span className="status-pill status-pill--amber">
            {gaps} unassigned
          </span>
        )}
      </h3>

      <ul className="matrix-list">
        {drawerClass.subjects.map((subject) => (
          <li
            className={`matrix-row${subject.teacher ? "" : " is-unassigned"}`}
            key={subject.code}>
            <span className="matrix-code">{subject.code}</span>
            <span className="matrix-subject">{subject.name}</span>
            {subject.teacher ?
              <span className="matrix-teacher">
                <UserRound />
                {subject.teacher}
              </span>
            : <span className="matrix-teacher is-empty">
                <TriangleAlert />
                Unassigned
              </span>
            }
          </li>
        ))}
      </ul>
    </section>
  );
};

export default SubjectMatrix;
