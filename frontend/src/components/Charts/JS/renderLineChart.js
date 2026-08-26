import { LINE_CHART_CONFIG } from "./chartConfig";
import { data } from "./mockData";
import { computeLineGeometry } from "./computeLineGeometry";

function renderLineChart() {
  const { points, linePath, areaPath } = computeLineGeometry(
    data,
    LINE_CHART_CONFIG,
  );
  const { width: W, height: H, padX, padTop, padBottom } = LINE_CHART_CONFIG;
  document.getElementById("linePath").setAttribute("d", linePath);
  document.getElementById("areaPath").setAttribute("d", areaPath);

  // Grid lines
  const gridGroup = document.getElementById("gridLines");
  gridGroup.innerHTML = "";
  for (let i = 0; i <= 3; i++) {
    const y = padTop + ((H - padTop - padBottom) / 3) * i;
    const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line.setAttribute("x1", padX);
    line.setAttribute("x2", W - padX);
    line.setAttribute("y1", y);
    line.setAttribute("y2", y);
    line.setAttribute("class", "grid-line");
    gridGroup.appendChild(line);
  }

  // Dots
  const dotsGroup = document.getElementById("dotsGroup");
  dotsGroup.innerHTML = "";
  points.forEach((p) => {
    const circle = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "circle",
    );
    circle.setAttribute("cx", p.x);
    circle.setAttribute("cy", p.y);
    circle.setAttribute("r", 4.5);
    circle.setAttribute("class", "chart-dot");
    dotsGroup.appendChild(circle);
  });

  // Labels
  document.getElementById("lineChartLabels").innerHTML = data
    .map((d) => `<span>${d.label}</span>`)
    .join("");

  // Draw-in animation
  const linePathEl = document.getElementById("linePath");
  const areaPathEl = document.getElementById("areaPath");
  const length = linePathEl.getTotalLength();

  if (window.gsap) {
    gsap.set(linePathEl, { strokeDasharray: length, strokeDashoffset: length });
    gsap.set(areaPathEl, { opacity: 0 });
    gsap.to(linePathEl, {
      strokeDashoffset: 0,
      duration: 1.1,
      ease: "power2.out",
      delay: 0.2,
    });
    gsap.to(areaPathEl, { opacity: 1, duration: 0.8, delay: 0.6 });
    gsap.fromTo(
      dotsGroup.children,
      { opacity: 0, scale: 0 },
      {
        opacity: 1,
        scale: 1,
        duration: 0.3,
        stagger: 0.08,
        ease: "back.out(2)",
        delay: 0.9,
        transformOrigin: "center",
      },
    );
  }
}

export default renderLineChart;
