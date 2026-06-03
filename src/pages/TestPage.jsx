import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { pythonTestQuestions } from '../data/mockData';
import {
  Brain, Clock, ChevronRight, ChevronLeft, X, CheckCircle,
  AlertTriangle, ExternalLink, BookOpen, Sparkles, ArrowLeft, Target
} from 'lucide-react';
import AppNavbar from '../components/AppNavbar';
import ChatWidget from '../components/ChatWidget';

/*
 * CORRECT ANSWERS (for QA reference — see mockData.js):
 * Q1: b — Список изменяемый, кортеж — нет
 * Q2: c — Словарь (dict)
 * Q3: a — list, dict, set
 *
 * The test is intentionally always scored 33% (1/3 correct)
 * to demonstrate the "failed → INO recommendation" flow.
 */

function ResultModal({ onClose, onRetry }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" />
      <div className="relative bg-surface border border-outline-variant rounded-2xl max-w-xl w-full p-8 animate-slide-up shadow-glass-lg max-h-[90vh] overflow-y-auto">

        <button
          id="result-close-btn"
          className="absolute top-4 right-4 text-outline hover:text-on-surface transition-colors"
          onClick={onClose}
        >
          <X className="w-5 h-5" />
        </button>

        {/* Score */}
        <div className="flex flex-col items-center mb-8">
          <div className="relative mb-6">
            <svg width="100" height="100" className="rotate-[-90deg]">
              <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
              <circle
                cx="50" cy="50" r="42" fill="none"
                stroke="#ef4444" strokeWidth="8"
                strokeDasharray={`${2 * Math.PI * 42 * 0.33} ${2 * Math.PI * 42}`}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-bold text-error">33%</span>
              <span className="text-xs text-outline font-medium">1 из 3</span>
            </div>
          </div>

          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-5 h-5 text-error" />
            <h2 className="text-xl font-bold text-on-surface">Тест не пройден</h2>
          </div>
          <p className="text-on-surface-variant text-sm text-center">Минимальный проходной балл: 70%</p>
        </div>

        {/* Detailed AI Analysis */}
        <div className="bg-surface-container border border-outline-variant rounded-xl p-6 mb-6 text-sm text-on-surface-variant leading-relaxed">
          <div className="flex items-center gap-2 mb-4 text-on-surface">
            <Sparkles className="w-4 h-4 text-primary" />
            <h3 className="font-semibold tracking-wide text-xs uppercase">ИИ-Разбор результатов</h3>
          </div>
          
          <p className="mb-5 text-on-surface font-medium text-sm">Мансур, по результату видно, что у тебя есть базовое понимание Python, но пока не хватает уверенности в практических моментах, которые реально проверяют на junior-позиции.</p>
          
          <h4 className="font-semibold text-error mb-2 text-xs uppercase tracking-wider">Главные слабые места:</h4>
          <ul className="list-disc list-inside space-y-1.5 mb-5 text-on-surface-variant">
            <li>Ты ошибаешься там, где нужно внимательно читать код и понимать, как он поведет себя при запуске.</li>
            <li>Есть пробелы в работе со словарями, списками и изменяемыми объектами.</li>
            <li>Нужно лучше понять, как работают <code className="bg-surface px-1.5 py-0.5 rounded border border-outline-variant text-xs mx-0.5 font-mono">with open()</code>, <code className="bg-surface px-1.5 py-0.5 rounded border border-outline-variant text-xs mx-0.5 font-mono">try/except</code> и виртуальное окружение.</li>
            <li>По ООП и базовому синтаксису у тебя есть основа, но ее еще нужно закрепить практикой.</li>
          </ul>

          <h4 className="font-semibold text-amber-500 mb-2 text-xs uppercase tracking-wider">Что стоит подтянуть в первую очередь:</h4>
          <ul className="list-disc list-inside space-y-1.5 mb-6 text-on-surface-variant">
            <li>Изменяемые и неизменяемые типы данных.</li>
            <li>Функции и аргументы, особенно tricky-моменты в Python.</li>
            <li>Работа с файлами и исключениями.</li>
            <li>Итерация по коллекциям и типичные ошибки в коде.</li>
            <li>Базовый рабочий процесс Python-разработчика: venv, pip, requirements.txt.</li>
          </ul>

          <p className="border-l-2 border-primary pl-4 py-1 italic text-on-surface text-sm">Если коротко, твоя проблема не в том, что ты совсем не знаешь Python, а в том, что пока не хватает именно практической уверенности и насмотренности на реальные ошибки.</p>
        </div>

        {/* Recommended Courses section */}
        <div className="mb-8">
          <p className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-4 flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-primary" /> Рекомендованные курсы от ИНО
          </p>
          <div className="space-y-3">
            {[
              {
                title: 'Python Basics / Основы Python',
                desc: 'Нужен, чтобы хорошо закрыть базу: типы данных, функции, аргументы, условия, циклы.'
              },
              {
                title: 'Working with Files and Exceptions / Работа с файлами и исключениями',
                desc: 'Поможет лучше понять with open(), обработку ошибок и более аккуратную работу со скриптами.'
              },
              {
                title: 'OOP in Python / ООП в Python',
                desc: 'Полезен, чтобы увереннее работать с self, __init__, методами и классами.'
              },
              {
                title: 'Python for Data Processing / Python для обработки данных',
                desc: 'Хорошо прокачивает работу со списками, словарями, filter, comprehension и общей логикой кода.'
              },
              {
                title: 'Git and Debugging for Beginners / Git и отладка для начинающих',
                desc: 'Нужен, чтобы научиться не просто писать код, а нормально искать и исправлять ошибки.'
              },
              {
                title: 'SQL for Python Developers / SQL для Python-разработчиков',
                desc: 'Это уже хороший следующий шаг после базы Python, чтобы стать сильнее как junior-кандидат.'
              }
            ].map(course => (
              <a 
                href="https://ino.iitu.kz/" 
                target="_blank" 
                rel="noopener noreferrer" 
                key={course.title}
                className="block p-4 rounded-xl border border-outline-variant bg-surface hover:border-outline transition-colors group"
              >
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="font-semibold text-primary text-sm group-hover:underline">{course.title}</span>
                  <ExternalLink className="w-3 h-3 text-primary/70" />
                </div>
                <p className="text-xs text-on-surface-variant leading-relaxed">{course.desc}</p>
              </a>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-2">
          <button
            id="retry-test-btn"
            className="btn-primary w-full justify-center py-2.5"
            onClick={onRetry}
          >
            Пройти тест заново
          </button>
        </div>
      </div>
    </div>
  );
}

export default function TestPage() {
  const navigate = useNavigate();
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showResult, setShowResult] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes

  // Declare handleFinish before the timer useEffect that references it
  const handleFinish = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
      setShowResult(true);
    }, 3000);
  };

  useEffect(() => {
    if (timeLeft > 0 && !showResult && !isAnalyzing) {
      const timerId = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timerId);
    } else if (timeLeft === 0 && !showResult && !isAnalyzing) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      handleFinish();
    }
  }, [timeLeft, showResult, isAnalyzing]);

  const mins = Math.floor(timeLeft / 60);
  const secs = timeLeft % 60;
  const timeStr = `${mins}:${secs.toString().padStart(2, '0')}`;

  const question = pythonTestQuestions[currentQ];
  const total = pythonTestQuestions.length;
  const progress = ((currentQ) / total) * 100;

  const handleAnswer = (optionId) => {
    setAnswers(prev => ({ ...prev, [question.id]: optionId }));
  };

  const handleNext = () => {
    if (currentQ < total - 1) setCurrentQ(c => c + 1);
  };

  const handlePrev = () => {
    if (currentQ > 0) setCurrentQ(c => c - 1);
  };



  const handleRetry = () => {
    setShowResult(false);
    setCurrentQ(0);
    setAnswers({});
    setTimeLeft(600);
  };

  const allAnswered = pythonTestQuestions.every(q => answers[q.id]);

  return (
    <div className="min-h-screen bg-background">
      <AppNavbar />
      {/* Test sub-header with timer + progress */}
      <div className="border-b border-outline-variant/40 bg-background/80 backdrop-blur-glass">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button id="test-back-btn" className="btn-ghost py-1.5 px-3 text-xs" onClick={() => navigate('/companies')}>
              <ArrowLeft className="w-3.5 h-3.5" /> Назад
            </button>
            <div className="h-4 w-px bg-outline-variant" />
            <div className="flex items-center gap-2">
              <Brain className="w-4 h-4 text-on-surface-variant" />
              <span className="text-sm font-semibold text-on-surface hidden sm:block">Оценка навыков · Junior Python</span>
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-sm text-on-surface-variant bg-surface-container px-3 py-1.5 rounded-md border border-outline-variant">
            <Clock className={`w-4 h-4 ${timeLeft < 60 ? 'text-error animate-pulse' : 'text-on-surface-variant'}`} />
            <span className={`font-mono font-medium ${timeLeft < 60 ? 'text-error' : 'text-on-surface'}`}>{timeStr}</span>
          </div>
        </div>
        {/* Progress bar */}
        <div className="h-0.5 bg-surface-container-highest">
          <div
            className="h-full bg-primary transition-all duration-500"
            style={{ width: `${allAnswered ? 100 : progress + (answers[question.id] ? 1/total*100 : 0)}%` }}
          />
        </div>
      </div>

      <main className="max-w-3xl mx-auto px-6 py-12">
        {/* Test header */}
        <div className="text-center mb-10 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-container border border-outline-variant mb-5">
            <Target className="w-3.5 h-3.5 text-primary" />
            <span className="text-xs font-semibold text-on-surface-variant tracking-wide uppercase">Junior Python Developer</span>
          </div>
          <h1 className="text-3xl font-bold text-on-surface mb-2 tracking-tight">Тестирование Python</h1>
          <p className="text-on-surface-variant text-sm">
            Вопрос {currentQ + 1} из {total} · Проходной балл: 70%
          </p>
        </div>

        {/* Question card */}
        <div key={currentQ} className="bg-surface border border-outline-variant p-8 rounded-2xl mb-8 animate-fade-in">
          <div className="flex items-start gap-4 mb-8">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-surface-container border border-outline-variant flex-shrink-0">
              <span className="text-on-surface font-semibold text-sm">{currentQ + 1}</span>
            </div>
            <h2 className="text-lg font-medium text-on-surface leading-relaxed pt-1.5 whitespace-pre-wrap">
              {question.question}
            </h2>
          </div>

          <div className="space-y-3">
            {question.options.map((option) => {
              const isSelected = answers[question.id] === option.id;
              return (
                <button
                  key={option.id}
                  id={`option-${question.id}-${option.id}`}
                  className={`w-full text-left p-4 rounded-xl border transition-all duration-200 flex items-start gap-4 group ${
                    isSelected
                      ? 'border-primary bg-primary/5'
                      : 'border-outline-variant bg-surface hover:border-outline hover:bg-surface-container'
                  }`}
                  onClick={() => handleAnswer(option.id)}
                >
                  <div className={`w-5 h-5 rounded-full border flex items-center justify-center flex-shrink-0 mt-0.5 transition-all duration-200 ${
                    isSelected
                      ? 'border-primary bg-primary'
                      : 'border-outline-variant group-hover:border-outline'
                  }`}>
                    {isSelected && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-xs font-semibold uppercase tracking-wider ${isSelected ? 'text-primary' : 'text-outline'}`}>
                      {option.id})
                    </span>
                    <span className={`text-sm leading-relaxed whitespace-pre-wrap font-medium ${isSelected ? 'text-on-surface' : 'text-on-surface-variant group-hover:text-on-surface'}`}>
                      {option.text}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Question dots */}
        <div className="flex items-center justify-center gap-2 mb-10">
          {pythonTestQuestions.map((q, i) => (
            <button
              key={q.id}
              id={`dot-${i}`}
              className={`rounded-full transition-all duration-300 ${
                i === currentQ
                  ? 'w-6 h-2 bg-primary'
                  : answers[q.id]
                  ? 'w-2 h-2 bg-primary/60'
                  : 'w-2 h-2 bg-outline-variant hover:bg-outline'
              }`}
              onClick={() => setCurrentQ(i)}
            />
          ))}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between gap-4">
          <button
            id="prev-question-btn"
            className="btn-secondary"
            disabled={currentQ === 0}
            onClick={handlePrev}
            style={{ opacity: currentQ === 0 ? 0.4 : 1 }}
          >
            <ChevronLeft className="w-4 h-4" />
            Назад
          </button>

          {currentQ < total - 1 ? (
            <button
              id="next-question-btn"
              className="btn-primary"
              disabled={!answers[question.id]}
              onClick={handleNext}
              style={{ opacity: answers[question.id] ? 1 : 0.5 }}
            >
              Далее
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              id="finish-test-btn"
              className="btn-primary"
              onClick={handleFinish}
              style={{ opacity: answers[question.id] ? 1 : 0.5 }}
            >
              <CheckCircle className="w-4 h-4" />
              Завершить тест
            </button>
          )}
        </div>
      </main>

      {isAnalyzing && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center p-4 bg-background/90 backdrop-blur-md animate-fade-in">
          <div className="relative flex items-center justify-center w-20 h-20 mb-6">
            <div className="absolute inset-0 rounded-full bg-primary/10 animate-ping" />
            <div className="absolute inset-2 rounded-full bg-primary/20 animate-pulse" />
            <div className="relative z-10 flex items-center justify-center w-14 h-14 rounded-full bg-primary">
              <Brain className="w-6 h-6 text-white animate-pulse" />
            </div>
          </div>
          <h2 className="text-xl font-bold text-on-surface mb-2 animate-pulse tracking-tight">ИИ оценивает ответы...</h2>
          <p className="text-sm text-on-surface-variant max-w-sm text-center">Проверяем знания, ищем слабые места и подготавливаем персональный план обучения.</p>
        </div>
      )}

      {showResult && <ResultModal onClose={() => navigate('/companies')} onRetry={handleRetry} />}
      <ChatWidget />

      {/* Bottom timer progress line */}
      <div className="fixed bottom-0 left-0 w-full h-1 bg-surface-container-highest z-50">
        <div
          className={`h-full transition-all duration-1000 ease-linear ${timeLeft < 60 ? 'bg-error' : 'bg-primary'}`}
          style={{ width: `${(timeLeft / 600) * 100}%` }}
        />
      </div>
    </div>
  );
}
