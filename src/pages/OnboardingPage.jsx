import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GraduationCap, Search, Building2, ArrowRight, Sparkles, Shield, Zap, ChevronRight, CheckCircle2 } from 'lucide-react';

function EcpModal({ onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in backdrop-blur-glass bg-background/80">
      <div className="absolute inset-0" onClick={onClose} />
      <div className="relative bg-surface border border-outline-variant max-w-md w-full p-8 rounded-2xl shadow-2xl animate-slide-up">
        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-surface-container border border-outline-variant mb-6 mx-auto">
          <Shield className="w-6 h-6 text-on-surface" />
        </div>
        <h3 className="text-xl font-semibold text-on-surface text-center mb-2">Авторизация для компаний</h3>
        <div className="bg-surface-container rounded-lg p-4 border border-outline-variant mb-6">
          <p className="text-on-surface-variant text-sm leading-relaxed text-center">
            Требуется авторизация через{' '}
            <span className="text-on-surface font-medium">ЭЦП (NCALayer)</span>{' '}
            для подтверждения юридического лица.
          </p>
          <p className="text-outline text-xs text-center mt-3">
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
    title: 'Для студентов',
    description: 'Верифицируйте навыки и диплом. Получайте предложения от компаний напрямую.',
    badge: 'Университеты-партнеры',
    cta: 'Войти как студент',
    route: '/register/student',
  },
  {
    id: 'jobseeker',
    icon: Search,
    title: 'Для соискателей',
    description: 'Пройдите ИИ-ассесмент и станьте видимыми для ведущих работодателей рынка.',
    badge: 'Открытый рынок',
    cta: 'Начать поиск',
    route: '/register/jobseeker',
  },
  {
    id: 'company',
    icon: Building2,
    title: 'Для компаний',
    description: 'Доступ к базе проверенных талантов. Нанимайте быстрее и эффективнее.',
    badge: 'Регистрация по email',
    cta: 'Зарегистрировать компанию',
    route: '/register/company',
  },
];

export default function OnboardingPage() {
  const navigate = useNavigate();
  const [showEcp, setShowEcp] = useState(false);

  // Обработка клика по карточкам направлений (Студент / Соискатель / Компания)
  const handlePathClick = (path) => {
    if (path.route === '/login') {
      // Если маршрут '/login' (временно используется для компаний), 
      // передаем роль через state, чтобы страница входа открылась на нужной вкладке
      navigate(path.route, { state: { role: path.id } });
    } else if (path.route === 'ecp') {
      // Открытие модального окна ЭЦП (оставлено для будущей интеграции)
      setShowEcp(true);
    } else {
      // Стандартный переход на страницу регистрации
      navigate(path.route);
    }
  };

  return (
    <div className="min-h-screen bg-background bg-grid relative overflow-hidden flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-8 py-6 border-b border-outline-variant/40 bg-background/50 backdrop-blur-md z-10 sticky top-0">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-8 h-8 rounded-md bg-on-surface text-inverse-on-surface">
            <Sparkles className="w-4 h-4" />
          </div>
          <span className="text-lg font-semibold text-on-surface tracking-tight">CareerHub</span>
        </div>
        <div className="flex items-center gap-4">
          <button
            id="signin-link"
            className="text-sm font-medium text-on-surface-variant hover:text-on-surface transition-colors"
            onClick={() => navigate('/login')}
          >
            Войти в систему
          </button>
        </div>
      </header>

      {/* Hero */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-20 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-20 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-container border border-outline-variant mb-8">
            <span className="w-2 h-2 rounded-full bg-primary" />
            <span className="text-xs font-medium text-on-surface-variant tracking-wide uppercase">Платформа найма нового поколения</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-on-surface leading-tight mb-6 tracking-tight">
            Интеллектуальный путь к <span className="text-on-surface-variant">вашей карьере</span>
          </h1>
          <p className="text-on-surface-variant text-lg md:text-xl leading-relaxed max-w-2xl mx-auto">
            CareerHub объединяет таланты и компании с помощью верификации навыков и точного ИИ-матчинга.
          </p>
        </div>

        {/* Path cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl w-full animate-slide-up">
          {paths.map((path) => {
            const Icon = path.icon;
            return (
              <div
                key={path.id}
                id={`path-${path.id}`}
                className="group relative flex flex-col bg-surface border border-outline-variant rounded-2xl p-8 hover:border-outline transition-all duration-300 cursor-pointer shadow-glass hover:shadow-glass-lg"
                onClick={() => handlePathClick(path)}
              >
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-surface-container border border-outline-variant text-on-surface group-hover:bg-primary group-hover:text-white group-hover:border-primary transition-colors duration-300">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-[11px] font-medium text-outline uppercase tracking-wider px-2 py-1 bg-surface-container rounded-md border border-outline-variant">
                    {path.badge}
                  </span>
                </div>

                <h2 className="text-xl font-semibold text-on-surface mb-3">{path.title}</h2>
                <p className="text-on-surface-variant text-sm leading-relaxed flex-1 mb-8">
                  {path.description}
                </p>

                <div className="flex items-center text-sm font-medium text-on-surface-variant group-hover:text-primary transition-colors">
                  {path.cta}
                  <ChevronRight className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Features minimal */}
        <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16 mt-24 text-center animate-fade-in text-on-surface-variant">
          {[
            { label: 'Верифицированных талантов', value: '2,400+' },
            { label: 'Компаний-партнёров', value: '180+' },
            { label: 'Успешных наймов', value: '940+' },
          ].map(({ label, value }) => (
            <div key={label} className="flex flex-col items-center gap-2">
              <span className="text-3xl font-semibold text-on-surface tracking-tight">{value}</span>
              <span className="text-sm">{label}</span>
            </div>
          ))}
        </div>
      </main>

      {showEcp && <EcpModal onClose={() => setShowEcp(false)} />}
    </div>
  );
}
