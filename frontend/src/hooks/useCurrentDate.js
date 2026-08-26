import { useEffect } from "react";

export function useCurrentDate() {
  useEffect(() => {
  const now = new Date();
  const hour = now.getHours();
  const greeting =
    hour < 12 ? "Good morning"
    : hour < 18 ? "Good afternoon"
    : "Good evening";
  document.getElementById("greetingTitle").textContent =
    `${greeting}, Teacher Name`;

  const dateStr = now.toLocaleDateString(undefined, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const timeStr = now.toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
  });
  document.getElementById("greetingDate").textContent =
    `${dateStr} · ${timeStr} `;
  }, []);
}
