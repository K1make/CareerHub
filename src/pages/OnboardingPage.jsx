import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GraduationCap, Search, Building2, ArrowRight, Sparkles, Shield, Zap, ChevronRight } from 'lucide-react';

function EcpModal({ onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative glass-card-high max-w-md w-full p-8 animate-slide-up shadow-modal border-glow">
        <div className="flex items-center justify-center w-14 h-14 rounded-xl bg-amber-500/15 border border-amber-500/30 mb-6 mx-auto">
          <Shield className="w-7 h-7 text-amber-400" />
        </div>
        <h3 className="text-xl font-bold text-on-surface text-center mb-3">Авторизация для компаний</h3>
        <div className="bg-surface-container rounded-lg p-4 border border-outline-variant mb-6">
          <p className="text-on-surface-variant text-sm leading-relaxed text-center">
            Требуется авторизация через{' '}
            <span className="text-amber-400 font-semibold">ЭЦП (NCALayer)</span>{' '}
            для подтверждения юридического лица.
          </p>
          <p className="text-outline text-xs text-center mt-2">
            Убедитесь, что приложение NCALayer запущено на вашем компьютере.
          </p>
        </div>
        <div className="flex flex-col gap-3">
          <button
            id="ecp-connect-btn"
            className="btn-primary justify-center w-full"
            onClick={onClose}
          >
            <Shield className="w-4 h-4" />
            Подключить NCALayer
          </button>
          <button
            id="ecp-cancel-btn"
            className="btn-ghost justify-center w-full text-sm"
            onClick={onClose}
          >
            Отмена
          </button>
        </div>
      </div>
    </div>
  );
}

const paths = [
  {
    id: 'student',
    icon: GraduationCap,
    title: 'Вы студент?',
    description: 'Зарегистрируйтесь через вашу университетскую базу. Подтвердите диплом и навыки автоматически.',
    badge: 'IITU, KBTU, НУ и др.',
    cta: 'Войти как студент',
    gradient: 'from-primary-container/20 to-primary/5',
    borderColor: 'border-primary-container/30',
    iconBg: 'bg-primary-container/15 border-primary-container/25',
    iconColor: 'text-primary',
    route: '/register/student',
    badgeClass: 'badge-indigo',
  },
  {
    id: 'jobseeker',
    icon: Search,
    title: 'Ищете работу?',
    description: 'Создайте профиль, пройдите ИИ-верификацию навыков и получайте оферы от топовых компаний.',
    badge: 'Для соискателей',
    cta: 'Начать поиск',
    gradient: 'from-secondary/10 to-secondary-container/5',
    borderColor: 'border-secondary/20',
    iconBg: 'bg-secondary/10 border-secondary/20',
    iconColor: 'text-secondary',
    route: '/register/jobseeker',
    badgeClass: 'badge-green',
  },
  {
    id: 'company',
    icon: Building2,
    title: 'Вы компания?',
    description: 'Доступ к верифицированной базе ИИ-кандидатов. Нанимайте быстро, нанимайте правильно.',
    badge: 'Требуется ЭЦП',
    cta: 'Войти как компания',
    gradient: 'from-tertiary/10 to-tertiary-container/5',
    borderColor: 'border-tertiary/20',
    iconBg: 'bg-tertiary/10 border-tertiary/20',
    iconColor: 'text-tertiary',
    route: 'ecp',
    badgeClass: 'badge-amber',
  },
];

export default function OnboardingPage() {
  const navigate = useNavigate();
  const [showEcp, setShowEcp] = useState(false);
  const [hoveredPath, setHoveredPath] = useState(null);

  const handlePathClick = (path) => {
    if (path.route === 'ecp') {
      setShowEcp(true);
    } else {
      navigate(path.route);
    }
  };

  return (
    <div className="min-h-screen bg-background bg-grid relative overflow-hidden">
      {/* Background glow blobs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-primary-container/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-secondary/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header */}
        <header className="flex items-center justify-between px-6 py-5 border-b border-outline-variant/40">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-primary-container shadow-glow-sm">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold text-on-surface tracking-tight">CareerAI</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              id="signin-link"
              className="btn-ghost text-sm"
              onClick={() => navigate('/login')}
            >
              Войти
            </button>
          </div>
        </header>

        {/* Hero */}
        <div className="flex-1 flex flex-col items-center justify-center px-6 py-16">
          <div className="text-center max-w-2xl mx-auto mb-16 animate-fade-in">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-container/15 border border-primary-container/25 mb-6">
              <Zap className="w-3.5 h-3.5 text-primary" />
              <span className="text-xs font-semibold text-primary tracking-wide uppercase">ИИ-Платформа карьерного роста</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-on-surface leading-tight mb-5 tracking-tight">
              Найди свой путь в{' '}
              <span className="text-gradient">карьере</span>
            </h1>
            <p className="text-on-surface-variant text-lg leading-relaxed">
              CareerAI использует ИИ для верификации навыков, персонального наставничества и подбора идеальной работы — всё в одном месте.
            </p>
          </div>

          {/* Path cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-4xl w-full animate-slide-up">
            {paths.map((path) => {
              const Icon = path.icon;
              const isHovered = hoveredPath === path.id;
              return (
                <button
                  key={path.id}
                  id={`path-${path.id}`}
                  className={`
                    relative text-left p-7 rounded-xl border transition-all duration-300 cursor-pointer group
                    bg-gradient-to-br ${path.gradient} ${path.borderColor}
                    ${isHovered ? 'scale-[1.02] shadow-glass-lg' : 'shadow-glass'}
                  `}
                  onMouseEnter={() => setHoveredPath(path.id)}
                  onMouseLeave={() => setHoveredPath(null)}
                  onClick={() => handlePathClick(path)}
                  style={{ background: 'rgba(27,27,36,0.6)', backdropFilter: 'blur(12px)' }}
                >
                  {/* Top border highlight */}
                  <div className={`absolute inset-x-0 top-0 h-px rounded-t-xl transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-40'}`}
                    style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)' }} />

                  <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl border ${path.iconBg} mb-5 transition-transform duration-300 ${isHovered ? 'scale-110' : ''}`}>
                    <Icon className={`w-6 h-6 ${path.iconColor}`} />
                  </div>

                  <span className={`${path.badgeClass} mb-4 block w-fit`}>{path.badge}</span>

                  <h2 className="text-lg font-bold text-on-surface mb-3 leading-tight">{path.title}</h2>
                  <p className="text-on-surface-variant text-sm leading-relaxed mb-6">{path.description}</p>

                  <div className={`flex items-center gap-2 text-sm font-semibold transition-all duration-200 ${path.iconColor} ${isHovered ? 'gap-3' : ''}`}>
                    {path.cta}
                    <ChevronRight className={`w-4 h-4 transition-transform duration-300 ${isHovered ? 'translate-x-1' : ''}`} />
                  </div>
                </button>
              );
            })}
          </div>

          {/* Stats */}
          <div className="flex items-center gap-8 mt-16 text-center animate-fade-in">
            {[
              { label: 'Студентов', value: '2,400+' },
              { label: 'Компаний-партнёров', value: '180+' },
              { label: 'Успешных оферов', value: '940+' },
            ].map(({ label, value }) => (
              <div key={label} className="flex flex-col items-center gap-1">
                <span className="text-2xl font-bold text-gradient-indigo">{value}</span>
                <span className="text-xs text-outline tracking-wide uppercase">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {showEcp && <EcpModal onClose={() => setShowEcp(false)} />}
    </div>
  );
}
