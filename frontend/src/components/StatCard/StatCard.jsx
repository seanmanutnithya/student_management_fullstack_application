import { usePageLoadAnimation } from "@/animation/usePageLoadAnimation";
import { TrendingDown, TrendingUp } from "lucide-react";
import { animateCounters } from "./animateCounter";
import { wireHoverScale } from "@/animation/wireHoverScale";

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
  return (
    <div className="stat-card">
      <div className={`stat-icon stat-icon--${colorClass}`}>{<Icon />}</div>
      <div className="stat-card-body">
        <span
          className="stat-card-value"
          data-count={value}
          data-prefix={prefix}
          data-suffix={suffix}>
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
