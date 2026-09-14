export function formatMoney(amount) {
  return `$${Number(amount || 0).toFixed(2)}`;
}

/* A date-only string ("2026-09-15") parses as UTC midnight, which is the
   *previous* day for anyone west of UTC and turns into the previous day
   again on the way back out through toISOString(). Both helpers below stay
   in local time so a calendar day survives the round trip. */
export function parseDate(value) {
  if (value instanceof Date) return value;
  if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return new Date(`${value}T00:00:00`);
  }
  return new Date(value);
}

export function toIsoDate(value) {
  const d = parseDate(value);
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${month}-${day}`;
}

export function formatDate(value) {
  if (!value) return "—";
  return parseDate(value).toLocaleDateString(undefined, {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}
