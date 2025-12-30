import React from 'react';
import { Brain, Database, Search, Target, FileCheck, AlertTriangle } from 'lucide-react';
import { KnowledgeItem } from '../types';

interface RightPanelProps {
  activeContext: KnowledgeItem[];
  isThinking: boolean;
  stage: string;
}

const RightPanel: React.FC<RightPanelProps> = ({ activeContext, isThinking, stage }) => {
  return (
    <div className="w-80 bg-slate-50 border-l border-slate-200 hidden lg:flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-slate-200 bg-white">
        <h2 className="text-sm font-bold text-slate-700 flex items-center gap-2 uppercase tracking-wide">
          <Brain size={16} className="text-indigo-600" />
          智能体状态 (Agent State)
        </h2>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        
        {/* Status Card */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
           <div className="text-xs text-slate-400 font-semibold mb-2 uppercase">当前操作</div>
           <div className="flex items-center gap-3">
             <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${isThinking ? 'bg-blue-100' : 'bg-slate-100'}`}>
                {isThinking ? <Search className="text-blue-600 animate-pulse" size={20} /> : <Target className="text-slate-400" size={20} />}
             </div>
             <div>
               <div className="text-sm font-bold text-slate-800">{isThinking ? '处理中...' : '空闲'}</div>
               <div className="text-xs text-slate-500">{stage}</div>
             </div>
           </div>
        </div>

        {/* Knowledge Graph Visualization (Simulated) */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
              <Database size={12} />
              检索到的知识 (KG)
            </h3>
            {activeContext.length > 0 && (
              <span className="bg-indigo-100 text-indigo-700 text-[10px] px-2 py-0.5 rounded-full font-bold">
                {activeContext.length} 个实体
              </span>
            )}
          </div>

          <div className="space-y-3">
            {activeContext.length === 0 ? (
              <div className="text-center py-8 border-2 border-dashed border-slate-200 rounded-xl">
                <Database size={24} className="mx-auto text-slate-300 mb-2" />
                <p className="text-xs text-slate-400">无活跃知识上下文</p>
              </div>
            ) : (
              activeContext.map((item) => (
                <div key={item.id} className="bg-white p-3 rounded-lg border border-slate-200 shadow-sm hover:border-blue-300 transition-colors group">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-xs font-bold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-100">
                      {item.id}
                    </span>
                    <span className="text-[10px] text-slate-400">{item.source.split(' ')[0]}</span>
                  </div>
                  
                  <div className="mb-2">
                    <div className="text-sm font-bold text-slate-800">{item.entity}</div>
                    {item.attribute && <div className="text-xs text-slate-500">{item.attribute}</div>}
                  </div>

                  <div className="bg-slate-50 p-2 rounded text-xs font-mono text-slate-600 mb-2 border border-slate-100">
                    标准值: <span className="font-bold text-slate-900">{item.standard_value || `${item.condition} ${item.threshold}${item.unit}`}</span>
                  </div>

                  {item.hard_negative && (
                    <div className="flex items-start gap-1.5 bg-amber-50 p-2 rounded text-xs text-amber-800 border border-amber-100">
                      <AlertTriangle size={12} className="mt-0.5 shrink-0" />
                      <div>
                        <span className="font-bold">负样本过滤:</span> {item.hard_negative}
                      </div>
                    </div>
                  )}
                  
                  {item.description && (
                    <div className="text-xs text-slate-500 italic mt-1 border-t border-slate-50 pt-1">
                      "{item.description}"
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

         {/* RAG Logic Details */}
        {activeContext.length > 0 && (
           <div className="bg-slate-800 rounded-xl p-4 text-slate-300">
             <div className="flex items-center gap-2 mb-3 text-xs font-bold text-slate-400 uppercase">
               <FileCheck size={12} />
               推理逻辑 (Reasoning)
             </div>
             <div className="space-y-2">
               <div className="flex items-center justify-between text-xs">
                 <span>向量相似度:</span>
                 <span className="text-green-400 font-mono">0.92</span>
               </div>
               <div className="w-full bg-slate-700 h-1.5 rounded-full overflow-hidden">
                 <div className="bg-green-500 h-full w-[92%]"></div>
               </div>
               
               <div className="flex items-center justify-between text-xs mt-2">
                 <span>图谱对齐 (KG Alignment):</span>
                 <span className="text-blue-400 font-mono">已验证 (Verified)</span>
               </div>
             </div>
           </div>
        )}

      </div>
    </div>
  );
};

export default RightPanel;