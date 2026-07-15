import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, FileText, BarChart2, Route, Compass, Sparkles } from 'lucide-react';
import clsx from 'clsx';

const navHR = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard', end: true },
  { to: '/manager', icon: Users, label: 'Manager View' },
  { to: '/templates', icon: FileText, label: 'Templates' },
  { to: '/analytics', icon: BarChart2, label: 'Analytics' },
];

export default function Sidebar() {
  return (
    <aside className="w-60 shrink-0 h-screen sticky top-0 bg-white/70 backdrop-blur-md border-r border-gray-200/60 flex flex-col">
      {/* Brand */}
      <div className="h-16 flex items-center gap-2.5 px-5 border-b border-gray-200/60">
        <div className="p-1.5 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 shadow-[0_2px_6px_rgb(5_150_105/0.35),inset_0_1px_0_rgb(255_255_255/0.25)]">
          <Compass className="w-5 h-5 text-white" />
        </div>
        <span className="font-semibold text-gray-900 tracking-tight">Stride</span>
      </div>

      <nav className="flex-1 px-3 py-5 overflow-y-auto">
        <p className="px-3 text-[11px] font-semibold uppercase tracking-wider text-gray-400 mb-2">HR Views</p>
        <ul className="space-y-1">
          {navHR.map(({ to, icon: Icon, label, end }) => (
            <SidebarLink key={to} to={to} icon={Icon} label={label} end={end} />
          ))}
        </ul>

        <p className="px-3 text-[11px] font-semibold uppercase tracking-wider text-gray-400 mb-2 mt-6">New Hire</p>
        <ul className="space-y-1">
          <SidebarLink to="/hire/EMP-001" icon={Route} label="My Journey" />
        </ul>

        <p className="px-3 text-[11px] font-semibold uppercase tracking-wider text-gray-400 mb-2 mt-6">Tools</p>
        <ul className="space-y-1">
          <li>
            <NavLink
              to="/compass"
              className={({ isActive }) =>
                clsx(
                  'group flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition-all',
                  isActive
                    ? 'bg-brand-50/80 text-brand-800 font-semibold shadow-[inset_0_0_0_1px_rgb(16_185_129/0.15)]'
                    : 'text-gray-600 hover:bg-gray-100/70 hover:text-gray-900'
                )
              }
            >
              {({ isActive }) => (
                <>
                  <Sparkles className={clsx('w-[18px] h-[18px] transition-colors', isActive ? 'text-brand-600' : 'text-gray-400 group-hover:text-gray-600')} />
                  HR Compass
                  <span className="ml-auto text-[10px] bg-brand-100 text-brand-700 px-1.5 py-0.5 rounded-full font-semibold">AI</span>
                </>
              )}
            </NavLink>
          </li>
        </ul>
      </nav>

      {/* Demo mode callout */}
      <div className="p-3">
        <div className="rounded-xl bg-gradient-to-br from-brand-50 to-teal-50 border border-brand-100 p-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-semibold text-gray-700">Demo Mode</span>
          </div>
          <p className="text-xs text-gray-500 leading-relaxed">
            All data is simulated for portfolio purposes.
          </p>
          <p className="text-xs text-gray-500 leading-relaxed mt-2">
            Built by <span className="font-semibold text-gray-700">Shlok Mistry</span>
          </p>
          <a
            href="#"
            onClick={(e) => e.preventDefault()}
            className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-brand-600 hover:text-brand-700 transition-colors"
          >
            Get this for your business →
          </a>
        </div>
      </div>
    </aside>
  );
}

function SidebarLink({ to, icon: Icon, label, end }) {
  return (
    <li>
      <NavLink
        to={to}
        end={end}
        className={({ isActive }) =>
          clsx(
            'group flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition-all',
            isActive
              ? 'bg-brand-50/80 text-brand-800 font-semibold shadow-[inset_0_0_0_1px_rgb(16_185_129/0.15)]'
              : 'text-gray-600 hover:bg-gray-100/70 hover:text-gray-900'
          )
        }
      >
        {({ isActive }) => (
          <>
            <Icon className={clsx('w-[18px] h-[18px] transition-colors', isActive ? 'text-brand-600' : 'text-gray-400 group-hover:text-gray-600')} />
            {label}
            {isActive && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-brand-500" />}
          </>
        )}
      </NavLink>
    </li>
  );
}
