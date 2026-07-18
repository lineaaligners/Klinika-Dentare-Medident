import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, X, Bot, User, Loader2, ShieldCheck } from 'lucide-react';
import { getClaudeResponse } from '../services/claudeService';
import { getGeminiChatResponse } from '../services/geminiService';
import { ChatMessage } from '../types';

interface AIChatbotProps {
  lang: 'en' | 'sq';
}

const AIChatbot: React.FC<AIChatbotProps> = ({ lang }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: lang === 'en' ? 'MEDIDENT SUPPORT active. How can I assist with your clinical inquiry?' : 'MEDIDENT SUPPORT aktiv. Si mund t\'ju ndihmoj me kërkesën tuaj klinike?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setIsLoading(true);

    try {
      let response: string;
      try {
        const claudeChatMessages = messages.map(m => ({
          role: m.role === 'user' ? 'user' : 'assistant' as const,
          content: m.text
        }));
        claudeChatMessages.push({ role: 'user', content: userMessage });
        response = await getClaudeResponse(claudeChatMessages as any);
      } catch (e) {
        console.warn('Claude failed, falling back to Gemini', e);
        response = await getGeminiChatResponse(userMessage, messages);
      }
      setMessages(prev => [...prev, { role: 'model', text: response }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'model', text: lang === 'en' ? "Liaison system offline. Please use the clinical contact form." : "Sistemi offline. Ju lutem përdorni formën e kontaktit." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-8 right-8 z-[60]">
      {isOpen ? (
        <div className="bg-white rounded-xl shadow-[0_32px_64px_-16px_rgba(0,0,0,0.3)] w-[380px] h-[550px] flex flex-col overflow-hidden border border-slate-200 animate-in slide-in-from-bottom-8 duration-500">
          {/* Clinical Header */}
          <div className="bg-slate-900 p-6 text-white flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="bg-blue-600 p-2.5 rounded-lg">
                <ShieldCheck size={20} />
              </div>
              <div>
                <h3 className="text-xs font-black uppercase tracking-widest leading-none mb-1.5 text-white">MEDIDENT SUPPORT</h3>
                <p className="text-[10px] text-slate-400 flex items-center font-bold">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2"></span>
                  SYSTEMS OPERATIONAL
                </p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-slate-500 hover:text-white transition-colors">
              <X size={20} />
            </button>
          </div>

          {/* Clinical Messages Container */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 bg-white">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-4 text-xs font-medium leading-relaxed ${
                  msg.role === 'user' 
                    ? 'bg-slate-100 text-slate-900 rounded-lg' 
                    : 'bg-blue-50 text-slate-900 rounded-lg border border-blue-100'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                  <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                </div>
              </div>
            )}
          </div>

          {/* Clinical Input Footer */}
          <div className="p-6 bg-slate-50 border-t border-slate-100">
            <div className="flex space-x-3">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Submit inquiry..."
                className="flex-1 bg-white border border-slate-200 rounded-lg px-4 py-3 text-xs focus:ring-1 focus:ring-blue-500 transition-all outline-none font-medium"
              />
              <button 
                onClick={handleSend}
                disabled={isLoading || !input.trim()}
                className="bg-slate-900 hover:bg-blue-600 text-white p-3 rounded-lg transition-all disabled:opacity-50"
              >
                <Send size={18} />
              </button>
            </div>
            <p className="text-[8px] text-center text-slate-400 mt-4 font-black uppercase tracking-widest">
              Institutional AI Data Protection Active
            </p>
          </div>
        </div>
      ) : (
        <button 
          onClick={() => setIsOpen(true)}
          className="bg-slate-900 hover:bg-blue-600 text-white p-5 rounded-full shadow-2xl transition-all transform hover:scale-105 flex items-center space-x-3 group border border-white/10"
        >
          <MessageSquare size={20} />
          <span className="text-[10px] font-black uppercase tracking-widest">Liaison Support</span>
        </button>
      )}
    </div>
  );
};

export default AIChatbot;