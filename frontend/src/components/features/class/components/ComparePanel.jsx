import { useStaggerReveal } from "@/animation/reveal";
import { useClasses } from "@/context/ClassContext";

/* Side-by-side bars per grade: the shortest bar in a row is the section
   that needs attention, and every bar carries its own number. */
const ComparePanel = ({ activeTab }) => {
  const { comparison, attendanceThreshold, gradeThreshold } = useClasses();
  const isActive = activeTab === "compare";

  useStaggerReveal(".compare-row", [isActive], {
    y: 10,
    duration: 0.35,
    stagger: 0.05,
  });

  return (
    <section
      className={`class-panel${isActive ? " is-active" : ""}`}
      id="panel-compare"
      role="tabpanel"
      aria-labelledby="tab-compare">
      {comparison.map((group) => (
        <div className="compare-group" key={group.grade}>
          <header className="compare-head">
            <h3>{group.grade}</h3>
            <span className="cell-sub">
              {group.sections.length} sections · spread{" "}
              {Math.round((group.bestAttendance - group.worstAttendance) * 10) /
                10}
              pts on attendance
            </span>
          </header>

          <div className="compare-table">
            <div className="compare-row compare-row--head">
              <span>Section</span>
              <span>Students</span>
              <span>Attendance</span>
              <span>Average grade</span>
            </div>

            {group.sections.map((section) => {
              const weakestAttendance =
                section.attendance === group.worstAttendance &&
                group.sections.length > 1;
              const weakestGrade =
                section.averageGrade === group.worstGrade && group.sections.length > 1;

              return (
                <div className="compare-row" key={section.id}>
                  <span className="compare-section">
                    <strong>{section.id}</strong>
                    <span className="cell-sub">{section.homeroom}</span>
                  </span>
                  <span>{section.enrolled}</span>

                  <span className="compare-metric">
                    <span className="compare-bar" aria-hidden="true">
                      <span
                        className={`compare-fill${
                          section.attendance < attendanceThreshold ?
                            " is-low"
                          : ""
                        }`}
                        style={{ width: `${section.attendance}%` }}
                      />
                    </span>
                    <span className="compare-value">
                      {section.attendance}%
                      {weakestAttendance && (
                        <span className="compare-flag">lowest</span>
                      )}
                    </span>
                  </span>

                  <span className="compare-metric">
                    <span className="compare-bar" aria-hidden="true">
                      <span
                        className={`compare-fill compare-fill--grade${
                          section.averageGrade < gradeThreshold ? " is-low" : ""
                        }`}
                        style={{ width: `${section.averageGrade}%` }}
                      />
                    </span>
                    <span className="compare-value">
                      {section.averageGrade}%
                      {weakestGrade && (
                        <span className="compare-flag">lowest</span>
                      )}
                    </span>
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </section>
  );
};

export default ComparePanel;
