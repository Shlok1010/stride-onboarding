import { useState } from 'react';
import { FileText, ChevronRight, Sparkles, CheckCircle2, Clock, X } from 'lucide-react';
import { templates } from '../data/templates';
import { CategoryBadge, PhaseBadge } from '../components/shared/Badge';
import { streamAI } from '../lib/ai';
import Toast from '../components/shared/Toast';

const PHASE_COLORS = {
  preboarding: 'bg-purple-100 text-purple-700',
  day1: 'bg-blue-100 text-blue-700',
  first30: 'bg-teal-100 text-teal-700',
  days31to60: 'bg-amber-100 text-amber-700',
  days61to90: 'bg-green-100 text-green-700',
};

const PHASE_LABELS = { preboarding: 'Pre-board', day1: 'Day 1', first30: 'First 30', days31to60: '31–60', days61to90: '61–90' };

export default function Templates() {
  const [selected, setSelected] = useState(null);
  const [toast, setToast] = useState(null);
  const [showGenerator, setShowGenerator] = useState(false);
  const [genForm, setGenForm] = useState({ role: '', department: 'Operations', seniority: 'Mid' });
  const [genResult, setGenResult] = useState(null);
  const [genStreaming, setGenStreaming] = useState(false);
  const [genRaw, setGenRaw] = useState('');

  const generateTemplate = async () => {
    if (!genForm.role.trim()) return;
    setGenResult(null);
    setGenRaw('');
    setGenStreaming(true);
    let accumulated = '';
    await streamAI({
      systemPrompt: 'You are an HR specialist creating structured onboarding task lists. Output ONLY valid JSON, no markdown, no explanation. The JSON should be an array of task objects.',
      userMessage: `Create an onboarding task list for a ${genForm.role} (${genForm.seniority}) in the ${genForm.department} department at a manufacturing company. Generate 15–20 tasks across these phases: preboarding (2–3 tasks), day1 (4–5 tasks), first30 (6–8 tasks), days31to60 (3–4 tasks), days61to90 (2–3 tasks).\n\nEach task object: { "title": string, "phase": string, "assignedTo": "hr"|"manager"|"newhire", "category": "compliance"|"it"|"culture"|"training"|"admin"|"social", "durationMins": number, "isMandatory": boolean }\n\nReturn only the JSON array, nothing else.`,
      onToken: (t) => { accumulated += t; setGenRaw(accumulated); },
      onDone: () => {
        setGenStreaming(false);
        try {
          const clean = accumulated.replace(/```json|```/g, '').trim();
          const parsed = JSON.parse(clean);
          setGenResult(parsed);
        } catch {
          setGenResult([]);
        }
      },
    });
  };

  const PHASES = ['preboarding', 'day1', 'first30', 'days31to60', 'days61to90'];

  return (
    <div className="p-6 max-w-[1200px] space-y-6">
      {toast && <Toast message={toast.message} type={toast.type} onDismiss={() => setToast(null)} />}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-brand-navy">Onboarding Templates</h1>
          <p className="text-sm text-gray-400 mt-0.5">Role-based templates for Acme Manufacturing</p>
        </div>
        <button
          onClick={() => setShowGenerator(!showGenerator)}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-xl transition-colors"
        >
          <Sparkles className="w-4 h-4" /> Generate Template with AI
        </button>
      </div>

      {/* AI Generator */}
      {showGenerator && (
        <div className="bg-compass-light border border-indigo-100 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-semibold text-brand-navy">AI Template Generator</p>
            <button onClick={() => setShowGenerator(false)} className="text-gray-400 hover:text-gray-600">
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div>
              <label className="text-xs font-medium text-gray-500 mb-1 block">Role Title</label>
              <input
                value={genForm.role}
                onChange={e => setGenForm(prev => ({ ...prev, role: e.target.value }))}
                placeholder="e.g. Procurement Specialist"
                className="w-full border border-indigo-200 bg-white rounded-lg px-3 py-2 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500 mb-1 block">Department</label>
              <select
                value={genForm.department}
                onChange={e => setGenForm(prev => ({ ...prev, department: e.target.value }))}
                className="w-full border border-indigo-200 bg-white rounded-lg px-3 py-2 text-sm outline-none focus:border-indigo-400"
              >
                {['Operations','Logistics','Finance','Human Resources','Facilities','Quality','Procurement','Information Technology','Sales'].map(d => (
                  <option key={d}>{d}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500 mb-1 block">Seniority</label>
              <select
                value={genForm.seniority}
                onChange={e => setGenForm(prev => ({ ...prev, seniority: e.target.value }))}
                className="w-full border border-indigo-200 bg-white rounded-lg px-3 py-2 text-sm outline-none focus:border-indigo-400"
              >
                {['Junior','Mid','Senior'].map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
          </div>
          <button
            onClick={generateTemplate}
            disabled={genStreaming || !genForm.role.trim()}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-xl transition-colors disabled:opacity-60 flex items-center gap-2"
          >
            {genStreaming ? <><span className="inline-block w-1.5 h-4 bg-white animate-blink" /> Generating...</> : <><Sparkles className="w-4 h-4" /> Generate</>}
          </button>

          {genStreaming && !genResult && (
            <div className="mt-4 bg-white rounded-xl p-4 border border-indigo-100">
              <p className="text-xs text-gray-400 mb-2">Generating tasks...</p>
              <div className="font-mono text-xs text-gray-500 whitespace-pre-wrap max-h-32 overflow-hidden">{genRaw.slice(0, 300)}{genRaw.length > 300 ? '...' : ''}</div>
            </div>
          )}

          {genResult && genResult.length > 0 && (
            <div className="mt-4">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-medium text-brand-navy">{genResult.length} tasks generated for <strong>{genForm.role}</strong></p>
                <button
                  onClick={() => setToast({ message: `Template for ${genForm.role} saved!`, type: 'success' })}
                  className="px-3 py-1.5 bg-hire-mid text-white text-xs font-medium rounded-lg hover:bg-hire-dark transition-colors"
                >
                  Save Template
                </button>
              </div>
              {PHASES.map(phase => {
                const phaseTasks = genResult.filter(t => t.phase === phase);
                if (!phaseTasks.length) return null;
                return (
                  <div key={phase} className="mb-3">
                    <p className={`inline-flex text-xs font-medium px-2 py-0.5 rounded-full mb-2 ${PHASE_COLORS[phase]}`}>{PHASE_LABELS[phase]}</p>
                    <div className="space-y-1.5">
                      {phaseTasks.map((t, i) => (
                        <div key={i} className="flex items-center gap-3 bg-white rounded-lg p-2.5 border border-gray-100">
                          {t.isMandatory ? <CheckCircle2 className="w-3.5 h-3.5 text-red-400 flex-shrink-0" /> : <div className="w-3.5 h-3.5 rounded-full border border-gray-300 flex-shrink-0" />}
                          <span className="text-xs text-gray-700 flex-1">{t.title}</span>
                          <CategoryBadge category={t.category} />
                          {t.durationMins > 0 && <span className="text-[10px] text-gray-400 flex items-center gap-0.5"><Clock className="w-2.5 h-2.5" />{t.durationMins}m</span>}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Template Library */}
      {!selected ? (
        <div className="grid grid-cols-3 gap-4">
          {templates.map(tpl => (
            <TemplateCard key={tpl.id} template={tpl} onSelect={() => setSelected(tpl)} onUse={() => setToast({ message: `Template applied: ${tpl.role}`, type: 'success' })} />
          ))}
        </div>
      ) : (
        <TemplateDetail template={selected} onBack={() => setSelected(null)} onUse={() => { setToast({ message: `Template applied: ${selected.role}`, type: 'success' }); setSelected(null); }} />
      )}
    </div>
  );
}

function TemplateCard({ template: t, onSelect, onUse }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition-all">
      <div className="flex items-start justify-between mb-3">
        <div className="w-10 h-10 rounded-xl bg-hr-light flex items-center justify-center">
          <FileText className="w-5 h-5 text-hr-dark" />
        </div>
        <span className="text-xs text-gray-400 bg-gray-50 px-2 py-0.5 rounded">{t.department}</span>
      </div>
      <h3 className="font-semibold text-brand-navy text-sm mb-1">{t.role}</h3>
      <p className="text-xs text-gray-400 mb-3">{t.totalTasks} tasks · ~{t.estimatedDays} days</p>

      <div className="flex gap-1.5 mb-4 flex-wrap">
        {Object.entries(t.phases).map(([phase, count]) => (
          <span key={phase} className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${PHASE_COLORS[phase]}`}>
            {PHASE_LABELS[phase]}: {count}
          </span>
        ))}
      </div>

      <div className="flex gap-2">
        <button onClick={onSelect} className="flex-1 text-xs font-medium bg-gray-50 hover:bg-gray-100 text-gray-700 py-2 rounded-lg transition-colors flex items-center justify-center gap-1">
          View <ChevronRight className="w-3 h-3" />
        </button>
        <button onClick={onUse} className="flex-1 text-xs font-medium bg-hr-light hover:bg-hr-mid hover:text-white text-hr-dark py-2 rounded-lg transition-colors">
          Use Template
        </button>
      </div>
    </div>
  );
}

function TemplateDetail({ template: t, onBack, onUse }) {
  const PHASES = ['preboarding', 'day1', 'first30', 'days31to60', 'days61to90'];
  return (
    <div>
      <div className="flex items-center gap-3 mb-4">
        <button onClick={onBack} className="text-xs text-gray-400 hover:text-gray-600 flex items-center gap-1">
          ← Back to Templates
        </button>
      </div>
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <div className="flex items-start justify-between mb-5">
          <div>
            <h2 className="text-xl font-semibold text-brand-navy">{t.role}</h2>
            <p className="text-sm text-gray-400">{t.department} · {t.totalTasks} tasks · ~{t.estimatedDays} days to completion</p>
            <p className="text-sm text-gray-500 mt-2 max-w-xl">{t.description}</p>
          </div>
          <button onClick={onUse} className="px-4 py-2 bg-hr-mid hover:bg-hr-dark text-white text-sm font-medium rounded-xl transition-colors">
            Use This Template
          </button>
        </div>

        {PHASES.map(phase => {
          const phaseTasks = t.tasks.filter(task => task.phase === phase);
          if (!phaseTasks.length) return null;
          return (
            <div key={phase} className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <PhaseBadge phase={phase} />
                <span className="text-xs text-gray-400">{phaseTasks.length} tasks</span>
              </div>
              <div className="space-y-2">
                {phaseTasks.map((task, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 hover:bg-gray-50 transition-colors">
                    {task.isMandatory
                      ? <CheckCircle2 className="w-4 h-4 text-red-400 flex-shrink-0" />
                      : <div className="w-4 h-4 rounded-full border-2 border-gray-200 flex-shrink-0" />
                    }
                    <span className="text-sm text-gray-700 flex-1">{task.title}</span>
                    <CategoryBadge category={task.category} />
                    <span className="text-xs text-gray-400 capitalize">{task.assignedTo}</span>
                    {task.durationMins > 0 && (
                      <span className="text-xs text-gray-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" />{task.durationMins}m
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
