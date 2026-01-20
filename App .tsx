import React, { useState, useEffect, useRef } from 'react';
import { Message, Role, Memory, THEMES, ThemeConfig } from './types';
import { gemini } from './geminiService';
import ChatInterface from './ChatInterface';
import MemorySidebar from './MemorySidebar';

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [memories, setMemories] = useState<Memory[]>([]);
  const [currentTheme, setCurrentTheme] = useState<ThemeConfig>(THEMES[0]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const savedMsg = localStorage.getItem('anhao_v3_msg');
    const savedMem = localStorage.getItem('anhao_v3_mem');
    const savedThemeId = localStorage.getItem('anhao_theme');
    
    if (savedMsg) setMessages(JSON.parse(savedMsg));
    if (savedMem) setMemories(JSON.parse(savedMem));
    if (savedThemeId) {
      const theme = THEMES.find(t => t.id === savedThemeId);
      if (theme) setCurrentTheme(theme);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('anhao_v3_msg', JSON.stringify(messages));
    localStorage.setItem('anhao_v3_mem', JSON.stringify(memories));
    localStorage.setItem('anhao_theme', currentTheme.id);
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, memories, currentTheme]);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;
    setError(null);
    const userMsg: Message = { id: Date.now().toString(), role: Role.USER, content: input, timestamp: Date.now() };
    setMessages(prev => [...prev, userMsg]);
    const currentInput = input;
    setInput('');
    setIsTyping(true);

    try {
      const stream = await gemini.chat(messages, currentInput);
      const aiId = (Date.now() + 1).toString();
      setMessages(prev => [...prev, { id: aiId, role: Role.ASSISTANT, content: '', timestamp: Date.now() }]);
      
      let fullText = '';
      for await (const chunk of stream) {
        fullText += chunk.text;
        setMessages(prev => prev.map(m => m.id === aiId ? { ...m, content: fullText } : m));
      }

      if (messages.length > 0 && (messages.length + 2) % 4 === 0) {
        const topic = await gemini.generateSummary([...messages, userMsg]);
        setMemories(prev => [{ id: Date.now().toString(), topic, summary: '', timestamp: Date.now() }, ...prev].slice(0, 15));
      }
    } catch (e: any) {
      setError("网络似乎有些拥堵，请稍后再试。");
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex h-screen transition-colors duration-700" style={{ backgroundColor: currentTheme.bg }}>
      <aside className="w-80 border-r border-slate-200/40 hidden md:block" style={{ backgroundColor: currentTheme.sidebar }}>
        <MemorySidebar 
          memories={memories} 
          currentTheme={currentTheme}
          onThemeChange={setCurrentTheme}
          onClear={() => { if(confirm("确定清空吗？")) { setMessages([]); setMemories([]); localStorage.clear(); }}} 
        />
      </aside>
      
      <main className="flex-1 flex flex-col relative max-w-4xl mx-auto w-full px-4 md:px-0">
        <header className="h-20 flex items-center px-6 md:px-10 z-10 safe-padding">
          <div>
            <h1 className="text-xl font-medium tracking-[0.2em]" style={{ color: currentTheme.accent }}>安好一日</h1>
            <p className="text-[9px] uppercase tracking-[0.25em] mt-1 opacity-50" style={{ color: currentTheme.text }}>愿你心中有光，不惧风霜</p>
          </div>
        </header>

        <div ref={scrollRef} className="flex-1 overflow-y-auto px-6 md:px-10 pt-4 pb-44 space-y-2">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center opacity-30 text-center">
              <div className="w-12 h-12 border rounded-full flex items-center justify-center mb-6" style={{ borderColor: currentTheme.accent }}>
                <div className="w-1.5 h-1.5 rounded-full animate-ping" style={{ backgroundColor: currentTheme.accent }}></div>
              </div>
              <p className="text-sm tracking-widest italic font-light" style={{ color: currentTheme.text }}>好久不见，今天过得好吗？</p>
            </div>
          ) : (
            messages.map(m => <ChatInterface key={m.id} message={m} theme={currentTheme} />)
          )}
          {error && <div className="text-center p-3 text-[11px] text-red-400 bg-red-50/50 rounded-xl backdrop-blur-sm">{error}</div>}
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10 bg-gradient-to-t from-inherit via-inherit to-transparent">
          <div className="relative max-w-2xl mx-auto mb-2">
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
              placeholder="聊聊此刻的心情..."
              className="w-full bg-white/70 border border-slate-200/50 rounded-2xl py-5 px-7 pr-16 focus:outline-none focus:ring-1 focus:ring-slate-300 transition-all text-[15px] shadow-sm backdrop-blur-md"
            />
            <button 
              onClick={handleSend}
              disabled={isTyping || !input.trim()}
              className={`absolute right-4 top-4 p-1.5 transition-all duration-500 ${input.trim() ? 'opacity-100 scale-100' : 'opacity-20 scale-90'}`}
              style={{ color: currentTheme.accent }}
            >
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M12 19l7-7-7-7M5 12h14" strokeWidth={1.2} strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
          <p className="text-center text-[9px] opacity-30 mt-2" style={{ color: currentTheme.text }}>
            点击侧边栏下方可更换主题。在浏览器菜单中选择“添加到主屏幕”以安装本应用。
          </p>
        </div>
      </main>
    </div>
  );
};

export default App;