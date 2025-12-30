import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, RefreshCw, Ruler, Activity, AlertTriangle, Calculator, FileText } from 'lucide-react';
import Sidebar from './components/Sidebar';
import ChatMessage from './components/ChatMessage';
import RightPanel from './components/RightPanel';
import { Message, PanelViewMode } from './types';
import { SCENARIOS } from './constants';

function App() {
  // State
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'init-1',
      role: 'agent',
      content: "您好！我是 LogicGuard 工业合规智能体。\n\n已加载 **IEC-60335**、**GB/T-2423** 等 12 个行业标准库。\n请选择上方快捷场景或直接输入问题。",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [rightPanelView, setRightPanelView] = useState<PanelViewMode>('default');
  const [rightPanelData, setRightPanelData] = useState<any>(null);

  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages, isThinking]);

  // Handle Scenario Click
  const triggerScenario = async (scenarioId: string) => {
    if (isThinking) return;

    const scenario = SCENARIOS.find(s => s.id === scenarioId);
    if (!scenario) return;

    // 1. Add User Message
    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: scenario.userQuery,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMsg]);
    setIsThinking(true);
    setRightPanelView('default'); // Reset panel while thinking

    // 2. Simulate Network/Processing Delay
    await new Promise(r => setTimeout(r, 1500));

    // 3. Trigger Panel Update & Thinking Steps
    setRightPanelView(scenario.panelView);
    setRightPanelData(scenario.panelData);

    // 4. Add Agent Message
    const agentMsg: Message = {
      id: 'agent-' + Date.now(),
      role: 'agent',
      content: scenario.response,
      thoughtChain: scenario.thoughtChain,
      timestamp: new Date(),
      relatedView: scenario.panelView,
      relatedData: scenario.panelData
    };

    setMessages(prev => [...prev, agentMsg]);
    setIsThinking(false);
  };

  // Fallback for manual input (Demo logic for manual input is limited)
  const handleManualSend = async () => {
    if (!input.trim() || isThinking) return;
    
    // Add User Message
    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsThinking(true);

    await new Promise(r => setTimeout(r, 1000));

    // Generic fallback response
    const fallbackMsg: Message = {
      id: 'fallback-' + Date.now(),
      role: 'agent',
      content: "这是一个演示系统。请点击输入框上方的 **快捷按钮** 来体验完整的思维链和图谱交互功能。",
      timestamp: new Date(),
      thoughtChain: [{ label: '接收输入', status: 'completed', detail: '未匹配到预设演示场景' }]
    };
    setMessages(prev => [...prev, fallbackMsg]);
    setIsThinking(false);
  };

  const handleReset = () => {
    setMessages([messages[0]]);
    setRightPanelView('default');
    setRightPanelData(null);
  };

  // Map icons for buttons
  const getIcon = (name: string) => {
    const props = { size: 14, className: "text-slate-500 group-hover:text-blue-600" };
    switch(name) {
      case 'Ruler': return <Ruler {...props} />;
      case 'Activity': return <Activity {...props} />;
      case 'AlertTriangle': return <AlertTriangle {...props} />;
      case 'Calculator': return <Calculator {...props} />;
      case 'FileText': return <FileText {...props} />;
      default: return <Sparkles {...props} />;
    }
  };

  return (
    <div className="flex h-screen bg-slate-100 overflow-hidden font-sans text-slate-900 selection:bg-blue-100">
      
      {/* Sidebar (Static) */}
      <Sidebar />

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col h-full relative z-10">
        
        {/* Top Bar Mobile */}
        <div className="md:hidden h-14 bg-slate-900 text-white flex items-center px-4 justify-between shadow-md">
           <span className="font-bold tracking-tight">LogicGuard</span>
           <span className="text-[10px] bg-blue-600 px-2 py-0.5 rounded font-mono">DEMO</span>
        </div>

        {/* Messages List */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 scroll-smooth" ref={chatContainerRef}>
          <div className="max-w-4xl mx-auto pb-4">
             {messages.map((msg) => (
               <ChatMessage 
                 key={msg.id} 
                 message={msg} 
                 isThinking={isThinking && msg.role === 'agent' && !msg.content} 
                />
             ))}
             {isThinking && (
               <div className="flex items-center gap-2 text-xs text-slate-400 ml-14 animate-pulse">
                 <RefreshCw size={12} className="animate-spin" />
                 LogicGuard 正在推理中...
               </div>
             )}
             <div className="h-40"></div> {/* Spacer */}
          </div>
        </div>

        {/* Input & Controls Area */}
        <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-slate-100 via-slate-100 to-transparent">
          <div className="max-w-4xl mx-auto flex flex-col gap-4">
            
            {/* Quick Actions (CRITICAL) */}
            <div className="flex flex-wrap gap-2 animate-in slide-in-from-bottom-2 duration-700">
               {SCENARIOS.map((scenario) => (
                 <button 
                  key={scenario.id}
                  onClick={() => triggerScenario(scenario.id)}
                  disabled={isThinking}
                  className="group flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 shadow-sm rounded-lg hover:border-blue-400 hover:shadow-md transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
                 >
                   {getIcon(scenario.icon)}
                   <span className="text-xs font-semibold text-slate-700 group-hover:text-blue-700">{scenario.label.split(':')[1]}</span>
                 </button>
               ))}
               <button onClick={handleReset} className="ml-auto flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-400 hover:text-slate-600 transition-colors">
                  <RefreshCw size={12}/> 重置
               </button>
            </div>

            {/* Input Box */}
            <div className="relative shadow-xl shadow-slate-200/50 rounded-2xl bg-white border border-slate-200 focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-50 transition-all overflow-hidden">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleManualSend();
                  }
                }}
                placeholder="输入测试参数、查询标准或描述故障现象..."
                className="w-full pl-6 pr-16 py-4 bg-transparent outline-none resize-none text-slate-700 placeholder:text-slate-300 min-h-[60px]"
                rows={1}
                disabled={isThinking}
              />
              <button 
                onClick={handleManualSend}
                disabled={!input.trim() || isThinking}
                className={`absolute right-2 bottom-2 p-2.5 rounded-xl transition-all ${
                  input.trim() && !isThinking
                    ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-600/20 rotate-0 scale-100' 
                    : 'bg-slate-100 text-slate-300 scale-90'
                }`}
              >
                <Send size={18} />
              </button>
            </div>

            <div className="text-center">
              <span className="text-[10px] text-slate-400 font-medium">LogicGuard Industrial Compliance Agent v1.0.4 (Preview)</span>
            </div>
          </div>
        </div>

      </div>

      {/* Dynamic Right Panel */}
      <RightPanel 
        viewMode={rightPanelView}
        data={rightPanelData}
        isThinking={isThinking}
      />

    </div>
  );
}

export default App;