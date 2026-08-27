import { useEffect } from "react";
import renderLineChart from "./JS/renderLineChart";
import { Calendar, ChevronDown } from "lucide-react";
import { pageLoadAnimation } from "../../animation/pageLoadAnimation";
const LineChart = () => {
  useEffect(() => {
    pageLoadAnimation(() => renderLineChart());
  });
  return (
    <div className="card chart-card">
      <div className="card-head">
        <h2 className="card-title">Enrollment &amp; attendance trend</h2>
        <button className="select-field select-field--sm">
          <Calendar />
          <span>Last 6 months</span>
          <ChevronDown />
        </button>
      </div>
      <div className="line-chart-wrap">
        <svg
          viewBox="0 0 560 220"
          className="line-chart"
          id="lineChart"
          preserveAspectRatio="none">
          <defs>
            <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="0%"
                stopColor="var(--color-primary)"
                stopOpacity="0.25"></stop>
              <stop
                offset="100%"
                stopColor="var(--color-primary)"
                stopOpacity="0"></stop>
            </linearGradient>
          </defs>
          <g className="grid-lines" id="gridLines"></g>
          <path
            id="areaPath"
            className="area-path"
            fill="url(#areaGradient)"></path>
          <path id="linePath" className="line-path" fill="none"></path>
          <g id="dotsGroup"></g>
        </svg>
        <div className="line-chart-labels" id="lineChartLabels"></div>
      </div>
      <div className="chart-legend">
        <span>
          <i className="legend-dot legend-dot--primary"></i>
          Enrollment
        </span>
      </div>
    </div>
  );
};

export default LineChart;
