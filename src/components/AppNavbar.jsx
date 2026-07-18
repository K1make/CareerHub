import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Sparkles, LogOut, Menu, X, ChevronRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const studentNav = [
  { label: 'Вакансии', path: '/vacancies-public' },
  { label: 'Тесты', path: '/test' },
  { label: 'Профиль', path: '/profile' },
];

const companyNav = [
  { label: 'Вакансии', path: '/vacancies' },
  { label: 'Кандидаты', path: '/candidates' },
  { label: 'Профиль', path: '/profile' },
];

export default function AppNavbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout, isCompany } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = isCompany ? companyNav : studentNav;
  const currentPath = location.pathname;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const initials = user?.name
    ? user.name.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase()
    : '?';

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-outline-variant/40 bg-background/80 backdrop-blur-glass">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
          {/* Logo */}
          <button
            id="navbar-logo"
            className="flex items-center gap-2.5 flex-shrink-0"
            onClick={() => navigate(isCompany ? '/vacancies' : '/vacancies-public')}
          >
            <div className="flex items-center justify-center w-8 h-8 rounded-md bg-on-surface text-inverse-on-surface">
              <Sparkles className="w-4 h-4" />
            </div>
            <span className="text-base font-semibold text-on-surface">CareerHub</span>
          </button>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1 flex-1">
            {navItems.map(({ label, path }) => (
              <button
                key={path}
                onClick={() => navigate(path)}
                className={currentPath === path ? 'nav-link-active' : 'nav-link'}
              >
                {label}
              </button>
            ))}
          </nav>

          {/* Right side */}
          <div className="hidden md:flex items-center gap-3">
            {/* Role badge */}
            <span className={`badge text-[10px] ${isCompany ? 'badge-indigo' : user?.role === 'student' ? 'badge-blue' : 'badge-green'}`}>
              {isCompany ? 'Компания' : user?.role === 'student' ? 'Студент' : 'Соискатель'}
            </span>

            {/* Avatar */}
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-surface-container border border-outline-variant flex items-center justify-center text-on-surface text-xs font-semibold select-none">
                {initials}
              </div>
              <span className="text-sm font-medium text-on-surface hidden lg:block">
                {user?.name || 'Пользователь'}
              </span>
            </div>

            {/* Logout */}
            <button
              id="navbar-logout"
              onClick={handleLogout}
              className="btn-ghost py-1.5 px-3 text-xs gap-1.5"
            >
              <LogOut className="w-3.5 h-3.5" />
              Выйти
            </button>
          </div>

          {/* Mobile menu toggle */}
          <button
            className="md:hidden btn-ghost p-2"
            onClick={() => setMobileOpen(v => !v)}
            aria-label="Меню"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden border-t border-outline-variant/40 bg-background animate-fade-in">
            <div className="px-4 py-4 space-y-1">
              {navItems.map(({ label, path }) => (
                <button
                  key={path}
                  onClick={() => { navigate(path); setMobileOpen(false); }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    currentPath === path
                      ? 'bg-surface-container text-on-surface border border-outline-variant'
                      : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
                  }`}
                >
                  {label}
                  <ChevronRight className="w-4 h-4 ml-auto text-outline" />
                </button>
              ))}
              <div className="pt-3 border-t border-outline-variant/40">
                <div className="flex items-center gap-3 px-3 py-2 mb-2">
                  <div className="w-8 h-8 rounded-full bg-surface-container border border-outline-variant flex items-center justify-center text-on-surface text-xs font-semibold">
                    {initials}
                  </div>
                  <div>
                    <div className="text-sm font-medium text-on-surface">{user?.name || 'Пользователь'}</div>
                    <div className="text-xs text-on-surface-variant">{isCompany ? 'Компания' : user?.role === 'student' ? 'Студент' : 'Соискатель'}</div>
                  </div>
                </div>
                <button
                  onClick={() => { handleLogout(); setMobileOpen(false); }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-error hover:bg-error/10 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Выйти из аккаунта
                </button>
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
