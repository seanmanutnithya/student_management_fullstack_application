import { useEffect } from "react";

import { animateSummaryCounters } from "@/animation/teachersPageAnimation";
import { summaryCards } from "@/assets/data/attendanceSeed";
import { useAttendance } from "@/context/AttendanceContext";

const SummaryStrip = () => {
  const { summary } = useAttendance();

  // gsap writes the counter text, so re-run it whenever the totals change.
  useEffect(() => {
    animateSummaryCounters();
  }, [summary]);

  return (
    <section className="attendance-summary">
      {summaryCards.map(({ key, icon: Icon, colorClass, label }) => (
        <div className="summary-card" key={key}>
          <div className={`stat-icon stat-icon--${colorClass}`}>
            <Icon />
          </div>
          <div>
            <span className="summary-value" data-count={summary[key]}>
              0
            </span>
            <span className="summary-label">{label}</span>
          </div>
        </div>
      ))}
    </section>
  );
};

export default SummaryStrip;
