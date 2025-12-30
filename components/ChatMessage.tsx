import React from 'react';
import { User, Bot, CheckCircle2, Circle, Loader2, AlertTriangle, ShieldAlert } from 'lucide-react';
import { Message, ThoughtStep } from '../types';

interface ChatMessageProps {
  message: Message;
  isThinking?: boolean;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message, isThinking }) => {
  const isUser = message.role === 'user';

  // Simple Markdown Parser for bold text and newlines
  const formatText = (text: string) => {
    return text.split('\n').map((line, i) => (
      <React.Fragment key={i}>
        {line.split(/(\*\*.*?\*\*)/).map((part, j) => {
          if (part.startsWith('**') && part.endsWith('**')) {
            return <strong key={j} className="font-bold text-slate-900">{part.slice(2, -2)}</strong>;
          }
          return part;
        })}
        <br />
      </React.Fragment>
    ));
  };

  return (
    <div className={`flex w-full mb-6 ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`flex max-w-[85%] md:max-w-[75%] gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
        
        {/* Avatar */}
        <div className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center shrink-0 ${isUser ? 'bg-blue-600' : 'bg-indigo-600'}`}>
          {isUser ? <User size={18} className="text-white" /> : <Bot size={18} className="text-white" />}
        </div>

        {/* Content */}
        <div className="flex flex-col gap-2">
          {/* User Name */}
          <span className={`text-xs text-slate-400 ${isUser ? 'text-right' : 'text-left'}`}>
            {isUser ? '工程师 (用户)' : 'LogicGuard 智能体'} • {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>

          {/* Thought Process (Agent Only) */}
          {!isUser && message.thoughtChain && message.thoughtChain.length > 0 && (
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 mb-1 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="flex items-center gap-2 mb-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                <Loader2 size={12} className={isThinking ? "animate-spin" : "opacity-0"} />
                思考过程 (Thinking Process)
              </div>
              <div className="space-y-2">
                {message.thoughtChain.map((step, idx) => (
                  <div key={idx} className={`flex items-start gap-2 text-sm ${step.status === 'pending' ? 'opacity-40' : 'opacity-100'}`}>
                    <div className="mt-0.5">
                      {step.status === 'completed' ? (
                        <CheckCircle2 size={14} className="text-green-600" />
                      ) : step.status === 'active' ? (
                        <Loader2 size={14} className="text-blue-600 animate-spin" />
                      ) : (
                        <Circle size={14} className="text-slate-300" />
                      )}
                    </div>
                    <div className="flex flex-col">
                      <span className={`font-medium ${step.status === 'active' ? 'text-blue-700' : 'text-slate-700'}`}>
                        {step.label}
                      </span>
                      {step.detail && step.status !== 'pending' && (
                         <span className="text-xs text-slate-500 mt-0.5 font-mono bg-slate-100 px-1 py-0.5 rounded w-fit">
                           {step.detail}
                         </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Bubble */}
          {(message.content || !isThinking) && (
             <div className={`p-4 rounded-2xl shadow-sm text-sm md:text-base leading-relaxed whitespace-pre-wrap ${
              isUser 
                ? 'bg-blue-600 text-white rounded-tr-none' 
                : 'bg-white border border-slate-200 text-slate-600 rounded-tl-none'
            }`}>
              {message.content ? formatText(message.content) : <span className="italic text-slate-400">正在生成回复...</span>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;