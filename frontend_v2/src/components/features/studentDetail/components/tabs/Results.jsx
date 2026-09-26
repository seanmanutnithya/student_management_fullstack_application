import { useRef } from "react";
import { useGSAP } from "@gsap/react";

import { RESULTS, animateResults } from "../../utils/renderResults";

const ResultsPanel = () => {
  const panelRef = useRef(null);

  useGSAP(animateResults, { scope: panelRef });

  return (
    <div
      className="detail-panel is-active"
      id="panel-results"
      role="tabpanel"
      aria-labelledby="tab-results"
      data-panel="results"
      ref={panelRef}>
      <div className="table-wrap">
        <table className="table results-table">
          <thead>
            <tr>
              <th>Subject</th>
              <th>Term</th>
              <th>Marks</th>
              <th>Grade</th>
              <th className="col-progress">Progress</th>
            </tr>
          </thead>
          <tbody id="resultsBody">
            {RESULTS.map((row) => (
              <tr key={row.subject}>
                <td>{row.subject}</td>
                <td>{row.term}</td>
                <td>{row.marks}</td>
                <td>
                  <span className="grade-pill">{row.grade}</span>
                </td>
                <td className="col-progress">
                  <div
                    className="progress-bar-track"
                    role="progressbar"
                    aria-valuenow={row.pct}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-label={`${row.subject} ${row.pct}%`}>
                    <span
                      className="progress-bar-fill"
                      style={{ width: `${row.pct}%` }}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

/* Hooks can't run after an early return, so the tab check lives in this thin
   wrapper and the panel only mounts while its tab is active. */
const Results = ({ activeTab }) =>
  activeTab === "results" ? <ResultsPanel /> : null;

export default Results;
