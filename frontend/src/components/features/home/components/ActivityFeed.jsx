import { RefreshCw } from "lucide-react";
import { useState } from "react";

import { activities } from "@/assets/data/stats";
import { showToast } from "@/hooks/useToast";

const ActivityFeed = () => {
  const [isSpinning, setIsSpinning] = useState(false);

  async function handleRefresh(isSpinning) {
    if (isSpinning) return;
    setIsSpinning(true);
    try {
      showToast("Activity feed refreshed");
    } catch (error) {
      setTimeout(() => setIsSpinning(false), 500);
    }
  }

  return (
    <section className="card activity-card">
      <div className="card-head">
        <h2 className="card-title">Recent activity</h2>
        <button
          className="icon-btn icon-btn--ghost"
          title="Refresh"
          id="refreshActivityBtn"
          onClick={() => handleRefresh(isSpinning)}>
          <RefreshCw className={isSpinning ? "btn-spin" : ""} />
        </button>
      </div>
      <ul className="activity-feed" id="activityFeed">
        {activities.map((a, idx) => (
          <li className="activity-item" key={idx}>
            <div className={`activity-icon activity-icon--${a.type}`}>
              {<a.icon />}
            </div>
            <div>
              <div
                className="activity-text"
                dangerouslySetInnerHTML={{ __html: a.text }}></div>
              <div className="activity-time">{a.time} </div>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default ActivityFeed;
