import React from 'react';
import { PanelViewMode } from '../types';
import { Brain, FileText, Activity, Share2, Search, AlertTriangle, CheckCircle, XCircle, ShieldAlert } from 'lucide-react';

interface RightPanelProps {
  viewMode: PanelViewMode;
  data: any;
  isThinking: boolean;
}

const RightPanel: React.FC<RightPanelProps> = ({ viewMode, data, isThinking }) => {

  // --- View 1: Knowledge Graph (Units & Risk) ---
  const GraphView = ({ data }: { data: any }) => {
    if (data.type === 'conflict') {
      return (
        <div className="h-full flex flex-col items-center justify-center p-6">
          <div className="relative w-full max-w-[280px] h-[300px] flex flex-col items-center justify-center">
            {/* Center Node */}
            <div className="z-10 w-24 h-24 rounded-full bg-slate-800 border-2 border-slate-600 flex flex-col items-center justify-center text-center shadow-[0_0_20px_rgba(30,41,59,0.5)]">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">实体</span>
              <span className="text-sm font-bold text-slate-200">持续时间</span>
            </div>

            {/* Connecting Lines */}
            <div className="absolute top-1/2 left-0 w-full h-[1px] bg-slate-700 -translate-y-1/2"></div>

            {/* Nodes Wrapper */}
            <div className="absolute inset-0 flex justify-between items-center w-full">
              {/* Left Node (Correct) */}
              <div className="flex flex-col items-center gap-2 z-10 p-2 bg-slate-900/80 rounded-lg backdrop-blur-sm">
                <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/50 flex items-center justify-center shadow-[0_0_15px_rgba(16,185,129,0.2)]">
                   <span className="text-xs font-bold text-emerald-400 font-mono">60s</span>
                </div>
                <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-500 uppercase">
                  <CheckCircle size={10} /> 标准
                </div>
              </div>

              {/* Right Node (Wrong) */}
              <div className="flex flex-col items-center gap-2 z-10 p-2 bg-slate-900/80 rounded-lg backdrop-blur-sm">
                 <div className="w-16 h-16 rounded-full bg-rose-500/10 border border-rose-500/50 flex items-center justify-center shadow-[0_0_15px_rgba(244,63,94,0.2)] relative">
                   <span className="text-xs font-bold text-rose-400 line-through decoration-2 font-mono">60mm</span>
                   <div className="absolute -top-1 -right-1 bg-rose-500 rounded-full p-0.5 border border-slate-900">
                     <XCircle size={12} className="text-white" />
                   </div>
                 </div>
                 <div className="flex items-center gap-1 text-[10px] font-bold text-rose-500 uppercase">
                  <AlertTriangle size={10} /> 冲突
                </div>
              </div>
            </div>
          </div>
          <div className="mt-8 p-3 rounded bg-slate-800/50 border border-slate-700 text-xs text-slate-400 font-mono text-center w-full">
             <span className="text-rose-400">错误:</span> 维度不匹配 (长度 vs 时间)
          </div>
        </div>
      );
    } 
    
    // Scenario 5: Risk Propagation
    if (data.type === 'risk') {
       return (
         <div className="h-full flex flex-col items-center justify-center p-8">
            <div className="space-y-6 w-full max-w-[280px]">
               {data.nodes.map((node: any, idx: number) => (
                 <div key={idx} className="relative flex flex-col items-center animate-in fade-in slide-in-from-bottom-4 duration-700" style={{ animationDelay: `${idx * 200}ms` }}>
                    <div className={`
                      w-full py-3 px-4 rounded-lg border-l-4 shadow-lg flex items-center justify-between backdrop-blur-sm
                      ${node.status === 'neutral' ? 'bg-slate-800 border-blue-500 text-slate-300' : ''}
                      ${node.status === 'warning' ? 'bg-amber-950/30 border-amber-500 text-amber-200' : ''}
                      ${node.status === 'danger' ? 'bg-rose-950/30 border-rose-500 text-rose-200 font-bold' : ''}
                    `}>
                      <span className="text-xs">{node.label}</span>
                      {node.status === 'danger' && <ShieldAlert size={14} className="text-rose-500" />}
                    </div>
                    {idx < data.nodes.length - 1 && (
                      <div className="h-6 w-[2px] bg-slate-700 my-1"></div>
                    )}
                 </div>
               ))}
            </div>
         </div>
       );
    }

    return null;
  };

  // --- View 2a: Dashboard Fail (Semi-Circle Gauge) ---
  const DashboardFailView = ({ data }: { data: any }) => {
    const min = 0;
    const max = data.limit * 1.5; // Scale max to 150% of limit
    const current = Math.min(Math.max(data.value, min), max);
    const percentage = ((current - min) / (max - min)) * 100;
    
    // Needle rotation (0% = -90deg, 100% = 90deg)
    const rotation = (percentage / 100) * 180 - 90;

    return (
      <div className="h-full flex flex-col items-center justify-center p-6 space-y-10">
          {/* Semi-Circle Gauge Container */}
          <div className="relative w-[240px] h-[120px] overflow-hidden">
            
            {/* The Gauge Arc (Conic Gradient) */}
            <div className="absolute top-0 left-0 w-[240px] h-[240px] rounded-full"
                  style={{
                    background: `conic-gradient(from 270deg at 50% 50%, 
                      #10b981 0%, 
                      #10b981 60%, 
                      #f59e0b 60%, 
                      #f59e0b 80%, 
                      #ef4444 80%, 
                      #ef4444 100%
                    )`,
                    transform: 'rotate(-90deg)'
                  }}>
            </div>

            {/* Inner Mask (to create the arc) */}
            <div className="absolute top-[30px] left-[30px] w-[180px] h-[180px] bg-slate-950 rounded-full z-10 flex items-center justify-center">
                {/* Inner decoration */}
                <div className="w-[140px] h-[140px] rounded-full border border-slate-800 bg-slate-900/50"></div>
            </div>

            {/* Needle Wrapper (Centered at bottom) */}
            <div className="absolute bottom-0 left-[120px] w-0 h-0 z-20"
                  style={{ transform: `rotate(${rotation}deg)`, transition: 'transform 1s cubic-bezier(0.4, 0, 0.2, 1)' }}>
                {/* The Needle */}
                <div className="absolute bottom-0 left-[-4px] w-[8px] h-[120px] bg-slate-200 rounded-t-full origin-bottom"
                      style={{ 
                        boxShadow: '0 0 10px rgba(0,0,0,0.5)',
                        background: 'linear-gradient(to top, #cbd5e1 50%, #f43f5e 100%)' 
                      }}>
                </div>
            </div>
            
            {/* Gauge Pivot Point */}
            <div className="absolute bottom-[-10px] left-[110px] w-[20px] h-[20px] bg-slate-700 border-2 border-slate-500 rounded-full z-30 shadow-lg"></div>
          </div>

          <div className="text-center z-10 -mt-4">
            <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">{data.metric}</div>
            <div className="text-6xl font-black font-mono mb-4 tracking-tight drop-shadow-2xl text-rose-500">
              {data.value} <span className="text-xl text-slate-600 font-normal">{data.unit}</span>
            </div>
            
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold uppercase tracking-wider shadow-lg backdrop-blur-md bg-rose-950/40 text-rose-500 border border-rose-500/30 animate-pulse">
              <XCircle size={16} /> 不合格 (FAIL)
            </div>
          </div>

          <div className="w-full bg-slate-900 rounded-xl p-4 text-xs flex justify-between items-center border border-slate-800 shadow-inner">
            <span className="text-slate-500">检测标准</span>
            <span className="font-mono font-bold text-slate-300 bg-slate-800 px-2 py-1 rounded">TSP-003 ≤ {data.limit} {data.unit}</span>
          </div>
      </div>
    );
  };

  // --- View 2b: Dashboard Pass (Progress Bar) ---
  const DashboardPassView = ({ data }: { data: any }) => {
    return (
      <div className="h-full flex flex-col justify-center p-8 space-y-10">
        <div className="text-center space-y-4">
          <div className="w-20 h-20 bg-emerald-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4 text-emerald-500 shadow-[0_0_30px_rgba(16,185,129,0.1)] border border-emerald-500/20">
            <Activity size={40} />
          </div>
          <div className="text-sm font-bold text-slate-500 uppercase tracking-widest">{data.metric}</div>
          <div className="text-6xl font-black text-emerald-500 font-mono tracking-tighter drop-shadow-lg">{data.value}%</div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/20 text-emerald-400 text-xs font-bold rounded uppercase border border-emerald-500/20">
            <CheckCircle size={14} /> 状态: {data.status}
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-[10px] font-bold text-slate-500 uppercase font-mono">
            <span>0%</span>
            <span>限值: {data.limit}%</span>
            <span>100%</span>
          </div>
          <div className="h-8 bg-slate-800 rounded-sm overflow-hidden border border-slate-700 relative">
            {/* Limit Marker */}
            <div className="absolute top-0 bottom-0 left-[95%] w-[1px] bg-red-500/50 z-20"></div>
            {/* Bar */}
            <div 
              className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.4)] transition-all duration-1000" 
              style={{ width: `${data.value}%` }}
            ></div>
            {/* Scanline Effect */}
            <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.1)_50%,transparent_100%)] w-full h-full animate-[shimmer_2s_infinite]"></div>
          </div>
        </div>
        
        {data.formula && (
          <div className="bg-slate-900 p-4 rounded-lg text-slate-400 font-mono text-[10px] border-l-2 border-emerald-500 shadow-inner">
            <div className="text-emerald-500/70 uppercase font-bold mb-1 flex items-center gap-2">
              <Search size={10} /> 计算逻辑
            </div>
            {data.formula}
          </div>
        )}
      </div>
    );
  };

  // --- View 3: Document (Failure Analysis) ---
  const DocView = ({ data }: { data: any }) => (
    <div className="p-6 h-full flex flex-col">
       <div className="bg-slate-900 border border-slate-700 shadow-xl flex-1 rounded-sm p-8 font-serif text-slate-300 text-sm leading-relaxed overflow-y-auto relative">
         {/* Paper Texture Overlay */}
         <div className="absolute inset-0 bg-slate-200/5 pointer-events-none"></div>

         {/* Document Header */}
         <div className="border-b-2 border-slate-700 pb-4 mb-6 relative z-10">
           <div className="flex justify-between items-start">
             <div>
                <h3 className="font-bold text-lg text-slate-100 leading-tight">{data.title}</h3>
                <div className="text-[10px] text-slate-500 font-sans mt-1 uppercase tracking-wider">密级：机密 / 内部资料</div>
             </div>
             <FileText size={24} className="text-slate-600" />
           </div>
         </div>
         
         {/* Content with Highlight */}
         <div className="space-y-3 font-mono text-xs md:text-sm text-slate-400 relative z-10">
           {data.content && data.content.map((line: string, i: number) => {
             const isHighlight = line.includes(data.highlight) || (data.highlight === '复现条件' && (line.includes('1.') || line.includes('2.') || line.includes('3.')));
             return (
              <div key={i} className={`py-1 px-2 -mx-2 rounded transition-colors ${isHighlight ? 'bg-yellow-500/20 border-l-2 border-yellow-500 text-yellow-100 font-bold' : ''}`}>
                {line}
              </div>
             );
           })}
         </div>

         {/* Footer signature */}
         <div className="mt-8 pt-4 border-t border-slate-800 text-[10px] text-slate-600 font-sans flex justify-between relative z-10">
           <span>文档ID: 2024-ENG-089</span>
           <span>第 1 页 / 共 4 页</span>
         </div>
       </div>
    </div>
  );

  // Main Render Logic
  const renderContent = () => {
    if (isThinking && !data) {
       return (
         <div className="h-full flex flex-col items-center justify-center text-slate-600 space-y-4">
           <Search size={48} className="animate-pulse opacity-20" />
           <p className="text-xs font-mono uppercase tracking-widest animate-pulse text-blue-500/50">正在检索智能情报...</p>
         </div>
       );
    }

    if (!data) {
      return (
        <div className="h-full flex flex-col items-center justify-center text-slate-500 space-y-4 opacity-50">
           <div className="w-24 h-24 bg-slate-800 rounded-full flex items-center justify-center border border-slate-700">
             <Brain size={48} className="text-slate-600" />
           </div>
           <p className="text-xs font-mono tracking-widest">系统就绪 / 等待输入</p>
        </div>
      );
    }

    switch (viewMode) {
      case 'graph': return <GraphView data={data} />;
      case 'dashboard-fail': return <DashboardFailView data={data} />;
      case 'dashboard-pass': return <DashboardPassView data={data} />;
      case 'doc': return <DocView data={data} />;
      default: return null;
    }
  };

  const getHeaderInfo = () => {
    switch (viewMode) {
      case 'graph': return { title: '知识图谱可视化', icon: <Share2 size={14} className="text-blue-500" /> };
      case 'doc': return { title: '检索到的文档源', icon: <FileText size={14} className="text-amber-500" /> };
      case 'dashboard-fail': return { title: '实时合规仪表盘 (异常)', icon: <AlertTriangle size={14} className="text-rose-500" /> };
      case 'dashboard-pass': return { title: '实时合规仪表盘 (正常)', icon: <Activity size={14} className="text-emerald-500" /> };
      default: return { title: '智能分析面板', icon: <Brain size={14} className="text-indigo-500" /> };
    }
  };

  const { title, icon } = getHeaderInfo();

  return (
    <div className="w-[400px] bg-slate-900 border-l border-slate-800 hidden xl:flex flex-col h-full shadow-2xl z-20 shrink-0">
      {/* Header */}
      <div className="h-14 px-4 border-b border-slate-800 bg-slate-900 flex items-center justify-between">
        <h2 className="text-xs font-bold text-slate-300 flex items-center gap-2 uppercase tracking-wide font-mono">
          {icon}
          {title}
        </h2>
        {isThinking && <span className="flex h-2 w-2 relative">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-500 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600"></span>
        </span>}
      </div>

      <div className="flex-1 overflow-hidden bg-slate-950 relative">
         {/* Grid Background Effect */}
         <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
              style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
         </div>
         {renderContent()}
      </div>
      
      {/* Footer Info */}
      <div className="h-8 bg-slate-900 border-t border-slate-800 flex items-center justify-between px-4 text-[10px] text-slate-600 font-mono">
         <span>网络延迟: 14ms</span>
         <span>安全连接</span>
      </div>
    </div>
  );
};

export default RightPanel;