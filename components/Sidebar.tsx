import React from 'react';
import { LayoutDashboard, FileText, Database, Settings, ShieldCheck, History, Brain } from 'lucide-react';
import { PageMode } from '../types';

interface SidebarProps {
  activePage: PageMode;
  onNavigate: (page: PageMode) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activePage, onNavigate }) => {
  return (
    <div className="w-64 bg-slate-900 text-slate-300 flex flex-col h-full border-r border-slate-800 hidden md:flex shrink-0 transition-all duration-300">
      {/* Header */}
      <div className="p-6 flex items-center gap-3 border-b border-slate-800">
        <div className="bg-blue-600 p-2 rounded-lg shadow-lg shadow-blue-900/50">
          <ShieldCheck className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-white font-bold text-lg tracking-tight font-sans">LogicGuard</h1>
          <p className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold">AI Industry Agent</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        <div className="text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-4 px-3 mt-2">Main Menu</div>
        
        <SidebarItem 
          icon={<Brain size={20} />} 
          label="智能助手 (Agent)" 
          active={activePage === 'agent'} 
          onClick={() => onNavigate('agent')}
        />
        <SidebarItem 
          icon={<Database size={20} />} 
          label="工业知识库 (KB)" 
          active={activePage === 'kb'} 
          onClick={() => onNavigate('kb')}
        />
        <SidebarItem 
          icon={<History size={20} />} 
          label="审计日志 (Audit)" 
          active={activePage === 'audit'} 
          onClick={() => onNavigate('audit')}
        />
      </nav>

      {/* Footer / Settings */}
      <div className="p-4 border-t border-slate-800 bg-slate-900/50">
        <div className="text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-3 px-3">System</div>
        <SidebarItem icon={<Settings size={20} />} label="系统设置" />
        <SidebarItem icon={<LayoutDashboard size={20} />} label="仪表盘概览" />
        
        <div className="mt-6 p-3 bg-slate-800 rounded-lg border border-slate-700/50">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] text-slate-400 font-bold uppercase">Status</span>
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
              <span className="text-[10px] text-emerald-400 font-mono">ONLINE</span>
            </div>
          </div>
          <div className="text-[10px] text-slate-500 font-mono">v2.4.0-build.89</div>
        </div>
      </div>
    </div>
  );
};

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick?: () => void;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ icon, label, active, onClick }) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200 group ${
      active 
        ? 'bg-blue-600 text-white shadow-md shadow-blue-900/30 translate-x-1' 
        : 'hover:bg-slate-800 hover:text-white hover:translate-x-1'
    }`}
  >
    <div className={`${active ? 'text-white' : 'text-slate-400 group-hover:text-white transition-colors'}`}>
      {icon}
    </div>
    <span className="text-sm font-medium tracking-wide">{label}</span>
  </button>
);

export default Sidebar;