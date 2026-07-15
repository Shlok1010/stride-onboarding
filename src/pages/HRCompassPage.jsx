import { useState, useRef, useEffect } from 'react';
import { Send, Compass } from 'lucide-react';
import { streamAI } from '../lib/ai';
import { HR_COMPASS_SYSTEM_PROMPT } from '../lib/hrCompassContext';
import SourceTag, { parseSourceFromText } from '../components/hrCompass/SourceTag';

const INITIAL_MESSAGE = {
  role: 'assistant',
  content: "Hello! I'm HR Compass, your dedicated HR assistant for Acme Manufacturing Co. I can answer questions about your benefits, Arizona and federal employment law, payroll, PTO, and onboarding. What can I help you with today?",
  sources: [],
};

const CATEGORIES = [
  { label: 'Benefits & Enrollment', starter: 'When does my health insurance coverage start, and what plans are available?' },
  { label: 'Payroll & Taxes', starter: 'How does our payroll schedule work and what are my payroll deductions?' },
  { label: 'PTO & Leave Policies', starter: 'How much PTO do I earn in my first year, and what is the sick leave policy?' },
  { label: 'Arizona State Law', starter: 'What are my rights as an employee under Arizona state law?' },
  { label: 'Federal Employment Law', starter: 'What are my rights under federal employment law including FMLA and ADA?' },
  { label: 'Onboarding & Compliance', starter: 'What compliance training and paperwork do I need to complete in my first 30 days?' },
  { label: 'Termination & Final Pay', starter: 'If I resign or am terminated in Arizona, when do I receive my final paycheck?' },
];

const SUGGESTED = [
  "When does my health insurance start?",
  "How does Arizona overtime work?",
  "What's the 401k match and when am I eligible?",
  "What are my rights if I'm terminated in Arizona?",
  "How much PTO do I earn in year one?",
  "Is my non-compete enforceable in Arizona?",
];

export default function HRCompassPage({ sharedMessages, setSharedMessages }) {
  const [messages, setMessages] = useState(sharedMessages && sharedMessages.length > 0 ? sharedMessages : [INITIAL_MESSAGE]);
  const [input, setInput] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (setSharedMessages) setSharedMessages(messages);
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
      conversationHistory: history.map(m => ({ role: m.role, content: m.content })),
      onToken: (token) => {
        accumulated += token;
        const { cleanText, sources } = parseSourceFromText(accumulated);
        setMessages(prev => {
          const updated = [...prev];
          updated[updated.length - 1] = { role: 'assistant', content: cleanText, sources, streaming: true };
          return updated;
        });
      },
      onDone: () => {
        const { cleanText, sources } = parseSourceFromText(accumulated);
        setMessages(prev => {
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
    <div className="flex h-full">
      {/* Sidebar */}
      <div className="w-56 flex-shrink-0 border-r border-gray-200/70 bg-white p-4">
        <p className="text-xs font-medium text-gray-400 uppercase tracking-widest mb-3">Topics</p>
        <div className="space-y-1">
          {CATEGORIES.map(cat => (
            <button
              key={cat.label}
              onClick={() => sendMessage(cat.starter)}
              className="w-full text-left text-xs text-gray-600 hover:text-gray-900 hover:bg-brand-50 px-3 py-2 rounded-lg transition-colors leading-snug"
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Chat */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-brand-700 via-brand-600 to-teal-500">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center">
              <Compass className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-white">HR Compass</h1>
              <p className="text-xs text-white/70">Your AI HR assistant — Arizona & Federal law · Acme Manufacturing Co.</p>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
          {messages.map((msg, i) => (
            <MessageBubble key={i} msg={msg} />
          ))}

          {showEmpty && (
            <div className="pt-4">
              <p className="text-xs font-medium text-gray-400 uppercase tracking-widest mb-3">Try asking...</p>
              <div className="flex flex-wrap gap-2">
                {SUGGESTED.map(q => (
                  <button
                    key={q}
                    onClick={() => sendMessage(q)}
                    className="text-sm bg-brand-50 text-brand-700 border border-brand-100 hover:border-brand-300 hover:bg-brand-100/60 px-4 py-2 rounded-full transition-colors"
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
        <div className="px-6 py-4 border-t border-gray-200/70 bg-white">
          <div className="flex gap-3 max-w-3xl">
            <input
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage()}
              placeholder="Ask about benefits, PTO, Arizona employment law..."
              className="flex-1 border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100 transition-all"
              disabled={isStreaming}
            />
            <button
              onClick={() => sendMessage()}
              disabled={!input.trim() || isStreaming}
              className="w-11 h-11 rounded-xl bg-brand-600 hover:bg-brand-700 disabled:opacity-40 flex items-center justify-center transition-colors flex-shrink-0"
            >
              <Send className="w-4 h-4 text-white" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function MessageBubble({ msg }) {
  const isUser = msg.role === 'user';

  if (isUser) {
    return (
      <div className="flex justify-end">
        <div className="max-w-xl bg-brand-600 text-white text-sm px-5 py-3 rounded-2xl rounded-tr-sm leading-relaxed">
          {msg.content}
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-3 items-start max-w-3xl">
      <div className="w-8 h-8 rounded-full bg-brand-600 flex items-center justify-center flex-shrink-0 mt-0.5">
        <Compass className="w-4 h-4 text-white" />
      </div>
      <div>
        <div className="bg-white border border-gray-200/70 shadow-card text-gray-700 text-sm px-5 py-4 rounded-2xl rounded-tl-sm leading-relaxed whitespace-pre-wrap">
          {msg.content}
          {msg.streaming && <span className="inline-block w-1.5 h-4 bg-brand-400 ml-0.5 animate-blink" />}
        </div>
        {msg.sources && msg.sources.length > 0 && <SourceTag sources={msg.sources} />}
        {!msg.streaming && msg.content && (
          <p className="text-[10px] text-gray-400 mt-1.5 px-1">
            General guidance only. Not legal advice. Contact hr@acmemfg.com for official policy.
          </p>
        )}
      </div>
    </div>
  );
}
