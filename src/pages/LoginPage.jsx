import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, ArrowLeft, Eye, EyeOff, Key } from 'lucide-react';

export default function LoginPage() {
  const navigate = useNavigate();
  const [showPass, setShowPass] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate('/students'); // Replace with actual login logic
  };

  return (
    <div className="min-h-screen bg-background bg-grid flex flex-col items-center justify-center px-4">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[250px] bg-primary-container/8 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md animate-slide-up relative z-10">
        <button
          className="btn-ghost mb-6 -ml-2"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="w-4 h-4" /> Назад
        </button>

        <div className="glass-card-high p-8">
          <div className="flex items-center gap-3 mb-8">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary-container shadow-glow-sm">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-base font-bold text-on-surface">CareerAI</span>
              <p className="text-xs text-outline">Вход в систему</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <h2 className="text-2xl font-bold text-on-surface mb-1">С возвращением!</h2>
              <p className="text-on-surface-variant text-sm">Введите свои данные для входа</p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-2">Email или Логин</label>
              <input type="email" className="input-field" placeholder="student@example.com" required />
            </div>
            
            <div>
              <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-2">Пароль</label>
              <div className="relative">
                <input type={showPass ? 'text' : 'password'} className="input-field pr-12" placeholder="Ваш пароль" required />
                <button type="button" className="absolute right-4 top-1/2 -translate-y-1/2 text-outline hover:text-on-surface-variant" onClick={() => setShowPass(s => !s)}>
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button type="submit" className="btn-primary w-full justify-center mt-2">
              <Key className="w-4 h-4" />
              Войти
            </button>
          </form>

          <p className="text-center text-xs text-outline mt-6">
            Ещё нет аккаунта?{' '}
            <button className="text-primary hover:underline font-medium" onClick={() => navigate('/')}>
              Зарегистрироваться
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
