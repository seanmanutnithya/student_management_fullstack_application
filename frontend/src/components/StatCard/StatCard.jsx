import { TrendingDown, TrendingUp } from "lucide-react";
import { useEffect } from "react";
import { pageLoadAnimation } from "../../animation/pageLoadAnimation";
import { animateCounters } from "./animateCounter";
import { wireHoverScale } from "../../animation/wireHoverScale";
const StatCard = ({
  Icon,
  colorClass,
  value,
  prefix = "",
  suffix = "",
  label,
  trend,
  trendDirection,
}) => {
  useEffect(() => {
    pageLoadAnimation(() => animateCounters());
    wireHoverScale(".stat-card", 1.015);
  }, []);
  return (
    <div className="stat-card">
      <div className={`stat-icon stat-icon--${colorClass}`}>{<Icon />}</div>
      <div className="stat-card-body">
        <span className="stat-card-value" data-count={value}>
          0
        </span>
        <span className="stat-card-title">{label}</span>
      </div>
      <span className={`trend trend--${trendDirection}`}>
        {trendDirection === "up" ?
          <TrendingUp />
        : <TrendingDown />}
        {trend}
      </span>
    </div>
  );
};

export default StatCard;
