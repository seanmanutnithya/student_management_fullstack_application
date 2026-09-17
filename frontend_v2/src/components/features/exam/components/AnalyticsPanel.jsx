import { useEffect } from "react";
import { TrendingDown, TrendingUp } from "lucide-react";

import { animateBars } from "@/animation/examPageAnimation";
import { useExams } from "@/context/ExamContext";

/* Every bar prints its own number, and pass/fail uses the reserved status
   colours with a label — nothing here reads by colour alone. */
const AnalyticsPanel = ({ activeTab }) => {
  const { analytics, passMark, rows } = useExams();
  const isActive = activeTab === "analytics";

  useEffect(() => {
    if (isActive) animateBars(".analytics-fill");
  }, [isActive, analytics]);

  const maxHistogram = Math.max(1, ...analytics.histogram.map((h) => h.count));

  return (
    <section
      className={`exam-panel${isActive ? " is-active" : ""}`}
      id="panel-analytics"
      role="tabpanel"
      aria-labelledby="tab-analytics">
      <div className="panel-head">
        <div>
          <h2>Result analytics</h2>
          <p>
            Based on {analytics.graded} of {rows.length} students with a
            weighted total. Pass mark is {passMark}%.
          </p>
        </div>
      </div>

      <div className="analytics-grid">
        <div className="analytics-card">
          <h3>Pass / fail</h3>
          <div className="passfail-bar" aria-hidden="true">
            <span
              className="passfail-seg passfail-seg--pass"
              style={{
                width: `${analytics.graded ? (analytics.passed / analytics.graded) * 100 : 0}%`,
              }}
            />
            <span
              className="passfail-seg passfail-seg--fail"
              style={{
                width: `${analytics.graded ? (analytics.failed / analytics.graded) * 100 : 0}%`,
              }}
            />
          </div>
          <ul className="analytics-legend">
            <li>
              <span className="legend-swatch passfail-seg--pass" />
              Passed
              <strong>{analytics.passed}</strong>
              <span className="cell-sub">{analytics.passRate}%</span>
            </li>
            <li>
              <span className="legend-swatch passfail-seg--fail" />
              Failed
              <strong>{analytics.failed}</strong>
              <span className="cell-sub">
                {analytics.graded ?
                  Math.round((analytics.failed / analytics.graded) * 1000) / 10
                : 0}
                %
              </span>
            </li>
          </ul>
        </div>

        <div className="analytics-card">
          <h3>Grade distribution</h3>
          <ul className="histogram">
            {analytics.histogram.map((band) => (
              <li key={band.letter}>
                <span className="histogram-label">{band.letter}</span>
                <span className="histogram-track">
                  <span
                    className={`analytics-fill histogram-fill histogram-fill--${band.tone}`}
                    data-share={(band.count / maxHistogram) * 100}
                    style={{ width: 0 }}
                  />
                </span>
                <span className="histogram-count">{band.count}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="analytics-card analytics-card--wide">
          <h3>Subject averages</h3>
          <ul className="subject-bars">
            {analytics.bySubject.map((subject) => (
              <li key={subject.code}>
                <span className="subject-bar-label">
                  <strong>{subject.code}</strong>
                  <span className="cell-sub">{subject.name}</span>
                </span>
                <span className="subject-bar-track">
                  <span
                    className={`analytics-fill subject-bar-fill${
                      subject.average !== null && subject.average < passMark ?
                        " is-low"
                      : ""
                    }`}
                    data-share={subject.average ?? 0}
                    style={{ width: 0 }}
                  />
                </span>
                <span className="subject-bar-value">
                  {subject.average === null ? "—" : `${subject.average}%`}
                  <span className="cell-sub">
                    {subject.failing} below pass · {subject.entered} marked
                  </span>
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="analytics-card">
          <h3>
            <TrendingUp />
            Top performers
          </h3>
          <ol className="performer-list">
            {analytics.top.map((row) => (
              <li key={row.id}>
                <span>{row.name}</span>
                <strong>{row.weighted}%</strong>
              </li>
            ))}
          </ol>
        </div>

        <div className="analytics-card">
          <h3>
            <TrendingDown />
            Needs support
          </h3>
          <ol className="performer-list performer-list--low">
            {analytics.bottom.map((row) => (
              <li key={row.id}>
                <span>{row.name}</span>
                <strong>{row.weighted}%</strong>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
};

export default AnalyticsPanel;
