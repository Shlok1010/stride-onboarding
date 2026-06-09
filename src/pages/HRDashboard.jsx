import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, TrendingUp, TrendingDown, Minus, Users, CheckCircle2, ChevronRight, Sparkles } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { employees } from '../data/employees';
import { pulseData } from '../data/pulseData';
import Avatar from '../components/shared/Avatar';
import ProgressRing from '../components/shared/ProgressRing';
import PulseCurve from '../components/shared/PulseCurve';
import { PhaseBadge } from '../components/shared/Badge';
import { streamAI } from '../lib/ai';

// --- Helpers ---
function getPulseHistory(id) {
  return pulseData.filter(p => p.employeeId === id).sort((a, b) => a.week - b.week).map(p => p.avgScore);
}

function getDeptData() {
  const map = {};
  employees.forEach(e => {
    if (!map[e.department]) map[e.department] = [];
    map[e.department].push(e.completionPct);
  });
  return Object.entries(map)
    .map(([dept, vals]) => ({ dept, avg: Math.round(vals.reduce((a, b) => a + b, 0) / vals.length) }))
    .sort((a, b) => b.avg - a.avg);
}

const PHASE_WEEKS = { preboarding: 0, day1: 0, first30: 4, days31to60: 8, days61to90: 12, complete: 13 };

function getSentimentCell(empId, week) {
  const entry = pulseData.find(p => p.employeeId === empId && p.week === week);
  if (!entry) return null;
  return entry.avgScore;
}

const HEATMAP_COLOR = (score) => {
  if (score === null) return 'bg-gray-100';
  if (score >= 9) return 'bg-green-500';
  if (score >= 7) return 'bg-green-300';
  if (score >= 5) return 'bg-amber-300';
  return 'bg-red-400';
};

// --- Component ---
export default function HRDashboard() {
  const navigate = useNavigate();
  const [aiPanel, setAiPanel] = useState('');
  const [aiStreaming, setAiStreaming] = useState(false);
  const deptData = getDeptData();
  const atRisk = employees.find(e => e.riskScore === 3);
  const active = employees.filter(e => e.phase !== 'complete' && e.phase !== 'preboarding').length;
  const completing = employees.filter(e => ['days61to90'].includes(e.phase)).length;
  const avgCompletion = Math.round(employees.reduce((a, e) => a + e.completionPct, 0) / employees.length);

  const generateTalkingPoints = async () => {
    if (aiStreaming) return;
    setAiPanel('');
    setAiStreaming(true);
    await streamAI({
      systemPrompt: 'You are an HR advisor helping a manager prepare for a check-in with a struggling new hire. Be warm, specific, and actionable. Output as a numbered list of 4–5 talking points.',
      userMessage: `New hire: Derek Thompson, Warehouse Associate, Day 6. Pulse score: 5/10 (connected: 4, clarity: 6, supported: 5). Task completion: 31% vs 58% average for his role. Only 1 connection logged. Manager: Ray Morales. Generate 4–5 talking points for Ray's check-in with Derek this week. Focus on connection, clarity of role, and making Derek feel supported.`,
      onToken: (t) => setAiPanel(prev => prev + t),
      onDone: () => setAiStreaming(false),
    });
  };

  return (
    <div className="p-6 space-y-6 max-w-[1280px]">
      <div>
        <h1 className="text-2xl font-semibold text-brand-navy">HR Dashboard</h1>
        <p className="text-sm text-gray-400 mt-0.5">Acme Manufacturing Co. · June 9, 2026</p>
      </div>

      {/* KPI Strip */}
      <div className="grid grid-cols-4 gap-4">
        <StatCard label="Active Onboardings" value={7} subtitle="Across 6 departments" color="text-hr-dark" />
        <StatCard label="Completing This Week" value={completing} subtitle="Days 61–90 phase" color="text-green-600" />
        <StatCard label="At-Risk Hires" value={1} subtitle="Derek Thompson · Day 6" color="text-red-500" />
        <StatCard label="Avg. Completion" value={`${avgCompletion}%`} subtitle="Across all active hires" color="text-amber-600" />
      </div>

      {/* At-Risk Alert */}
      {atRisk && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-5">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0 mt-0.5">
              <AlertTriangle className="w-5 h-5 text-red-500" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div>
                  <p className="text-sm font-semibold text-red-800">{atRisk.name} — {atRisk.role} — Day {atRisk.daysIn}</p>
                  <div className="flex items-center gap-4 mt-1 flex-wrap">
                    <span className="text-xs text-red-600">Pulse score: <strong>5/10</strong> (below threshold)</span>
                    <span className="text-xs text-red-600">Task completion: <strong>31%</strong> (vs 58% avg)</span>
                    <span className="text-xs text-red-600">Connections: <strong>1</strong></span>
                  </div>
                  <p className="text-xs text-red-500 mt-1">Risk factors: low sentiment · slow progress · low social connections</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => navigate(`/hire/${atRisk.id}`)}
                    className="px-3 py-1.5 text-xs font-medium bg-white border border-red-200 text-red-700 rounded-lg hover:bg-red-50 transition-colors"
                  >
                    View Profile
                  </button>
                  <button
                    onClick={generateTalkingPoints}
                    disabled={aiStreaming}
                    className="px-3 py-1.5 text-xs font-medium bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-60 transition-colors flex items-center gap-1.5"
                  >
                    <Sparkles className="w-3 h-3" />
                    AI Talking Points for Manager
                  </button>
                </div>
              </div>

              {(aiPanel || aiStreaming) && (
                <div className="mt-4 bg-white border border-red-100 rounded-xl p-4">
                  <p className="text-xs font-medium text-gray-400 uppercase tracking-widest mb-2">AI Talking Points for Ray Morales</p>
                  <div className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
                    {aiPanel}
                    {aiStreaming && <span className="inline-block w-1.5 h-4 bg-indigo-400 ml-0.5 animate-blink" />}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Hire Cards */}
      <div>
        <h2 className="text-xs font-medium text-gray-400 uppercase tracking-widest mb-3">Active New Hires</h2>
        <div className="grid grid-cols-2 gap-4">
          {employees.map(e => (
            <HireCard key={e.id} employee={e} pulseHistory={getPulseHistory(e.id)} onView={() => navigate(`/hire/${e.id}`)} />
          ))}
        </div>
      </div>

      {/* Sentiment Heatmap */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <h2 className="text-xs font-medium text-gray-400 uppercase tracking-widest mb-4">Pulse Score Heatmap</h2>
        <div className="overflow-x-auto">
          <table className="text-xs w-full">
            <thead>
              <tr>
                <th className="text-left text-gray-400 font-normal pr-4 pb-2 w-32">Employee</th>
                {[1,2,3,4,5,6,7,8].map(w => (
                  <th key={w} className="text-center text-gray-400 font-normal px-2 pb-2 w-10">Wk {w}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {employees.map(e => (
                <tr key={e.id}>
                  <td className="pr-4 py-1 text-gray-600 font-medium truncate max-w-[120px]">{e.name.split(' ')[0]}</td>
                  {[1,2,3,4,5,6,7,8].map(w => {
                    const score = getSentimentCell(e.id, w);
                    return (
                      <td key={w} className="px-2 py-1 text-center">
                        <div
                          className={`w-8 h-7 rounded mx-auto flex items-center justify-center text-white text-[10px] font-semibold ${HEATMAP_COLOR(score)}`}
                          title={score ? `Week ${w}: ${score}` : 'No data'}
                        >
                          {score ? score.toFixed(1) : '—'}
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex items-center gap-3 mt-3">
            {[['At Risk','bg-red-400'],['Needs Attention','bg-amber-300'],['Good','bg-green-300'],['Thriving','bg-green-500']].map(([l,c]) => (
              <div key={l} className="flex items-center gap-1.5">
                <div className={`w-3 h-3 rounded ${c}`} />
                <span className="text-xs text-gray-400">{l}</span>
              </div>
            ))}
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded bg-gray-100" />
              <span className="text-xs text-gray-400">No data</span>
            </div>
          </div>
        </div>
      </div>

      {/* Dept Chart */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <h2 className="text-xs font-medium text-gray-400 uppercase tracking-widest mb-4">Completion by Department</h2>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={deptData} layout="vertical" margin={{ left: 16, right: 24, top: 4, bottom: 4 }}>
            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#F3F4F6" />
            <XAxis type="number" domain={[0, 100]} tickFormatter={v => `${v}%`} tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
            <YAxis type="category" dataKey="dept" tick={{ fontSize: 12, fill: '#374151' }} axisLine={false} tickLine={false} width={110} />
            <Tooltip formatter={(v) => [`${v}%`, 'Avg Completion']} contentStyle={{ borderRadius: 12, border: '1px solid #E5E7EB', fontSize: 12 }} />
            <Bar dataKey="avg" radius={[0, 6, 6, 0]} maxBarSize={22}>
              {deptData.map((_, i) => (
                <Cell key={i} fill={i === 0 ? '#1D9E75' : i === deptData.length - 1 ? '#F87171' : '#378ADD'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function StatCard({ label, value, subtitle, color }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
      <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-1">{label}</p>
      <p className={`text-3xl font-semibold ${color}`}>{value}</p>
      <p className="text-xs text-gray-400 mt-1">{subtitle}</p>
    </div>
  );
}

function TrendIcon({ trend }) {
  if (trend === 'up') return <TrendingUp className="w-3.5 h-3.5 text-green-500" />;
  if (trend === 'down') return <TrendingDown className="w-3.5 h-3.5 text-red-400" />;
  return <Minus className="w-3.5 h-3.5 text-gray-400" />;
}

function HireCard({ employee: e, pulseHistory, onView }) {
  const isAtRisk = e.riskScore === 3;
  const isComplete = e.phase === 'complete';

  return (
    <div className={`bg-white rounded-2xl border shadow-sm p-5 transition-all hover:shadow-md ${isAtRisk ? 'border-l-4 border-l-red-400 border-gray-100' : 'border-gray-100'} ${isComplete ? 'opacity-70' : ''}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <Avatar initials={e.initials} color={e.avatarColor} />
          <div>
            <p className="text-sm font-semibold text-brand-navy">{e.name}</p>
            <p className="text-xs text-gray-400">{e.role} · Day {e.daysIn}</p>
          </div>
        </div>
        <PhaseBadge phase={e.phase} />
      </div>

      <div className="flex items-center gap-4 mt-4">
        <ProgressRing percentage={e.completionPct} size={52} strokeWidth={5} />
        <div className="flex-1 space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-500">Pulse</span>
            <span className="flex items-center gap-1 font-medium text-brand-navy">
              {e.currentPulse !== null ? `${e.currentPulse}/10` : '—'}
              <TrendIcon trend={e.pulseTrend} />
            </span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-500">Connections</span>
            <span className="font-medium text-brand-navy">{e.connectionsCount}</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-500">Velocity</span>
            <span className={`font-medium ${e.velocityScore >= 100 ? 'text-green-600' : 'text-amber-600'}`}>{e.velocityScore}% vs avg</span>
          </div>
          {pulseHistory.length > 1 && (
            <PulseCurve data={pulseHistory} width={100} height={20} color={e.riskScore === 3 ? '#F87171' : '#1D9E75'} />
          )}
        </div>
      </div>

      <div className="flex gap-2 mt-4">
        <button onClick={onView} className="flex-1 text-xs font-medium bg-gray-50 hover:bg-gray-100 text-gray-700 py-2 rounded-lg transition-colors flex items-center justify-center gap-1">
          View Profile <ChevronRight className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
}
