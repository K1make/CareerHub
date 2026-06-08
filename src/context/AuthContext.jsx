import { createContext, useContext, useEffect, useState } from 'react';
import { api } from '../api/client';

const AuthContext = createContext();
const USER_KEY = 'careerhub_user';

function normalizeUser(user) {
  if (!user) return null;
  return {
    ...user,
    name: user.name || [user.first_name, user.last_name].filter(Boolean).join(' ') || user.email,
  };
}

function readStoredUser() {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? normalizeUser(JSON.parse(raw)) : null;
  } catch {
    return null;
  }
}

function persistUser(user) {
  const normalized = normalizeUser(user);
  if (normalized) {
    localStorage.setItem(USER_KEY, JSON.stringify(normalized));
  } else {
    localStorage.removeItem(USER_KEY);
  }
  return normalized;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(readStoredUser);
  const [loading, setLoading] = useState(Boolean(api.getAccessToken()));

  useEffect(() => {
    let active = true;

    async function loadUser() {
      if (!api.getAccessToken()) {
        setLoading(false);
        return;
      }

      try {
        const data = await api.me();
        if (active) setUser(persistUser(data.user));
      } catch {
        api.setAccessToken(null);
        persistUser(null);
        if (active) setUser(null);
      } finally {
        if (active) setLoading(false);
      }
    }

    loadUser();
    return () => { active = false; };
  }, []);

  const login = async (credentials) => {
    const data = await api.login(credentials);
    api.setAccessToken(data.access);
    const normalized = persistUser(data.user);
    setUser(normalized);
    return normalized;
  };

  const register = async (payload) => {
    const data = await api.register(payload);
    api.setAccessToken(data.access);
    const normalized = persistUser(data.user);
    setUser(normalized);
    return normalized;
  };

  const logout = async () => {
    await api.logout();
    api.setAccessToken(null);
    persistUser(null);
    setUser(null);
  };

  const deleteProfile = async () => {
    await api.deleteProfile();
    api.setAccessToken(null);
    persistUser(null);
    setUser(null);
  };

  const updateUser = (newData) => {
    const updated = { ...user, ...newData };
    setUser(persistUser(updated));
  };

  const isStudent = user?.role === 'student' || user?.role === 'jobseeker';
  const isCompany = user?.role === 'company';

  return (
    <AuthContext.Provider value={{ user, login, register, logout, deleteProfile, updateUser, loading, isStudent, isCompany }}>
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  return useContext(AuthContext);
}
