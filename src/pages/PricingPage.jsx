import { useNavigate } from 'react-router-dom';
import { pricingPlans } from '../data/mockData';
import {
  CheckCircle2, X, Sparkles, Zap, Crown, ArrowLeft, Star,
  ChevronRight, Brain, Lock
} from 'lucide-react';
import ChatWidget from '../components/ChatWidget';

const planIcons = {
  starter: Sparkles,
  active: Zap,
  top: Crown,
};

const planColors = {
  starter: {
    icon: 'bg-surface-container text-on-surface-variant border-outline-variant',
    cta: 'btn-secondary',
    badge: null,
    ring: '',
  },
  active: {
    icon: 'bg-primary-container/20 text-primary border-primary-container/30 shadow-glow-sm',
    cta: 'btn-primary',
    badge: 'bg-primary-container text-white',
    ring: 'ring-1 ring-primary-container/40',
  },
  top: {
    icon: 'bg-tertiary/10 text-tertiary border-tertiary/20',
    cta: '',
    badge: 'bg-tertiary/20 text-tertiary',
    ring: '',
  },
};

function PlanCard({ plan }) {
  const navigate = useNavigate();
  const Icon = planIcons[plan.id];
  const colors = planColors[plan.id];
  const isHighlighted = plan.highlighted;

  return (
    <div
      className={`relative flex flex-col glass-card rounded-2xl p-7 transition-all duration-300 hover:scale-[1.02] hover:shadow-glass-lg group ${
        isHighlighted ? `${colors.ring} border-primary-container/40` : ''
      }`}
      style={{ background: isHighlighted ? 'rgba(79,70,229,0.08)' : undefined }}
    >
      {/* Top highlight */}
      <div className={`absolute inset-x-0 top-0 h-px rounded-t-2xl transition-opacity duration-300 ${isHighlighted ? 'opacity-100' : 'opacity-40 group-hover:opacity-70'}`}
        style={{ background: isHighlighted
          ? 'linear-gradient(90deg, transparent, rgba(195,192,255,0.3), transparent)'
          : 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)' }} />

      {/* Popular badge */}
      {plan.badge && (
        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
          <span className={`px-4 py-1 rounded-full text-xs font-bold tracking-wide ${colors.badge}`}>
            {plan.badge}
          </span>
        </div>
      )}

      {/* Icon + Name */}
      <div className="flex items-start justify-between mb-6">
        <div className={`flex items-center justify-center w-12 h-12 rounded-xl border transition-transform duration-300 group-hover:scale-110 ${colors.icon}`}>
          <Icon className="w-6 h-6" />
        </div>
        {plan.price === 0 && (
          <span className="badge-green text-xs">Бесплатно</span>
        )}
      </div>

      <h3 className="text-xl font-bold text-on-surface mb-1">{plan.name}</h3>
      <p className="text-on-surface-variant text-sm mb-6 leading-relaxed">{plan.tagline}</p>

      {/* Price */}
      <div className="flex items-end gap-1.5 mb-2">
        {plan.price === 0 ? (
          <span className="text-4xl font-extrabold text-on-surface tracking-tight">$0</span>
        ) : (
          <>
            <span className="text-4xl font-extrabold text-on-surface tracking-tight">{plan.currency}{plan.price}</span>
            <span className="text-on-surface-variant text-sm mb-1.5">/ {plan.period}</span>
          </>
        )}
      </div>
      <p className="text-xs text-outline mb-8">{plan.description}</p>

      {/* Features */}
      <ul className="space-y-3.5 flex-1 mb-8">
        {plan.features.map((feat, i) => (
          <li key={i} className="flex items-start gap-3">
            {feat.included ? (
              <CheckCircle2 className={`w-4 h-4 flex-shrink-0 mt-0.5 ${isHighlighted ? 'text-primary' : 'text-emerald-400'}`} />
            ) : (
              <X className="w-4 h-4 flex-shrink-0 mt-0.5 text-outline" />
            )}
            <span className={`text-sm leading-relaxed ${feat.included ? 'text-on-surface-variant' : 'text-outline line-through decoration-outline/50'}`}>
              {feat.text}
            </span>
          </li>
        ))}
      </ul>

      {/* CTA */}
      {plan.id === 'starter' && (
        <button
          id={`plan-cta-${plan.id}`}
          className="btn-secondary w-full justify-center"
          onClick={() => navigate('/register/student')}
        >
          {plan.cta}
          <ChevronRight className="w-4 h-4" />
        </button>
      )}
      {plan.id === 'active' && (
        <button
          id={`plan-cta-${plan.id}`}
          className="btn-primary w-full justify-center"
          onClick={() => navigate('/register/student')}
        >
          {plan.cta}
          <Zap className="w-4 h-4" />
        </button>
      )}
      {plan.id === 'top' && (
        <button
          id={`plan-cta-${plan.id}`}
          className="w-full justify-center inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold text-sm transition-all duration-200 hover:brightness-110 active:scale-95"
          style={{ background: 'linear-gradient(135deg, #a44100, #ffb695)', color: '#fff' }}
          onClick={() => navigate('/register/student')}
        >
          <Crown className="w-4 h-4" />
          {plan.cta}
        </button>
      )}
    </div>
  );
}

export default function PricingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-outline-variant/40 bg-background/80 backdrop-blur-glass">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <button id="pricing-logo-btn" className="flex items-center gap-2.5" onClick={() => navigate('/')}>
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary-container shadow-glow-sm">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="text-base font-bold text-on-surface">CareerAI</span>
            </button>
            <nav className="hidden md:flex items-center gap-1">
              <button id="nav-students" className="nav-link" onClick={() => navigate('/students')}>База студентов</button>
              <button id="nav-test" className="nav-link" onClick={() => navigate('/test')}>ИИ-Тест</button>
              <span className="nav-link-active">Тарифы</span>
            </nav>
          </div>
          <button id="pricing-back-btn" className="btn-ghost text-sm" onClick={() => navigate('/students')}>
            <ArrowLeft className="w-4 h-4" /> Назад
          </button>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-16">
        {/* Hero */}
        <div className="text-center max-w-2xl mx-auto mb-16 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-container/15 border border-primary-container/25 mb-6">
            <Star className="w-3.5 h-3.5 text-primary" />
            <span className="text-xs font-semibold text-primary tracking-wide uppercase">Тарифные планы</span>
          </div>
          <h1 className="text-4xl font-extrabold text-on-surface tracking-tight mb-4">
            Инвестируй в свою <span className="text-gradient">карьеру</span>
          </h1>
          <p className="text-on-surface-variant text-lg leading-relaxed">
            Выбери план, который подходит именно тебе. Начни бесплатно, расти быстрее с Premium.
          </p>
        </div>

        {/* Plans grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16 animate-slide-up">
          {pricingPlans.map(plan => (
            <PlanCard key={plan.id} plan={plan} />
          ))}
        </div>

        {/* Trust section */}
        <div className="glass-card rounded-2xl p-8 text-center animate-fade-in">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Lock className="w-5 h-5 text-outline" />
            <h3 className="text-lg font-bold text-on-surface">Безопасная оплата</h3>
          </div>
          <p className="text-on-surface-variant text-sm mb-6">
            Все платежи защищены SSL-шифрованием. Отменить подписку можно в любой момент.
          </p>
          <div className="flex items-center justify-center gap-6 flex-wrap">
            {['Kaspi Pay', 'Visa / Mastercard', 'Halyk Bank', 'Freedom Pay'].map(m => (
              <span key={m} className="px-4 py-2 rounded-lg bg-surface-container text-on-surface-variant text-sm font-medium border border-outline-variant">
                {m}
              </span>
            ))}
          </div>
        </div>

        {/* FAQ teaser */}
        <div className="mt-10 text-center">
          <p className="text-outline text-sm">
            Есть вопросы?{' '}
            <button
              id="faq-link"
              className="text-primary hover:underline font-medium"
              onClick={() => navigate('/students')}
            >
              Напишите нам через чат
            </button>
            {' '}или воспользуйтесь ИИ-консультантом ↗
          </p>
        </div>
      </div>

      <ChatWidget />
    </div>
  );
}
