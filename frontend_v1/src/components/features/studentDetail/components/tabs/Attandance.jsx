import React from "react";

const Attandance = ({ activeTab }) => {
  if (activeTab !== "attendance") return null;
  return (
    <div
      className="detail-panel is-active"
      id="panel-attendance"
      role="tabpanel"
      aria-labelledby="tab-attendance"
      data-panel="attendance">
      <div className="attendance-legend">
        <span>
          <i className="legend-dot legend-dot--present"></i>Present
        </span>
        <span>
          <i className="legend-dot legend-dot--late"></i>Late
        </span>
        <span>
          <i className="legend-dot legend-dot--absent"></i>Absent
        </span>
      </div>
      <div className="calendar-grid" id="calendarGrid"></div>
      <div className="attendance-bars" id="attendanceBars"></div>
    </div>
  );
};

export default Attandance;
