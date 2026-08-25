const ClassDonutChart = () => {
  return (
    <section className="chart-row">
      <div className="card chart-card">
        <div className="card-head">
          <h2 className="card-title">Enrollment &amp; attendance trend</h2>
          <button className="select-field select-field--sm">
            <i data-lucide="calendar"></i>
            <span>Last 6 months</span>
            <i data-lucide="chevron-down"></i>
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
    </section>
  );
};

export default ClassDonutChart;
