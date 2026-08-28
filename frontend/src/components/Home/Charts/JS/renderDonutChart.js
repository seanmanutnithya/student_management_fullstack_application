import { segments } from "./mockData";
import { DONUT_CHART_CONFIG } from "./chartConfig";
import { computeCircleGeometry } from "./computeGeometry";
import gsap from "gsap";
function renderDonutChart() {
  const { radius: r, circleX: cx, circleY: cy } = DONUT_CHART_CONFIG;
  const { total, circumference } = computeCircleGeometry(
    segments,
    DONUT_CHART_CONFIG,
  );
  const svg = document.getElementById("donutChart");
  svg.innerHTML = "";

  let cumulative = 0;
  segments.forEach((seg) => {
    const pct = seg.value / total;
    const dash = pct * circumference;
    const circle = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "circle",
    );
    circle.setAttribute("cx", cx);
    circle.setAttribute("cy", cy);
    circle.setAttribute("r", r);
    circle.setAttribute("fill", "none");
    circle.setAttribute("stroke", seg.color);
    circle.setAttribute("stroke-width", "18");
    circle.setAttribute("stroke-dasharray", `${dash} ${circumference - dash}`);
    circle.setAttribute("stroke-dashoffset", -cumulative);
    circle.style.transformOrigin = `${cx}px ${cy}px`;
    circle.dataset.dash = dash;
    circle.dataset.gap = circumference - dash;
    svg.appendChild(circle);

    if (gsap) {
      gsap.fromTo(
        circle,
        { strokeDasharray: `0 ${circumference}` },
        {
          strokeDasharray: `${dash} ${circumference - dash}`,
          duration: 0.9,
          ease: "power2.out",
          delay: 0.2,
        },
      );
    }
    cumulative += dash;
  });

  document.getElementById("donutLegend").innerHTML = segments
    .map(
      (seg) => `
      <li>
        <span class="legend-swatch" style="background:${seg.color}"></span>
        <span class="legend-name">${seg.name}</span>
        <span class="legend-pct">${Math.round((seg.value / total) * 100)}%</span>
      </li>`,
    )
    .join("");
}

export default renderDonutChart;
