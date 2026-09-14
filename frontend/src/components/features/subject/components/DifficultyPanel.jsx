import { Activity, TriangleAlert } from "lucide-react";

import { useStaggerReveal } from "@/animation/reveal";
import { useSubjects } from "@/context/SubjectContext";

/* Bands are a status scale, not a rainbow: every cell prints its own pass
   rate, so the reading never depends on colour alone. */
const bandOf = (rate, target) => {
  if (rate >= target + 10) return "strong";
  if (rate >= target) return "ok";
  if (rate >= target - 10) return "watch";
  return "critical";
};

const BANDS = [
  { key: "strong", label: "Comfortably above target" },
  { key: "ok", label: "At or above target" },
  { key: "watch", label: "Up to 10 points below" },
  { key: "critical", label: "More than 10 below" },
];

const DifficultyPanel = ({ activeTab }) => {
  const { selected, difficulty, passTarget } = useSubjects();
  const isActive = activeTab === "difficulty";

  useStaggerReveal(".difficulty-cell", [isActive, selected?.id], {
    y: 8,
    duration: 0.32,
    stagger: 0.05,
  });

  if (!selected) return null;

  const { rows, average, verdict, below } = difficulty;

  return (
    <div
      className={`subject-panel${isActive ? " is-active" : ""}`}
      id="panel-difficulty"
      role="tabpanel"
      aria-labelledby="tab-difficulty">
      <section className="detail-block">
        <header className="detail-block-head">
          <h3>
            <Activity />
            Pass rate by class
          </h3>
          <span className="cell-sub">Target {passTarget}%</span>
        </header>

        {rows.length === 0 ?
          <p className="cell-sub">
            No results recorded for {selected.code} yet.
          </p>
        : <>
            <div className="difficulty-grid">
              {rows.map((row) => {
                const band = bandOf(row.passRate, passTarget);
                return (
                  <div
                    className={`difficulty-cell difficulty-cell--${band}`}
                    key={row.classId}
                    title={`${row.classId} — ${row.passRate}% pass rate`}>
                    <span className="difficulty-class">{row.classId}</span>
                    <strong className="difficulty-rate">{row.passRate}%</strong>
                    <span className="difficulty-delta">
                      {row.passRate >= passTarget ? "+" : ""}
                      {Math.round((row.passRate - passTarget) * 10) / 10} vs
                      target
                    </span>
                  </div>
                );
              })}
            </div>

            <ul className="difficulty-legend">
              {BANDS.map((band) => (
                <li key={band.key}>
                  <span
                    className={`legend-swatch difficulty-cell--${band.key}`}
                    aria-hidden="true"
                  />
                  {band.label}
                </li>
              ))}
            </ul>

            <div
              className={`difficulty-verdict${
                below === rows.length ? " is-subject-wide" : ""
              }`}>
              {below > 0 && <TriangleAlert />}
              <span>
                <strong>Average {average}%</strong> across {rows.length} class
                {rows.length === 1 ? "" : "es"}. {verdict}
              </span>
            </div>
          </>
        }
      </section>
    </div>
  );
};

export default DifficultyPanel;
