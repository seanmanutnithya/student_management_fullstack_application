import { TrendingDown, TrendingUp } from "lucide-react";

const RING_CIRCUMFERENCE = 213.6;

const StatCard = ({
  Icon,
  colorClass,
  value,
  prefix = "",
  suffix = "",
  label,
  trend,
  trendDirection,
  ring = false,
}) => {
  const isNumeric = typeof value === "number";

  return (
    <div className="stat-card">
      {ring ?
        <div className="stat-ring-wrap">
          <svg className="stat-ring" viewBox="0 0 80 80">
            <circle className="stat-ring-track" cx="40" cy="40" r="34" />
            <circle
              className="stat-ring-fill"
              cx="40"
              cy="40"
              r="34"
              style={{
                strokeDashoffset:
                  RING_CIRCUMFERENCE * (1 - Math.min(value, 100) / 100),
              }}
            />
          </svg>
          <span className="stat-ring-value">{value}%</span>
        </div>
      : <div className={`stat-icon stat-icon--${colorClass}`}>{<Icon />}</div>
      }
      <div className="stat-card-body">
        {ring ? null
        : isNumeric ?
          <span
            className="stat-card-value"
            data-count={value}
            data-prefix={prefix}
            data-suffix={suffix}>
            0
          </span>
        : <span className="stat-card-value">{value}</span>}
        <span className="stat-card-title">{label}</span>
      </div>
      {trend && (
        <span className={`trend trend--${trendDirection}`}>
          {trendDirection === "up" ?
            <TrendingUp />
          : <TrendingDown />}
          {trend}
        </span>
      )}
    </div>
  );
};

export default StatCard;
