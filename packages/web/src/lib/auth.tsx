import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
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
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string) => Promise<void>;
  setPassword: (token: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    api.get<{ user: User }>('/auth/session')
      .then(res => setUser(res.user))
      .catch(async (err) => {
        if (err.status === 401) {
          try {
            await api.post('/auth/refresh');
            const res = await api.get<{ user: User }>('/auth/session');
            setUser(res.user);
          } catch {
            // Refresh failed — user stays logged out
          }
        }
      })
      .finally(() => setIsLoading(false));
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const res = await api.post<{ user: User }>('/auth/login', { email, password });
      setUser(res.user);
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
      const res = await api.post<{ user: User }>('/auth/set-password', { token: magicToken, password });
      setUser(res.user);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    await api.post('/auth/logout');
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoading, login, signup, setPassword, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
