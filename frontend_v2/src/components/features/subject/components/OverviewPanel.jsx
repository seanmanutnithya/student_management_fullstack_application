import { Clock3, TriangleAlert, UserCheck, UserPlus, Users } from "lucide-react";

import { useStaggerReveal } from "@/animation/reveal";
import { Button } from "@/components/ui";
import { useSubjects } from "@/context/SubjectContext";

/* Teacher coverage + class/period load — the two things a head of
   department checks first, so they share the opening panel. */
const OverviewPanel = ({ activeTab }) => {
  const { selected, mappingRows, setBulkOpen, periodMinutes } = useSubjects();
  const isActive = activeTab === "overview";

  useStaggerReveal(".mapping-row", [isActive, selected?.id], {
    y: 8,
    duration: 0.32,
    stagger: 0.04,
  });

  if (!selected) return null;

  const totalPeriods = selected.periodsPerWeek;
  const totalHours = selected.weeklyHours;

  return (
    <div
      className={`subject-panel${isActive ? " is-active" : ""}`}
      id="panel-overview"
      role="tabpanel"
      aria-labelledby="tab-overview">
      <section className="detail-block">
        <header className="detail-block-head">
          <h3>
            <Users />
            Teacher coverage
          </h3>
        </header>

        <div className="coverage-grid">
          <div className="coverage-card">
            <span className="coverage-role">Primary teacher</span>
            <strong className="coverage-name">
              <UserCheck />
              {selected.primaryTeacher}
            </strong>
            <span className="cell-sub">
              Teaches {selected.classCount} class
              {selected.classCount === 1 ? "" : "es"} · {totalPeriods} periods a
              week
            </span>
          </div>

          <div
            className={`coverage-card${
              selected.substitutes.length === 0 ? " is-uncovered" : ""
            }`}>
            <span className="coverage-role">Substitutes</span>
            {selected.substitutes.length === 0 ?
              <>
                <strong className="coverage-warning">
                  <TriangleAlert />
                  No substitute assigned
                </strong>
                <span className="cell-sub">
                  A single point of failure — if {selected.primaryTeacher} is
                  out, these classes have no cover.
                </span>
              </>
            : <>
                <ul className="substitute-list">
                  {selected.substitutes.map((name) => (
                    <li key={name}>
                      <UserPlus />
                      {name}
                    </li>
                  ))}
                </ul>
                <span className="cell-sub">
                  {selected.substitutes.length} teacher
                  {selected.substitutes.length === 1 ? "" : "s"} can cover this
                  subject
                </span>
              </>
            }
          </div>
        </div>
      </section>

      <section className="detail-block">
        <header className="detail-block-head">
          <h3>
            <Clock3 />
            Class mapping &amp; period load
          </h3>
          <Button size="sm" variant="secondary" onClick={() => setBulkOpen(true)}>
            Assign classes
          </Button>
        </header>

        <div className="table-wrap">
          <table className="table mapping-table">
            <thead>
              <tr>
                <th>Class</th>
                <th>Grade</th>
                <th>Periods / week</th>
                <th>Hours / week</th>
                <th>Pass rate</th>
              </tr>
            </thead>
            <tbody>
              {mappingRows.map((row) => (
                <tr className="mapping-row" key={row.classId}>
                  <td>
                    <span className="student-name">{row.classId}</span>
                  </td>
                  <td>{row.grade}</td>
                  <td>{row.periodsPerWeek}</td>
                  <td>{row.weeklyHours} h</td>
                  <td>{row.passRate === null ? "—" : `${row.passRate}%`}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan={2}>
                  <strong>Total teaching load</strong>
                </td>
                <td>
                  <strong>{totalPeriods}</strong>
                </td>
                <td>
                  <strong>{totalHours} h</strong>
                </td>
                <td className="cell-sub">{periodMinutes} min periods</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </section>
    </div>
  );
};

export default OverviewPanel;
