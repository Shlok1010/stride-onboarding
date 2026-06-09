import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, Sparkles, ChevronRight, UserPlus, Mail } from 'lucide-react';
import { employees } from '../data/employees';
import { pulseData } from '../data/pulseData';
import { teamMembers } from '../data/teamMembers';
import { tasks } from '../data/tasks';
import { streamAI } from '../lib/ai';
import Avatar from '../components/shared/Avatar';
import ProgressRing from '../components/shared/ProgressRing';
import PulseCurve from '../components/shared/PulseCurve';
import { PhaseBadge } from '../components/shared/Badge';
import Toast from '../components/shared/Toast';

const MANAGER = 'Linda Holt';
const managerReports = employees.filter(e => e.manager === MANAGER);

function getPulseHistory(id) {
  return pulseData.filter(p => p.employeeId === id).sort((a, b) => a.week - b.week).map(p => p.avgScore);
}

function getConnectionNames(emp) {
  const data = (emp.connectionsCount > 0)
    ? ['Linda Holt', 'Tom Vasquez', 'Ray Morales', 'Sofia Reyes']
    : [];
  return data.slice(0, emp.connectionsCount);
}

export default function ManagerView() {
  const navigate = useNavigate();
  const [aiPanels, setAiPanels] = useState({});
  const [streamingFor, setStreamingFor] = useState(null);
  const [toast, setToast] = useState(null);

  const generateTalkingPoints = async (emp) => {
    if (streamingFor) return;
    setAiPanels(prev => ({ ...prev, [emp.id]: '' }));
    setStreamingFor(emp.id);
    const pulseDesc = emp.currentPulse ? `${emp.currentPulse}/10` : 'No pulse data yet';
    await streamAI({
      systemPrompt: 'You are an HR advisor helping a manager prepare for a check-in with a new hire. Be warm, specific, and actionable. Output as a numbered list of 4–5 talking points.',
      userMessage: `New hire: ${emp.name}, ${emp.role}, Day ${emp.daysIn}. Pulse score: ${pulseDesc}. Task completion: ${emp.completionPct}% vs average. Connections: ${emp.connectionsCount}. Manager: ${MANAGER}. Generate 4–5 talking points for a manager check-in. Focus on building connection and clarifying role expectations.`,
      onToken: (t) => setAiPanels(prev => ({ ...prev, [emp.id]: (prev[emp.id] || '') + t })),
      onDone: () => setStreamingFor(null),
    });
  };

  const managerTasks = tasks.filter(t => t.assignedTo === 'manager').slice(0, 6);

  return (
    <div className="p-6 max-w-[1200px] space-y-6">
      {toast && <Toast message={toast.message} type={toast.type} onDismiss={() => setToast(null)} />}

      {/* Header */}
      <div className="bg-gradient-to-r from-manager-light to-white rounded-2xl p-6 border border-manager-mid/20">
        <p className="text-xs font-medium text-gray-400 uppercase tracking-widest mb-1">Manager View</p>
        <h1 className="text-2xl font-semibold text-brand-navy">{MANAGER}</h1>
        <p className="text-sm text-gray-500 mt-1">Operations Director · {managerReports.length} active reports in onboarding</p>
      </div>

      {/* Pulse Alerts */}
      {managerReports.filter(e => e.currentPulse && e.currentPulse < 7 || e.pulseTrend === 'down').length > 0 && (
        <div className="space-y-2">
          {managerReports.filter(e => (e.currentPulse && e.currentPulse < 7) || e.pulseTrend === 'down').map(e => (
            <div key={e.id} className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-center gap-3">
              <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0" />
              <p className="text-sm text-amber-800 flex-1">
                <strong>{e.name}</strong> pulse score {e.pulseTrend === 'flat' ? 'flat' : 'declining'} ({e.currentPulse}/10 avg).
                {e.pulseTrend === 'flat' ? ' Consider checking in on role clarity.' : ' May need immediate check-in.'}
              </p>
              <button
                onClick={() => generateTalkingPoints(e)}
                className="text-xs bg-amber-100 hover:bg-amber-200 text-amber-800 px-3 py-1.5 rounded-lg font-medium transition-colors flex items-center gap-1.5 flex-shrink-0"
              >
                <Sparkles className="w-3 h-3" /> AI Suggest
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Report Cards */}
      <div>
        <p className="text-xs font-medium text-gray-400 uppercase tracking-widest mb-3">Direct Reports in Onboarding</p>
        <div className="space-y-4">
          {managerReports.map(emp => {
            const pulseHistory = getPulseHistory(emp.id);
            const avgPulse = pulseHistory.length ? (pulseHistory.reduce((a, b) => a + b, 0) / pulseHistory.length).toFixed(1) : '—';

            return (
              <div key={emp.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                <div className="flex items-start gap-4">
                  {/* Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <Avatar initials={emp.initials} color={emp.avatarColor} />
                      <div>
                        <p className="text-sm font-semibold text-brand-navy">{emp.name}</p>
                        <p className="text-xs text-gray-400">{emp.role} · Day {emp.daysIn}</p>
                      </div>
                      <PhaseBadge phase={emp.phase} />
                    </div>

                    <div className="grid grid-cols-4 gap-3 mb-4">
                      <Metric label="Completion" value={`${emp.completionPct}%`} />
                      <Metric label="Pulse Avg" value={emp.currentPulse ? `${emp.currentPulse}/10` : '—'} />
                      <Metric label="Connections" value={emp.connectionsCount} />
                      <Metric label="Velocity" value={`${emp.velocityScore}%`} color={emp.velocityScore >= 100 ? 'text-green-600' : 'text-amber-600'} />
                    </div>

                    {pulseHistory.length > 1 && (
                      <div className="flex items-center gap-2 mb-4">
                        <span className="text-xs text-gray-400">Pulse trend:</span>
                        <PulseCurve data={pulseHistory} width={120} height={24} color={emp.riskScore === 3 ? '#F87171' : '#1D9E75'} />
                      </div>
                    )}

                    <div className="flex gap-2">
                      <button
                        onClick={() => generateTalkingPoints(emp)}
                        disabled={streamingFor === emp.id}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-manager-light hover:bg-manager-mid hover:text-white text-manager-dark text-xs font-medium rounded-lg transition-colors border border-manager-mid/20 disabled:opacity-60"
                      >
                        <Sparkles className="w-3 h-3" /> Generate Talking Points
                      </button>
                      <button
                        onClick={() => navigate(`/hire/${emp.id}`)}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 hover:bg-gray-100 text-gray-600 text-xs font-medium rounded-lg transition-colors"
                      >
                        View Full Journey <ChevronRight className="w-3 h-3" />
                      </button>
                    </div>

                    {aiPanels[emp.id] !== undefined && (
                      <div className="mt-4 bg-manager-light border border-manager-mid/20 rounded-xl p-4">
                        <p className="text-xs font-medium text-gray-400 uppercase tracking-widest mb-2">AI Check-In Talking Points</p>
                        <div className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
                          {aiPanels[emp.id]}
                          {streamingFor === emp.id && <span className="inline-block w-1.5 h-4 bg-indigo-400 ml-0.5 animate-blink" />}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Progress Ring */}
                  <ProgressRing percentage={emp.completionPct} size={64} strokeWidth={6} color={emp.riskScore === 3 ? '#F87171' : '#7077A1'} />
                </div>

                {/* Connection Recommendations */}
                <div className="mt-4 pt-4 border-t border-gray-50">
                  <p className="text-xs font-medium text-gray-400 uppercase tracking-widest mb-3">Who should {emp.name.split(' ')[0]} meet next?</p>
                  <div className="grid grid-cols-3 gap-3">
                    {getRecommendedConnections(emp).map(rec => (
                      <div key={rec.person} className="bg-gray-50 rounded-xl p-3">
                        <div className="flex items-center gap-2 mb-1">
                          <Avatar initials={rec.initials} color={rec.color} size="sm" />
                          <div>
                            <p className="text-xs font-medium text-brand-navy">{rec.person}</p>
                            <p className="text-[10px] text-gray-400">{rec.role}</p>
                          </div>
                        </div>
                        <p className="text-[10px] text-gray-500 italic mb-2">"{rec.reason}"</p>
                        <button
                          onClick={() => setToast({ message: `Email drafted — connecting ${emp.name.split(' ')[0]} and ${rec.person}!`, type: 'success' })}
                          className="w-full text-[10px] bg-white border border-gray-200 hover:bg-manager-light text-gray-600 py-1 rounded-lg transition-colors flex items-center justify-center gap-1"
                        >
                          <Mail className="w-2.5 h-2.5" /> Schedule Intro
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Manager Tasks */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <p className="text-xs font-medium text-gray-400 uppercase tracking-widest mb-4">Your Onboarding Tasks</p>
        <div className="space-y-2">
          {managerTasks.map(t => (
            <div key={t.id} className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 hover:bg-gray-50 transition-colors">
              <div className="w-2 h-2 rounded-full bg-manager-mid flex-shrink-0" />
              <p className="text-sm text-gray-700 flex-1">{t.title}</p>
              <span className="text-xs text-gray-400 bg-gray-50 px-2 py-0.5 rounded capitalize">{t.category}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Metric({ label, value, color = 'text-brand-navy' }) {
  return (
    <div className="bg-gray-50 rounded-xl p-3 text-center">
      <p className={`text-lg font-semibold ${color}`}>{value}</p>
      <p className="text-[10px] text-gray-400">{label}</p>
    </div>
  );
}

function getRecommendedConnections(emp) {
  const recs = [
    { person: 'Sandra Okafor', role: 'HR Director', initials: 'SO', color: 'purple', reason: `${emp.name.split(' ')[0]} will work closely with HR on staffing decisions. Early intro sets the tone.` },
    { person: 'Derek Park', role: 'IT Manager', initials: 'DP', color: 'blue', reason: 'IT partnership is critical in the first 30 days for system access and troubleshooting.' },
    { person: 'Chris Lim', role: 'Financial Controller', initials: 'CL', color: 'green', reason: 'Cross-functional budget awareness is key for any ops or production role.' },
    { person: 'Ray Morales', role: 'Operations Lead', initials: 'RM', color: 'amber', reason: "Day-to-day floor coordination will happen through Ray's team." },
    { person: 'Maria Gonzalez', role: 'Safety Manager', initials: 'MG', color: 'amber', reason: 'Safety program alignment from the start prevents incidents and builds trust.' },
    { person: 'Janelle Brooks', role: 'Logistics Manager', initials: 'JB', color: 'rose', reason: 'Materials flow and production scheduling require close logistics coordination.' },
  ].filter(r => r.person !== emp.manager && r.person !== emp.buddy);
  return recs.slice(0, 3);
}
