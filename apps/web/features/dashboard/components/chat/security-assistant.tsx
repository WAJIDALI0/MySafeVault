"use client";

import { useState, useRef, useEffect } from "react";
import { Bot, X, Send, User, Loader2, Sparkles } from "lucide-react";
import { generateChatResponse } from "../../actions/chat.actions";

export function SecurityAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [history, setHistory] = useState<{ role: string; text: string }[]>([
    { role: 'model', text: 'Hi! I am your MySafeVault Security Assistant. Ask me anything about passwords, cryptography, or how to secure your digital life.' }
  ]);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [history, isOpen]);

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!message.trim() || isLoading) return;

    const userMsg = message.trim();
    setMessage("");
    setHistory(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsLoading(true);

    const res = await generateChatResponse(userMsg, history.slice(1)); // exclude the initial greeting
    
    if (res.error) {
      setHistory(prev => [...prev, { role: 'model', text: `Error: ${res.error}` }]);
    } else if (res.data) {
      setHistory(prev => [...prev, { role: 'model', text: res.data }]);
    }

    setIsLoading(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen ? (
        <div className="w-[350px] sm:w-[400px] h-[500px] max-h-[80vh] bg-white dark:bg-[#0b1120] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-300">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#10b981] to-emerald-600 p-4 flex items-center justify-between text-white">
            <div className="flex items-center gap-2">
              <Bot className="w-5 h-5" />
              <div>
                <h3 className="font-semibold text-sm">Security Assistant</h3>
                <p className="text-xs text-emerald-100">Powered by Gemini AI</p>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {history.map((msg, idx) => (
              <div key={idx} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'user' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' : 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400'}`}>
                  {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>
                <div className={`px-4 py-2.5 rounded-2xl text-sm max-w-[80%] whitespace-pre-wrap ${
                  msg.role === 'user' 
                    ? 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200 rounded-tr-none' 
                    : 'bg-emerald-50 text-slate-800 dark:bg-emerald-900/20 dark:text-slate-300 border border-emerald-100 dark:border-emerald-800/30 rounded-tl-none'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400 flex items-center justify-center shrink-0">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="px-4 py-3 rounded-2xl rounded-tl-none bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800/30 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce"></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
            <form onSubmit={handleSend} className="relative flex items-center">
              <input 
                type="text" 
                value={message}
                onChange={e => setMessage(e.target.value)}
                placeholder="Ask a security question..."
                className="w-full bg-white dark:bg-[#0b1120] border border-slate-300 dark:border-slate-700 rounded-full py-2.5 pl-4 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-[#10b981]/50 text-slate-800 dark:text-slate-200 placeholder:text-slate-400"
                disabled={isLoading}
              />
              <button 
                type="submit"
                disabled={isLoading || !message.trim()}
                className="absolute right-1.5 p-2 bg-[#10b981] hover:bg-emerald-600 disabled:bg-slate-300 dark:disabled:bg-slate-700 text-white rounded-full transition-colors"
              >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              </button>
            </form>
          </div>
        </div>
      ) : (
        <button 
          onClick={() => setIsOpen(true)}
          className="flex items-center justify-center w-14 h-14 bg-gradient-to-tr from-[#10b981] to-emerald-500 hover:to-emerald-400 text-white rounded-full shadow-lg shadow-emerald-500/30 hover:scale-105 transition-transform group relative"
        >
          <Sparkles className="w-6 h-6 animate-pulse" />
          <span className="absolute -top-1 -right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-yellow-500"></span>
          </span>
        </button>
      )}
    </div>
  );
}
