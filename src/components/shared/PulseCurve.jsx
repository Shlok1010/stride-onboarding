export default function PulseCurve({ data = [], width = 80, height = 28, color = '#059669' }) {
  if (!data || data.length < 2) {
    return (
      <svg width={width} height={height}>
        <line x1={0} y1={height / 2} x2={width} y2={height / 2} stroke="#E5E7EB" strokeWidth={2} />
      </svg>
    );
  }

  const min = 1;
  const max = 10;
  const range = max - min;
  const xStep = width / (data.length - 1);
  const points = data.map((v, i) => {
    const x = i * xStep;
    const y = height - ((v - min) / range) * (height - 4) - 2;
    return `${x},${y}`;
  });

  return (
    <svg width={width} height={height} style={{ overflow: 'visible' }}>
      <polyline
        points={points.join(' ')}
        fill="none"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {data.map((v, i) => (
        <circle
          key={i}
          cx={i * xStep}
          cy={height - ((v - min) / range) * (height - 4) - 2}
          r={2.5}
          fill={color}
        />
      ))}
    </svg>
  );
}
