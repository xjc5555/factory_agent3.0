import React, { useState } from 'react';
import { User, Bot, CheckCircle2, Circle, Loader2, ChevronDown, ChevronRight, Cpu } from 'lucide-react';
import { Message } from '../types';

interface ChatMessageProps {
  message: Message;
  isThinking?: boolean;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message, isThinking }) => {
  const isUser = message.role === 'user';
  const [isExpanded, setIsExpanded] = useState(true);

  const formatText = (text: string) => {
    return text.split('\n').map((line, i) => (
      <React.Fragment key={i}>
        {line.split(/(\*\*.*?\*\*)/).map((part, j) => {
          if (part.startsWith('**') && part.endsWith('**')) {
            return <strong key={j} className="font-bold text-white">{part.slice(2, -2)}</strong>;
          }
          return part;
        })}
        <br />
      </React.Fragment>
    ));
  };

  return (
    <div className={`flex w-full mb-8 ${isUser ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-4 duration-500`}>
      <div className={`flex max-w-[90%] md:max-w-[80%] gap-4 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
        
        {/* Avatar */}
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-lg border border-slate-700/50 ${isUser ? 'bg-blue-600 text-white' : 'bg-slate-800 text-blue-400'}`}>
          {isUser ? <User size={20} /> : <Bot size={20} />}
        </div>

        {/* Content Container */}
        <div className="flex flex-col gap-2 min-w-[300px]">
          {/* User Name */}
          <span className={`text-[10px] font-mono font-semibold text-slate-500 uppercase tracking-widest ${isUser ? 'text-right' : 'text-left'}`}>
            {isUser ? '工程师_01' : 'LogicGuard_核心'}
          </span>

          {/* Thought Process (Accordion Style - Dark Mode) */}
          {!isUser && message.thoughtChain && message.thoughtChain.length > 0 && (
            <div className="bg-slate-900/50 border border-slate-800 rounded-lg overflow-hidden transition-all duration-300">
              <button 
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-full flex items-center justify-between p-3 hover:bg-slate-800/50 transition-colors"
              >
                <div className="flex items-center gap-2 text-xs font-bold text-blue-400 uppercase tracking-wider font-mono">
                  {isThinking ? (
                    <Loader2 size={14} className="animate-spin text-blue-500" />
                  ) : (
                    <Cpu size={14} className="text-blue-500" />
                  )}
                  思维链推理轨迹
                </div>
                {isExpanded ? <ChevronDown size={14} className="text-slate-600"/> : <ChevronRight size={14} className="text-slate-600"/>}
              </button>
              
              {isExpanded && (
                <div className="p-3 bg-slate-950/30 border-t border-slate-800 space-y-3">
                  {message.thoughtChain.map((step, idx) => (
                    <div key={idx} className={`flex items-start gap-3 text-sm ${step.status === 'pending' ? 'opacity-30' : 'opacity-100'}`}>
                      <div className="mt-0.5 relative">
                         {step.status === 'completed' && <div className="absolute inset-0 bg-emerald-500/20 rounded-full animate-ping opacity-20"></div>}
                        {step.status === 'completed' ? (
                          <CheckCircle2 size={14} className="text-emerald-500" />
                        ) : step.status === 'active' ? (
                          <Loader2 size={14} className="text-blue-500 animate-spin" />
                        ) : (
                          <Circle size={14} className="text-slate-700" />
                        )}
                      </div>
                      <div className="flex flex-col">
                        <span className={`font-mono text-xs ${step.status === 'active' ? 'text-blue-400' : 'text-slate-400'}`}>
                          {step.label}
                        </span>
                        {step.detail && step.status !== 'pending' && (
                           <span className="text-[10px] text-slate-600 leading-tight mt-0.5 font-mono">
                             {">"} {step.detail}
                           </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Chat Bubble */}
          {(message.content || !isThinking) && (
             <div className={`p-5 rounded-2xl shadow-lg text-sm md:text-[15px] leading-relaxed whitespace-pre-wrap border ${
              isUser 
                ? 'bg-blue-600 border-blue-500 text-white rounded-tr-none' 
                : 'bg-slate-800 border-slate-700 text-slate-300 rounded-tl-none'
            }`}>
              {message.content ? formatText(message.content) : (
                <div className="flex items-center gap-1 text-slate-500">
                  <span className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce"></span>
                  <span className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce delay-75"></span>
                  <span className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce delay-150"></span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;