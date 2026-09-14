import { memo } from "react";

const RADIUS = 34;
const CENTER = 40;
const STROKE = 7;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

/* The ring is a status scale — it always prints the headcount inside, so
   the reading never depends on the colour alone. */
const CapacityRing = memo(function CapacityRing({
  enrolled,
  capacity,
  fill,
  state,
}) {
  const share = Math.min(1, fill);
  const dash = share * CIRCUMFERENCE;

  return (
    <div className={`capacity-ring capacity-ring--${state}`}>
      <svg viewBox="0 0 80 80" aria-hidden="true">
        <circle
          className="ring-track"
          cx={CENTER}
          cy={CENTER}
          r={RADIUS}
          fill="none"
          strokeWidth={STROKE}
        />
        <circle
          className="ring-value"
          data-dash={dash}
          data-circumference={CIRCUMFERENCE}
          cx={CENTER}
          cy={CENTER}
          r={RADIUS}
          fill="none"
          strokeWidth={STROKE}
          strokeLinecap="round"
          strokeDasharray={`${dash} ${CIRCUMFERENCE - dash}`}
        />
      </svg>
      <span className="ring-label">
        <strong>{enrolled}</strong>
        <span>of {capacity}</span>
      </span>
    </div>
  );
});

export default CapacityRing;
