import { memo } from "react";
import { Gauge } from "lucide-react";

import { useStaggerReveal } from "@/animation/reveal";
import { useRoutine } from "@/context/RoutineContext";

const STATE_COPY = { over: "Over", under: "Under", ok: "On target" };

const WorkloadRow = memo(function WorkloadRow({ row, target, max }) {
  return (
    <li className="workload-row">
      <span className="workload-name">
        {row.name}
        <span className="cell-sub">
          {row.periods} periods · {row.delta > 0 ? "+" : ""}
          {row.delta} vs target
        </span>
      </span>

      <span className="workload-track" aria-hidden="true">
        <span
          className={`workload-fill workload-fill--${row.state}`}
          style={{ width: `${Math.min(100, (row.periods / max) * 100)}%` }}
        />
        <span
          className="workload-target"
          style={{ left: `${Math.min(100, (target / max) * 100)}%` }}
        />
      </span>

      <span className={`workload-pill workload-pill--${row.state}`}>
        {STATE_COPY[row.state]}
      </span>
    </li>
  );
});

const WorkloadPanel = () => {
  const { workload, workloadTarget, setWorkloadTarget, tolerance } = useRoutine();

  useStaggerReveal(".workload-row", [workload.length], {
    y: 8,
    duration: 0.32,
    stagger: 0.04,
  });

  const max = Math.max(workloadTarget + tolerance * 2, ...workload.map((w) => w.periods));

  return (
    <section className="routine-aside">
      <header className="aside-head">
        <h3>
          <Gauge />
          Teacher workload
        </h3>
        <label className="workload-target-field">
          <span className="visually-hidden">Weekly period target</span>
          <input
            type="number"
            min="1"
            max="40"
            aria-label="Weekly period target"
            value={workloadTarget}
            onChange={(e) =>
              setWorkloadTarget(
                Math.max(1, Math.min(40, Number(e.target.value) || 1)),
              )
            }
          />
          <span>/ week</span>
        </label>
      </header>

      <p className="cell-sub workload-caption">
        Flagged when more than {tolerance} periods either side of the target.
      </p>

      <ul className="workload-list">
        {workload.map((row) => (
          <WorkloadRow
            key={row.name}
            row={row}
            target={workloadTarget}
            max={max}
          />
        ))}
      </ul>
    </section>
  );
};

export default WorkloadPanel;
