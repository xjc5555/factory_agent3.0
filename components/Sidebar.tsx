import React from 'react';
import { LayoutDashboard, FileText, Database, Settings, ShieldCheck, History, Brain, BarChart3 } from 'lucide-react';
import { PageMode } from '../types';

interface SidebarProps {
  activePage: PageMode;
  onNavigate: (page: PageMode) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activePage, onNavigate }) => {
  return (
    <div className="w-64 bg-slate-950 text-slate-400 flex flex-col h-full border-r border-slate-800 hidden md:flex shrink-0 transition-all duration-300">
      {/* Header */}
      <div className="p-6 flex items-center gap-3 border-b border-slate-800">
        <div className="bg-blue-600 p-2 rounded-lg shadow-[0_0_15px_rgba(37,99,235,0.3)]">
          <ShieldCheck className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-slate-100 font-bold text-lg tracking-tight font-sans">LogicGuard</h1>
          <p className="text-[10px] text-blue-400 uppercase tracking-widest font-semibold">工业智能体 v2.4</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        <div className="text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-4 px-3 mt-2">Main Menu</div>
        
        <SidebarItem 
          icon={<Brain size={18} />} 
          label="智能助手 (Agent)" 
          active={activePage === 'agent'} 
          onClick={() => onNavigate('agent')}
        />
        <SidebarItem 
          icon={<Database size={18} />} 
          label="工业知识库 (KB)" 
          active={activePage === 'kb'} 
          onClick={() => onNavigate('kb')}
        />
        <SidebarItem 
          icon={<History size={18} />} 
          label="审计日志 (Audit)" 
          active={activePage === 'audit'} 
          onClick={() => onNavigate('audit')}
        />
        <SidebarItem 
          icon={<Settings size={18} />} 
          label="系统配置 (Config)" 
          active={activePage === 'settings'} 
          onClick={() => onNavigate('settings')}
        />
      </nav>

      {/* Footer / Settings */}
      <div className="p-4 border-t border-slate-800 bg-slate-900/50">
        <div className="text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-3 px-3">System Metrics</div>
        
        <div className="mt-2 p-3 bg-slate-900 rounded-lg border border-slate-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] text-slate-500 font-bold uppercase flex items-center gap-1">
               <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
               KG-Engine
            </span>
            <span className="text-[10px] text-emerald-400 font-mono">ONLINE</span>
          </div>
          <div className="w-full bg-slate-800 h-1 rounded-full overflow-hidden">
             <div className="bg-blue-600 h-full w-[85%]"></div>
          </div>
          <div className="mt-1 flex justify-between text-[8px] text-slate-600 font-mono">
             <span>MEM: 14.2GB</span>
             <span>LAT: 24ms</span>
          </div>
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
    className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200 group border border-transparent ${
      active 
        ? 'bg-blue-600/10 text-blue-400 border-blue-600/20 shadow-lg shadow-blue-900/10' 
        : 'hover:bg-slate-900 hover:text-slate-200 hover:border-slate-800'
    }`}
  >
    <div className={`${active ? 'text-blue-400' : 'text-slate-500 group-hover:text-slate-300 transition-colors'}`}>
      {icon}
    </div>
    <span className="text-sm font-medium tracking-wide">{label}</span>
  </button>
);

export default Sidebar;