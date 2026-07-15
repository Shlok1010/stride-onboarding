import { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, LayoutDashboard, Users, FileText, BarChart2, Route, Sparkles, CornerDownLeft } from 'lucide-react';
import { employees } from '../../data/employees';

const STATIC_COMMANDS = [
  { id: 'dashboard', label: 'HR Dashboard', hint: 'Go to page', icon: LayoutDashboard, to: '/' },
  { id: 'manager', label: 'Manager View', hint: 'Go to page', icon: Users, to: '/manager' },
  { id: 'templates', label: 'Templates', hint: 'Go to page', icon: FileText, to: '/templates' },
  { id: 'analytics', label: 'Analytics', hint: 'Go to page', icon: BarChart2, to: '/analytics' },
  { id: 'compass', label: 'HR Compass', hint: 'Open AI assistant', icon: Sparkles, to: '/compass' },
];

export default function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeydown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      } else if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };
    const handleOpenEvent = () => setIsOpen(true);

    window.addEventListener('keydown', handleKeydown);
    window.addEventListener('stride:open-command-palette', handleOpenEvent);
    return () => {
      window.removeEventListener('keydown', handleKeydown);
      window.removeEventListener('stride:open-command-palette', handleOpenEvent);
    };
  }, []);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setActiveIndex(0);
      setTimeout(() => inputRef.current?.focus(), 10);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const employeeCommands = useMemo(
    () => employees.map((e) => ({
      id: e.id,
      label: e.name,
      hint: `${e.role} · ${e.phase === 'complete' ? 'Complete' : `Day ${e.daysIn}`}`,
      icon: Route,
      to: `/hire/${e.id}`,
    })),
    []
  );

  const allCommands = useMemo(() => [...STATIC_COMMANDS, ...employeeCommands], [employeeCommands]);

  const results = useMemo(() => {
    if (!query.trim()) return allCommands;
    const q = query.toLowerCase();
    return allCommands.filter((c) => c.label.toLowerCase().includes(q) || c.hint.toLowerCase().includes(q));
  }, [query, allCommands]);

  useEffect(() => setActiveIndex(0), [query]);

  const select = (cmd) => {
    if (!cmd) return;
    setIsOpen(false);
    navigate(cmd.to);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      select(results[activeIndex]);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] px-4">
      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={() => setIsOpen(false)} />
      <div className="relative w-full max-w-lg bg-white rounded-2xl border border-gray-200/70 shadow-pop overflow-hidden animate-slide-up">
        <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100">
          <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Jump to a page, a new hire, or an action..."
            className="flex-1 text-sm outline-none placeholder:text-gray-400"
          />
          <kbd className="text-[10px] font-semibold bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded">Esc</kbd>
        </div>

        <div className="max-h-80 overflow-y-auto py-2">
          {results.length === 0 && (
            <p className="px-4 py-6 text-sm text-gray-400 text-center">No matches for "{query}"</p>
          )}
          {results.map((cmd, i) => {
            const Icon = cmd.icon;
            const active = i === activeIndex;
            return (
              <button
                key={cmd.id}
                onMouseEnter={() => setActiveIndex(i)}
                onClick={() => select(cmd)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors ${active ? 'bg-brand-50/80' : 'hover:bg-gray-50'}`}
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${active ? 'bg-brand-100 text-brand-700' : 'bg-gray-100 text-gray-400'}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className={`text-sm font-medium truncate ${active ? 'text-brand-800' : 'text-gray-800'}`}>{cmd.label}</p>
                  <p className="text-xs text-gray-400 truncate">{cmd.hint}</p>
                </div>
                {active && <CornerDownLeft className="w-3.5 h-3.5 text-brand-500 flex-shrink-0" />}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
