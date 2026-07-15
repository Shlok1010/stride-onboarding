import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, Legend, ScatterChart, Scatter, ZAxis, ReferenceLine, Cell,
} from 'recharts';
import { employees } from '../data/employees';
import { pulseData } from '../data/pulseData';

const HIRE_COLORS = {
  'EMP-001': '#2563EB', 'EMP-002': '#9333EA', 'EMP-003': '#F87171',
  'EMP-004': '#059669', 'EMP-005': '#EA580C', 'EMP-006': '#DB2777',
  'EMP-007': '#0D9488', 'EMP-008': '#64748B',
};

function getPulseLineData() {
  const weeks = [1,2,3,4,5,6,7,8];
  return weeks.map(w => {
    const row = { week: `Week ${w}` };
    employees.filter(e => e.phase !== 'preboarding').forEach(e => {
      const entry = pulseData.find(p => p.employeeId === e.id && p.week === w);
      if (entry) row[e.name.split(' ')[0]] = entry.avgScore;
    });
    return row;
  });
}

function getVelocityData() {
  const expectedPct = (daysIn) => Math.min(Math.round((daysIn / 90) * 100), 100);
  return employees.map(e => ({
    name: e.name.split(' ')[0],
    actual: e.completionPct,
    expected: expectedPct(e.daysIn),
    diff: e.completionPct - expectedPct(e.daysIn),
  }));
}

function getTimeToProductivity() {
  return [
    { role: 'Financial Analyst', days: 49 },
    { role: 'HR Generalist', days: 55 },
    { role: 'QC Analyst', days: 58 },
    { role: 'Supply Chain Coord.', days: 65 },
    { role: 'Safety Coordinator', days: 68 },
    { role: 'Production Supervisor', days: 72 },
    { role: 'Maintenance Tech', days: 75 },
    { role: 'Warehouse Associate', days: 82 },
  ];
}

function getScatterData() {
  return employees.filter(e => e.currentPulse !== null).map(e => ({
    name: e.name.split(' ')[0],
    x: e.completionPct,
    y: e.currentPulse,
    z: Math.max(e.daysIn, 5),
    id: e.id,
  }));
}

const CUSTOM_DOT = (props) => {
  const { cx, cy, payload } = props;
  const isAtRisk = payload.id === 'EMP-003';
  return (
    <g>
      <circle cx={cx} cy={cy} r={payload.z / 4 + 6} fill={HIRE_COLORS[payload.id] || '#059669'} fillOpacity={0.7} stroke={isAtRisk ? '#EF4444' : 'white'} strokeWidth={isAtRisk ? 2 : 1} />
      <text x={cx} y={cy - 12} textAnchor="middle" fontSize={10} fill="#374151">{payload.name}</text>
    </g>
  );
};

export default function Analytics() {
  const pulseLines = getPulseLineData();
  const velocityData = getVelocityData();
  const productivityData = getTimeToProductivity();
  const scatterData = getScatterData();
  const activePulseEmployees = employees.filter(e => pulseData.some(p => p.employeeId === e.id));

  return (
    <div className="p-6 max-w-[1200px] space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">Analytics</h1>
        <p className="text-sm text-gray-400 mt-0.5">Onboarding performance insights · Acme Manufacturing Co.</p>
      </div>

      {/* Velocity */}
      <div className="bg-white rounded-2xl border border-gray-200/70 shadow-card p-5">
        <h2 className="text-xs font-medium text-gray-400 uppercase tracking-widest mb-4">Onboarding Velocity — Actual vs. Expected Completion</h2>
        <p className="text-xs text-gray-400 mb-4">Expected = linear pace (days in role / 90). Actual completion vs. expected. Positive = ahead of pace.</p>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={velocityData} margin={{ left: 0, right: 16, top: 4, bottom: 4 }}>
            <CartesianGrid vertical={false} stroke="#eef2f6" />
            <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#6B7280' }} axisLine={false} tickLine={false} />
            <YAxis tickFormatter={v => `${v}%`} tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
            <Tooltip formatter={(v, n) => [`${v}%`, n === 'actual' ? 'Actual' : 'Expected']} contentStyle={{ borderRadius: 12, border: '1px solid #e5e7eb', fontSize: 12, boxShadow: '0 8px 24px -6px rgb(16 24 40 / 0.12)' }} />
            <Legend formatter={v => v === 'actual' ? 'Actual %' : 'Expected %'} />
            <Bar dataKey="expected" fill="#e5e7eb" radius={[4, 4, 0, 0]} maxBarSize={24} name="expected" isAnimationActive={false} />
            <Bar dataKey="actual" radius={[4, 4, 0, 0]} maxBarSize={24} name="actual" isAnimationActive={false}>
              {velocityData.map((entry, i) => (
                <Cell key={i} fill={entry.diff >= 0 ? '#059669' : '#F87171'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Pulse Trends */}
      <div className="bg-white rounded-2xl border border-gray-200/70 shadow-card p-5">
        <h2 className="text-xs font-medium text-gray-400 uppercase tracking-widest mb-4">Pulse Score Trends Over Time</h2>
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={pulseLines} margin={{ left: 0, right: 16, top: 4, bottom: 4 }}>
            <CartesianGrid stroke="#eef2f6" />
            <XAxis dataKey="week" tick={{ fontSize: 11, fill: '#6B7280' }} axisLine={false} tickLine={false} />
            <YAxis domain={[3, 10]} tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #e5e7eb', fontSize: 12, boxShadow: '0 8px 24px -6px rgb(16 24 40 / 0.12)' }} />
            <Legend />
            {activePulseEmployees.map(e => (
              <Line
                key={e.id}
                type="monotone"
                dataKey={e.name.split(' ')[0]}
                stroke={HIRE_COLORS[e.id]}
                strokeWidth={2}
                dot={{ r: 3, fill: HIRE_COLORS[e.id] }}
                connectNulls={false}
                isAnimationActive={false}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Time to Productivity */}
        <div className="bg-white rounded-2xl border border-gray-200/70 shadow-card p-5">
          <h2 className="text-xs font-medium text-gray-400 uppercase tracking-widest mb-4">Avg. Days to Full Onboarding by Role</h2>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={productivityData} layout="vertical" margin={{ left: 8, right: 24, top: 0, bottom: 0 }}>
              <CartesianGrid horizontal={false} stroke="#eef2f6" />
              <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 10, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="role" tick={{ fontSize: 10, fill: '#374151' }} axisLine={false} tickLine={false} width={130} />
              <Tooltip formatter={(v) => [`${v} days`, 'Avg Duration']} contentStyle={{ borderRadius: 12, border: '1px solid #e5e7eb', fontSize: 12, boxShadow: '0 8px 24px -6px rgb(16 24 40 / 0.12)' }} />
              <Bar dataKey="days" radius={[0, 6, 6, 0]} maxBarSize={18} isAnimationActive={false}>
                {productivityData.map((_, i) => (
                  <Cell key={i} fill={i < 3 ? '#059669' : i > 5 ? '#F87171' : '#2563EB'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* At-Risk Scatter */}
        <div className="bg-white rounded-2xl border border-gray-200/70 shadow-card p-5">
          <h2 className="text-xs font-medium text-gray-400 uppercase tracking-widest mb-1">At-Risk Analysis</h2>
          <p className="text-xs text-gray-400 mb-3">Completion % vs. pulse score. Dot size = days in role.</p>
          <div className="relative">
            <ResponsiveContainer width="100%" height={280}>
              <ScatterChart margin={{ left: 8, right: 24, top: 24, bottom: 24 }}>
                <CartesianGrid stroke="#eef2f6" />
                <XAxis type="number" dataKey="x" domain={[0, 100]} name="Completion" tickFormatter={v => `${v}%`} tick={{ fontSize: 10, fill: '#9CA3AF' }} axisLine={false} tickLine={false} label={{ value: 'Task Completion %', position: 'insideBottom', offset: -16, style: { fontSize: 10, fill: '#9CA3AF' } }} />
                <YAxis type="number" dataKey="y" domain={[1, 10]} name="Pulse" tick={{ fontSize: 10, fill: '#9CA3AF' }} axisLine={false} tickLine={false} label={{ value: 'Pulse Score', angle: -90, position: 'insideLeft', offset: 8, style: { fontSize: 10, fill: '#9CA3AF' } }} />
                <ZAxis type="number" dataKey="z" range={[30, 120]} />
                <Tooltip
                  cursor={{ strokeDasharray: '3 3' }}
                  content={({ active, payload }) => {
                    if (!active || !payload?.length) return null;
                    const d = payload[0].payload;
                    return (
                      <div className="bg-white rounded-xl border border-gray-200/70 shadow-pop p-3 text-xs">
                        <p className="font-semibold text-gray-900">{d.name}</p>
                        <p className="text-gray-500">Completion: {d.x}%</p>
                        <p className="text-gray-500">Pulse: {d.y}/10</p>
                        <p className="text-gray-500">Day {d.z}</p>
                      </div>
                    );
                  }}
                />
                <ReferenceLine x={50} stroke="#f87171" strokeDasharray="4 4" />
                <ReferenceLine y={6} stroke="#f87171" strokeDasharray="4 4" />
                <Scatter data={scatterData} shape={CUSTOM_DOT} isAnimationActive={false} />
              </ScatterChart>
            </ResponsiveContainer>
            {/* Quadrant labels */}
            <div className="absolute top-6 left-12 text-[9px] font-medium text-gray-400 bg-brand-50 rounded px-1.5 py-0.5">Engaged but stuck</div>
            <div className="absolute top-6 right-8 text-[9px] font-medium text-brand-700 bg-brand-50 rounded px-1.5 py-0.5">✦ Thriving</div>
            <div className="absolute bottom-10 left-12 text-[9px] font-medium text-red-500 bg-red-50 rounded px-1.5 py-0.5">⚠ At risk</div>
            <div className="absolute bottom-10 right-8 text-[9px] font-medium text-amber-600 bg-amber-50 rounded px-1.5 py-0.5">Productive but disengaged</div>
          </div>
        </div>
      </div>
    </div>
  );
}
