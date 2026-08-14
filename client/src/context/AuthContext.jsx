import React, {
  createContext, useContext, useEffect, useState,
} from 'react';
import { fetchMe, loginUser, registerUser } from '../api/auth';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setLoading(false);
      return;
    }
    fetchMe()
      .then((data) => setUser(data.user))
      .catch(() => localStorage.removeItem('token'))
      .finally(() => setLoading(false));
  }, []);

  async function login(email, password) {
    const data = await loginUser({ email, password });
    localStorage.setItem('token', data.token);
    setUser(data.user);
    return data.user;
  }

  async function register(name, email, password) {
    const data = await registerUser({ name, email, password });
    localStorage.setItem('token', data.token);
    setUser(data.user);
    return data.user;
  }

  function logout() {
    localStorage.removeItem('token');
    setUser(null);
  }

  // Called after a profile/avatar edit succeeds so the navbar and every other
  // consumer of useAuth() re-render with the fresh data immediately.
  function updateUser(updatedFields) {
    setUser((prev) => (prev ? { ...prev, ...updatedFields } : prev));
  }

  return (
    <AuthContext.Provider value={{
      user, loading, login, register, logout, updateUser,
    }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
