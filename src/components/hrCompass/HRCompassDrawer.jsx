import { useState, useRef, useEffect } from 'react';
import { X, Send, Compass } from 'lucide-react';
import { streamAI } from '../../lib/ai';
import { HR_COMPASS_SYSTEM_PROMPT } from '../../lib/hrCompassContext';
import SourceTag, { parseSourceFromText } from './SourceTag';

const INITIAL_MESSAGE = {
  role: 'assistant',
  content: "Hello! I'm HR Compass, your dedicated HR assistant for Acme Manufacturing Co. I can answer questions about your benefits, Arizona and federal employment law, payroll, PTO, and onboarding. What can I help you with today?",
  sources: [],
};

const SUGGESTED = [
  "When does my health insurance start?",
  "How does Arizona overtime work?",
  "What's the 401k match and when am I eligible?",
  "What are my rights if I'm terminated in Arizona?",
  "How much PTO do I earn in year one?",
  "Is my non-compete enforceable in Arizona?",
];

export default function HRCompassDrawer({ isOpen, onClose, messages, setMessages }) {
  const [input, setInput] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen && inputRef.current) inputRef.current.focus();
  }, [isOpen]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (text) => {
    const userText = text || input.trim();
    if (!userText || isStreaming) return;
    setInput('');

    const userMsg = { role: 'user', content: userText };
    const history = [...messages, userMsg];
    setMessages(history);

    const assistantMsg = { role: 'assistant', content: '', sources: [], streaming: true };
    setMessages([...history, assistantMsg]);
    setIsStreaming(true);

    let accumulated = '';

    await streamAI({
      systemPrompt: HR_COMPASS_SYSTEM_PROMPT,
      conversationHistory: history.map((m) => ({ role: m.role, content: m.content })),
      onToken: (token) => {
        accumulated += token;
        const { cleanText, sources } = parseSourceFromText(accumulated);
        setMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1] = { role: 'assistant', content: cleanText, sources, streaming: true };
          return updated;
        });
      },
      onDone: () => {
        const { cleanText, sources } = parseSourceFromText(accumulated);
        setMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1] = { role: 'assistant', content: cleanText, sources, streaming: false };
          return updated;
        });
        setIsStreaming(false);
      },
    });
  };

  const showEmpty = messages.length <= 1;

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div className="fixed inset-0 z-40 bg-black/20 backdrop-blur-[2px]" onClick={onClose} />
      )}

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-[420px] max-w-full bg-white shadow-lift z-50 flex flex-col transition-transform duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 bg-gradient-to-r from-brand-700 via-brand-600 to-teal-500">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center">
              <Compass className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">HR Compass</p>
              <p className="text-xs text-white/70">Arizona & Federal law · Acme Policy</p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-lg hover:bg-white/15 flex items-center justify-center text-white/80 hover:text-white transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
          {messages.map((msg, i) => (
            <MessageBubble key={i} msg={msg} />
          ))}

          {showEmpty && (
            <div className="mt-4">
              <p className="text-xs font-medium text-gray-400 uppercase tracking-widest mb-3">Common questions</p>
              <div className="flex flex-wrap gap-2">
                {SUGGESTED.map((q) => (
                  <button
                    key={q}
                    onClick={() => sendMessage(q)}
                    className="text-xs bg-brand-50 text-brand-700 border border-brand-100 hover:border-brand-300 hover:bg-brand-100/60 px-3 py-1.5 rounded-full transition-colors"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className="px-4 py-4 border-t border-gray-100">
          <div className="flex gap-2">
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage()}
              placeholder="Ask about benefits, PTO, Arizona law..."
              className="flex-1 text-sm border border-gray-200 rounded-xl px-4 py-2.5 outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100 transition-all"
              disabled={isStreaming}
            />
            <button
              onClick={() => sendMessage()}
              disabled={!input.trim() || isStreaming}
              className="w-10 h-10 rounded-xl bg-brand-600 hover:bg-brand-700 disabled:opacity-40 flex items-center justify-center transition-colors flex-shrink-0"
            >
              <Send className="w-4 h-4 text-white" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

function MessageBubble({ msg }) {
  const isUser = msg.role === 'user';

  if (isUser) {
    return (
      <div className="flex justify-end">
        <div className="max-w-[80%] bg-brand-600 text-white text-sm px-4 py-2.5 rounded-2xl rounded-tr-sm leading-relaxed">
          {msg.content}
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-2.5 items-start">
      <div className="w-7 h-7 rounded-full bg-brand-600 flex items-center justify-center flex-shrink-0 mt-0.5">
        <Compass className="w-3.5 h-3.5 text-white" />
      </div>
      <div className="max-w-[85%]">
        <div className="bg-gray-50 border border-gray-100 text-gray-700 text-sm px-4 py-3 rounded-2xl rounded-tl-sm leading-relaxed whitespace-pre-wrap">
          {msg.content}
          {msg.streaming && <span className="inline-block w-1.5 h-4 bg-brand-400 ml-0.5 animate-blink" />}
        </div>
        {msg.sources && msg.sources.length > 0 && <SourceTag sources={msg.sources} />}
        {!msg.streaming && msg.content && (
          <p className="text-[10px] text-gray-400 mt-1.5 px-1">
            General guidance only. Not legal advice. Contact hr@acmemfg.com
          </p>
        )}
      </div>
    </div>
  );
}
