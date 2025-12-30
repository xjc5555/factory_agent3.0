import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, MessageSquarePlus, RefreshCw } from 'lucide-react';
import Sidebar from './components/Sidebar';
import ChatMessage from './components/ChatMessage';
import RightPanel from './components/RightPanel';
import { Message, ThoughtStep, KnowledgeItem } from './types';
import { MOCK_DATA, DEMO_QUESTIONS } from './constants';

function App() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'init-1',
      role: 'agent',
      content: "你好！我是 LogicGuard，您的工业合规助手。我可以帮助您根据 TSS、TSP 等标准验证测试参数。\n\n**您可以尝试询问：**\n* 加热测试持续时间\n* 防水等级 (IPX)",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [thinkingState, setThinkingState] = useState<{
    steps: ThoughtStep[];
    stage: string;
    activeContext: KnowledgeItem[];
  }>({
    steps: [],
    stage: '就绪 (Ready)',
    activeContext: []
  });

  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages, thinkingState.steps]);

  const handleSend = async () => {
    if (!input.trim() || isThinking) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsThinking(true);

    // Initial Thought State
    const initialSteps: ThoughtStep[] = [
      { label: '意图识别 (Intent Detection)', status: 'active' },
      { label: '知识检索 (Knowledge Retrieval)', status: 'pending' },
      { label: '负样本过滤 (Filtering Negatives)', status: 'pending' },
      { label: '合规推理 (Compliance Reasoning)', status: 'pending' }
    ];

    // Placeholder for the "Thinking" message
    const thinkingMsgId = 'thinking-' + Date.now();
    const thinkingMsg: Message = {
      id: thinkingMsgId,
      role: 'agent',
      content: '',
      timestamp: new Date(),
      thoughtChain: initialSteps
    };

    setMessages(prev => [...prev, thinkingMsg]);

    // --- LOGIC ENGINE SIMULATION ---
    
    // Determine Scenario
    let scenario: 'A' | 'B' | 'default' = 'default';
    if (userMsg.content.includes('60mm') && userMsg.content.includes('时间')) scenario = 'A';
    else if (userMsg.content.includes('TSS-002') && userMsg.content.includes('IPX2')) scenario = 'B';

    // Step 1: Intent Detected (Wait 800ms)
    await new Promise(r => setTimeout(r, 800));
    updateThinkingStep(thinkingMsgId, 0, 'completed', '意图: 合规性检查 (compliance_check)');
    updateThinkingStep(thinkingMsgId, 1, 'active');
    setThinkingState(prev => ({ ...prev, stage: '正在查询图谱...' }));

    // Step 2: Retrieval (Wait 1000ms)
    await new Promise(r => setTimeout(r, 1000));
    
    // Load context based on scenario
    let retrievedItems: KnowledgeItem[] = [];
    if (scenario === 'A') {
      retrievedItems = [MOCK_DATA.knowledge_base[0]]; // kb_001
    } else if (scenario === 'B') {
      retrievedItems = [MOCK_DATA.knowledge_base[1]]; // kb_002
    } else {
       // Generic retrieval for demo
       if (userMsg.content.includes("TSP")) retrievedItems = [MOCK_DATA.knowledge_base[2]];
    }

    setThinkingState(prev => ({ ...prev, activeContext: retrievedItems, stage: '正在过滤干扰项...' }));
    updateThinkingStep(thinkingMsgId, 1, 'completed', `已检索 ${retrievedItems.length} 个相关实体`);
    updateThinkingStep(thinkingMsgId, 2, 'active');

    // Step 3: Filtering (Wait 1000ms)
    await new Promise(r => setTimeout(r, 1000));
    
    let filterDetail = "无冲突";
    if (scenario === 'A') filterDetail = "已过滤：60mm (距离参数)";
    
    updateThinkingStep(thinkingMsgId, 2, 'completed', filterDetail);
    updateThinkingStep(thinkingMsgId, 3, 'active');
    setThinkingState(prev => ({ ...prev, stage: '逻辑推理中...' }));

    // Step 4: Reasoning & Final Response (Wait 800ms)
    await new Promise(r => setTimeout(r, 800));
    updateThinkingStep(thinkingMsgId, 3, 'completed', scenario === 'A' ? '单位不匹配' : scenario === 'B' ? '规则违例' : '检测通过');
    
    // Construct Final Response
    let finalContent = "";
    if (scenario === 'A') finalContent = MOCK_DATA.test_cases[0].response;
    else if (scenario === 'B') finalContent = MOCK_DATA.test_cases[1].response;
    else if (retrievedItems.length > 0) finalContent = `根据 **${retrievedItems[0].source}**，**${retrievedItems[0].entity}** 的标准值为 **${retrievedItems[0].standard_value || retrievedItems[0].threshold}**。\n\n请确保您的配置符合该标准。`;
    else finalContent = "我在当前的知识库中未找到与您查询匹配的具体标准。\n\n您能否指定标准代码（例如 TSS-002, TSP-003）？";

    // Update the message with final content
    setMessages(prev => prev.map(m => {
      if (m.id === thinkingMsgId) {
        return { ...m, content: finalContent };
      }
      return m;
    }));

    setIsThinking(false);
    setThinkingState(prev => ({ ...prev, stage: '空闲 (Idle)' }));
  };

  // Helper to update specific steps in the thinking chain visualization
  const updateThinkingStep = (msgId: string, stepIndex: number, status: 'active' | 'completed', detail?: string) => {
    setMessages(prev => prev.map(m => {
      if (m.id === msgId && m.thoughtChain) {
        const newChain = [...m.thoughtChain];
        newChain[stepIndex] = { ...newChain[stepIndex], status, detail: detail || newChain[stepIndex].detail };
        // If we actived current, set next pending if exists? No, logic handled manually above for control
        return { ...m, thoughtChain: newChain };
      }
      return m;
    }));
  };

  const loadDemoQuestion = (text: string) => {
    setInput(text);
  };

  const handleClear = () => {
      setMessages([messages[0]]);
      setThinkingState({ steps: [], stage: '就绪 (Ready)', activeContext: [] });
  };

  return (
    <div className="flex h-screen bg-slate-100 overflow-hidden font-sans text-slate-900">
      
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full relative">
        
        {/* Mobile Header (visible only on small screens) */}
        <div className="md:hidden h-14 bg-slate-900 text-white flex items-center px-4 justify-between">
           <span className="font-bold">LogicGuard</span>
           <span className="text-xs bg-blue-600 px-2 py-1 rounded">演示版</span>
        </div>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 scroll-smooth" ref={chatContainerRef}>
          <div className="max-w-3xl mx-auto">
             {messages.map((msg) => (
               <ChatMessage 
                 key={msg.id} 
                 message={msg} 
                 isThinking={msg.id.startsWith('thinking-') && !msg.content} 
                />
             ))}
             {/* Spacer for bottom input area */}
             <div className="h-32"></div>
          </div>
        </div>

        {/* Floating Input Area */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-slate-100 via-slate-100 to-transparent">
          <div className="max-w-3xl mx-auto space-y-3">
            
            {/* Quick Actions / Demo Questions */}
            {!isThinking && (
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                 {DEMO_QUESTIONS.map((q, idx) => (
                   <button 
                    key={idx}
                    onClick={() => loadDemoQuestion(q.text)}
                    className="flex items-center gap-1.5 whitespace-nowrap px-3 py-1.5 bg-white border border-slate-200 text-slate-600 rounded-full text-xs font-medium hover:border-blue-400 hover:text-blue-600 transition-colors shadow-sm"
                   >
                     <Sparkles size={12} />
                     {q.label}
                   </button>
                 ))}
                 <button onClick={handleClear} className="flex items-center gap-1.5 whitespace-nowrap px-3 py-1.5 bg-slate-200 border border-slate-300 text-slate-600 rounded-full text-xs font-medium hover:bg-slate-300 transition-colors">
                    <RefreshCw size={12}/> 重置
                 </button>
              </div>
            )}

            {/* Input Box */}
            <div className="relative shadow-xl rounded-2xl bg-white border border-slate-200 focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-100 transition-all">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                placeholder="描述您的测试参数或合规性问题..."
                className="w-full pl-5 pr-14 py-4 rounded-2xl bg-transparent outline-none resize-none text-slate-700 min-h-[60px] max-h-[120px]"
                rows={1}
                disabled={isThinking}
              />
              <button 
                onClick={handleSend}
                disabled={!input.trim() || isThinking}
                className={`absolute right-3 bottom-3 p-2 rounded-xl transition-all ${
                  input.trim() && !isThinking
                    ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-md' 
                    : 'bg-slate-100 text-slate-400'
                }`}
              >
                <Send size={20} />
              </button>
            </div>
            
            <div className="text-center">
              <span className="text-[10px] text-slate-400">LogicGuard AI 可能会犯错。请务必对照官方文档进行核实。</span>
            </div>
          </div>
        </div>

      </div>

      {/* Right Panel (Knowledge Graph) */}
      <RightPanel 
        activeContext={thinkingState.activeContext} 
        isThinking={isThinking} 
        stage={thinkingState.stage} 
      />

    </div>
  );
}

export default App;