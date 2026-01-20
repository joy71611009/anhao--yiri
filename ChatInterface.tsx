import React from 'react';
import { Message, Role } from './types';

const ChatInterface: React.FC<{ message: Message }> = ({ message }) => {
  const isUser = message.role === Role.USER;
  return (
    <div className={`flex w-full ${isUser ? 'justify-end' : 'justify-start'} mb-8 animate-fade-in`}>
      <div className={`flex max-w-[85%] ${isUser ? 'flex-row-reverse' : 'flex-row'} items-start gap-4`}>
        <div className={`w-9 h-9 rounded-full flex-shrink-0 flex items-center justify-center text-[10px] shadow-sm ${isUser ? 'bg-slate-200 text-slate-600' : 'bg-white border border-slate-100 text-slate-400'}`}>
          {isUser ? '我' : '安'}
        </div>
        <div className={`p-4 rounded-2xl text-[14px] leading-relaxed tracking-wide ${isUser ? 'bg-slate-800 text-slate-100 rounded-tr-none shadow-md' : 'bg-white border border-slate-100 text-slate-700 rounded-tl-none shadow-sm'}`}>
          {message.content || <span className="opacity-50 animate-pulse">正在落笔...</span>}
        </div>
      </div>
    </div>
  );
};
export default ChatInterface;