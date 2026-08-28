export function computeLineGeometry(
  data,
  { width, height, padX, padTop, padBottom },
) {
  const max = Math.max(...data.map((d) => d.value));
  const min = Math.min(...data.map((d) => d.value));
  const range = max - min || 1;
  const stepX = (width - padX * 2) / (data.length - 1);

  const points = data.map((d, i) => ({
    x: padX + i * stepX,
    y: padTop + (height - padTop - padBottom) * (1 - (d.value - min) / range),
  }));

  const linePath = points
    .map((p, i) => (i === 0 ? `M${p.x},${p.y}` : `L${p.x},${p.y}`))
    .join(" ");

  const areaPath = `${linePath} L${points.at(-1).x},${height - padBottom} L${points[0].x},${height - padBottom} Z`;

  return { points, linePath, areaPath };
}
export function computeCircleGeometry(segments, { radius, circleX, circleY }) {
  const total = segments.reduce((sum, s) => sum + s.value, 0);
  const circumference = 2 * Math.PI * radius;
  return { total, circumference };
}
