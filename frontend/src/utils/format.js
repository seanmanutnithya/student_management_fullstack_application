export function formatMoney(amount) {
  return `$${Number(amount || 0).toFixed(2)}`;
}

export function formatDate(value) {
  if (!value) return "—";
  return new Date(value).toLocaleDateString(undefined, {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}
