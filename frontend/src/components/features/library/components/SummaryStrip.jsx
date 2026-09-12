import { useEffect } from "react";

import { librarySummaryCards } from "@/assets/data/libraryAssets";
import { animateSummaryCounters } from "@/animation/teachersPageAnimation";
import { useLibrary } from "@/context/LibraryContext";
import { formatMoney } from "@/utils/format";

const SummaryStrip = () => {
  const { summary, finesOutstanding } = useLibrary();

  // gsap writes the counter text, so re-run it whenever the totals change.
  useEffect(() => {
    animateSummaryCounters();
  }, [summary]);

  return (
    <section className="library-summary">
      {librarySummaryCards.map(({ key, icon: Icon, colorClass, label }) => (
        <div className="summary-card" key={key}>
          <div className={`stat-icon stat-icon--${colorClass}`}>
            <Icon />
          </div>
          <div>
            <span className="summary-value" data-count={summary[key]}>
              0
            </span>
            <span className="summary-label">{label}</span>
            {key === "overdue" && finesOutstanding > 0 && (
              <span className="summary-sub">
                {formatMoney(finesOutstanding)} in fines
              </span>
            )}
          </div>
        </div>
      ))}
    </section>
  );
};

export default SummaryStrip;
