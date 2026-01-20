import React from 'react';
import { Message, Role, ThemeConfig } from './types';

interface Props {
  message: Message;
  theme: ThemeConfig;
}

const ChatInterface: React.FC<Props> = ({ message, theme }) => {
  const isUser = message.role === Role.USER;
  const isDark = theme.isDark;

  return (
    <div className={`flex w-full ${isUser ? 'justify-end' : 'justify-start'} mb-8 animate-fade-in`}>
      <div className={`flex max-w-[90%] md:max-w-[85%] ${isUser ? 'flex-row-reverse' : 'flex-row'} items-start gap-3 md:gap-4`}>
        <div 
          className={`w-9 h-9 rounded-full flex-shrink-0 flex items-center justify-center text-[10px] shadow-sm transition-all duration-500 ${isUser ? 'bg-black/10 text-slate-500' : 'bg-white/10 text-slate-400'}`}
          style={{ 
            color: isDark ? '#888' : theme.text,
            border: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}`
          }}
        >
          {isUser ? '我' : '安'}
        </div>
        <div 
          className={`p-4 rounded-2xl text-[14px] leading-relaxed tracking-wide shadow-sm transition-all duration-500 ${isUser ? 'rounded-tr-none' : 'rounded-tl-none'}`}
          style={{ 
            backgroundColor: isUser 
              ? (isDark ? '#2c2e33' : '#334155') 
              : (isDark ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.6)'),
            color: isUser 
              ? '#fff' 
              : theme.text,
            border: isUser ? 'none' : `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)'}`
          }}
        >
          {message.content || <span className="opacity-40 animate-pulse italic">正在落笔...</span>}
        </div>
      </div>
    </div>
  );
};
export default ChatInterface;