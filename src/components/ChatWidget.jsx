import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User, Sparkles } from 'lucide-react';

// Smart bot logic based on keywords
const getBotResponse = (text) => {
  const lower = text.toLowerCase();
  
  if (lower.includes('курс') && lower.includes('пайтон')) {
    return {
      text: 'Я советую вам пройти базовые и продвинутые курсы по Python на платформе INO. Это поможет быстро закрыть пробелы в знаниях (особенно в ООП и работе с файлами) и повысит ваши шансы при отборе на уровень Junior.',
      isIno: true
    };
  }
  
  if (lower.includes('верификац')) {
    return {
      text: 'Для прохождения ИИ-верификации перейдите во вкладку «Пройти тест». Выберите нужный стек (например, Python) и ваш уровень. Тест длится 10 минут, минимальный проходной балл — 70%. Результаты сразу отразятся в вашем профиле!'
    };
  }

  if (lower.includes('тариф')) {
    return {
      text: 'Выбор тарифа зависит от вашей цели:\n• Starter (0$) — для пассивного поиска, 1 тест в месяц.\n• Active Seeker (5$) — безлимитные отклики и тесты. \n• Top Talent (15$) — статус Топ-кандидата и AI-менторство.'
    };
  }

  return {
    text: 'Хороший вопрос! В данный момент я анализирую профиль и возможности нашей базы CareerAI. Как ИИ-ассистент, я помогу вам подготовиться к интервью или выбрать оптимальный путь развития. Чем еще могу быть полезен?'
  };
};

const QUICK_QUESTIONS = [
  'Какой курс вы мне посоветуете чтобы стать джуном на пайтоне?',
  'Как пройти ИИ-верификацию?',
  'Какой тариф мне подойдет?',
];

function TypewriterMessage({ fullText, isIno, onScroll }) {
  const [displayedText, setDisplayedText] = useState('');

  useEffect(() => {
    if (displayedText.length < fullText.length) {
      const timer = setTimeout(() => {
        setDisplayedText(prev => fullText.slice(0, prev.length + 1));
        if (displayedText.length % 10 === 0 && onScroll) {
          onScroll();
        }
      }, 15); // Typewriting speed
      return () => clearTimeout(timer);
    } else if (onScroll) {
      onScroll();
    }
  }, [displayedText, fullText, onScroll]);

  return (
    <>
      <span className="whitespace-pre-wrap">{displayedText}</span>
      {displayedText.length < fullText.length && (
        <span className="inline-block w-1.5 h-3.5 ml-0.5 align-middle bg-on-surface-variant animate-pulse" />
      )}
      {displayedText.length === fullText.length && isIno && (
        <a
          id="chat-ino-link"
          href="https://ino.iitu.kz"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 flex items-center gap-1.5 text-primary text-xs font-semibold hover:underline animate-fade-in"
        >
          🎓 Перейти на портал INO →
        </a>
      )}
    </>
  );
}

function TypingIndicator() {
  return (
    <div className="flex items-end gap-2 justify-start animate-fade-in">
      <div className="w-7 h-7 rounded-full bg-surface border border-outline-variant flex items-center justify-center flex-shrink-0">
        <Bot className="w-3.5 h-3.5 text-primary" />
      </div>
      <div className="px-4 py-3 rounded-2xl rounded-bl-sm bg-surface-container border border-outline-variant/50">
        <div className="flex items-center gap-1">
          <span className="w-1.5 h-1.5 bg-on-surface-variant rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
          <span className="w-1.5 h-1.5 bg-on-surface-variant rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
          <span className="w-1.5 h-1.5 bg-on-surface-variant rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
      </div>
    </div>
  );
}

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const msgIdRef = useRef(1); // monotonic counter — avoids Date.now() in render
  const nextId = () => String(msgIdRef.current++);
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
      id: nextId(),
      role: 'user',
      text: trimmed,
      time: new Date(),
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);
    setShowQuick(false);

    // Simulate thinking delay
    setTimeout(() => {
      setIsTyping(false);
      const botResponse = getBotResponse(trimmed);
      setMessages(prev => [...prev, {
        id: nextId(),
        role: 'bot',
        text: botResponse.text,
        time: new Date(),
        isIno: botResponse.isIno,
        isAnimated: true // flag to trigger typewriter
      }]);
    }, 1000);
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
        <div className="bg-surface rounded-2xl overflow-hidden shadow-glass-lg border border-outline flex flex-col"
          style={{ height: '520px' }}>

          {/* Chat header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-outline-variant bg-surface-container">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-9 h-9 rounded-xl bg-surface border border-outline-variant flex items-center justify-center">
                  <Sparkles className="w-4.5 h-4.5 text-primary" />
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-surface-container" />
              </div>
              <div>
                <p className="text-sm font-semibold text-on-surface">ИИ-Консультант</p>
                <p className="text-xs text-on-surface-variant">Онлайн · CareerAI</p>
              </div>
            </div>
            <button
              id="chat-close-btn"
              className="w-8 h-8 rounded-lg flex items-center justify-center text-outline hover:text-on-surface hover:bg-surface-container-highest transition-all"
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
                  <div className="w-7 h-7 rounded-full bg-surface border border-outline-variant flex items-center justify-center flex-shrink-0">
                    <Bot className="w-3.5 h-3.5 text-primary" />
                  </div>
                )}
                {msg.role === 'user' && (
                  <div className="w-7 h-7 rounded-full bg-surface-container flex items-center justify-center flex-shrink-0">
                    <User className="w-3.5 h-3.5 text-on-surface-variant" />
                  </div>
                )}
                <div className="max-w-[75%]">
                  <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-primary text-white rounded-br-sm shadow-sm'
                      : 'bg-surface-container text-on-surface-variant border border-outline-variant/50 rounded-bl-sm'
                  }`}>
                    {msg.isAnimated ? (
                      <TypewriterMessage
                        fullText={msg.text}
                        isIno={msg.isIno}
                        onScroll={scrollToBottom}
                      />
                    ) : (
                      <>
                        <span className="whitespace-pre-wrap">{msg.text}</span>
                        {msg.isIno && (
                          <a
                            id="chat-ino-link"
                            href="https://ino.iitu.kz"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-3 flex items-center gap-1.5 text-white/90 text-xs font-semibold hover:underline"
                          >
                            🎓 Перейти на INO →
                          </a>
                        )}
                      </>
                    )}
                  </div>
                  <p className={`text-[10px] font-medium text-outline mt-1.5 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
                    {formatTime(msg.time)}
                  </p>
                </div>
              </div>
            ))}

            {isTyping && <TypingIndicator />}

            {/* Quick questions */}
            {showQuick && (
              <div className="animate-fade-in mt-2">
                <p className="text-xs font-medium text-outline mb-2 pl-9">Популярные вопросы:</p>
                <div className="pl-9 flex flex-col gap-2">
                  {QUICK_QUESTIONS.map((q, i) => (
                    <button
                      key={i}
                      id={`quick-q-${i}`}
                      className="text-left text-xs font-medium px-3.5 py-2.5 rounded-xl border border-outline-variant text-on-surface-variant bg-surface hover:bg-surface-container hover:text-on-surface transition-all duration-150"
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
          <div className="border-t border-outline-variant p-4 bg-surface-container">
            <form onSubmit={handleSubmit} className="flex items-end gap-3 relative">
              <input
                id="chat-input"
                ref={inputRef}
                type="text"
                className="input-field flex-1 py-2.5 pl-4 pr-12 text-sm bg-surface"
                placeholder="Задайте вопрос..."
                value={input}
                onChange={e => setInput(e.target.value)}
                disabled={isTyping}
              />
              <button
                id="chat-send-btn"
                type="submit"
                disabled={!input.trim() || isTyping}
                className="absolute right-1 top-1 w-8 h-8 rounded-lg bg-primary flex items-center justify-center flex-shrink-0 transition-all duration-200 hover:brightness-110 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Send className="w-3.5 h-3.5 text-white" />
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Floating button */}
      <button
        id="chat-toggle-btn"
        className={`fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-primary flex items-center justify-center shadow-lg transition-transform duration-300 hover:scale-105 active:scale-95 ${
          isOpen ? 'rotate-0' : 'rotate-0'
        }`}
        onClick={() => setIsOpen(o => !o)}
        aria-label="Открыть чат с ИИ-консультантом"
      >
        {isOpen ? (
          <X className="w-6 h-6 text-white" />
        ) : (
          <MessageCircle className="w-6 h-6 text-white" />
        )}
      </button>
    </>
  );
}
