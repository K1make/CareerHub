import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  GraduationCap, ArrowLeft, Eye, EyeOff, CheckCircle, Sparkles,
  ChevronDown, AlertCircle
} from 'lucide-react';
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

// ─── Student Register ─────────────────────────────────────────────────────────
function StudentRegister() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [step, setStep] = useState(1);
  const [showPass, setShowPass] = useState(false);
  const [form, setForm] = useState({ university: 'МУИТ (IITU)', studentId: '', name: '', email: '', password: '' });
  const [showDropdown, setShowDropdown] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const universities = ['МУИТ (IITU)', 'КБТУ', 'НУ (NU)', 'КазНУ', 'SDU', 'AITU'];

  const validateStep1 = () => {
    const e = {};
    if (!form.studentId.trim()) e.studentId = 'Введите студенческий ID';
    return e;
  };

  const validateStep2 = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Введите имя и фамилию';
    if (!form.email.trim()) {
      e.email = 'Введите email';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      e.email = 'Некорректный формат email';
    }
    if (!form.password) {
      e.password = 'Введите пароль';
    } else if (form.password.length < 8) {
      e.password = 'Пароль должен содержать минимум 8 символов';
    }
    return e;
  };

  const handleNext = async (e) => {
    e.preventDefault();
    if (step === 1) {
      const e1 = validateStep1();
      if (Object.keys(e1).length) { setErrors(e1); return; }
      setErrors({});
      setStep(2);
    } else {
      const e2 = validateStep2();
      if (Object.keys(e2).length) { setErrors(e2); return; }
      setSubmitting(true);
      try {
        await register({
          role: 'student',
          name: form.name,
          email: form.email,
          password: form.password,
          university: form.university,
          student_id: form.studentId,
        });
        // Registration also logs the user in. Open the student's main workspace.
        navigate('/vacancies-public', { replace: true });
      } catch (err) {
        setErrors({ form: err.message });
      } finally {
        setSubmitting(false);
      }
    }
  };

  const field = (key) => ({
    value: form[key],
    onChange: (ev) => { setForm(f => ({ ...f, [key]: ev.target.value })); setErrors(er => ({ ...er, [key]: '' })); },
    className: `input-field${errors[key] ? ' input-error' : ''}`,
  });

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4 relative overflow-hidden">
      <div className="w-full max-w-md animate-slide-up relative z-10">
        <button
          id="reg-back-btn"
          className="flex items-center gap-2 text-sm font-medium text-on-surface-variant hover:text-on-surface transition-colors mb-8 -ml-2"
          onClick={() => step > 1 ? setStep(s => s - 1) : navigate('/')}
        >
          <ArrowLeft className="w-4 h-4" /> Назад
        </button>

        <div className="bg-surface border border-outline-variant rounded-2xl p-8 shadow-glass-lg">
          {/* Header */}
          <div className="flex flex-col items-center mb-8">
            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-surface-container border border-outline-variant text-on-surface mb-4">
              <Sparkles className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-semibold text-on-surface text-center tracking-tight mb-1">Аккаунт Студента</h2>
            <p className="text-on-surface-variant text-sm text-center">Создайте аккаунт для старта карьеры</p>
          </div>

          {/* Steps */}
          <div className="flex items-center justify-center gap-3 mb-8">
            {[1, 2].map(s => (
              <div key={s} className="flex items-center gap-2">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold transition-all duration-300 ${
                  step > s ? 'bg-primary text-white' :
                  step === s ? 'bg-surface-container text-on-surface border border-outline-variant shadow-sm' :
                  'bg-background text-outline border border-outline-variant'
                }`}>
                  {step > s ? <CheckCircle className="w-4 h-4" /> : s}
                </div>
                {s < 2 && <div className={`h-px w-16 transition-colors duration-300 ${step > s ? 'bg-primary' : 'bg-outline-variant'}`} />}
              </div>
            ))}
          </div>

          <form onSubmit={handleNext} className="space-y-5" noValidate>
            {step === 1 && (
              <>
                {/* University picker */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-medium text-on-surface-variant">Университет</label>
                  <div className="relative">
                    <button
                      type="button"
                      id="uni-select-btn"
                      className="input-field w-full text-left flex items-center justify-between"
                      onClick={() => setShowDropdown(!showDropdown)}
                    >
                      <span className="text-on-surface truncate">{form.university}</span>
                      <ChevronDown className={`w-4 h-4 transition-transform duration-200 flex-shrink-0 ${showDropdown ? 'rotate-180 text-primary' : 'text-outline'}`} />
                    </button>
                    {showDropdown && (
                      <div className="absolute top-full pt-1 left-0 w-full z-20 animate-fade-in">
                        <div className="bg-surface border border-outline-variant rounded-xl shadow-glass-lg overflow-hidden flex flex-col py-1">
                          {universities.map(u => (
                            <button
                              key={u}
                              type="button"
                              className={`w-full text-left px-4 py-2.5 text-sm transition-colors hover:bg-surface-container ${form.university === u ? 'text-primary font-medium bg-surface-container' : 'text-on-surface'}`}
                              onClick={() => { setForm(f => ({ ...f, university: u })); setShowDropdown(false); }}
                            >
                              {u}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Student ID */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-medium text-on-surface-variant">Студенческий ID</label>
                  <input id="student-id-input" type="text" placeholder="Например: 210103001" {...field('studentId')} />
                  <FieldError message={errors.studentId} />
                </div>

                <div className="bg-surface-container border border-outline-variant rounded-lg p-4 mt-2">
                  <div className="flex items-start gap-3">
                    <GraduationCap className="w-5 h-5 text-on-surface-variant flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-on-surface-variant leading-relaxed">Ваши данные будут верифицированы через базу ВУЗа.</p>
                  </div>
                </div>
              </>
            )}

            {step === 2 && (
              <>
                <div className="space-y-1.5">
                  <label className="block text-xs font-medium text-on-surface-variant">Полное имя</label>
                  <input id="name-input" type="text" placeholder="Иван Иванов" {...field('name')} />
                  <FieldError message={errors.name} />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-medium text-on-surface-variant">Email</label>
                  <input id="email-input" type="email" placeholder="student@university.edu" {...field('email')} />
                  <FieldError message={errors.email} />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-medium text-on-surface-variant">Пароль</label>
                  <div className="relative">
                    <input
                      id="password-input"
                      type={showPass ? 'text' : 'password'}
                      placeholder="Минимум 8 символов"
                      {...field('password')}
                      className={`input-field pr-10${errors.password ? ' input-error' : ''}`}
                    />
                    <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-outline hover:text-on-surface-variant transition-colors" onClick={() => setShowPass(s => !s)}>
                      {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  <FieldError message={errors.password} />
                </div>
              </>
            )}

            <button
              id="reg-next-btn"
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
                  Создание...
                </span>
              ) : step === 2 ? 'Создать аккаунт' : 'Продолжить'}
            </button>
            <FieldError message={errors.form} />
          </form>

          <div className="mt-6 pt-6 border-t border-outline-variant/50 text-center">
            <p className="text-sm text-on-surface-variant">
              Уже есть аккаунт?{' '}
              <button id="login-link" className="text-on-surface font-medium hover:underline" onClick={() => navigate('/login')}>
                Войти
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Job Seeker Register ──────────────────────────────────────────────────────
function JobSeekerRegister() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Введите имя и фамилию';
    if (!form.email.trim()) {
      e.email = 'Введите email';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      e.email = 'Некорректный формат email';
    }
    if (!form.password) {
      e.password = 'Введите пароль';
    } else if (form.password.length < 8) {
      e.password = 'Пароль должен содержать минимум 8 символов';
    }
    if (!form.confirm) {
      e.confirm = 'Подтвердите пароль';
    } else if (form.password !== form.confirm) {
      e.confirm = 'Пароли не совпадают';
    }
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const e2 = validate();
    if (Object.keys(e2).length) { setErrors(e2); return; }
    setSubmitting(true);
    try {
      await register({
        role: 'jobseeker',
        name: form.name,
        email: form.email,
        password: form.password,
      });
      // Registration also logs the user in. Open the job seeker's main workspace.
      navigate('/vacancies-public', { replace: true });
    } catch (err) {
      setErrors({ form: err.message });
    } finally {
      setSubmitting(false);
    }
  };

  const field = (key) => ({
    value: form[key],
    onChange: (ev) => { setForm(f => ({ ...f, [key]: ev.target.value })); setErrors(er => ({ ...er, [key]: '' })); },
    className: `input-field${errors[key] ? ' input-error' : ''}`,
  });

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4 relative overflow-hidden">
      <div className="w-full max-w-md animate-slide-up relative z-10">
        <button
          id="jobseeker-back-btn"
          className="flex items-center gap-2 text-sm font-medium text-on-surface-variant hover:text-on-surface transition-colors mb-8 -ml-2"
          onClick={() => navigate('/')}
        >
          <ArrowLeft className="w-4 h-4" /> Назад
        </button>

        <div className="bg-surface border border-outline-variant rounded-2xl p-8 shadow-glass-lg">
          <div className="flex flex-col items-center mb-8">
            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-surface-container border border-outline-variant text-on-surface mb-4">
              <Sparkles className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-semibold text-on-surface text-center tracking-tight mb-1">Аккаунт Соискателя</h2>
            <p className="text-on-surface-variant text-sm text-center">Пройдите ИИ-ассесмент и найдите работу</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-on-surface-variant">Полное имя</label>
              <input id="js-name" type="text" placeholder="Иван Иванов" {...field('name')} />
              <FieldError message={errors.name} />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-on-surface-variant">Email</label>
              <input id="js-email" type="email" placeholder="name@domain.com" {...field('email')} />
              <FieldError message={errors.email} />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-on-surface-variant">Пароль</label>
              <div className="relative">
                <input
                  id="js-password"
                  type={showPass ? 'text' : 'password'}
                  placeholder="Минимум 8 символов"
                  {...field('password')}
                  className={`input-field pr-10${errors.password ? ' input-error' : ''}`}
                />
                <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-outline hover:text-on-surface-variant transition-colors" onClick={() => setShowPass(s => !s)}>
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <FieldError message={errors.password} />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-on-surface-variant">Подтверждение пароля</label>
              <div className="relative">
                <input
                  id="js-confirm"
                  type={showConfirm ? 'text' : 'password'}
                  placeholder="Повторите пароль"
                  {...field('confirm')}
                  className={`input-field pr-10${errors.confirm ? ' input-error' : ''}`}
                />
                <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-outline hover:text-on-surface-variant transition-colors" onClick={() => setShowConfirm(s => !s)}>
                  {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <FieldError message={errors.confirm} />
            </div>

            <button id="js-submit-btn" type="submit" disabled={submitting} className="btn-primary w-full mt-6">
              {submitting ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  Создание...
                </span>
              ) : 'Создать аккаунт'}
            </button>
            <FieldError message={errors.form} />
          </form>

          <div className="mt-6 pt-6 border-t border-outline-variant/50 text-center">
            <p className="text-sm text-on-surface-variant">
              Уже есть аккаунт?{' '}
              <button id="js-login-link" className="text-on-surface font-medium hover:underline" onClick={() => navigate('/login')}>
                Войти
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Company Register ─────────────────────────────────────────────────────────
function CompanyRegister() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Введите название компании';
    if (!form.email.trim()) {
      e.email = 'Введите корпоративный email';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      e.email = 'Некорректный формат email';
    }
    if (!form.password) {
      e.password = 'Введите пароль';
    } else if (form.password.length < 8) {
      e.password = 'Пароль должен содержать минимум 8 символов';
    }
    if (!form.confirm) {
      e.confirm = 'Подтвердите пароль';
    } else if (form.password !== form.confirm) {
      e.confirm = 'Пароли не совпадают';
    }
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const e2 = validate();
    if (Object.keys(e2).length) { setErrors(e2); return; }
    setSubmitting(true);
    try {
      await register({
        role: 'company',
        name: form.name,
        email: form.email,
        password: form.password,
      });
      // Registration also logs the user in. Open the company's main workspace.
      navigate('/candidates', { replace: true });
    } catch (err) {
      setErrors({ form: err.message });
    } finally {
      setSubmitting(false);
    }
  };

  const field = (key) => ({
    value: form[key],
    onChange: (ev) => { setForm(f => ({ ...f, [key]: ev.target.value })); setErrors(er => ({ ...er, [key]: '' })); },
    className: `input-field${errors[key] ? ' input-error' : ''}`,
  });

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4 relative overflow-hidden">
      <div className="w-full max-w-md animate-slide-up relative z-10">
        <button
          id="company-back-btn"
          className="flex items-center gap-2 text-sm font-medium text-on-surface-variant hover:text-on-surface transition-colors mb-8 -ml-2"
          onClick={() => navigate('/')}
        >
          <ArrowLeft className="w-4 h-4" /> Назад
        </button>

        <div className="bg-surface border border-outline-variant rounded-2xl p-8 shadow-glass-lg">
          <div className="flex flex-col items-center mb-8">
            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-surface-container border border-outline-variant text-on-surface mb-4">
              <Sparkles className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-semibold text-on-surface text-center tracking-tight mb-1">Аккаунт Компании</h2>
            <p className="text-on-surface-variant text-sm text-center">Найдите лучших кандидатов для вашей команды</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-on-surface-variant">Название компании</label>
              <input id="comp-name" type="text" placeholder="Например: Tech Corp" {...field('name')} />
              <FieldError message={errors.name} />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-on-surface-variant">Email</label>
              <input id="comp-email" type="email" placeholder="hr@company.com" {...field('email')} />
              <FieldError message={errors.email} />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-on-surface-variant">Пароль</label>
              <div className="relative">
                <input
                  id="comp-password"
                  type={showPass ? 'text' : 'password'}
                  placeholder="Минимум 8 символов"
                  {...field('password')}
                  className={`input-field pr-10${errors.password ? ' input-error' : ''}`}
                />
                <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-outline hover:text-on-surface-variant transition-colors" onClick={() => setShowPass(s => !s)}>
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <FieldError message={errors.password} />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-on-surface-variant">Подтверждение пароля</label>
              <div className="relative">
                <input
                  id="comp-confirm"
                  type={showConfirm ? 'text' : 'password'}
                  placeholder="Повторите пароль"
                  {...field('confirm')}
                  className={`input-field pr-10${errors.confirm ? ' input-error' : ''}`}
                />
                <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-outline hover:text-on-surface-variant transition-colors" onClick={() => setShowConfirm(s => !s)}>
                  {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <FieldError message={errors.confirm} />
            </div>

            <button id="comp-submit-btn" type="submit" disabled={submitting} className="btn-primary w-full mt-6">
              {submitting ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  Регистрация...
                </span>
              ) : 'Зарегистрировать компанию'}
            </button>
            <FieldError message={errors.form} />
          </form>

          <div className="mt-6 pt-6 border-t border-outline-variant/50 text-center">
            <p className="text-sm text-on-surface-variant">
              Уже есть аккаунт?{' '}
              <button id="comp-login-link" className="text-on-surface font-medium hover:underline" onClick={() => navigate('/login', { state: { role: 'company' } })}>
                Войти
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export { StudentRegister, JobSeekerRegister, CompanyRegister };
