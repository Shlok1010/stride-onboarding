export default function ProgressRing({ percentage = 0, size = 64, strokeWidth = 6, color = '#1D9E75' }) {
  const r = (size - strokeWidth * 2) / 2;
  const circumference = 2 * Math.PI * r;
  const offset = circumference * (1 - Math.min(percentage, 100) / 100);
  const cx = size / 2;
  const cy = size / 2;

  return (
    <svg width={size} height={size} className="flex-shrink-0">
      <circle cx={cx} cy={cy} r={r} stroke="#E5E7EB" strokeWidth={strokeWidth} fill="none" />
      <circle
        cx={cx}
        cy={cy}
        r={r}
        stroke={color}
        strokeWidth={strokeWidth}
        fill="none"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        transform={`rotate(-90 ${cx} ${cy})`}
        style={{ transition: 'stroke-dashoffset 0.6s ease' }}
      />
      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dominantBaseline="central"
        fontSize={size < 50 ? '10' : '13'}
        fontWeight="600"
        fill="#2D3250"
      >
        {percentage}%
      </text>
    </svg>
  );
}
