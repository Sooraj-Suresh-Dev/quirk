import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { api } from './api';

interface User {
  id: string;
  email: string;
  voiceProfile?: {
    tone: string;
    avgSentenceLength: number;
    ctaStyle: string;
    emojiFrequency: number;
  };
  preferences: {
    sources: string[];
    digestTime: string;
    emailDigest: boolean;
  };
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string) => Promise<void>;
  setPassword: (token: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('quirk_token'));
  const [isLoading, setIsLoading] = useState(false);

  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const res = await api.post<{ user: User; token: string }>('/auth/login', { email, password });
      setUser(res.user);
      setToken(res.token);
      localStorage.setItem('quirk_token', res.token);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const signup = useCallback(async (email: string) => {
    setIsLoading(true);
    try {
      await api.post('/auth/magic-link', { email });
    } finally {
      setIsLoading(false);
    }
  }, []);

  const setPassword = useCallback(async (magicToken: string, password: string) => {
    setIsLoading(true);
    try {
      const res = await api.post<{ user: User; token: string }>('/auth/set-password', { token: magicToken, password });
      setUser(res.user);
      setToken(res.token);
      localStorage.setItem('quirk_token', res.token);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('quirk_token');
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, signup, setPassword, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
