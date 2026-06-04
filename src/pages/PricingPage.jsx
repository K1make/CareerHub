import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { pricingPlans, companyPricingPlans } from '../data/mockData';
import { api } from '../api/client';
import {
  CheckCircle2, X, Sparkles, Zap, Crown, Star,
  ChevronRight, Lock, Shield
} from 'lucide-react';
import AppNavbar from '../components/AppNavbar';
import ChatWidget from '../components/ChatWidget';
import { useAuth } from '../context/AuthContext';

const planIcons = { starter: Sparkles, active: Zap, top: Crown };

function PlanCard({ plan, annual }) {
  const navigate = useNavigate();
  const Icon = planIcons[plan.id];
  const isHighlighted = plan.highlighted;
  const annualPrice = plan.price ? Math.round(plan.price * 10) : 0;
  const displayPrice = annual ? annualPrice : plan.price;

  return (
    <div
      className={`relative flex flex-col rounded-2xl p-8 transition-all duration-300 ${
        isHighlighted
          ? 'bg-surface border-2 border-primary shadow-glow scale-[1.02]'
          : 'bg-surface border border-outline-variant hover:border-outline hover:shadow-glass-lg'
      }`}
    >
      {/* Popular badge */}
      {plan.badge && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2">
          <span className={`whitespace-nowrap px-4 py-1.5 rounded-full text-[11px] font-semibold uppercase tracking-wider shadow-sm ${
            isHighlighted ? 'bg-primary text-white' : 'bg-surface-container text-on-surface border border-outline-variant'
          }`}>
            {plan.badge}
          </span>
        </div>
      )}

      {/* Icon + Name */}
      <div className="flex items-start justify-between mb-6">
        <div className={`flex items-center justify-center w-12 h-12 rounded-xl border ${
          isHighlighted ? 'bg-primary text-white border-primary' : 'bg-surface-container text-on-surface-variant border-outline-variant'
        }`}>
          <Icon className="w-5 h-5" />
        </div>
        {plan.price === 0 && (
          <span className="badge badge-green">Бесплатно</span>
        )}
      </div>

      <h3 className="text-xl font-bold text-on-surface mb-2">{plan.name}</h3>
      <p className="text-on-surface-variant text-sm mb-6 leading-relaxed">{plan.tagline}</p>

      {/* Price */}
      <div className="flex items-end gap-1.5 mb-1">
        {plan.price === 0 ? (
          <span className="text-4xl font-bold text-on-surface tracking-tight">$0</span>
        ) : (
          <>
            <span className="text-4xl font-bold text-on-surface tracking-tight">{plan.currency}{displayPrice}</span>
            <span className="text-on-surface-variant text-sm mb-1.5 font-medium">/ {annual ? 'год' : plan.period}</span>
          </>
        )}
      </div>
      {annual && plan.price > 0 && (
        <p className="text-xs text-tertiary font-medium mb-2">Экономия 2 месяца бесплатно 🎉</p>
      )}
      <p className="text-xs text-outline mb-8">{plan.description}</p>

      {/* Features */}
      <ul className="space-y-3.5 flex-1 mb-8">
        {plan.features.map((feat, i) => (
          <li key={i} className="flex items-start gap-3">
            {feat.included ? (
              <CheckCircle2 className={`w-4 h-4 flex-shrink-0 mt-0.5 ${isHighlighted ? 'text-primary' : 'text-on-surface-variant'}`} />
            ) : (
              <X className="w-4 h-4 flex-shrink-0 mt-0.5 text-outline/40" />
            )}
            <span className={`text-sm ${feat.included ? 'text-on-surface-variant' : 'text-outline line-through'}`}>
              {feat.text}
            </span>
          </li>
        ))}
      </ul>

      {/* CTA */}
      <button
        id={`plan-cta-${plan.id}`}
        className={isHighlighted ? 'btn-primary w-full' : 'btn-secondary w-full'}
        onClick={() => navigate('/register/student')}
      >
        {plan.cta}
        {plan.id === 'starter' && <ChevronRight className="w-4 h-4" />}
        {plan.id === 'active' && <Zap className="w-4 h-4" />}
        {plan.id === 'top' && <Crown className="w-4 h-4" />}
      </button>
    </div>
  );
}

export default function PricingPage() {
  const [annual, setAnnual] = useState(false);
  const { user, isCompany } = useAuth();
  const [plans, setPlans] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    async function loadPlans() {
      try {
        const data = await api.pricing(isCompany ? 'company' : 'student');
        if (active) setPlans(data);
      } catch (err) {
        if (active) {
          setPlans(isCompany ? companyPricingPlans : pricingPlans);
          setError(err.message);
        }
      }
    }
    loadPlans();
    return () => { active = false; };
  }, [isCompany]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <AppNavbar />

      <main className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 py-16 w-full">
        {/* Hero */}
        <div className="text-center max-w-3xl mx-auto mb-16 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-container border border-outline-variant mb-6">
            <span className="w-2 h-2 rounded-full bg-primary" />
            <span className="text-xs font-medium text-on-surface-variant tracking-wide uppercase">Тарифные планы</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-on-surface tracking-tight mb-4">
            {isCompany ? 'Нанимайте' : 'Инвестируй в свою'}{' '}
            <span className="text-on-surface-variant">{isCompany ? 'лучших' : 'карьеру'}</span>
          </h1>
          <p className="text-on-surface-variant text-lg leading-relaxed max-w-2xl mx-auto mb-8">
            Выбери план, который подходит именно тебе. Начни бесплатно, расти быстрее с Premium.
          </p>

          {/* Annual / monthly toggle */}
          <div className="inline-flex items-center gap-4 bg-surface-container border border-outline-variant rounded-xl p-1.5">
            <button
              onClick={() => setAnnual(false)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${!annual ? 'bg-surface text-on-surface border border-outline-variant shadow-sm' : 'text-on-surface-variant hover:text-on-surface'}`}
            >
              Ежемесячно
            </button>
            <button
              onClick={() => setAnnual(true)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${annual ? 'bg-surface text-on-surface border border-outline-variant shadow-sm' : 'text-on-surface-variant hover:text-on-surface'}`}
            >
              Ежегодно
              <span className="badge badge-green text-[10px]">−17%</span>
            </button>
          </div>
        </div>
        {error && (
          <div className="alert-info mb-6 text-xs">
            API fallback: {error}
          </div>
        )}

        {/* Plans grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20 animate-slide-up items-start">
          {plans.map(plan => {
            let displayPlan = plan;
            if (user?.role === 'student' && plan.id === 'active') {
              displayPlan = {
                ...plan,
                price: 0,
                badge: 'Бесплатно студентам',
                tagline: 'Твой ВУЗ оплатил подписку Pro!',
                cta: 'Активировать Pro',
              };
            }
            return <PlanCard key={plan.id} plan={displayPlan} annual={annual} />;
          })}
        </div>

        {/* Trust section */}
        <div className="bg-surface border border-outline-variant rounded-2xl p-10 text-center animate-fade-in max-w-4xl mx-auto mb-12">
          <div className="flex items-center justify-center gap-3 mb-3">
            <Shield className="w-5 h-5 text-on-surface-variant" />
            <h3 className="text-lg font-semibold text-on-surface">Безопасная оплата</h3>
          </div>
          <p className="text-on-surface-variant text-sm mb-8">
            Все платежи защищены шифрованием. Отменить подписку можно в любой момент.
          </p>
          <div className="flex items-center justify-center gap-3 flex-wrap">
            {['Kaspi Pay', 'Visa / Mastercard', 'Halyk Bank', 'Freedom Pay'].map(m => (
              <span key={m} className="px-4 py-2 rounded-lg bg-surface-container text-on-surface-variant text-sm font-medium border border-outline-variant">
                {m}
              </span>
            ))}
          </div>
        </div>

        {/* Testimonials */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12 animate-fade-in">
          {[
            { name: 'Айдар К.', role: 'Backend Dev, Kolesa Group', text: 'Нашёл работу за 3 недели после прохождения тестов на CareerAI. Платформа сильно помогла.' },
            { name: 'Динара Н.', role: 'Frontend Dev, Kaspi.kz', text: 'Pro-план окупился за первый месяц — меня заметили HR и пригласили на интервью напрямую.' },
            { name: 'Тимур А.', role: 'Data Scientist, Sergek', text: 'Верификация навыков через тесты даёт реальное преимущество перед другими кандидатами.' },
          ].map((t, i) => (
            <div key={i} className="glass-card p-5">
              <div className="flex mb-3">
                {[...Array(5)].map((_, j) => (
                  <Star key={j} className="w-3.5 h-3.5 text-primary fill-primary" />
                ))}
              </div>
              <p className="text-sm text-on-surface-variant leading-relaxed mb-4">"{t.text}"</p>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-surface-container border border-outline-variant flex items-center justify-center text-xs font-bold text-on-surface">
                  {t.name[0]}
                </div>
                <div>
                  <div className="text-xs font-semibold text-on-surface">{t.name}</div>
                  <div className="text-[10px] text-on-surface-variant">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* FAQ teaser */}
        <div className="text-center">
          <p className="text-outline text-sm">
            Есть вопросы?{' '}
            <button
              id="faq-link"
              className="text-on-surface hover:underline font-medium"
            >
              Напишите нам
            </button>
            {' '}или воспользуйтесь ИИ-консультантом ↗
          </p>
        </div>
      </main>

      <ChatWidget />
    </div>
  );
}
