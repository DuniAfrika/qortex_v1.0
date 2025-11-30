import React from 'react';
import { MemoryRouter, Routes, Route, NavLink, useLocation } from 'react-router-dom';
import { LayoutDashboard, PlusCircle, Layers, FileText, Settings, Cpu } from 'lucide-react';
import { Dashboard } from './components/Dashboard';
import { TaskSubmission } from './components/TaskSubmission';
import { LiveTaskView } from './components/LiveTaskView';
import { LandingPage } from './components/LandingPage';

const NavItem = ({ to, icon: Icon, label }: any) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors rounded-lg mb-1 ${
        isActive
          ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
          : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
      }`
    }
  >
    <Icon className="w-5 h-5" />
    {label}
  </NavLink>
);

const AppContent: React.FC = () => {
  const location = useLocation();
  const isLandingPage = location.pathname === '/';

  if (isLandingPage) {
    return (
      <Routes>
        <Route path="/" element={<LandingPage />} />
      </Routes>
    );
  }

  return (
    <div className="flex h-screen bg-slate-950 text-slate-200 font-sans selection:bg-cyan-500/30">
        
      {/* Sidebar - Only visible inside app */}
      <aside className="w-64 border-r border-slate-800 bg-slate-950 flex-shrink-0 flex flex-col hidden md:flex">
        <div className="p-6 flex items-center gap-2 border-b border-slate-800">
          <div className="bg-cyan-500 p-1.5 rounded">
              <Cpu className="w-5 h-5 text-slate-950" />
          </div>
          <span className="text-xl font-bold tracking-tight text-white">QORTEX</span>
        </div>

        <nav className="flex-1 p-4 overflow-y-auto">
          <div className="mb-6">
              <p className="px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Platform</p>
              <NavItem to="/dashboard" icon={LayoutDashboard} label="Overview" />
              <NavItem to="/submit" icon={PlusCircle} label="Submit Task" />
              <NavItem to="/tasks" icon={Layers} label="Task History" />
          </div>
            <div>
              <p className="px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Network</p>
              <NavItem to="/miners" icon={Cpu} label="Miner Nodes" />
              <NavItem to="/proofs" icon={FileText} label="Proofs" />
          </div>
        </nav>

        <div className="p-4 border-t border-slate-800">
            <div className="flex items-center gap-3 px-4 py-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
              <span className="text-xs text-emerald-500 font-mono">SYSTEM OPERATIONAL</span>
            </div>
        </div>
      </aside>

      {/* Mobile Header (visible only on small screens inside app) */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-slate-950 border-b border-slate-800 z-50 flex items-center px-4 justify-between">
            <div className="flex items-center gap-2">
              <div className="bg-cyan-500 p-1.5 rounded">
                  <Cpu className="w-5 h-5 text-slate-950" />
              </div>
              <span className="text-xl font-bold text-white">QORTEX</span>
            </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-4 md:p-8 pt-20 md:pt-8 scroll-smooth">
        <div className="max-w-7xl mx-auto">
          <Routes>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/submit" element={<TaskSubmission />} />
            <Route path="/live" element={<LiveTaskView />} />
            <Route path="*" element={<div className="text-center py-20 text-slate-500">Page under construction</div>} />
          </Routes>
        </div>
      </main>

    </div>
  );
}

const App: React.FC = () => {
  return (
    <MemoryRouter>
      <AppContent />
    </MemoryRouter>
  );
};

export default App;