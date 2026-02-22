import React, { useEffect, useState } from 'react';
import { ChatMessage, User } from '../types';
import { addChatMessage, clearChatHistory, getChatHistory } from '../services/localStorageService';
import { addChatMessageFirebase, clearChatHistoryFirebase, getChatHistoryFirebase } from '../services/firebaseService';
import { generateChatReply } from '../services/geminiService';

interface Props {
  user: User;
}

const ChatBot: React.FC<Props> = ({ user }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadChat = async () => {
      const history = await getChatHistoryFirebase(user.id);
      setMessages(history);
    };
    loadChat();
  }, [user.id]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    setError(null);
    const userMessage = await addChatMessageFirebase(user.id, { role: 'user', content: input.trim() });
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const replyText = await generateChatReply([...messages, userMessage], userMessage.content);
      const assistantMessage = await addChatMessageFirebase(user.id, { role: 'assistant', content: replyText });
      setMessages(prev => [...prev, assistantMessage]);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    clearChatHistory(user.id);
    setMessages([]);
  };

  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-teal-500 p-6 shadow-2xl">
        <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/10 blur-2xl"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full bg-white/10 blur-2xl"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4 text-white">
          <div>
            <p className="text-xs uppercase tracking-widest text-white/70">Student Support</p>
            <h2 className="text-2xl md:text-3xl font-extrabold">ChemGenius Tutor</h2>
            <p className="text-white/80">Ask any chemistry doubt and get guided help.</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="px-3 py-1 rounded-full bg-white/15 text-xs font-semibold">AI Powered</div>
            <button
              onClick={handleClear}
              className="px-3 py-2 rounded-xl text-xs font-semibold bg-white/20 hover:bg-white/30"
            >
              Clear Chat
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 bg-white/70 rounded-3xl border border-white/60 shadow-xl p-6 min-h-[380px] max-h-[560px] overflow-y-auto custom-scrollbar">
          {messages.length === 0 && (
            <div className="text-center text-slate-400">No messages yet. Ask your first question!</div>
          )}
          <div className="space-y-4">
            {messages.map(message => (
              <div key={message.id} className={`flex items-start gap-3 ${message.role === 'user' ? 'justify-end' : ''}`}>
                {message.role === 'assistant' && (
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-teal-400 text-white font-bold flex items-center justify-center shadow-lg">C</div>
                )}
                <div
                  className={`p-4 rounded-2xl max-w-2xl ${message.role === 'user'
                    ? 'bg-blue-600 text-white ml-auto shadow-lg'
                    : 'bg-white text-slate-800 shadow-md border border-slate-100'}`}
                >
                  <div className="text-[10px] uppercase tracking-wide text-white/70 mb-1">
                    {message.role === 'user' ? 'You' : 'Tutor'}
                  </div>
                  <div className="whitespace-pre-wrap text-sm leading-relaxed">{message.content}</div>
                </div>
                {message.role === 'user' && (
                  <div className="w-9 h-9 rounded-full bg-slate-200 text-slate-700 font-bold flex items-center justify-center">U</div>
                )}
              </div>
            ))}
            {loading && (
              <div className="p-4 rounded-2xl bg-slate-100 text-slate-500">Tutor is typing...</div>
            )}
          </div>
        </div>

        <div className="bg-white/70 rounded-3xl border border-white/60 shadow-xl p-5 space-y-4">
          <div className="bg-gradient-to-br from-blue-50 to-teal-50 rounded-2xl p-4">
            <div className="text-xs uppercase tracking-wide text-slate-400">Tips</div>
            <p className="text-sm text-slate-600 mt-2">Ask about mechanisms, numericals, or quick revision notes.</p>
          </div>
          <div className="rounded-2xl p-4 bg-white/80 border border-white/70">
            <div className="text-xs uppercase tracking-wide text-slate-400">Recent Activity</div>
            <div className="text-3xl font-black text-slate-800 mt-2">{messages.length}</div>
            <div className="text-sm text-slate-500">Messages exchanged</div>
          </div>
          {error && (
            <div className="p-3 rounded-lg bg-red-50 text-red-600 text-sm border border-red-100">
              {error}
            </div>
          )}
        </div>
      </div>

      <div className="bg-white/70 rounded-2xl border border-white/60 shadow-lg p-4 flex flex-col sm:flex-row gap-3">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Type your question..."
          className="flex-1 px-4 py-3 rounded-xl border border-white/60 bg-white/90 focus:ring-2 focus:ring-blue-400 outline-none"
        />
        <button
          onClick={handleSend}
          disabled={loading || !input.trim()}
          className={`px-6 py-3 rounded-xl text-white font-semibold ${loading || !input.trim() ? 'bg-slate-400' : 'bg-gradient-to-r from-blue-600 to-teal-500 hover:from-blue-700 hover:to-teal-600'}`}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatBot;
