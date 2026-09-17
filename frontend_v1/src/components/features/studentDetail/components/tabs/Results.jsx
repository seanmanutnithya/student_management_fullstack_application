import React from "react";

const Results = ({ activeTab }) => {
  if (activeTab !== "results") return null;
  return (
    <div
      className="detail-panel is-active"
      id="panel-results"
      role="tabpanel"
      aria-labelledby="tab-results"
      data-panel="results">
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
          <tbody id="resultsBody"></tbody>
        </table>
      </div>
    </div>
  );
};

export default Results;
