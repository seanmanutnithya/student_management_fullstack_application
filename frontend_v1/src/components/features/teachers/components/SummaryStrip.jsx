import { useEffect } from "react";

import { teacherSummaryCards } from "@/assets/data/stats";
import { animateSummaryCounters } from "@/animation/teachersPageAnimation";
import { useTeachers } from "@/context/TeacherContext";

const SummaryStrip = () => {
  const { summary } = useTeachers();

  // gsap writes the counter text, so re-run it whenever the totals change.
  useEffect(() => {
    animateSummaryCounters();
  }, [summary]);

  return (
    <section className="teacher-summary">
      {teacherSummaryCards.map(({ key, icon: Icon, colorClass, label }) => (
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
