import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GraduationCap, ArrowLeft, Eye, EyeOff, CheckCircle, Sparkles, ChevronDown } from 'lucide-react';

function StudentRegister() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [showPass, setShowPass] = useState(false);
  const [form, setForm] = useState({ university: 'МУИТ (IITU)', studentId: '', name: '', email: '', password: '' });
  const [showDropdown, setShowDropdown] = useState(false);

  const universities = ['МУИТ (IITU)', 'КБТУ', 'НУ (NU)', 'КазНУ', 'SDU', 'AITU'];

  const handleNext = (e) => {
    e.preventDefault();
    if (step < 2) setStep(s => s + 1);
    else navigate('/students');
  };

  return (
    <div className="min-h-screen bg-background bg-grid flex flex-col items-center justify-center px-4">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[250px] bg-primary-container/8 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md animate-slide-up relative z-10">
        <button
          id="reg-back-btn"
          className="btn-ghost mb-6 -ml-2"
          onClick={() => step > 1 ? setStep(s => s - 1) : navigate('/')}
        >
          <ArrowLeft className="w-4 h-4" /> Назад
        </button>

        <div className="glass-card-high p-8">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-8">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary-container shadow-glow-sm">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-base font-bold text-on-surface">CareerAI</span>
              <p className="text-xs text-outline">Для студентов</p>
            </div>
          </div>

          {/* Steps */}
          <div className="flex items-center gap-3 mb-8">
            {[1, 2].map(s => (
              <div key={s} className="flex items-center gap-2">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                  step > s ? 'bg-emerald-500 text-white' :
                  step === s ? 'bg-primary-container text-white shadow-glow-sm' :
                  'bg-surface-container text-outline border border-outline-variant'
                }`}>
                  {step > s ? <CheckCircle className="w-4 h-4" /> : s}
                </div>
                <span className={`text-xs font-medium hidden sm:block ${step >= s ? 'text-on-surface-variant' : 'text-outline'}`}>
                  {s === 1 ? 'Университет' : 'Аккаунт'}
                </span>
                {s < 2 && <div className={`h-px w-8 transition-colors duration-300 ${step > s ? 'bg-emerald-500' : 'bg-outline-variant'}`} />}
              </div>
            ))}
          </div>

          <form onSubmit={handleNext} className="space-y-5">
            {step === 1 && (
              <>
                <div>
                  <h2 className="text-2xl font-bold text-on-surface mb-1">Выберите ВУЗ</h2>
                  <p className="text-on-surface-variant text-sm">Подтвердите свою принадлежность к университету</p>
                </div>

                <div className="space-y-3">
                  <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Университет</label>
                  <div className="relative">
                    <button
                      type="button"
                      id="uni-select-btn"
                      className="input-field w-full text-left flex items-center justify-between"
                      onClick={() => setShowDropdown(!showDropdown)}
                    >
                      <span className="text-on-surface truncate">{form.university}</span>
                      <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${showDropdown ? 'rotate-180 text-primary' : 'text-outline'} flex-shrink-0`} />
                    </button>
                    {showDropdown && (
                      <div className="absolute top-full pt-1 left-0 w-full z-20 animate-fade-in">
                        <div className="bg-[#1a1b26]/90 backdrop-blur-xl border border-outline-variant/60 rounded-xl shadow-glass-lg overflow-hidden flex flex-col py-1">
                          {universities.map(u => (
                            <button
                              key={u}
                              type="button"
                              className={`w-full text-left px-4 py-2.5 text-sm transition-colors hover:bg-white/10 ${form.university === u ? 'text-primary bg-primary-container/15 font-semibold' : 'text-on-surface'}`}
                              onClick={() => {
                                setForm(f => ({ ...f, university: u }));
                                setShowDropdown(false);
                              }}
                            >
                              {u}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Студенческий ID</label>
                  <input
                    id="student-id-input"
                    type="text"
                    className="input-field"
                    placeholder="Например: 210103001"
                    value={form.studentId}
                    onChange={e => setForm(f => ({ ...f, studentId: e.target.value }))}
                    required
                  />
                </div>

                <div className="bg-primary-container/10 border border-primary-container/20 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <GraduationCap className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-on-surface-variant leading-relaxed">
                      Ваши данные будут верифицированы через официальную базу данных ВУЗа. GPA и специальность подтянутся автоматически.
                    </p>
                  </div>
                </div>
              </>
            )}

            {step === 2 && (
              <>
                <div>
                  <h2 className="text-2xl font-bold text-on-surface mb-1">Создать аккаунт</h2>
                  <p className="text-on-surface-variant text-sm">Осталось совсем немного</p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-2">Ваше имя</label>
                  <input
                    id="name-input"
                    type="text"
                    className="input-field"
                    placeholder="Иван Иванов"
                    value={form.name}
                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-2">Email</label>
                  <input
                    id="email-input"
                    type="email"
                    className="input-field"
                    placeholder="student@iitu.edu.kz"
                    value={form.email}
                    onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-2">Пароль</label>
                  <div className="relative">
                    <input
                      id="password-input"
                      type={showPass ? 'text' : 'password'}
                      className="input-field pr-12"
                      placeholder="Минимум 8 символов"
                      value={form.password}
                      onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                      required
                      minLength={8}
                    />
                    <button
                      type="button"
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-outline hover:text-on-surface-variant transition-colors"
                      onClick={() => setShowPass(s => !s)}
                    >
                      {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </>
            )}

            <button id="reg-next-btn" type="submit" className="btn-primary w-full justify-center mt-2">
              {step === 2 ? 'Создать аккаунт' : 'Продолжить'}
              {step === 2 && <CheckCircle className="w-4 h-4" />}
            </button>
          </form>

          <p className="text-center text-xs text-outline mt-6">
            Уже есть аккаунт?{' '}
            <button
              id="login-link"
              className="text-primary hover:underline font-medium"
              onClick={() => navigate('/login')}
            >
              Войти
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

function JobSeekerRegister() {
  const navigate = useNavigate();
  const [showPass, setShowPass] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate('/pricing');
  };

  return (
    <div className="min-h-screen bg-background bg-grid flex flex-col items-center justify-center px-4">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[250px] bg-secondary/5 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md animate-slide-up relative z-10">
        <button
          id="jobseeker-back-btn"
          className="btn-ghost mb-6 -ml-2"
          onClick={() => navigate('/')}
        >
          <ArrowLeft className="w-4 h-4" /> Назад
        </button>

        <div className="glass-card-high p-8">
          <div className="flex items-center gap-3 mb-8">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-secondary-container shadow-glow-green">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-base font-bold text-on-surface">CareerAI</span>
              <p className="text-xs text-outline">Для соискателей</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <h2 className="text-2xl font-bold text-on-surface mb-1">Регистрация</h2>
              <p className="text-on-surface-variant text-sm">Ваш первый шаг к новой карьере</p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-2">Полное имя</label>
              <input id="js-name" type="text" className="input-field" placeholder="Иван Иванов" required />
            </div>
            <div>
              <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-2">Email</label>
              <input id="js-email" type="email" className="input-field" placeholder="ivan@example.com" required />
            </div>
            <div>
              <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-2">Пароль</label>
              <div className="relative">
                <input id="js-password" type={showPass ? 'text' : 'password'} className="input-field pr-12" placeholder="Минимум 8 символов" required minLength={8} />
                <button type="button" className="absolute right-4 top-1/2 -translate-y-1/2 text-outline hover:text-on-surface-variant" onClick={() => setShowPass(s => !s)}>
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button id="js-submit-btn" type="submit" className="btn-primary w-full justify-center" style={{ background: '#00a572' }}>
              Создать аккаунт
              <CheckCircle className="w-4 h-4" />
            </button>
          </form>

          <p className="text-center text-xs text-outline mt-6">
            Уже есть аккаунт?{' '}
            <button id="js-login-link" className="text-secondary hover:underline font-medium" onClick={() => navigate('/login')}>
              Войти
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

export { StudentRegister, JobSeekerRegister };
