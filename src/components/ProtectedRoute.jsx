import { Navigate } from 'react-router-dom';
import { ShieldOff, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

/**
 * ProtectedRoute — guards routes by authentication and role.
 *
 * Props:
 *  - allowedRoles: string[] — e.g. ['student', 'jobseeker'] or ['company']
 *  - redirectUnauthenticated: string — default '/login'
 */
export default function ProtectedRoute({ children, allowedRoles }) {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  if (loading) return null;

  // Not logged in → go to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Wrong role → show access denied card
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    const homeRoute = user.role === 'company' ? '/candidates' : '/companies';
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-6">
        <div className="max-w-md w-full text-center">
          <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-surface-container border border-outline-variant mx-auto mb-6">
            <ShieldOff className="w-7 h-7 text-outline" />
          </div>
          <h1 className="text-2xl font-bold text-on-surface mb-3">Раздел недоступен</h1>
          <p className="text-on-surface-variant text-sm leading-relaxed mb-8">
            Этот раздел предназначен для другой роли. Ваш текущий профиль не имеет доступа к данной странице.
          </p>
          <button
            onClick={() => navigate(homeRoute)}
            className="btn-primary"
          >
            <ArrowLeft className="w-4 h-4" />
            Перейти на главную
          </button>
        </div>
      </div>
    );
  }

  return children;
}
