import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { api } from '../services/api';

const AuthContext = createContext(null);

const USER_STORAGE_KEY = 'carbazaar_user';
const TOKEN_STORAGE_KEY = 'carbazaar_token';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem(USER_STORAGE_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(true);

  const persistSession = useCallback((token, userObj) => {
    if (token) localStorage.setItem(TOKEN_STORAGE_KEY, token);
    if (userObj) localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userObj));
    setUser(userObj);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    localStorage.removeItem(USER_STORAGE_KEY);
    setUser(null);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem(TOKEN_STORAGE_KEY);
    if (!token) {
      setLoading(false);
      return;
    }
    api
      .getMe()
      .then((res) => {
        if (res?.user) {
          localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(res.user));
          setUser(res.user);
        }
      })
      .catch(() => {
        logout();
      })
      .finally(() => setLoading(false));
  }, [logout]);

  const login = async (credentials) => {
    const res = await api.login(credentials);
    persistSession(res.token, res.user);
    return res.user;
  };

  const register = async (payload) => {
    const res = await api.register(payload);
    persistSession(res.token, res.user);
    return res.user;
  };

  const updateUserProfile = async (payload) => {
    const res = await api.updateProfile(payload);
    if (res?.user) {
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(res.user));
      setUser(res.user);
    }
    return res.user;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: Boolean(user),
        login,
        register,
        logout,
        updateUserProfile
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
