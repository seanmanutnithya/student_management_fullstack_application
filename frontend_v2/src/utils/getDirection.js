// utils/getDirection.js
export function getDirection(trend) {
  if (trend === null || trend === undefined) return null;
  if (trend > 0) return "up";
  if (trend < 0) return "down";
  return "flat";
}
