import React from 'react';
import { LayoutDashboard, FileText, Database, Settings, ShieldCheck, History } from 'lucide-react';

const Sidebar: React.FC = () => {
  return (
    <div className="w-64 bg-slate-900 text-slate-300 flex flex-col h-full border-r border-slate-800 hidden md:flex">
      <div className="p-6 flex items-center gap-3 border-b border-slate-800">
        <div className="bg-blue-600 p-2 rounded-lg">
          <ShieldCheck className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-white font-bold text-lg tracking-tight">LogicGuard</h1>
          <p className="text-xs text-slate-500">工业合规 AI 助手</p>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4 px-2">菜单</div>
        
        <SidebarItem icon={<LayoutDashboard size={20} />} label="仪表盘" />
        <SidebarItem icon={<FileText size={20} />} label="合规检测" active />
        <SidebarItem icon={<Database size={20} />} label="知识库" />
        <SidebarItem icon={<History size={20} />} label="审计日志" />
      </nav>

      <div className="p-4 border-t border-slate-800">
        <SidebarItem icon={<Settings size={20} />} label="系统设置" />
        <div className="mt-4 p-3 bg-slate-800 rounded-lg">
          <div className="text-xs text-slate-400 mb-1">系统状态</div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            <span className="text-xs text-green-400 font-medium">模型在线</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const SidebarItem: React.FC<{ icon: React.ReactNode; label: string; active?: boolean }> = ({ icon, label, active }) => (
  <button className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md transition-colors ${active ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50' : 'hover:bg-slate-800 hover:text-white'}`}>
    {icon}
    <span className="text-sm font-medium">{label}</span>
  </button>
);

export default Sidebar;