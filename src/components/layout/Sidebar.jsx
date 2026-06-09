import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, FileText, BarChart2, Route, Compass, Sparkles } from 'lucide-react';
import clsx from 'clsx';

const navHR = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/manager', icon: Users, label: 'Manager View' },
  { to: '/templates', icon: FileText, label: 'Templates' },
  { to: '/analytics', icon: BarChart2, label: 'Analytics' },
];

export default function Sidebar() {
  return (
    <aside className="w-60 flex-shrink-0 bg-brand-navy h-screen flex flex-col fixed left-0 top-0">
      {/* Logo */}
      <div className="px-5 py-5 flex items-center gap-2.5 border-b border-white/10">
        <div className="w-8 h-8 rounded-lg bg-brand-amber flex items-center justify-center flex-shrink-0">
          <Compass className="w-5 h-5 text-white" />
        </div>
        <span className="text-lg font-bold text-white tracking-tight">Stride</span>
      </div>

      <nav className="flex-1 px-3 py-4 overflow-y-auto">
        {/* HR Views */}
        <p className="text-xs font-medium text-white/40 uppercase tracking-widest px-2 mb-2">HR Views</p>
        {navHR.map(({ to, icon: Icon, label }) => (
          <SidebarLink key={to} to={to} icon={Icon} label={label} exact={to === '/'} />
        ))}

        {/* New Hire */}
        <p className="text-xs font-medium text-white/40 uppercase tracking-widest px-2 mb-2 mt-6">New Hire</p>
        <SidebarLink to="/hire/EMP-001" icon={Route} label="My Journey" />

        {/* Tools */}
        <p className="text-xs font-medium text-white/40 uppercase tracking-widest px-2 mb-2 mt-6">Tools</p>
        <NavLink
          to="/compass"
          className={({ isActive }) => clsx(
            'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors',
            isActive
              ? 'bg-indigo-500/20 text-indigo-200'
              : 'text-white/60 hover:text-white hover:bg-white/10'
          )}
        >
          <Sparkles className="w-4 h-4 flex-shrink-0" />
          <span>HR Compass</span>
          <span className="ml-auto text-[10px] bg-indigo-500/30 text-indigo-200 px-1.5 py-0.5 rounded-full">AI</span>
        </NavLink>
      </nav>

      {/* Demo mode box */}
      <div className="mx-3 mb-4 p-3 rounded-xl bg-white/5 border border-white/10">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-2 h-2 rounded-full bg-brand-amber animate-pulse" />
          <span className="text-xs font-medium text-white/80">Demo Mode</span>
        </div>
        <p className="text-xs text-white/40 mb-2">All data is simulated for portfolio purposes.</p>
        <p className="text-xs text-white/50">Built by Nexus Advisory Group</p>
        <a
          href="#"
          onClick={(e) => e.preventDefault()}
          className="mt-2 block text-xs text-brand-amber hover:text-brand-amber/80 font-medium"
        >
          Get this for your business →
        </a>
      </div>
    </aside>
  );
}

function SidebarLink({ to, icon: Icon, label, exact }) {
  return (
    <NavLink
      to={to}
      end={exact}
      className={({ isActive }) => clsx(
        'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors mb-0.5',
        isActive
          ? 'bg-white/15 text-white'
          : 'text-white/60 hover:text-white hover:bg-white/10'
      )}
    >
      <Icon className="w-4 h-4 flex-shrink-0" />
      <span>{label}</span>
    </NavLink>
  );
}
