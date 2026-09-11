import { RefreshCw } from "lucide-react";
import { useState } from "react";

import { activities } from "@/assets/data/stats";
import { Card, IconButton, useToast } from "@/components/ui";

const ActivityFeed = () => {
  const { toast } = useToast();
  const [isSpinning, setIsSpinning] = useState(false);

  async function handleRefresh() {
    if (isSpinning) return;
    setIsSpinning(true);
    try {
      toast.success("Activity feed refreshed");
    } catch (error) {
      console.error("Failed to refresh activity feed:", error);
    } finally {
      setTimeout(() => setIsSpinning(false), 600);
    }
  }

  return (
    <Card
      className="activity-card"
      title="Recent activity"
      actions={
        <IconButton
          ghost
          icon={RefreshCw}
          iconClassName={isSpinning ? "btn-spin" : ""}
          title="Refresh"
          id="refreshActivityBtn"
          label="Refresh"
          onClick={handleRefresh}
        />
      }>
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
    </Card>
  );
};

export default ActivityFeed;
