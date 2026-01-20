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
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // 初始化加载与 PWA 安装事件监听
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

    // 监听安装提示事件
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    });
  }, []);

  // 状态同步至本地存储及 UI 滚动
  useEffect(() => {
    localStorage.setItem('anhao_v3_msg', JSON.stringify(messages));
    localStorage.setItem('anhao_v3_mem', JSON.stringify(memories));
    localStorage.setItem('anhao_theme', currentTheme.id);
    if (scrollRef.current) {
        scrollRef.current.scrollTo({
            top: scrollRef.current.scrollHeight,
            behavior: 'smooth'
        });
    }
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) metaThemeColor.setAttribute('content', currentTheme.bg);
  }, [messages, memories, currentTheme]);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: '安好一日',
          text: '找个安静的地方，和安好聊聊。',
          url: window.location.href,
        });
      } catch (err) { console.log('Share failed', err); }
    }
  };

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') setDeferredPrompt(null);
    }
  };

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;
    setError(null);
    
    const userMsg: Message = { 
      id: Date.now().toString(), 
      role: Role.USER, 
      content: input, 
      timestamp: Date.now() 
    };
    
    setMessages(prev => [...prev, userMsg]);
    const currentInput = input;
    setInput('');
    setIsTyping(true);

    try {
      const stream = await gemini.chat(messages, currentInput);
      const aiId = (Date.now() + 1).toString();
      
      // 预先插入一条空的 AI 消息用于流式填充
      setMessages(prev => [...prev, { id: aiId, role: Role.ASSISTANT, content: '', timestamp: Date.now() }]);
      
      let fullText = '';
      for await (const chunk of stream) {
        fullText += chunk.text;
        setMessages(prev => prev.map(m => m.id === aiId ? { ...m, content: fullText } : m));
      }

      // 每 4 轮对话生成一次心迹摘要
      if ((messages.length + 2) % 4 === 0) {
        const topic = await gemini.generateSummary([...messages, userMsg]);
        setMemories(prev => [{ id: Date.now().toString(), topic, summary: '', timestamp: Date.now() }, ...prev].slice(0, 15));
      }
    } catch (e: any) {
      if (e.message === "BUSY") {
        setError("此时寻访的人略多，安好正在挨个回信，请稍等一分钟再试。");
      } else {
        setError("山路难行，信件似乎寄丢了，再试一次吧。");
      }
      // 出错时移除那条空的等待消息
      setMessages(prev => prev.filter(m => m.content !== ''));
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex h-screen transition-colors duration-700 overflow-hidden" style={{ backgroundColor: currentTheme.bg }}>
      {/* 桌面端侧边栏 */}
      <aside className="w-80 border-r border-slate-200/20 hidden md:block" style={{ backgroundColor: currentTheme.sidebar }}>
        <MemorySidebar 
          memories={memories} 
          currentTheme={currentTheme}
          onThemeChange={setCurrentTheme}
          onInstall={handleInstall}
          showInstallBtn={!!deferredPrompt}
          onClear={() => { if(confirm("确定清空所有对话和记录吗？")) { setMessages([]); setMemories([]); localStorage.clear(); }}} 
        />
      </aside>
      
      <main className="flex-1 flex flex-col relative max-w-4xl mx-auto w-full px-4 md:px-0">
        {/* 顶部导航 */}
        <header className="h-20 flex items-center px-6 md:px-10 z-10 safe-padding justify-between backdrop-blur-sm bg-white/5">
          <div className="flex items-center gap-4">
            <div className="md:hidden w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center opacity-40">安</div>
            <div>
              <h1 className="text-lg font-medium tracking-[0.2em]" style={{ color: currentTheme.accent }}>安好一日</h1>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span>
                <p className="text-[8px] uppercase tracking-[0.1em] opacity-40" style={{ color: currentTheme.text }}>在线倾听中</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <button onClick={handleShare} className="p-2 opacity-40 hover:opacity-100 transition-opacity" title="分享给老友">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6L15.316 7.316m0 9.368a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0-9.368a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" strokeWidth={1.5} strokeLinecap="round"/></svg>
            </button>
            {deferredPrompt && (
              <button onClick={handleInstall} className="md:hidden text-[10px] px-3 py-1.5 border rounded-full" style={{ borderColor: currentTheme.accent, color: currentTheme.accent }}>安装</button>
            )}
          </div>
        </header>

        {/* 聊天内容区 */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto px-6 md:px-10 pt-4 pb-44 space-y-2">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center opacity-30 text-center px-10">
              <p className="text-sm tracking-widest italic font-light leading-loose" style={{ color: currentTheme.text }}>
                世界喧嚣，<br/>我会一直在这听你。
              </p>
            </div>
          ) : (
            messages.map(m => <ChatInterface key={m.id} message={m} theme={currentTheme} />)
          )}
          
          {/* AI 思考中的动画 */}
          {isTyping && messages[messages.length-1]?.role === Role.USER && (
            <div className="flex justify-start mb-8 animate-fade-in">
              <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center text-[10px] text-slate-300 mr-3 shadow-sm border border-slate-50">安</div>
              <div className="p-4 bg-white/50 rounded-2xl rounded-tl-none border border-slate-100">
                <div className="flex gap-1">
                  <span className="w-1 h-1 bg-slate-300 rounded-full animate-bounce"></span>
                  <span className="w-1 h-1 bg-slate-300 rounded-full animate-bounce delay-75"></span>
                  <span className="w-1 h-1 bg-slate-300 rounded-full animate-bounce delay-150"></span>
                </div>
              </div>
            </div>
          )}
          
          {/* 错误反馈 */}
          {error && (
            <div className="text-center p-4 text-[12px] text-slate-500 bg-white/40 border border-slate-200/20 rounded-2xl backdrop-blur-sm mx-auto max-w-sm shadow-sm animate-fade-in">
              {error}
            </div>
          )}
        </div>

        {/* 输入悬浮栏 */}
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10 pointer-events-none">
          <div className="relative max-w-2xl mx-auto mb-2 pointer-events-auto">
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
              placeholder="此刻在想什么..."
              className="w-full bg-white/90 border border-slate-200/50 rounded-3xl py-5 px-7 pr-16 focus:outline-none focus:ring-1 focus:ring-slate-200 transition-all text-[15px] shadow-2xl backdrop-blur-xl"
            />
            <button 
              onClick={handleSend}
              disabled={isTyping || !input.trim()}
              className={`absolute right-4 top-4 p-2.5 transition-all duration-500 rounded-2xl ${input.trim() ? 'bg-slate-800 text-white shadow-lg' : 'opacity-10 cursor-not-allowed'}`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;