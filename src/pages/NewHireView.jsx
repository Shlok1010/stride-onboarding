import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CheckCircle2, Clock, ChevronRight, Sparkles, Trophy, Star, Users, ArrowLeft } from 'lucide-react';
import { employees, getEmployee } from '../data/employees';
import { tasks, getTasksForHire } from '../data/tasks';
import { pulseData, getPulseForEmployee } from '../data/pulseData';
import { teamMembers } from '../data/teamMembers';
import { connectionsData, getConnectionsForEmployee } from '../data/connections';
import { streamAI } from '../lib/ai';
import ProgressRing from '../components/shared/ProgressRing';
import PulseCurve from '../components/shared/PulseCurve';
import { PhaseBadge, CategoryBadge } from '../components/shared/Badge';
import Avatar from '../components/shared/Avatar';
import Toast from '../components/shared/Toast';

const PHASE_ORDER = ['preboarding', 'day1', 'first30', 'days31to60', 'days61to90', 'complete'];
const PHASE_LABELS = { preboarding: 'Pre-board', day1: 'Day 1', first30: 'First 30', days31to60: 'Days 31–60', days61to90: 'Days 61–90', complete: 'Complete' };
const PHASE_ICONS = { preboarding: '📋', day1: '🚀', first30: '🌱', days31to60: '📈', days61to90: '🏆', complete: '✅' };

function Confetti() {
  const colors = ['#059669', '#34D399', '#2563EB', '#EA580C', '#0D9488'];
  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {Array.from({ length: 16 }).map((_, i) => (
        <div
          key={i}
          className="absolute top-1/3 animate-confetti-fall"
          style={{
            left: `${10 + i * 5.5}%`,
            width: 8, height: 8,
            borderRadius: i % 2 === 0 ? '50%' : '2px',
            background: colors[i % colors.length],
            animationDelay: `${i * 0.05}s`,
            animationDuration: `${0.8 + (i % 3) * 0.2}s`,
          }}
        />
      ))}
    </div>
  );
}

export default function NewHireView() {
  const { employeeId = 'EMP-001' } = useParams();
  const navigate = useNavigate();
  const emp = getEmployee(employeeId) || employees[0];
  const [completedTasks, setCompletedTasks] = useState(new Set());
  const [showConfetti, setShowConfetti] = useState(false);
  const [toast, setToast] = useState(null);
  const [roadmap, setRoadmap] = useState('');
  const [roadmapStreaming, setRoadmapStreaming] = useState(false);
  const [roadmapGenerated, setRoadmapGenerated] = useState(false);
  const [connections, setConnections] = useState(getConnectionsForEmployee(employeeId));
  const [pulseScores, setPulseScores] = useState({ connected: 7, clarity: 7, supported: 7 });
  const [pulseSubmitted, setPulseSubmitted] = useState(false);
  const pulseHistory = getPulseForEmployee(employeeId).map(p => p.avgScore);
  const phaseTasks = PHASE_ORDER.slice(0, -1).flatMap(phase => getTasksForHire(phase));
  const todaysTasks = tasks.filter(t => t.phase === emp.phase && t.assignedTo === 'newhire' && !completedTasks.has(t.id)).slice(0, 3);

  const wins = [
    ...(emp.daysIn >= 1 ? [{ icon: '🎉', label: 'Day 1 Complete!', date: emp.startDate }] : []),
    ...(emp.daysIn >= 1 ? [{ icon: '✅', label: 'I-9 Verified', date: emp.startDate }] : []),
    ...(emp.daysIn >= 1 ? [{ icon: '💻', label: 'IT Setup Done', date: emp.startDate }] : []),
    ...(emp.buddy ? [{ icon: '🤝', label: `Met your buddy ${emp.buddy}`, date: emp.startDate }] : []),
    ...(emp.completionPct >= 50 ? [{ icon: '⭐', label: '50% Onboarding Complete!', date: '' }] : []),
  ];

  const completeTask = (task) => {
    setCompletedTasks(prev => new Set([...prev, task.id]));
    if (task.isMandatory) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 1200);
    }
    setToast({ message: `"${task.title}" marked complete!`, type: 'success' });
  };

  const generateRoadmap = async () => {
    setRoadmap('');
    setRoadmapStreaming(true);
    setRoadmapGenerated(true);
    await streamAI({
      systemPrompt: `You are an onboarding coach creating a personalized 90-day plan for a new employee. Be specific, practical, and encouraging. Format as three clearly labeled sections: "First 30 Days", "Days 31–60", "Days 61–90". Each section has 4–5 bullet points. Use the employee's specific role and context.`,
      userMessage: `Create a personalized 30/60/90 day plan for:\nName: ${emp.name}\nRole: ${emp.role}\nDepartment: ${emp.department}\nCompany: Acme Manufacturing Co. (mid-sized industrial manufacturer in Phoenix, AZ)\nManager: ${emp.manager}\nKey context: ${emp.bio}\n\nMake the milestones specific and actionable for a ${emp.role} in manufacturing.`,
      onToken: (t) => setRoadmap(prev => prev + t),
      onDone: () => setRoadmapStreaming(false),
    });
  };

  const sayHi = (member) => {
    if (!connections.find(c => c.person === member.name)) {
      setConnections(prev => [...prev, { person: member.name, role: member.role, date: new Date().toISOString().split('T')[0], type: 'intro' }]);
      setToast({ message: `Said hi to ${member.name}! Connection logged.`, type: 'success' });
    }
  };

  const submitPulse = () => {
    setPulseSubmitted(true);
    setToast({ message: 'Pulse check-in submitted! Thanks for sharing.', type: 'success' });
  };

  const phaseIndex = PHASE_ORDER.indexOf(emp.phase);

  return (
    <div className="max-w-[900px] mx-auto">
      {showConfetti && <Confetti />}
      {toast && <Toast message={toast.message} type={toast.type} onDismiss={() => setToast(null)} />}

      {/* Welcome Header */}
      <div className="bg-gradient-to-br from-brand-50 via-teal-50 to-white px-8 py-8">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-medium text-gray-400 uppercase tracking-widest mb-1">Welcome back</p>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight mb-2">Good morning, {emp.name.split(' ')[0]}. 👋</h1>
            <p className="text-gray-500 mb-4">
              {emp.daysIn === 0 ? 'Your first day starts today!' : `Day ${emp.daysIn} of your onboarding journey`}
              {emp.phase !== 'complete' && ` · You're ${emp.completionPct}% through`}
            </p>
            <div className="flex items-center gap-3">
              <div className="bg-white rounded-full h-2 w-64 overflow-hidden">
                <div
                  className="h-full bg-brand-600 rounded-full transition-all duration-700"
                  style={{ width: `${emp.completionPct}%` }}
                />
              </div>
              <span className="text-sm font-semibold text-brand-700">{emp.completionPct}%</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Avatar initials={emp.initials} color={emp.avatarColor} size="xl" />
            {employeeId !== 'EMP-001' && (
              <button onClick={() => navigate('/hire/EMP-001')} className="text-xs text-gray-400 hover:text-gray-600 flex items-center gap-1">
                <ArrowLeft className="w-3 h-3" /> Back
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Journey Timeline */}
        <div className="bg-white rounded-2xl border border-gray-200/70 shadow-card p-5">
          <p className="text-xs font-medium text-gray-400 uppercase tracking-widest mb-4">Your Journey</p>
          <div className="flex items-center overflow-x-auto pb-2">
            {PHASE_ORDER.slice(0, -1).map((phase, i) => {
              const isDone = PHASE_ORDER.indexOf(phase) < phaseIndex;
              const isCurrent = phase === emp.phase;
              return (
                <div key={phase} className="flex items-center flex-shrink-0">
                  <div className="flex flex-col items-center gap-1.5">
                    <div className={`w-11 h-11 rounded-full flex items-center justify-center text-lg transition-all ${isDone ? 'bg-brand-600 text-white' : isCurrent ? 'bg-brand-50 border-2 border-brand-600 animate-pulse-ring' : 'bg-gray-100 text-gray-400'}`}>
                      {isDone ? '✓' : PHASE_ICONS[phase]}
                    </div>
                    <span className={`text-[10px] font-medium whitespace-nowrap ${isCurrent ? 'text-brand-700' : isDone ? 'text-gray-500' : 'text-gray-300'}`}>
                      {PHASE_LABELS[phase]}
                    </span>
                  </div>
                  {i < PHASE_ORDER.length - 2 && (
                    <div className={`w-12 h-0.5 mx-1 flex-shrink-0 ${PHASE_ORDER.indexOf(phase) < phaseIndex ? 'bg-brand-600' : 'bg-gray-200'}`} />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Today's Tasks */}
        <div>
          <p className="text-xs font-medium text-gray-400 uppercase tracking-widest mb-3">Today's Tasks</p>
          {todaysTasks.length === 0 ? (
            <div className="bg-brand-50 border border-brand-600/20 rounded-2xl p-6 text-center">
              <CheckCircle2 className="w-10 h-10 text-brand-600 mx-auto mb-2" />
              <p className="font-semibold text-brand-700">You're all caught up!</p>
              <p className="text-sm text-gray-500 mt-1">No pending tasks for today. Great work.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {todaysTasks.map(task => (
                <TaskCard key={task.id} task={task} onComplete={() => completeTask(task)} completed={completedTasks.has(task.id)} />
              ))}
            </div>
          )}
        </div>

        {/* 30/60/90 Roadmap */}
        <div className="bg-white rounded-2xl border border-gray-200/70 shadow-card p-5">
          <div className="flex items-center justify-between mb-4">
            <p className="text-xs font-medium text-gray-400 uppercase tracking-widest">My 30/60/90 Roadmap</p>
            {!roadmapGenerated && (
              <button
                onClick={generateRoadmap}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-brand-600 hover:bg-brand-700 text-white text-xs font-medium rounded-lg transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5" />
                Generate My Personalized Plan
              </button>
            )}
          </div>

          {!roadmapGenerated ? (
            <div className="text-center py-8 text-gray-400">
              <Sparkles className="w-10 h-10 mx-auto mb-2 text-gray-300" />
              <p className="text-sm">Click the button to generate your AI-personalized roadmap</p>
            </div>
          ) : (
            <div className="bg-brand-50 border border-brand-100 rounded-xl p-5">
              <div className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
                {roadmap}
                {roadmapStreaming && <span className="inline-block w-1.5 h-4 bg-brand-400 ml-0.5 animate-blink" />}
              </div>
            </div>
          )}
        </div>

        {/* Meet Your Team */}
        <div>
          <p className="text-xs font-medium text-gray-400 uppercase tracking-widest mb-3">Meet Your Team</p>
          <div className="flex gap-4 overflow-x-auto pb-2">
            {teamMembers.map(member => {
              const hasConnected = connections.some(c => c.person === member.name);
              return (
                <div key={member.id} className="bg-white rounded-2xl border border-gray-200/70 shadow-card p-4 flex-shrink-0 w-52">
                  <div className="flex flex-col items-center text-center gap-2">
                    <Avatar initials={member.initials} color={member.avatarColor} size="lg" />
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{member.name}</p>
                      <p className="text-xs text-gray-400">{member.role}</p>
                      <p className="text-xs text-gray-300">{member.yearsAtCompany} yrs at Acme</p>
                    </div>
                    <div className="bg-amber-50 text-amber-700 text-xs px-2 py-1 rounded-lg italic w-full">
                      "{member.funFact}"
                    </div>
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-gray-50 text-gray-600 border border-gray-200/70">
                      {member.expertise[0]}
                    </span>
                    <button
                      onClick={() => sayHi(member)}
                      disabled={hasConnected}
                      className={`w-full text-xs py-1.5 rounded-lg font-medium transition-colors ${hasConnected ? 'bg-brand-50 text-brand-700 border border-brand-200' : 'bg-brand-50 text-brand-700 hover:bg-brand-600 hover:text-white border border-brand-600/30'}`}
                    >
                      {hasConnected ? '✓ Connected' : 'Say hi 👋'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Weekly Pulse */}
        <div className="bg-white rounded-2xl border border-gray-200/70 shadow-card p-5">
          <div className="flex items-center justify-between mb-4">
            <p className="text-xs font-medium text-gray-400 uppercase tracking-widest">This Week's Pulse Check-In</p>
            {pulseHistory.length > 1 && (
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400">Trend</span>
                <PulseCurve data={pulseHistory} width={60} height={20} />
              </div>
            )}
          </div>

          {pulseSubmitted ? (
            <div className="text-center py-6">
              <div className="text-4xl mb-2">🎉</div>
              <p className="font-semibold text-gray-900">Thanks for checking in!</p>
              <p className="text-sm text-gray-400 mt-1">Your responses help us support you better.</p>
              <div className="flex justify-center gap-6 mt-4">
                <ScoreDisplay label="Connected" score={pulseScores.connected} />
                <ScoreDisplay label="Clarity" score={pulseScores.clarity} />
                <ScoreDisplay label="Supported" score={pulseScores.supported} />
              </div>
            </div>
          ) : (
            <div className="space-y-5">
              {[
                { key: 'connected', label: 'How connected do you feel to your team?', low: 'Isolated', high: 'Part of the family' },
                { key: 'clarity', label: 'How clear is your role and what\'s expected?', low: 'Confused', high: 'Crystal clear' },
                { key: 'supported', label: 'How supported do you feel by your manager?', low: 'On my own', high: 'Fully supported' },
              ].map(({ key, label, low, high }) => (
                <div key={key}>
                  <p className="text-sm font-medium text-gray-900 mb-2">{label}</p>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-gray-400 w-16 text-right">{low}</span>
                    <div className="flex gap-1.5">
                      {[1,2,3,4,5,6,7,8,9,10].map(n => (
                        <button
                          key={n}
                          onClick={() => setPulseScores(prev => ({ ...prev, [key]: n }))}
                          className={`w-7 h-7 rounded-lg text-xs font-medium transition-all ${pulseScores[key] === n ? 'bg-brand-600 text-white scale-110' : 'bg-gray-100 text-gray-500 hover:bg-brand-50 hover:text-brand-700'}`}
                        >
                          {n}
                        </button>
                      ))}
                    </div>
                    <span className="text-xs text-gray-400 w-20">{high}</span>
                  </div>
                </div>
              ))}
              <button
                onClick={submitPulse}
                className="w-full py-2.5 bg-brand-600 hover:bg-brand-700 text-white text-sm font-medium rounded-xl transition-colors"
              >
                Submit Check-In
              </button>
            </div>
          )}
        </div>

        {/* Wins Feed */}
        <div className="bg-white rounded-2xl border border-gray-200/70 shadow-card p-5">
          <p className="text-xs font-medium text-gray-400 uppercase tracking-widest mb-4">Your Wins 🏆</p>
          <div className="space-y-3">
            {wins.map((w, i) => (
              <div key={i} className="flex items-center gap-3 p-3 bg-brand-50 rounded-xl">
                <span className="text-xl">{w.icon}</span>
                <div>
                  <p className="text-sm font-medium text-gray-900">{w.label}</p>
                  {w.date && <p className="text-xs text-gray-400">{w.date}</p>}
                </div>
              </div>
            ))}
            {completedTasks.size > 0 && (
              <div className="flex items-center gap-3 p-3 bg-brand-50 rounded-xl">
                <span className="text-xl">✅</span>
                <div>
                  <p className="text-sm font-medium text-gray-900">{completedTasks.size} task{completedTasks.size > 1 ? 's' : ''} completed in this session</p>
                  <p className="text-xs text-gray-400">Nice work!</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function TaskCard({ task, onComplete, completed }) {
  return (
    <div className={`bg-white border rounded-2xl p-4 transition-all ${completed ? 'opacity-50 border-gray-200/70' : 'border-gray-200/70 hover:border-brand-300 hover:shadow-card'}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <p className={`text-sm font-medium ${completed ? 'line-through text-gray-400' : 'text-gray-900'}`}>{task.title}</p>
            {task.isMandatory && <span className="text-[10px] bg-red-50 text-red-600 border border-red-100 px-1.5 rounded">Required</span>}
          </div>
          <p className="text-xs text-gray-400 leading-relaxed mb-2">{task.description}</p>
          <div className="flex items-center gap-2">
            <CategoryBadge category={task.category} />
            {task.durationMins > 0 && (
              <span className="flex items-center gap-1 text-xs text-gray-400">
                <Clock className="w-3 h-3" />{task.durationMins} min
              </span>
            )}
          </div>
        </div>
        {!completed && (
          <button
            onClick={onComplete}
            className="flex-shrink-0 px-3 py-1.5 bg-brand-50 hover:bg-brand-600 hover:text-white text-brand-700 text-xs font-medium rounded-lg transition-colors border border-brand-600/20"
          >
            Mark Done
          </button>
        )}
        {completed && <CheckCircle2 className="w-5 h-5 text-brand-600 flex-shrink-0" />}
      </div>
    </div>
  );
}

function ScoreDisplay({ label, score }) {
  return (
    <div className="text-center">
      <div className="text-2xl font-bold text-brand-700">{score}</div>
      <div className="text-xs text-gray-400">{label}</div>
    </div>
  );
}
