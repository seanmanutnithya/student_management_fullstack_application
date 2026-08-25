import { activities } from "../assets/assets";
const ActivityFeed = () => {
  return (
    <section className="card activity-card">
      <div className="card-head">
        <h2 className="card-title">Recent activity</h2>
        <button
          className="icon-btn icon-btn--ghost"
          title="Refresh"
          id="refreshActivityBtn">
          <i data-lucide="refresh-cw"></i>
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
