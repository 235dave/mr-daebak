import React, { useState, useEffect, useRef } from 'react';
import { Send, MessageSquare, X, Loader2 } from 'lucide-react';
import { useData } from '../context/DataContext';
import { createChatSession, sendChatMessage, isGeminiConfigured } from '../services/geminiService';
import { Chat } from '@google/genai';

const ChatBot: React.FC = () => {
  const { menu } = useData();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{role: 'user' | 'model', text: string}[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const chatSession = useRef<Chat | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && !chatSession.current && isGeminiConfigured()) {
        const session = createChatSession(menu);
        if (session) {
            chatSession.current = session;
            // Initial greeting
            setMessages([{role: 'model', text: '안녕하세요! 미스터 대박입니다. 무엇을 도와드릴까요? 메뉴 추천이 필요하신가요?'}]);
        }
    }
  }, [isOpen, menu]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || !chatSession.current) return;
    
    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setLoading(true);

    const response = await sendChatMessage(chatSession.current, userMsg);
    
    setLoading(false);
    setMessages(prev => [...prev, { role: 'model', text: response }]);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!isGeminiConfigured()) return null;

  return (
    <>
      {/* Floating Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-24 right-6 bg-amber-500 text-white p-4 rounded-full shadow-lg hover:bg-amber-600 transition-all z-50 flex items-center justify-center"
        >
          <MessageSquare className="w-6 h-6" />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-80 md:w-96 h-[500px] bg-white rounded-2xl shadow-2xl border border-stone-200 z-50 flex flex-col overflow-hidden">
          {/* Header */}
          <div className="bg-stone-900 text-white p-4 flex justify-between items-center">
            <div className="flex items-center gap-2">
                <span className="text-xl">🧑‍🍳</span>
                <span className="font-bold">AI 웨이터</span>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-stone-300 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-stone-50">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm ${
                    msg.role === 'user'
                      ? 'bg-amber-500 text-white rounded-br-none'
                      : 'bg-white border border-stone-200 text-stone-800 rounded-bl-none shadow-sm'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-white border border-stone-200 rounded-2xl rounded-bl-none px-4 py-2 shadow-sm">
                  <Loader2 className="w-4 h-4 animate-spin text-amber-500" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-3 bg-white border-t border-stone-200">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="무엇을 추천해 드릴까요?"
                className="flex-1 px-4 py-2 bg-stone-100 rounded-full text-sm outline-none focus:ring-2 focus:ring-amber-500"
              />
              <button
                onClick={handleSend}
                disabled={loading || !input.trim()}
                className="p-2 bg-stone-900 text-white rounded-full hover:bg-stone-800 disabled:opacity-50"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatBot;