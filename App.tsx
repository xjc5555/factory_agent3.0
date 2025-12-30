import React, { useState, useRef, useEffect } from 'react';
import { Send, RefreshCw, Ruler, Activity, AlertTriangle, Calculator, FileText, Search, Filter, MoreHorizontal, Download } from 'lucide-react';
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
      content: "您好！我是 LogicGuard 工业合规智能体。\n\n已连接 **ERP, PLM, MES** 系统。\n您可以询问标准查询、合规检测、故障分析或风险评估相关问题。",
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
      thoughtChain: [{ label: '系统状态', status: 'completed', detail: 'Demo Mode Active' }]
    }]);
    setIsThinking(false);
  };

  const getIcon = (name: string) => {
    const p = { size: 14, className: "text-slate-500 group-hover:text-blue-600 transition-colors" };
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
    <div className="flex h-full overflow-hidden">
      <div className="flex-1 flex flex-col relative z-10 bg-slate-50/30">
        {/* Chat List */}
        <div className="flex-1 overflow-y-auto p-6 scroll-smooth" ref={chatContainerRef}>
          <div className="max-w-3xl mx-auto pb-6">
             {messages.map((msg) => (
               <ChatMessage key={msg.id} message={msg} isThinking={isThinking && msg.role === 'agent' && !msg.content} />
             ))}
             {isThinking && (
               <div className="flex items-center gap-2 text-xs text-slate-400 ml-14 animate-pulse font-mono">
                 <RefreshCw size={12} className="animate-spin" /> PROCESSING REASONING CHAIN...
               </div>
             )}
             <div className="h-48"></div> 
          </div>
        </div>

        {/* Input Area */}
        <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-slate-100 via-slate-100 to-transparent">
          <div className="max-w-3xl mx-auto flex flex-col gap-4">
            {/* Quick Actions */}
            <div className="flex flex-wrap gap-2 animate-in slide-in-from-bottom-2 duration-500">
               {SCENARIOS.map((s) => (
                 <button key={s.id} onClick={() => triggerScenario(s.id)} disabled={isThinking}
                  className="group flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 shadow-sm rounded-lg hover:border-blue-400 hover:shadow-md transition-all active:scale-95 disabled:opacity-50">
                   {getIcon(s.icon)}
                   <span className="text-xs font-semibold text-slate-600 group-hover:text-blue-700">{s.label.split(':')[1]}</span>
                 </button>
               ))}
               <button onClick={() => { setMessages([messages[0]]); setRightPanelView('default'); setRightPanelData(null); }} className="ml-auto text-slate-400 hover:text-slate-600 p-2"><RefreshCw size={14} /></button>
            </div>

            {/* Input */}
            <div className="relative shadow-xl shadow-slate-200/60 rounded-xl bg-white border border-slate-200 focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-50 transition-all">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleManualSend()}
                placeholder="Ask LogicGuard about standards, compliance, or risks..."
                className="w-full pl-5 pr-14 py-4 bg-transparent outline-none text-slate-700 placeholder:text-slate-300"
                disabled={isThinking}
              />
              <button onClick={handleManualSend} disabled={!input.trim() || isThinking}
                className={`absolute right-2 top-2 bottom-2 aspect-square flex items-center justify-center rounded-lg transition-all ${input.trim() ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' : 'bg-slate-100 text-slate-300'}`}>
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
    <div className="flex-1 bg-slate-50 p-8 overflow-y-auto">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">工业知识库 (Knowledge Base)</h2>
            <p className="text-sm text-slate-500 mt-1">Managed Standards, Regulations, and Internal Protocols.</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">
             <Download size={16} /> Export Catalog
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm mb-6 flex gap-4">
          <div className="flex-1 relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input placeholder="Search standards code or name..." className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:border-blue-500" />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg text-sm font-medium hover:bg-slate-50">
            <Filter size={16} /> Filters
          </button>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-medium">
              <tr>
                <th className="px-6 py-4">Standard Code</th>
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Last Updated</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {MOCK_KB.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 font-mono font-medium text-blue-600">{item.code}</td>
                  <td className="px-6 py-4 text-slate-800 font-medium">{item.name}</td>
                  <td className="px-6 py-4 text-slate-500"><span className="px-2 py-1 bg-slate-100 rounded text-xs">{item.category}</span></td>
                  <td className="px-6 py-4 text-slate-500 font-mono text-xs">{item.updated}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold capitalize ${item.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${item.status === 'active' ? 'bg-emerald-500' : 'bg-slate-400'}`}></span>
                      {item.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right text-slate-400 hover:text-blue-600 cursor-pointer">
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
    <div className="flex-1 bg-slate-50 p-8 overflow-y-auto">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-slate-800">系统审计日志 (Audit Logs)</h2>
          <p className="text-sm text-slate-500 mt-1">Immutable record of all agent interactions and compliance checks.</p>
        </div>

        <div className="space-y-4">
          {MOCK_AUDIT.map((log) => (
            <div key={log.id} className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm hover:border-blue-300 transition-all flex items-center gap-4 group">
               <div className="w-16 text-xs font-mono text-slate-400 text-right">{log.time}</div>
               <div className={`w-2 h-2 rounded-full shrink-0 ${log.result === 'Pass' ? 'bg-emerald-500' : log.result === 'Fail' ? 'bg-rose-500' : 'bg-amber-500'}`}></div>
               <div className="flex-1">
                 <div className="flex items-center gap-2 mb-1">
                   <span className="text-sm font-bold text-slate-800">{log.action}</span>
                   <span className="text-[10px] px-2 py-0.5 bg-slate-100 text-slate-500 rounded font-mono">{log.id}</span>
                 </div>
                 <div className="text-xs text-slate-500">
                   User: <span className="text-slate-700 font-medium">{log.user}</span> • Detail: {log.detail}
                 </div>
               </div>
               <div className={`px-3 py-1 rounded-md text-xs font-bold uppercase ${
                 log.result === 'Pass' ? 'bg-emerald-50 text-emerald-700' : 
                 log.result === 'Fail' ? 'bg-rose-50 text-rose-700' : 'bg-amber-50 text-amber-700'
               }`}>
                 {log.result}
               </div>
            </div>
          ))}
          <div className="text-center py-4 text-xs text-slate-400">End of recent logs</div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-slate-100 font-sans text-slate-900 selection:bg-blue-100">
      <Sidebar activePage={activePage} onNavigate={setActivePage} />
      <div className="flex-1 flex flex-col h-full relative overflow-hidden">
         {/* Mobile Header */}
         <div className="md:hidden h-14 bg-slate-900 text-white flex items-center px-4 justify-between shrink-0">
           <span className="font-bold">LogicGuard</span>
           <span className="text-[10px] bg-blue-600 px-2 py-0.5 rounded">MENU</span>
        </div>
        
        {/* Main Content Switcher */}
        {activePage === 'agent' && <AgentView />}
        {activePage === 'kb' && <KnowledgeBaseView />}
        {activePage === 'audit' && <AuditLogView />}
      </div>
    </div>
  );
}

export default App;