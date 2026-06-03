import { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

function readStoredUser() {
  try {
    const raw = localStorage.getItem('careerai_user');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(readStoredUser);
  const [loading] = useState(false);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('careerai_user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('careerai_user');
  };

  const isStudent = user?.role === 'student' || user?.role === 'jobseeker';
  const isCompany = user?.role === 'company';

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, isStudent, isCompany }}>
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  return useContext(AuthContext);
}
