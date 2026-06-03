import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Sparkles, ArrowLeft, Eye, EyeOff, Key, Building2, User, AlertCircle, GraduationCap } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

function FieldError({ message }) {
  if (!message) return null;
  return (
    <p className="form-error">
      <AlertCircle className="w-3 h-3 flex-shrink-0" />
      {message}
    </p>
  );
}

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [showPass, setShowPass] = useState(false);
  const [role, setRole] = useState(() => location.state?.role === 'company' ? 'company' : 'student');
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);


  const validate = () => {
    const e = {};
    if (!form.email.trim()) {
      e.email = 'Введите email';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      e.email = 'Некорректный формат email';
    }
    if (!form.password) {
      e.password = 'Введите пароль';
    } else if (form.password.length < 6) {
      e.password = 'Пароль должен содержать минимум 6 символов';
    }
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const e2 = validate();
    if (Object.keys(e2).length) { setErrors(e2); return; }

    setSubmitting(true);
    // Simulate async auth
    await new Promise(r => setTimeout(r, 600));

    const name = role === 'company' ? 'Kaspi.kz' : 'Мансур';
    login({ role, name });
    navigate(role === 'company' ? '/candidates' : '/companies');
  };

  const field = (key) => ({
    value: form[key],
    onChange: (ev) => { setForm(f => ({ ...f, [key]: ev.target.value })); setErrors(er => ({ ...er, [key]: '' })); },
    className: `input-field${errors[key] ? ' input-error' : ''}`,
  });

  return (
    <div className="min-h-screen bg-background bg-grid flex flex-col items-center justify-center px-4 relative overflow-hidden">
      <div className="w-full max-w-md animate-slide-up relative z-10">
        <button
          className="flex items-center gap-2 text-sm font-medium text-on-surface-variant hover:text-on-surface transition-colors mb-8 -ml-2"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="w-4 h-4" /> Назад
        </button>

        <div className="bg-surface border border-outline-variant rounded-2xl p-8 shadow-glass-lg">
          {/* Logo */}
          <div className="flex flex-col items-center mb-8">
            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-surface-container border border-outline-variant text-on-surface mb-4">
              <Sparkles className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-semibold text-on-surface text-center tracking-tight mb-1">С возвращением</h2>
            <p className="text-on-surface-variant text-sm text-center">Введите свои данные для входа в систему</p>
          </div>

          {/* Role selector */}
          <div className="flex bg-surface-container p-1 rounded-lg mb-6 border border-outline-variant">
            <button
              type="button"
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-2 rounded-md text-xs font-medium transition-all ${role === 'student' ? 'bg-surface border border-outline-variant text-on-surface shadow-sm' : 'text-on-surface-variant hover:text-on-surface'}`}
              onClick={() => setRole('student')}
            >
              <GraduationCap className="w-3.5 h-3.5" /> Студент
            </button>
            <button
              type="button"
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-2 rounded-md text-xs font-medium transition-all ${role === 'jobseeker' ? 'bg-surface border border-outline-variant text-on-surface shadow-sm' : 'text-on-surface-variant hover:text-on-surface'}`}
              onClick={() => setRole('jobseeker')}
            >
              <User className="w-3.5 h-3.5" /> Соискатель
            </button>
            <button
              type="button"
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-2 rounded-md text-xs font-medium transition-all ${role === 'company' ? 'bg-surface border border-outline-variant text-on-surface shadow-sm' : 'text-on-surface-variant hover:text-on-surface'}`}
              onClick={() => setRole('company')}
            >
              <Building2 className="w-3.5 h-3.5" /> Компания
            </button>
          </div>

          {/* Company info banner */}
          {role === 'company' && (
            <div className="alert-info mb-6 animate-fade-in">
              <Key className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <p className="leading-relaxed">Временный вход по паролю. Интеграция ЭЦП (NCALayer) находится в разработке.</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            {/* Email */}
            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-on-surface-variant">Email</label>
              <input id="login-email" type="email" placeholder="name@company.com" {...field('email')} />
              <FieldError message={errors.email} />
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-medium text-on-surface-variant">Пароль</label>
                <button type="button" className="text-xs text-primary hover:text-primary/80 font-medium">Забыли пароль?</button>
              </div>
              <div className="relative">
                <input
                  id="login-password"
                  type={showPass ? 'text' : 'password'}
                  placeholder="••••••••"
                  {...field('password')}
                  className={`input-field pr-10${errors.password ? ' input-error' : ''}`}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-outline hover:text-on-surface-variant transition-colors"
                  onClick={() => setShowPass(s => !s)}
                >
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <FieldError message={errors.password} />
            </div>

            <button
              id="login-submit"
              type="submit"
              disabled={submitting}
              className="btn-primary w-full mt-6"
            >
              {submitting ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  Вход...
                </span>
              ) : 'Войти в аккаунт'}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-outline-variant/50 text-center">
            <p className="text-sm text-on-surface-variant">
              Нет аккаунта?{' '}
              <button className="text-on-surface font-medium hover:underline" onClick={() => navigate('/')}>
                Зарегистрироваться
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
