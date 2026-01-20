import React from 'react';
import { Memory } from './types';

interface Props {
  memories: Memory[];
  onClear: () => void;
}

const MemorySidebar: React.FC<Props> = ({ memories, onClear }) => (
  <div className="flex flex-col h-full p-8 bg-white/20">
    <div className="flex items-center justify-between mb-12">
      <h2 className="text-[11px] font-bold uppercase tracking-[0.3em] text-slate-400">心迹存档</h2>
      <button onClick={onClear} className="text-[10px] text-slate-300 hover:text-red-400 transition-colors">清空</button>
    </div>
    <div className="flex-1 space-y-8 overflow-y-auto pr-2">
      {memories.length === 0 ? (
        <p className="text-[12px] text-slate-400 italic leading-relaxed opacity-60">
          时光缓缓，<br/>这里将记录我们聊过的温馨瞬间。
        </p>
      ) : (
        memories.map((m) => (
          <div key={m.id} className="group border-l border-slate-200 pl-4 py-1 hover:border-slate-400 transition-all cursor-default">
            <span className="text-[10px] text-slate-300 font-mono block mb-1">
              {new Date(m.timestamp).toLocaleDateString()}
            </span>
            <p className="text-[13px] text-slate-600 group-hover:text-slate-900 leading-snug">
              {m.topic}
            </p>
          </div>
        ))
      )}
    </div>
    <div className="mt-8 pt-8 border-t border-slate-100/50">
      <div className="bg-white/40 border border-white/60 rounded-xl p-4 shadow-sm">
        <p className="text-[11px] text-slate-400 leading-relaxed italic">
          “愿你每个清晨醒来，都能感受到这世界的温柔。”
        </p>
      </div>
    </div>
  </div>
);
export default MemorySidebar;