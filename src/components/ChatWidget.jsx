import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User, Sparkles } from 'lucide-react';

// Hardcoded bot logic:
// - Exact match phrase → specific INO recommendation
// - Everything else → "Я анализирую ваш запрос..."
const TRIGGER_PHRASE = 'Какой курс вы мне посоветуете чтобы стать джуном на пайтоне?';
const TRIGGER_RESPONSE =
  'Я советую вам пройти данный курс в INO, чтобы вы улучшили свои навыки и успешно прошли верификацию на платформе.';
const DEFAULT_RESPONSE = 'Я анализирую ваш запрос...';

const QUICK_QUESTIONS = [
  'Какой курс вы мне посоветуете чтобы стать джуном на пайтоне?',
  'Как пройти ИИ-верификацию?',
  'Какой тариф мне подойдет?',
];

function TypingIndicator() {
  return (
    <div className="flex items-end gap-2 justify-start animate-fade-in">
      <div className="w-7 h-7 rounded-full bg-primary-container/20 border border-primary-container/30 flex items-center justify-center flex-shrink-0">
        <Bot className="w-3.5 h-3.5 text-primary" />
      </div>
      <div className="px-4 py-3 rounded-2xl rounded-bl-sm bg-surface-container-high border border-outline-variant/50 backdrop-blur-xs">
        <div className="flex items-center gap-1">
          <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
          <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
          <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
      </div>
    </div>
  );
}

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      role: 'bot',
      text: 'Привет! Я ваш ИИ-карьерный консультант 👋 Задайте любой вопрос или выберите из популярных тем ниже.',
      time: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showQuick, setShowQuick] = useState(true);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  const sendMessage = (text) => {
    const trimmed = text.trim();
    if (!trimmed) return;

    const userMsg = {
      id: Date.now().toString(),
      role: 'user',
      text: trimmed,
      time: new Date(),
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);
    setShowQuick(false);

    const isExactTrigger = trimmed === TRIGGER_PHRASE;
    const response = isExactTrigger ? TRIGGER_RESPONSE : DEFAULT_RESPONSE;

    // Simulate typing delay
    const delay = isExactTrigger ? 1800 : 1200;
    setTimeout(() => {
      setIsTyping(false);
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'bot',
        text: response,
        time: new Date(),
        isIno: isExactTrigger,
      }]);
    }, delay);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage(input);
  };

  const formatTime = (date) =>
    date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });

  return (
    <>
      {/* Chat window */}
      <div className={`fixed bottom-24 right-6 z-50 w-[360px] max-w-[calc(100vw-24px)] transition-all duration-300 origin-bottom-right ${
        isOpen ? 'scale-100 opacity-100 translate-y-0' : 'scale-95 opacity-0 translate-y-4 pointer-events-none'
      }`}>
        <div className="glass-card-high rounded-2xl overflow-hidden shadow-modal border-glow flex flex-col"
          style={{ height: '520px' }}>

          {/* Chat header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-outline-variant/50"
            style={{ background: 'rgba(31,31,40,0.9)' }}>
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-9 h-9 rounded-xl bg-primary-container/20 border border-primary-container/30 flex items-center justify-center">
                  <Sparkles className="w-4.5 h-4.5 text-primary" />
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-surface-container" />
              </div>
              <div>
                <p className="text-sm font-semibold text-on-surface">ИИ-Консультант</p>
                <p className="text-xs text-emerald-400">Онлайн · CareerAI</p>
              </div>
            </div>
            <button
              id="chat-close-btn"
              className="w-8 h-8 rounded-lg flex items-center justify-center text-outline hover:text-on-surface hover:bg-white/5 transition-all"
              onClick={() => setIsOpen(false)}
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex items-end gap-2 animate-fade-in ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
              >
                {msg.role === 'bot' && (
                  <div className="w-7 h-7 rounded-full bg-primary-container/20 border border-primary-container/30 flex items-center justify-center flex-shrink-0">
                    <Bot className="w-3.5 h-3.5 text-primary" />
                  </div>
                )}
                {msg.role === 'user' && (
                  <div className="w-7 h-7 rounded-full bg-surface-container-highest flex items-center justify-center flex-shrink-0">
                    <User className="w-3.5 h-3.5 text-on-surface-variant" />
                  </div>
                )}
                <div className="max-w-[75%]">
                  <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-primary-container text-white rounded-br-sm'
                      : 'bg-surface-container-high text-on-surface-variant border border-outline-variant/50 rounded-bl-sm'
                  }`}>
                    {msg.text}
                    {msg.isIno && (
                      <a
                        id="chat-ino-link"
                        href="https://ino.kz"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-2 flex items-center gap-1.5 text-amber-400 text-xs font-semibold hover:underline"
                      >
                        🎓 Перейти на INO →
                      </a>
                    )}
                  </div>
                  <p className={`text-xs text-outline mt-1 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
                    {formatTime(msg.time)}
                  </p>
                </div>
              </div>
            ))}

            {isTyping && <TypingIndicator />}

            {/* Quick questions */}
            {showQuick && (
              <div className="animate-fade-in">
                <p className="text-xs text-outline mb-2 pl-9">Популярные вопросы:</p>
                <div className="pl-9 flex flex-col gap-2">
                  {QUICK_QUESTIONS.map((q, i) => (
                    <button
                      key={i}
                      id={`quick-q-${i}`}
                      className="text-left text-xs px-3 py-2 rounded-xl border border-primary-container/25 text-primary bg-primary-container/10 hover:bg-primary-container/20 transition-all duration-150"
                      onClick={() => sendMessage(q)}
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="border-t border-outline-variant/50 p-4" style={{ background: 'rgba(31,31,40,0.9)' }}>
            <form onSubmit={handleSubmit} className="flex items-end gap-3">
              <input
                id="chat-input"
                ref={inputRef}
                type="text"
                className="input-field flex-1 py-2.5 text-sm"
                placeholder="Задайте вопрос..."
                value={input}
                onChange={e => setInput(e.target.value)}
                disabled={isTyping}
              />
              <button
                id="chat-send-btn"
                type="submit"
                disabled={!input.trim() || isTyping}
                className="w-10 h-10 rounded-xl bg-primary-container flex items-center justify-center flex-shrink-0 transition-all duration-200 hover:brightness-110 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed shadow-glow-sm"
              >
                <Send className="w-4 h-4 text-white" />
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Floating button */}
      <button
        id="chat-toggle-btn"
        className={`fixed bottom-6 right-6 z-50 w-14 h-14 rounded-2xl bg-primary-container flex items-center justify-center shadow-glow transition-all duration-300 hover:brightness-110 active:scale-95 animate-float ${
          isOpen ? 'rotate-0' : 'rotate-0'
        }`}
        onClick={() => setIsOpen(o => !o)}
        aria-label="Открыть чат с ИИ-консультантом"
      >
        {isOpen ? (
          <X className="w-6 h-6 text-white transition-all duration-300" />
        ) : (
          <MessageCircle className="w-6 h-6 text-white" />
        )}
        {!isOpen && (
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full border-2 border-background animate-pulse-slow" />
        )}
      </button>
    </>
  );
}
