import { createContext, useContext, useState, useEffect } from 'react';
import { loginRequest, fetchMe, setToken, clearToken, getToken } from '../services/api';

const AuthContext = createContext(null);

const USER_KEY = 'gkj_current_user';

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Saat pertama kali render: pulihkan sesi dari token yang tersimpan
  useEffect(() => {
    const restoreSession = async () => {
      const token = getToken();
      if (!token) {
        setIsLoading(false);
        return;
      }

      // Tampilkan dulu user yang tersimpan agar tidak "berkedip"
      try {
        const stored = sessionStorage.getItem(USER_KEY);
        if (stored) setCurrentUser(JSON.parse(stored));
      } catch {
        // abaikan
      }

      // Validasi token ke backend
      try {
        const data = await fetchMe();
        setCurrentUser(data.user);
        sessionStorage.setItem(USER_KEY, JSON.stringify(data.user));
      } catch {
        // Token tidak valid / server mati -> bersihkan sesi
        clearToken();
        sessionStorage.removeItem(USER_KEY);
        setCurrentUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    restoreSession();
  }, []);

  // Login ke backend. Mengembalikan { success, user } atau { success: false, error }
  const login = async (username, password) => {
    try {
      const data = await loginRequest(username, password);
      setToken(data.token);
      setCurrentUser(data.user);
      sessionStorage.setItem(USER_KEY, JSON.stringify(data.user));
      return { success: true, user: data.user };
    } catch (err) {
      return { success: false, error: err.message || 'Username atau password salah' };
    }
  };

  const logout = () => {
    setCurrentUser(null);
    clearToken();
    try {
      sessionStorage.removeItem(USER_KEY);
    } catch (err) {
      console.error('Failed to clear session:', err);
    }
  };

  return (
    <AuthContext.Provider value={{ currentUser, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
};
