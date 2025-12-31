import React, { useState, useRef, useEffect } from 'react';
import { Send, RefreshCw, Ruler, Activity, AlertTriangle, Calculator, FileText, Search, Filter, MoreHorizontal, Download, Server, Cpu, Database, Sliders, Check, Shield } from 'lucide-react';
import Sidebar from './components/Sidebar';
import ChatMessage from './components/ChatMessage';
import RightPanel from './components/RightPanel';
import { Message, PanelViewMode, PageMode } from './types';
import { SCENARIOS, MOCK_KB, MOCK_AUDIT } from './constants';

function App() {
  // --- Global State ---
  const [activePage, setActivePage] = useState<PageMode>('agent');

  // --- Agent State ---
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'init-1',
      role: 'agent',
      content: "系统已上线。LogicGuard 工业合规引擎已就绪。\n\n当前接入知识库版本: **v2024.10.05**\n已连接传感器数据流: **24/24** 节点在线。\n\n请选择测试场景或直接输入指令。",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [rightPanelView, setRightPanelView] = useState<PanelViewMode>('default');
  const [rightPanelData, setRightPanelData] = useState<any>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll chat
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages, isThinking]);

  // --- Agent Logic ---
  const triggerScenario = async (scenarioId: string) => {
    if (isThinking) return;
    const scenario = SCENARIOS.find(s => s.id === scenarioId);
    if (!scenario) return;

    // 1. User Message
    setMessages(prev => [...prev, {
      id: Date.now().toString(),
      role: 'user',
      content: scenario.userQuery,
      timestamp: new Date()
    }]);
    setIsThinking(true);
    setRightPanelView('default'); 

    // 2. Simulate Delay
    await new Promise(r => setTimeout(r, 1200));

    // 3. Update Panel & Add Agent Message
    setRightPanelView(scenario.panelView);
    setRightPanelData(scenario.panelData);
    setMessages(prev => [...prev, {
      id: 'agent-' + Date.now(),
      role: 'agent',
      content: scenario.response,
      thoughtChain: scenario.thoughtChain,
      timestamp: new Date(),
      relatedView: scenario.panelView,
      relatedData: scenario.panelData
    }]);
    setIsThinking(false);
  };

  const handleManualSend = async () => {
    if (!input.trim() || isThinking) return;
    setMessages(prev => [...prev, { id: Date.now().toString(), role: 'user', content: input, timestamp: new Date() }]);
    setInput('');
    setIsThinking(true);
    await new Promise(r => setTimeout(r, 1000));
    setMessages(prev => [...prev, {
      id: 'fb-' + Date.now(),
      role: 'agent',
      content: "这是一个演示版本。请使用上方的 **快捷场景按钮** 来体验完整的工业 AI 能力。",
      timestamp: new Date(),
      thoughtChain: [{ label: '系统状态', status: 'completed', detail: '演示模式已激活' }]
    }]);
    setIsThinking(false);
  };

  const getIcon = (name: string) => {
    const p = { size: 14, className: "text-slate-400 group-hover:text-blue-400 transition-colors" };
    switch(name) {
      case 'Ruler': return <Ruler {...p} />;
      case 'Activity': return <Activity {...p} />;
      case 'AlertTriangle': return <AlertTriangle {...p} />;
      case 'Calculator': return <Calculator {...p} />;
      case 'FileText': return <FileText {...p} />;
      default: return <Activity {...p} />;
    }
  };

  // --- Views ---

  // 1. Agent View
  const AgentView = () => (
    <div className="flex h-full overflow-hidden bg-slate-950">
      <div className="flex-1 flex flex-col relative z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 to-slate-950">
        {/* Chat List */}
        <div className="flex-1 overflow-y-auto p-6 scroll-smooth" ref={chatContainerRef}>
          <div className="max-w-4xl mx-auto pb-6">
             {messages.map((msg) => (
               <ChatMessage key={msg.id} message={msg} isThinking={isThinking && msg.role === 'agent' && !msg.content} />
             ))}
             {isThinking && (
               <div className="flex items-center gap-2 text-xs text-blue-500 ml-14 animate-pulse font-mono tracking-widest">
                 <RefreshCw size={12} className="animate-spin" /> AI 正在进行逻辑推理...
               </div>
             )}
             <div className="h-48"></div> 
          </div>
        </div>

        {/* Input Area */}
        <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-slate-950 via-slate-950/95 to-transparent backdrop-blur-[2px]">
          <div className="max-w-4xl mx-auto flex flex-col gap-4">
            {/* Quick Actions */}
            <div className="flex flex-wrap gap-2 animate-in slide-in-from-bottom-2 duration-500">
               {SCENARIOS.map((s) => (
                 <button key={s.id} onClick={() => triggerScenario(s.id)} disabled={isThinking}
                  className="group flex items-center gap-2 px-3 py-2 bg-slate-800 border border-slate-700 shadow-lg rounded-lg hover:border-blue-500/50 hover:bg-slate-800/80 hover:shadow-blue-500/10 transition-all active:scale-95 disabled:opacity-50">
                   {getIcon(s.icon)}
                   <span className="text-xs font-semibold text-slate-300 group-hover:text-blue-300">{s.label.split(':')[1]}</span>
                 </button>
               ))}
               <button onClick={() => { setMessages([messages[0]]); setRightPanelView('default'); setRightPanelData(null); }} className="ml-auto text-slate-500 hover:text-slate-300 p-2"><RefreshCw size={14} /></button>
            </div>

            {/* Input */}
            <div className="relative shadow-2xl rounded-xl bg-slate-900 border border-slate-700 focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600/50 transition-all">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleManualSend()}
                placeholder="请输入关于标准、合规性或风险的问题..."
                className="w-full pl-5 pr-14 py-4 bg-transparent outline-none text-slate-200 placeholder:text-slate-600 font-sans"
                disabled={isThinking}
              />
              <button onClick={handleManualSend} disabled={!input.trim() || isThinking}
                className={`absolute right-2 top-2 bottom-2 aspect-square flex items-center justify-center rounded-lg transition-all ${input.trim() ? 'bg-blue-600 text-white shadow-[0_0_15px_rgba(37,99,235,0.4)]' : 'bg-slate-800 text-slate-600'}`}>
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Dynamic Right Panel */}
      <RightPanel viewMode={rightPanelView} data={rightPanelData} isThinking={isThinking} />
    </div>
  );

  // 2. Knowledge Base View
  const KnowledgeBaseView = () => (
    <div className="flex-1 bg-slate-950 p-8 overflow-y-auto">
      <div className="max-w-6xl mx-auto animate-in fade-in duration-500">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
              <Database className="text-blue-500" />
              工业知识库 (KB)
            </h2>
            <p className="text-sm text-slate-500 mt-1 font-mono">管理标准、法规及内部协议。</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-500 transition-colors shadow-[0_0_15px_rgba(37,99,235,0.3)]">
             <Download size={16} /> 导出目录
          </button>
        </div>

        {/* Filters */}
        <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 shadow-sm mb-6 flex gap-4">
          <div className="flex-1 relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input placeholder="搜索标准代码或名称..." className="w-full pl-10 pr-4 py-2 bg-slate-950 border border-slate-700 rounded-lg text-sm outline-none text-slate-200 focus:border-blue-500 transition-colors placeholder:text-slate-600" />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-slate-800 border border-slate-700 text-slate-300 rounded-lg text-sm font-medium hover:bg-slate-700 transition-colors">
            <Filter size={16} /> 筛选
          </button>
        </div>

        {/* Table */}
        <div className="bg-slate-900 rounded-xl border border-slate-800 shadow-lg overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-950/50 border-b border-slate-800 text-slate-400 font-medium">
              <tr>
                <th className="px-6 py-4">标准代码</th>
                <th className="px-6 py-4">名称</th>
                <th className="px-6 py-4">分类</th>
                <th className="px-6 py-4">最后更新</th>
                <th className="px-6 py-4">状态</th>
                <th className="px-6 py-4 text-right">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {MOCK_KB.map((item) => (
                <tr key={item.id} className="hover:bg-slate-800/50 transition-colors group">
                  <td className="px-6 py-4 font-mono font-medium text-blue-400 group-hover:text-blue-300">{item.code}</td>
                  <td className="px-6 py-4 text-slate-200 font-medium">{item.name}</td>
                  <td className="px-6 py-4 text-slate-500"><span className="px-2 py-1 bg-slate-800 border border-slate-700 rounded text-xs text-slate-400">{item.category}</span></td>
                  <td className="px-6 py-4 text-slate-500 font-mono text-xs">{item.updated}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold capitalize ${item.status === 'active' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-slate-800 text-slate-500 border border-slate-700'}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${item.status === 'active' ? 'bg-emerald-500' : 'bg-slate-500'}`}></span>
                      {item.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right text-slate-600 hover:text-blue-400 cursor-pointer">
                    <MoreHorizontal size={18} className="ml-auto" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  // 3. Audit Log View
  const AuditLogView = () => (
    <div className="flex-1 bg-slate-950 p-8 overflow-y-auto">
      <div className="max-w-4xl mx-auto animate-in fade-in duration-500">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
            <Shield className="text-blue-500" />
            系统审计日志 (Audit Logs)
          </h2>
          <p className="text-sm text-slate-500 mt-1 font-mono">不可篡改的区块链验证合规检查记录。</p>
        </div>

        <div className="space-y-4">
          {MOCK_AUDIT.map((log) => (
            <div key={log.id} className="bg-slate-900 p-4 rounded-lg border border-slate-800 shadow-sm hover:border-blue-500/30 transition-all flex items-center gap-4 group">
               <div className="w-20 text-xs font-mono text-slate-500 text-right">{log.time}</div>
               <div className={`w-2 h-2 rounded-full shrink-0 ${log.result === 'Pass' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : log.result === 'Fail' ? 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.5)]' : 'bg-amber-500'}`}></div>
               <div className="flex-1">
                 <div className="flex items-center gap-2 mb-1">
                   <span className="text-sm font-bold text-slate-200">{log.action}</span>
                   <span className="text-[10px] px-2 py-0.5 bg-slate-950 border border-slate-800 text-slate-500 rounded font-mono">{log.id}</span>
                 </div>
                 <div className="text-xs text-slate-500">
                   用户: <span className="text-slate-300 font-medium">{log.user}</span> <span className="mx-1">•</span> 详情: {log.detail}
                 </div>
               </div>
               <div className={`px-3 py-1 rounded-md text-xs font-bold uppercase border ${
                 log.result === 'Pass' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 
                 log.result === 'Fail' ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
               }`}>
                 {log.result}
               </div>
            </div>
          ))}
          <div className="text-center py-4 text-xs text-slate-600 font-mono">--- 近期日志结束 ---</div>
        </div>
      </div>
    </div>
  );

  // 4. Settings View
  const SettingsView = () => (
    <div className="flex-1 bg-slate-950 p-8 overflow-y-auto">
      <div className="max-w-3xl mx-auto animate-in fade-in duration-500">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
            <Sliders className="text-blue-500" />
            系统配置 (Configuration)
          </h2>
          <p className="text-sm text-slate-500 mt-1">调整 LogicGuard 引擎参数及阈值。</p>
        </div>

        <div className="space-y-6">
          {/* Card 1: Model Config */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
            <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Cpu size={16} className="text-blue-400" /> 模型配置
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">嵌入模型 (Embedding Model)</label>
                <select className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-slate-200 text-sm outline-none focus:border-blue-500">
                  <option>LogicGuard-v2-Industrial (768d)</option>
                  <option>BGE-Large-En-v1.5</option>
                  <option>OpenAI-Ada-002</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">RAG 上下文窗口</label>
                <select className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-slate-200 text-sm outline-none focus:border-blue-500">
                  <option>16k Tokens (标准)</option>
                  <option>32k Tokens (扩展)</option>
                  <option>128k Tokens (全文档)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Card 2: Thresholds */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
             <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Activity size={16} className="text-emerald-400" /> 合规阈值
            </h3>
            <div className="space-y-6">
              <div>
                 <div className="flex justify-between mb-2">
                   <label className="text-xs font-medium text-slate-400">相似度阈值 (检索)</label>
                   <span className="text-xs font-mono text-blue-400">0.78</span>
                 </div>
                 <input type="range" className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-blue-600 [&::-webkit-slider-thumb]:rounded-full" min="0" max="1" step="0.01" defaultValue="0.78" />
              </div>
              <div>
                 <div className="flex justify-between mb-2">
                   <label className="text-xs font-medium text-slate-400">风险警报灵敏度</label>
                   <span className="text-xs font-mono text-rose-400">High</span>
                 </div>
                 <input type="range" className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-rose-500 [&::-webkit-slider-thumb]:rounded-full" min="0" max="100" defaultValue="80" />
              </div>
            </div>
          </div>

          {/* Card 3: Status */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
             <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Server size={16} className="text-slate-400" /> 系统状态
            </h3>
            <div className="grid grid-cols-2 gap-4">
               <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 flex items-center justify-between">
                 <span className="text-xs text-slate-400">向量数据库</span>
                 <div className="flex items-center gap-1.5">
                   <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
                   <span className="text-[10px] text-emerald-500 font-bold">在线</span>
                 </div>
               </div>
               <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 flex items-center justify-between">
                 <span className="text-xs text-slate-400">知识图谱</span>
                 <div className="flex items-center gap-1.5">
                   <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
                   <span className="text-[10px] text-emerald-500 font-bold">在线</span>
                 </div>
               </div>
               <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 flex items-center justify-between">
                 <span className="text-xs text-slate-400">ERP 连接</span>
                 <div className="flex items-center gap-1.5">
                   <div className="w-1.5 h-1.5 bg-amber-500 rounded-full"></div>
                   <span className="text-[10px] text-amber-500 font-bold">同步中</span>
                 </div>
               </div>
               <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 flex items-center justify-between">
                 <span className="text-xs text-slate-400">API 网关</span>
                 <div className="flex items-center gap-1.5">
                   <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
                   <span className="text-[10px] text-emerald-500 font-bold">在线</span>
                 </div>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-slate-950 font-sans text-slate-200 selection:bg-blue-500/30">
      <Sidebar activePage={activePage} onNavigate={setActivePage} />
      <div className="flex-1 flex flex-col h-full relative overflow-hidden">
         {/* Mobile Header */}
         <div className="md:hidden h-14 bg-slate-900 text-white flex items-center px-4 justify-between shrink-0 border-b border-slate-800">
           <span className="font-bold">LogicGuard</span>
           <span className="text-[10px] bg-blue-600 px-2 py-0.5 rounded">菜单</span>
        </div>
        
        {/* Main Content Switcher */}
        {activePage === 'agent' && <AgentView />}
        {activePage === 'kb' && <KnowledgeBaseView />}
        {activePage === 'audit' && <AuditLogView />}
        {activePage === 'settings' && <SettingsView />}
      </div>
    </div>
  );
}

export default App;