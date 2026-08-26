export function computeLineGeometry(
  data,
  { width, height, padX, padTop, padBottom },
) {
  const max = Math.max(...data.map((d) => d.value));
  const min = Math.min(...data.map((d) => d.value));
  const range = max - min || 1;
  const stepX = (width - padX * 2) / (data.length - 1);

  console.log(stepX);
  console.log(padX);
  const points = data.map((d, i) => ({
    x: padX + i * stepX,
    y: padTop + (height - padTop - padBottom) * (1 - (d.value - min) / range),
  }));

  const linePath = points
    .map((p, i) => (i === 0 ? `M${p.x},${p.y}` : `L${p.x},${p.y}`))
    .join(" ");

  const areaPath = `${linePath} L${points.at(-1).x},${height - padBottom} L${points[0].x},${height - padBottom} Z`;

  console.log(points);
  return { points, linePath, areaPath };
}
