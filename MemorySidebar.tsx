import React from 'react';
import { Memory, THEMES, ThemeConfig } from './types';

interface Props {
  memories: Memory[];
  currentTheme: ThemeConfig;
  onThemeChange: (theme: ThemeConfig) => void;
  onClear: () => void;
}

const MemorySidebar: React.FC<Props> = ({ memories, currentTheme, onThemeChange, onClear }) => (
  <div className="flex flex-col h-full p-8">
    <div className="flex items-center justify-between mb-12">
      <h2 className="text-[11px] font-bold uppercase tracking-[0.3em] opacity-40" style={{ color: currentTheme.accent }}>心迹存档</h2>
      <button onClick={onClear} className="text-[10px] opacity-30 hover:opacity-100 hover:text-red-400 transition-all">清空</button>
    </div>
    
    <div className="flex-1 space-y-8 overflow-y-auto pr-2">
      {memories.length === 0 ? (
        <p className="text-[12px] opacity-40 italic leading-relaxed" style={{ color: currentTheme.text }}>
          时光缓缓，<br/>这里将记录我们聊过的温馨瞬间。
        </p>
      ) : (
        memories.map((m) => (
          <div key={m.id} className="group border-l pl-4 py-1 hover:border-slate-400 transition-all cursor-default" style={{ borderColor: `${currentTheme.accent}33` }}>
            <span className="text-[10px] opacity-30 font-mono block mb-1" style={{ color: currentTheme.text }}>
              {new Date(m.timestamp).toLocaleDateString()}
            </span>
            <p className="text-[13px] opacity-70 group-hover:opacity-100 leading-snug" style={{ color: currentTheme.text }}>
              {m.topic}
            </p>
          </div>
        ))
      )}
    </div>

    <div className="mt-8 pt-8 border-t border-slate-200/20">
      <div className="mb-6">
        <p className="text-[10px] uppercase tracking-[0.2em] opacity-30 mb-3" style={{ color: currentTheme.accent }}>切换心境</p>
        <div className="flex gap-3">
          {THEMES.map(theme => (
            <button
              key={theme.id}
              onClick={() => onThemeChange(theme)}
              title={theme.name}
              className={`w-5 h-5 rounded-full border transition-all duration-300 ${currentTheme.id === theme.id ? 'scale-125 shadow-md ring-2 ring-offset-2 ring-slate-200' : 'opacity-60 hover:opacity-100'}`}
              style={{ backgroundColor: theme.bg, borderColor: 'rgba(0,0,0,0.1)' }}
            />
          ))}
        </div>
      </div>
      
      <div className="bg-white/30 border border-white/40 rounded-xl p-4 shadow-sm backdrop-blur-sm">
        <p className="text-[11px] opacity-50 leading-relaxed italic" style={{ color: currentTheme.text }}>
          “愿你每个清晨醒来，都能感受到这世界的温柔。”
        </p>
      </div>
    </div>
  </div>
);
export default MemorySidebar;