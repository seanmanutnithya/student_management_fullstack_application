import { Mail, Phone, TriangleAlert, UserRound } from "lucide-react";

import { useClasses } from "@/context/ClassContext";

const TeacherCard = () => {
  const { drawerClass, drawerTeacher, homeroomCounts, rows } = useClasses();
  if (!drawerClass || !drawerTeacher) return null;

  const held = homeroomCounts[drawerClass.homeroom] ?? 1;
  const others = rows
    .filter((k) => k.homeroom === drawerClass.homeroom && k.id !== drawerClass.id)
    .map((k) => k.id);

  return (
    <section className="drawer-block">
      <h3>Class teacher</h3>
      <div className={`teacher-card${held > 1 ? " is-conflicted" : ""}`}>
        <span className="teacher-avatar">
          <UserRound />
        </span>
        <div className="teacher-meta">
          <strong>{drawerTeacher.name}</strong>
          <span className="cell-sub">Homeroom · {drawerClass.room}</span>
          <ul className="teacher-contact">
            {drawerTeacher.email && (
              <li>
                <Mail />
                {drawerTeacher.email}
              </li>
            )}
            {drawerTeacher.phone && (
              <li>
                <Phone />
                {drawerTeacher.phone}
              </li>
            )}
          </ul>
        </div>
        {held > 1 && (
          <span className="status-pill status-pill--amber teacher-badge">
            <TriangleAlert />
            {held} homerooms
          </span>
        )}
      </div>

      {held > 1 && (
        <p className="drawer-warning">
          <TriangleAlert />
          {drawerTeacher.name} is also homeroom for {others.join(", ")}. One
          teacher cannot cover two registers at the same time.
        </p>
      )}
    </section>
  );
};

export default TeacherCard;
