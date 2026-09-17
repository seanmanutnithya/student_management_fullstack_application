import { ClipboardCheck, GraduationCap, TriangleAlert } from "lucide-react";

import { useClasses } from "@/context/ClassContext";

/* Each figure is a button: it opens the filtered roster behind it, so a
   number is never a dead end. */
const HealthSnapshot = () => {
  const {
    drawerClass,
    openFilter,
    attendanceThreshold,
    gradeThreshold,
  } = useClasses();

  if (!drawerClass) return null;

  const tiles = [
    {
      key: "attendance",
      icon: ClipboardCheck,
      value: `${drawerClass.attendance}%`,
      label: "Average attendance",
      note: `${drawerClass.belowAttendance} below ${attendanceThreshold}%`,
      tone: drawerClass.attendance >= attendanceThreshold ? "good" : "warn",
    },
    {
      key: "grade",
      icon: GraduationCap,
      value: `${drawerClass.averageGrade}%`,
      label: "Average grade",
      note: `${drawerClass.belowGrade} below ${gradeThreshold}%`,
      tone: drawerClass.averageGrade >= gradeThreshold ? "good" : "warn",
    },
    {
      key: "risk",
      icon: TriangleAlert,
      value: drawerClass.belowAttendance + drawerClass.belowGrade,
      label: "Below threshold",
      note: "Attendance or grade",
      tone: drawerClass.belowAttendance + drawerClass.belowGrade > 0 ? "warn" : "good",
    },
  ];

  return (
    <section className="drawer-block">
      <h3>Health snapshot</h3>
      <div className="health-grid">
        {tiles.map((tile) => (
          <button
            key={tile.key}
            type="button"
            className={`health-tile health-tile--${tile.tone}`}
            onClick={() =>
              openFilter(tile.key === "risk" ? "attendance" : tile.key)
            }
            title={`Show the students behind ${tile.label.toLowerCase()}`}>
            <span className="health-icon">
              <tile.icon />
            </span>
            <strong className="health-value">{tile.value}</strong>
            <span className="health-label">{tile.label}</span>
            <span className="cell-sub">{tile.note}</span>
          </button>
        ))}
      </div>
    </section>
  );
};

export default HealthSnapshot;
