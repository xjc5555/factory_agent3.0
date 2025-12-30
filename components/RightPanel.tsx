import React from 'react';
import { PanelViewMode } from '../types';
import { Brain, FileText, Activity, Share2, AlertCircle, CheckCircle, Search } from 'lucide-react';

interface RightPanelProps {
  viewMode: PanelViewMode;
  data: any;
  isThinking: boolean;
}

const RightPanel: React.FC<RightPanelProps> = ({ viewMode, data, isThinking }) => {
  
  // -- Sub-component: Graph View --
  const GraphView = ({ nodes }: { nodes: any[] }) => (
    <div className="relative h-full w-full bg-slate-50/50 p-6 flex flex-col items-center justify-center gap-8">
       <div className="absolute inset-0 grid grid-cols-[repeat(20,minmax(0,1fr))] opacity-[0.03] pointer-events-none">
          {Array.from({ length: 400 }).map((_, i) => <div key={i} className="border border-slate-900"></div>)}
       </div>
       
       {nodes && nodes.map((node, idx) => (
         <div key={idx} className="relative z-10 flex flex-col items-center group w-full">
            {idx > 0 && <div className="absolute -top-8 h-8 w-0.5 bg-slate-300"></div>}
            
            <div className={`
              px-4 py-3 rounded-lg border-2 shadow-sm text-sm font-bold flex items-center gap-2 w-full max-w-[240px] justify-between transition-all duration-500
              ${node.type === 'input' ? 'bg-white border-slate-300 text-slate-600' : ''}
              ${node.type === 'entity' ? 'bg-blue-50 border-blue-200 text-blue-700' : ''}
              ${node.type === 'standard' ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : ''}
              ${node.type === 'negative' ? 'bg-amber-50 border-amber-200 text-amber-700 line-through decoration-2 decoration-amber-500/50' : ''}
              ${node.type === 'root' ? 'bg-red-50 border-red-200 text-red-700' : ''}
            `}>
              <span>{node.label}</span>
              <span className="text-[10px] uppercase opacity-50 font-mono tracking-wider">{node.type}</span>
            </div>
         </div>
       ))}
    </div>
  );

  // -- Sub-component: Dashboard View --
  const DashboardView = ({ score, status, metric, value, limit, unit, formula }: any) => {
    const isPass = status === 'Calc' ? true : value <= limit;
    const percentage = Math.min(Math.max((value / (limit * 1.5)) * 100, 10), 100);
    
    return (
      <div className="p-6 space-y-8">
        <div className={`p-6 rounded-2xl border-2 ${isPass ? 'bg-emerald-50 border-emerald-100' : 'bg-red-50 border-red-100'} text-center`}>
           <div className="text-sm uppercase font-bold text-slate-500 mb-2">合规状态</div>
           <div className={`text-4xl font-black ${isPass ? 'text-emerald-600' : 'text-red-600'}`}>
             {status === 'Calc' ? 'COMPLETED' : status === 'Pass' ? 'PASS' : 'FAIL'}
           </div>
        </div>

        <div>
          <div className="flex justify-between text-sm font-bold text-slate-600 mb-2">
            <span>{metric}</span>
            <span>{value} <span className="text-slate-400">{unit}</span></span>
          </div>
          <div className="h-4 bg-slate-200 rounded-full overflow-hidden">
             <div 
               className={`h-full transition-all duration-1000 ease-out ${isPass ? 'bg-blue-500' : 'bg-red-500'}`} 
               style={{ width: `${percentage}%` }}
             ></div>
          </div>
          <div className="flex justify-between text-xs text-slate-400 mt-1 font-mono">
            <span>0</span>
            <span>Limit: {limit}</span>
            <span>{limit * 1.5}</span>
          </div>
        </div>

        {formula && (
           <div className="bg-slate-800 rounded-xl p-4 text-slate-300 font-mono text-xs">
             <div className="flex items-center gap-2 mb-2 text-slate-500 font-bold uppercase">
               <Activity size={12} /> 计算公式
             </div>
             <div>{formula}</div>
           </div>
        )}
      </div>
    );
  };

  // -- Sub-component: Doc View --
  const DocView = ({ title, highlight, content }: any) => (
    <div className="p-4 h-full flex flex-col">
       <div className="bg-white border border-slate-200 shadow-sm flex-1 rounded-sm p-6 font-serif text-slate-800 text-sm leading-relaxed overflow-y-auto relative">
         {/* Paper texture effect */}
         <div className="absolute top-0 right-0 p-2 opacity-10">
           <FileText size={64} />
         </div>

         <div className="border-b-2 border-slate-800 pb-2 mb-4 font-bold text-lg text-slate-900">
           {title}
         </div>
         
         <div className="space-y-2 opacity-80 text-xs text-slate-500 font-sans mb-4">
           <div>DOC ID: ISO-9001-REF-2024</div>
           <div>CLASSIFICATION: INTERNAL</div>
         </div>

         {content && content.map((line: string, i: number) => (
           <div key={i} className={`py-1 ${line.includes(highlight.split(':')[0]) ? 'bg-yellow-100 -mx-2 px-2 border-l-4 border-yellow-400 text-slate-900 font-medium' : ''}`}>
             {line}
           </div>
         ))}
       </div>
    </div>
  );

  const renderContent = () => {
    if (isThinking && !data) {
       return (
         <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-4">
           <Search size={48} className="animate-pulse opacity-50" />
           <p className="text-xs font-mono uppercase tracking-widest">检索相关数据...</p>
         </div>
       );
    }

    switch (viewMode) {
      case 'graph': return <GraphView nodes={data?.nodes} />;
      case 'dashboard': return <DashboardView {...data} />;
      case 'doc': return <DocView {...data} />;
      default: return (
        <div className="h-full flex flex-col items-center justify-center text-slate-300 space-y-4">
           <Brain size={64} strokeWidth={1} />
           <p className="text-sm">LogicGuard 系统就绪</p>
        </div>
      );
    }
  };

  const getHeaderIcon = () => {
    switch (viewMode) {
      case 'graph': return <Share2 size={16} className="text-blue-600" />;
      case 'doc': return <FileText size={16} className="text-amber-600" />;
      case 'dashboard': return <Activity size={16} className="text-emerald-600" />;
      default: return <Brain size={16} className="text-indigo-600" />;
    }
  };

  const getHeaderTitle = () => {
    switch (viewMode) {
      case 'graph': return '知识图谱 (Knowledge Graph)';
      case 'doc': return '原始文档 (Source Doc)';
      case 'dashboard': return '合规仪表盘 (Compliance)';
      default: return '系统状态 (System Status)';
    }
  };

  return (
    <div className="w-[400px] bg-white border-l border-slate-200 hidden xl:flex flex-col h-full shadow-xl z-20">
      {/* Header */}
      <div className="p-4 border-b border-slate-100 bg-white flex items-center justify-between">
        <h2 className="text-xs font-bold text-slate-700 flex items-center gap-2 uppercase tracking-wide">
          {getHeaderIcon()}
          {getHeaderTitle()}
        </h2>
        {isThinking && <span className="w-2 h-2 bg-blue-500 rounded-full animate-ping"></span>}
      </div>

      <div className="flex-1 overflow-hidden bg-slate-50 relative">
         {renderContent()}
      </div>
      
      {/* Footer Info */}
      <div className="p-3 bg-slate-900 text-slate-400 text-[10px] font-mono border-t border-slate-800 flex justify-between">
         <span>LATENCY: 42ms</span>
         <span>CTX: 128k</span>
      </div>
    </div>
  );
};

export default RightPanel;