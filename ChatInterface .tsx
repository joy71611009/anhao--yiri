import React from 'react';
import { Message, Role, ThemeConfig } from './types';

interface Props {
  message: Message;
  theme: ThemeConfig;
}

const ChatInterface: React.FC<Props> = ({ message, theme }) => {
  const isUser = message.role === Role.USER;
  return (
    <div className={`flex w-full ${isUser ? 'justify-end' : 'justify-start'} mb-8 animate-fade-in`}>
      <div className={`flex max-w-[90%] md:max-w-[85%] ${isUser ? 'flex-row-reverse' : 'flex-row'} items-start gap-3 md:gap-4`}>
        <div 
          className={`w-9 h-9 rounded-full flex-shrink-0 flex items-center justify-center text-[10px] shadow-sm transition-all duration-500 ${isUser ? 'bg-slate-200/80 text-slate-600' : 'bg-white text-slate-400'}`}
          style={{ border: isUser ? 'none' : `1px solid ${theme.bg}` }}
        >
          {isUser ? '我' : '安'}
        </div>
        <div 
          className={`p-4 rounded-2xl text-[14px] leading-relaxed tracking-wide shadow-sm transition-all duration-500 ${isUser ? 'bg-slate-800 text-slate-100 rounded-tr-none' : 'bg-white text-slate-700 rounded-tl-none'}`}
          style={{ border: isUser ? 'none' : `1px solid rgba(0,0,0,0.03)` }}
        >
          {message.content || <span className="opacity-40 animate-pulse italic">正在落笔...</span>}
        </div>
      </div>
    </div>
  );
};
export default ChatInterface;