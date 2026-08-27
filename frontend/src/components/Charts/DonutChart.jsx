import { useEffect } from "react";
import renderDonutChart from "./JS/renderDonutChart";
import { pageLoadAnimation } from "../../animation/pageLoadAnimation";
const DonutChart = () => {
  useEffect(() => {
    pageLoadAnimation(() => renderDonutChart());
  }, []);
  return (
    <div className="card chart-card chart-card--donut">
      <div className="card-head">
        <h2 className="card-title">Class-wise distribution</h2>
      </div>
      <div className="donut-wrap">
        <svg
          viewBox="0 0 160 160"
          className="donut-chart"
          id="donutChart"></svg>
        <div className="donut-center">
          <span className="donut-center-value">1,248</span>
          <span className="donut-center-label">Students</span>
        </div>
      </div>
      <ul className="donut-legend" id="donutLegend"></ul>
    </div>
  );
};

export default DonutChart;
