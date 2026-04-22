import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { pythonTestQuestions } from '../data/mockData';
import {
  Brain, Clock, ChevronRight, ChevronLeft, X, CheckCircle,
  AlertTriangle, ExternalLink, BookOpen, Sparkles, ArrowLeft, Target
} from 'lucide-react';
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
      <div className="absolute inset-0 bg-black/75 backdrop-blur-sm" />
      <div className="relative glass-card-high max-w-lg w-full p-8 animate-slide-up shadow-modal border border-error-container/40">
        {/* Glow ring */}
        <div className="absolute inset-0 rounded-lg pointer-events-none" style={{ boxShadow: '0 0 40px rgba(147,0,10,0.2)' }} />

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
                stroke="#93000a" strokeWidth="8"
                strokeDasharray={`${2 * Math.PI * 42 * 0.33} ${2 * Math.PI * 42}`}
                strokeLinecap="round"
                style={{ filter: 'drop-shadow(0 0 6px rgba(147,0,10,0.5))' }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-extrabold text-error">33%</span>
              <span className="text-xs text-outline">1 из 3</span>
            </div>
          </div>

          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-5 h-5 text-error" />
            <h2 className="text-xl font-bold text-on-surface">Тест не пройден</h2>
          </div>
          <p className="text-outline text-sm text-center">Минимальный проходной балл: 70%</p>
        </div>

        {/* AI Analysis */}
        <div className="bg-error-container/15 border border-error-container/30 rounded-xl p-5 mb-6">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary-container/20 border border-primary-container/30 flex items-center justify-center flex-shrink-0">
              <Brain className="w-4 h-4 text-primary" />
            </div>
            <div>
              <p className="text-xs font-bold text-primary uppercase tracking-wider mb-2">ИИ-Анализ результатов</p>
              <p className="text-on-surface-variant text-sm leading-relaxed">
                Тест не пройден. Твои слабые места: <span className="text-on-surface font-semibold">понимание структур данных</span> и <span className="text-on-surface font-semibold">ООП</span>. Чтобы улучшить навыки и успешно пересдать тест, рекомендуем пройти курс <span className="text-amber-400 font-semibold">«Основы Python»</span> на платформе INO.
              </p>
            </div>
          </div>
        </div>

        {/* Weak areas */}
        <div className="mb-6">
          <p className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-3">Темы для изучения</p>
          <div className="flex flex-wrap gap-2">
            {['Структуры данных', 'Изменяемые типы', 'ООП в Python', 'Коллекции'].map(t => (
              <span key={t} className="px-3 py-1 rounded-full text-xs bg-error-container/20 text-error border border-error-container/30">{t}</span>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <a
            id="ino-course-link"
            href="https://ino.kz"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary flex-1 justify-center text-sm"
            style={{ background: '#f59e0b', color: '#000' }}
          >
            <BookOpen className="w-4 h-4" />
            Курс на INO
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
          <button
            id="retry-test-btn"
            className="btn-secondary flex-1 justify-center text-sm"
            onClick={onRetry}
          >
            Пересдать
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
  const [timeLeft] = useState(300); // 5 min display only

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

  const handleFinish = () => {
    // Intentionally always shows 33% failed result (1 out of 3)
    setShowResult(true);
  };

  const handleRetry = () => {
    setShowResult(false);
    setCurrentQ(0);
    setAnswers({});
  };

  const allAnswered = pythonTestQuestions.every(q => answers[q.id]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-outline-variant/40 bg-background/80 backdrop-blur-glass">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button id="test-back-btn" className="btn-ghost" onClick={() => navigate('/students')}>
              <ArrowLeft className="w-4 h-4" /> Назад
            </button>
            <div className="h-5 w-px bg-outline-variant/50" />
            <div className="flex items-center gap-2">
              <Brain className="w-5 h-5 text-primary" />
              <span className="text-sm font-semibold text-on-surface">ИИ-тестирование навыков</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-sm text-on-surface-variant">
              <Clock className="w-4 h-4 text-outline" />
              <span className="font-mono text-on-surface">4:32</span>
            </div>
          </div>
        </div>
        {/* Progress bar */}
        <div className="h-0.5 bg-surface-container-highest">
          <div
            className="h-full bg-primary-container transition-all duration-500"
            style={{ width: `${allAnswered ? 100 : progress + (answers[question.id] ? 1/total*100 : 0)}%` }}
          />
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-6 py-10">
        {/* Test header */}
        <div className="text-center mb-10 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-container/15 border border-primary-container/25 mb-5">
            <Target className="w-3.5 h-3.5 text-primary" />
            <span className="text-xs font-semibold text-primary tracking-wide uppercase">Junior Python Developer</span>
          </div>
          <h1 className="text-2xl font-extrabold text-on-surface mb-2">Оценка навыков Python</h1>
          <p className="text-on-surface-variant text-sm">
            Вопрос {currentQ + 1} из {total} · Минимальный проходной балл: 70%
          </p>
        </div>

        {/* Question card */}
        <div key={currentQ} className="glass-card-high p-8 rounded-xl mb-6 animate-fade-in">
          <div className="flex items-start gap-4 mb-8">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary-container/15 border border-primary-container/25 flex-shrink-0">
              <span className="text-primary font-bold text-sm">{currentQ + 1}</span>
            </div>
            <h2 className="text-lg font-semibold text-on-surface leading-snug pt-1.5">
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
                      ? 'border-primary-container bg-primary-container/15 shadow-glow-sm'
                      : 'border-outline-variant bg-surface-container/50 hover:border-outline-variant/80 hover:bg-surface-container hover:border-outline'
                  }`}
                  onClick={() => handleAnswer(option.id)}
                >
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-all duration-200 ${
                    isSelected
                      ? 'border-primary-container bg-primary-container'
                      : 'border-outline-variant group-hover:border-outline'
                  }`}>
                    {isSelected && <div className="w-2.5 h-2.5 bg-white rounded-full" />}
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-xs font-bold uppercase tracking-wider ${isSelected ? 'text-primary' : 'text-outline'}`}>
                      {option.id})
                    </span>
                    <span className={`text-sm leading-relaxed ${isSelected ? 'text-on-surface' : 'text-on-surface-variant group-hover:text-on-surface'}`}>
                      {option.text}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Question dots */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {pythonTestQuestions.map((q, i) => (
            <button
              key={q.id}
              id={`dot-${i}`}
              className={`rounded-full transition-all duration-300 ${
                i === currentQ
                  ? 'w-6 h-2.5 bg-primary-container'
                  : answers[q.id]
                  ? 'w-2.5 h-2.5 bg-emerald-500'
                  : 'w-2.5 h-2.5 bg-outline-variant hover:bg-outline'
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
      </div>

      {showResult && <ResultModal onClose={() => navigate('/students')} onRetry={handleRetry} />}
      <ChatWidget />
    </div>
  );
}
