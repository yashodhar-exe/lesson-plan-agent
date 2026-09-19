import React, { useState, useRef, useEffect } from 'react';
import { dotPulse } from 'ldrs';

dotPulse.register();

const Chat = ({ facultyId }) => {
  const [messages, setMessages] = useState([
    {
      role: 'ai',
      content: 'Hello! I am your AI academic assistant. You can ask me questions about your schedule, courses, and upcoming classes.'
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || !facultyId) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          faculty_id: facultyId,
          query: userMessage
        })
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const data = await response.json();
      setMessages(prev => [...prev, { role: 'ai', content: data.response }]);
    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [...prev, { role: 'ai', content: 'Sorry, I encountered an error while processing your request.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] bg-white rounded-xl shadow-sm border border-brand-light/50 overflow-hidden">

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {messages.map((msg, index) => (
          <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className="flex items-start max-w-[80%] gap-3">
              {msg.role === 'ai' && (
                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="material-symbols-outlined text-[16px] text-gray-500">smart_toy</span>
                </div>
              )}
              
              <div 
                className={`
                  ${msg.role === 'user' 
                    ? 'bg-brand-primary text-white px-5 py-3 rounded-2xl rounded-tr-sm shadow-sm' 
                    : 'bg-transparent text-brand-dark py-2' 
                  }
                `}
              >
                <div className="whitespace-pre-wrap text-[15px] leading-relaxed">
                  {msg.content}
                </div>
              </div>
              
              {msg.role === 'user' && (
                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="material-symbols-outlined text-[16px] text-gray-500">person</span>
                </div>
              )}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="flex items-start max-w-[80%] gap-3">
              <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0 mt-1">
                <span className="material-symbols-outlined text-[16px] text-gray-500">smart_toy</span>
              </div>
              <div className="py-2 text-gray-400 flex items-center space-x-2">
                <div className="flex items-center justify-center w-6 h-6">
                  <l-dot-pulse size="24" speed="1.3" color="#9ca3af"></l-dot-pulse>
                </div>
                <span className="text-sm">Thinking...</span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-brand-light/50 bg-white">
        <form onSubmit={handleSend} className="flex space-x-4">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about your schedule, courses, or next class..."
            className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all"
            disabled={isLoading || !facultyId}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim() || !facultyId}
            className="px-5 py-3 bg-brand-primary text-white rounded-xl hover:bg-brand-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center"
          >
            {isLoading ? <span className="material-symbols-outlined animate-spin text-[20px]">progress_activity</span> : <span className="material-symbols-outlined text-[20px]">send</span>}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Chat;
