import { useNavigate, useLocation } from 'react-router-dom';
import { ChevronDown, Building2, Search } from 'lucide-react';
import { useState } from 'react';
import { employees } from '../../data/employees';
import Modal from '../shared/Modal';
import Avatar from '../shared/Avatar';

export default function TopBar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [showHireModal, setShowHireModal] = useState(false);
  const apiKey = import.meta.env.VITE_GROQ_API_KEY;

  const currentRole =
    location.pathname.startsWith('/hire') ? 'New Hire View' :
    location.pathname.startsWith('/manager') ? 'Manager View' :
    'HR Admin';

  const handleRoleChange = (role) => {
    setShowRoleMenu(false);
    if (role === 'HR Admin') navigate('/');
    else if (role === 'Manager View') navigate('/manager');
    else if (role === 'New Hire View') setShowHireModal(true);
  };

  return (
    <>
      <header className="h-16 flex items-center justify-between px-6 bg-white/75 backdrop-blur-md border-b border-gray-200/60 flex-shrink-0 sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <Building2 className="w-4 h-4 text-gray-400" />
          <span className="text-sm font-medium text-gray-700">Acme Manufacturing Co.</span>
          <span className="text-gray-300">·</span>
          <span className="text-sm text-gray-400">June 9, 2026</span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => window.dispatchEvent(new Event('stride:open-command-palette'))}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-gray-200 bg-white text-sm text-gray-400 hover:text-gray-600 hover:border-gray-300 transition-colors"
          >
            <Search className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Search</span>
            <kbd className="hidden sm:inline text-[10px] font-semibold bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded">⌘K</kbd>
          </button>

          <div className="relative">
            <button
              onClick={() => setShowRoleMenu(!showRoleMenu)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-gray-200 hover:border-gray-300 bg-white text-sm text-gray-700 transition-colors"
            >
              <span>{currentRole}</span>
              <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
            </button>

            {showRoleMenu && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setShowRoleMenu(false)} />
                <div className="absolute right-0 top-full mt-1 z-20 bg-white rounded-xl border border-gray-200/70 shadow-pop py-1 w-44">
                  {['HR Admin', 'Manager View', 'New Hire View'].map((r) => (
                    <button
                      key={r}
                      onClick={() => handleRoleChange(r)}
                      className={`w-full text-left px-4 py-2 text-sm transition-colors ${currentRole === r ? 'text-brand-700 font-medium bg-brand-50' : 'text-gray-600 hover:bg-gray-50'}`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </header>

      {!apiKey && (
        <div className="bg-amber-50 border-b border-amber-200 px-6 py-2 text-sm text-amber-800 flex-shrink-0">
          ⚠️ AI features require a Groq API key. Add <code className="bg-amber-100 px-1 rounded text-xs">VITE_GROQ_API_KEY</code> to .env.local
        </div>
      )}

      <Modal isOpen={showHireModal} onClose={() => setShowHireModal(false)} title="Preview New Hire View">
        <p className="text-sm text-gray-500 mb-4">Select a new hire to preview their onboarding experience:</p>
        <div className="space-y-2">
          {employees.filter(e => e.phase !== 'complete').map(e => (
            <button
              key={e.id}
              onClick={() => { setShowHireModal(false); navigate(`/hire/${e.id}`); }}
              className="w-full flex items-center gap-3 p-3 rounded-xl border border-gray-200/70 hover:border-brand-300 hover:bg-brand-50/50 transition-colors text-left"
            >
              <Avatar initials={e.initials} color={e.avatarColor} size="sm" />
              <div>
                <p className="text-sm font-medium text-gray-900">{e.name}</p>
                <p className="text-xs text-gray-400">{e.role} · Day {e.daysIn}</p>
              </div>
            </button>
          ))}
        </div>
      </Modal>
    </>
  );
}
