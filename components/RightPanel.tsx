import React from 'react';
import { PanelViewMode } from '../types';
import { Brain, FileText, Activity, Share2, Search, ArrowRight, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';

interface RightPanelProps {
  viewMode: PanelViewMode;
  data: any;
  isThinking: boolean;
}

const RightPanel: React.FC<RightPanelProps> = ({ viewMode, data, isThinking }) => {

  // --- View 1: Knowledge Graph (Units & Risk) ---
  const GraphView = ({ data }: { data: any }) => {
    // Scenario 1: Conflict (Unit Mismatch)
    if (data.type === 'conflict') {
      return (
        <div className="h-full flex flex-col items-center justify-center p-6 bg-slate-50/50">
          <div className="relative w-full max-w-[280px] h-[300px] flex flex-col items-center justify-center">
            {/* Center Node */}
            <div className="z-10 w-24 h-24 rounded-full bg-blue-100 border-4 border-blue-200 flex flex-col items-center justify-center text-center shadow-sm">
              <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">Entity</span>
              <span className="text-sm font-bold text-slate-700">持续时间</span>
            </div>

            {/* Connecting Lines (CSS) */}
            <div className="absolute top-1/2 left-0 w-full h-[2px] bg-slate-300 -translate-y-1/2"></div>

            {/* Nodes Wrapper */}
            <div className="absolute inset-0 flex justify-between items-center w-full">
              
              {/* Left Node (Correct) */}
              <div className="flex flex-col items-center gap-2 z-10 bg-slate-50 p-2">
                <div className="w-16 h-16 rounded-full bg-emerald-100 border-2 border-emerald-400 flex items-center justify-center shadow-md">
                   <span className="text-xs font-bold text-emerald-700 font-mono">60s</span>
                </div>
                <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 uppercase bg-emerald-50 px-2 py-0.5 rounded-full">
                  <CheckCircle size={10} /> Standard
                </div>
              </div>

              {/* Right Node (Wrong) */}
              <div className="flex flex-col items-center gap-2 z-10 bg-slate-50 p-2">
                 <div className="w-16 h-16 rounded-full bg-rose-100 border-2 border-rose-400 flex items-center justify-center shadow-md relative">
                   <span className="text-xs font-bold text-rose-700 line-through decoration-2 font-mono">60mm</span>
                   <div className="absolute -top-1 -right-1 bg-rose-500 rounded-full p-0.5 border-2 border-white">
                     <XCircle size={12} className="text-white" />
                   </div>
                 </div>
                 <div className="flex items-center gap-1 text-[10px] font-bold text-rose-600 uppercase bg-rose-50 px-2 py-0.5 rounded-full">
                  <AlertTriangle size={10} /> Mismatch
                </div>
              </div>
            </div>
          </div>
          <div className="mt-4 text-xs text-slate-400 font-mono text-center">
            Detected unit conflict: Length(mm) vs Time(s)
          </div>
        </div>
      );
    } 
    
    // Scenario 5: Risk Propagation
    if (data.type === 'risk') {
       return (
         <div className="h-full flex flex-col items-center justify-center p-8 bg-slate-50/50">
            <div className="space-y-6 w-full max-w-[260px]">
               {data.nodes.map((node: any, idx: number) => (
                 <div key={idx} className="relative flex flex-col items-center animate-in fade-in slide-in-from-bottom-4 duration-700" style={{ animationDelay: `${idx * 200}ms` }}>
                    <div className={`
                      w-full py-3 px-4 rounded-lg border-l-4 shadow-sm flex items-center justify-between
                      ${node.status === 'neutral' ? 'bg-white border-blue-400 text-slate-700' : ''}
                      ${node.status === 'warning' ? 'bg-amber-50 border-amber-400 text-amber-800' : ''}
                      ${node.status === 'danger' ? 'bg-rose-50 border-rose-500 text-rose-800 font-bold' : ''}
                    `}>
                      <span className="text-xs">{node.label}</span>
                      {node.status === 'danger' && <AlertTriangle size={14} />}
                    </div>
                    {idx < data.nodes.length - 1 && (
                      <div className="h-6 w-[2px] bg-slate-300 my-1"></div>
                    )}
                 </div>
               ))}
            </div>
         </div>
       );
    }

    return null;
  };

  // --- View 2: Dashboard (Gauge & Progress) ---
  const DashboardView = ({ data }: { data: any }) => {
    // Scenario 2: Gauge (Vibration)
    if (data.type === 'gauge') {
      return (
        <div className="h-full flex flex-col items-center justify-center p-6 space-y-8">
           <div className="relative w-48 h-24 overflow-hidden">
              {/* Gauge Background */}
              <div className="absolute top-0 left-0 w-48 h-48 rounded-full border-[12px] border-slate-200 box-border"></div>
              {/* Gauge Red Zone */}
              <div className="absolute top-0 left-0 w-48 h-48 rounded-full border-[12px] border-transparent border-t-rose-500 border-r-rose-500 rotate-[45deg] box-border opacity-20"></div>
              
              {/* Needle */}
              <div className="absolute bottom-0 left-1/2 w-1 h-24 bg-rose-600 origin-bottom rounded-full" style={{ transform: 'translateX(-50%) rotate(35deg)' }}></div>
              <div className="absolute bottom-0 left-1/2 w-4 h-4 bg-slate-800 rounded-full -translate-x-1/2 translate-y-1/2"></div>
           </div>

           <div className="text-center">
             <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">{data.metric}</div>
             <div className="text-4xl font-black text-rose-600 font-mono mb-2">{data.value} <span className="text-lg text-slate-400">{data.unit}</span></div>
             <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-rose-100 text-rose-700 rounded-full text-xs font-bold uppercase">
               <XCircle size={14} /> {data.status}
             </div>
           </div>

           <div className="w-full bg-slate-100 rounded-lg p-3 text-xs text-center border border-slate-200">
             <span className="text-slate-500">Threshold:</span> <span className="font-mono font-bold text-slate-700">≤ {data.limit} {data.unit}</span>
           </div>
        </div>
      );
    }

    // Scenario 4: Progress (Calc)
    if (data.type === 'progress') {
       return (
         <div className="h-full flex flex-col justify-center p-8 space-y-8">
           <div className="text-center space-y-2">
             <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-4 text-emerald-600 shadow-sm">
               <Activity size={32} />
             </div>
             <div className="text-sm font-bold text-slate-500 uppercase">{data.metric}</div>
             <div className="text-5xl font-black text-emerald-600 font-mono tracking-tighter">{data.value}%</div>
           </div>

           <div className="space-y-2">
             <div className="flex justify-between text-xs font-bold text-slate-400 uppercase">
               <span>0%</span>
               <span>Limit: {data.limit}%</span>
               <span>100%</span>
             </div>
             <div className="h-6 bg-slate-100 rounded-full overflow-hidden border border-slate-200 relative">
               <div className="absolute top-0 bottom-0 left-[95%] w-[2px] bg-slate-900 z-10 opacity-20"></div>
               <div className="h-full bg-emerald-500 rounded-full transition-all duration-1000" style={{ width: `${data.value}%` }}></div>
             </div>
           </div>
           
           {data.formula && (
             <div className="bg-slate-800 p-4 rounded-xl text-slate-300 font-mono text-xs shadow-inner">
               <div className="text-[10px] text-slate-500 uppercase font-bold mb-1">Formula logic</div>
               {data.formula}
             </div>
           )}
         </div>
       );
    }
    return null;
  };

  // --- View 3: Document (Failure Analysis) ---
  const DocView = ({ data }: { data: any }) => (
    <div className="p-6 h-full flex flex-col">
       <div className="bg-white border border-slate-200 shadow-sm flex-1 rounded-sm p-8 font-serif text-slate-800 text-sm leading-relaxed overflow-y-auto relative">
         {/* Document Header */}
         <div className="border-b-2 border-slate-800 pb-4 mb-6">
           <div className="flex justify-between items-start">
             <div>
                <h3 className="font-bold text-lg text-slate-900 leading-tight">{data.title}</h3>
                <div className="text-[10px] text-slate-500 font-sans mt-1 uppercase tracking-wider">Classification: INTERNAL USE ONLY</div>
             </div>
             <FileText size={24} className="text-slate-300" />
           </div>
         </div>
         
         {/* Content with Highlight */}
         <div className="space-y-3 font-mono text-xs md:text-sm text-slate-600">
           {data.content && data.content.map((line: string, i: number) => {
             const isHighlight = line.includes(data.highlight) || (data.highlight === '复现条件' && (line.includes('1.') || line.includes('2.') || line.includes('3.')));
             return (
              <div key={i} className={`py-1 px-2 -mx-2 rounded transition-colors ${isHighlight ? 'bg-yellow-100 border-l-2 border-yellow-400 text-slate-900 font-bold' : ''}`}>
                {line}
              </div>
             );
           })}
         </div>

         {/* Footer signature */}
         <div className="mt-8 pt-4 border-t border-slate-100 text-[10px] text-slate-400 font-sans flex justify-between">
           <span>DOC-ID: 2024-ENG-089</span>
           <span>Page 1 of 4</span>
         </div>
       </div>
    </div>
  );

  // Main Render Logic
  const renderContent = () => {
    if (isThinking && !data) {
       return (
         <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-4">
           <Search size={48} className="animate-pulse opacity-30" />
           <p className="text-xs font-mono uppercase tracking-widest animate-pulse">Analyzing Knowledge Graph...</p>
         </div>
       );
    }

    if (!data) {
      return (
        <div className="h-full flex flex-col items-center justify-center text-slate-300 space-y-4">
           <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center">
             <Brain size={40} className="text-slate-300" />
           </div>
           <p className="text-sm font-medium">Ready to process compliance queries.</p>
        </div>
      );
    }

    switch (viewMode) {
      case 'graph': return <GraphView data={data} />;
      case 'dashboard': return <DashboardView data={data} />;
      case 'doc': return <DocView data={data} />;
      default: return null;
    }
  };

  const getHeaderInfo = () => {
    switch (viewMode) {
      case 'graph': return { title: 'Knowledge Graph Visualization', icon: <Share2 size={14} className="text-blue-600" /> };
      case 'doc': return { title: 'Retrieved Document Source', icon: <FileText size={14} className="text-amber-600" /> };
      case 'dashboard': return { title: 'Real-time Compliance Dashboard', icon: <Activity size={14} className="text-emerald-600" /> };
      default: return { title: 'Intelligent Analysis Panel', icon: <Brain size={14} className="text-indigo-600" /> };
    }
  };

  const { title, icon } = getHeaderInfo();

  return (
    <div className="w-[380px] bg-white border-l border-slate-200 hidden xl:flex flex-col h-full shadow-xl z-20 shrink-0">
      {/* Header */}
      <div className="h-14 px-4 border-b border-slate-100 bg-white flex items-center justify-between">
        <h2 className="text-xs font-bold text-slate-700 flex items-center gap-2 uppercase tracking-wide">
          {icon}
          {title}
        </h2>
        {isThinking && <span className="flex h-2 w-2 relative">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
        </span>}
      </div>

      <div className="flex-1 overflow-hidden bg-slate-50 relative">
         {renderContent()}
      </div>
    </div>
  );
};

export default RightPanel;