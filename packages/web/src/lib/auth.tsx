import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import { api } from './api';

interface VoiceProfile {
  tone: {
    primary: string;
    secondary: string[];
    confidence: number;
  };
  writingStyle: {
    description: string;
    avgSentenceLength: number;
    avgParagraphLength: number;
  };
  personality: {
    traits: string[];
    description: string;
  };
  structure: {
    description: string;
    pattern: string[];
  };
  engagement: {
    cta: 'None' | 'Soft' | 'Direct';
    questions: 'None' | 'Rare' | 'Occasional' | 'Frequent';
    emoji: 'None' | 'Low' | 'Medium' | 'High';
    emojiFrequency: number;
  };
  signaturePatterns: string[];
  brandSummary: string;
  trainingQuality: {
    score: number;
    consistency: string;
    limitations: string[];
  };
}

interface Voice {
  samples: string[];
  profile: VoiceProfile;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface User {
  id: string;
  email: string;
  preferences: {
    sources: string[];
    digestTime: string;
    emailDigest: boolean;
    timezone: string;
    openaiKey?: string;
    anthropicKey?: string;
    preferredProvider?: string;
    preferredModel?: string;
    preferredTemperature?: number;
  };
}

interface AuthContextType {
  user: User | null;
  voice: Voice | null;
  isLoading: boolean;
  refreshVoice: () => Promise<void>;
  updatePreferences: (prefs: Partial<User['preferences']>) => void;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string) => Promise<void>;
  setPassword: (token: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [voice, setVoice] = useState<Voice | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const loadSession = async () => {
      try {
        const res = await api.get<{ user: User; voice: Voice | null }>('/auth/session');
        if (cancelled) return;
        setUser(res.user);
        setVoice(res.voice);
      } catch (err) {
        if (cancelled) return;
        if ((err as { status?: number }).status === 401) {
          try {
            await api.post('/auth/refresh');
            const res = await api.get<{ user: User; voice: Voice | null }>('/auth/session');
            if (cancelled) return;
            setUser(res.user);
            setVoice(res.voice);
          } catch {
          }
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    const schedule = () => {
      if (typeof window.requestIdleCallback === 'function') {
        window.requestIdleCallback(() => { void loadSession(); }, { timeout: 4000 });
      } else {
        window.setTimeout(() => { void loadSession(); }, 2000);
      }
    };

    if (document.readyState === 'complete') {
      schedule();
    } else {
      window.addEventListener('load', schedule, { once: true });
    }

    return () => {
      cancelled = true;
      window.removeEventListener('load', schedule);
    };
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const res = await api.post<{ user: User; voice: Voice | null }>('/auth/login', { email, password });
      setUser(res.user);
      setVoice(res.voice);
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
      const res = await api.post<{ user: User; voice: Voice | null }>('/auth/set-password', { token: magicToken, password });
      setUser(res.user);
      setVoice(res.voice);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    await api.post('/auth/logout');
    setUser(null);
    setVoice(null);
  }, []);

  const refreshVoice = useCallback(async () => {
    try {
      const res = await api.get<{ voice: Voice | null }>('/users/voice');
      setVoice(res.voice);
    } catch {
    }
  }, []);

  const updatePreferences = useCallback((prefs: Partial<User['preferences']>) => {
    setUser(prev => prev ? { ...prev, preferences: { ...prev.preferences, ...prefs } } : prev);
  }, []);

  return (
    <AuthContext.Provider value={{ user, voice, isLoading, refreshVoice, updatePreferences, login, signup, setPassword, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
