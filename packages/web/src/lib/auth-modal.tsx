import { createContext, useContext, useState, useCallback, ReactNode } from 'react';

type ModalType = 'login' | 'signup' | null;

interface AuthModalContextType {
  activeModal: ModalType;
  openLogin: () => void;
  openSignup: () => void;
  closeModal: () => void;
}

const AuthModalContext = createContext<AuthModalContextType | null>(null);

export function AuthModalProvider({ children }: { children: ReactNode }) {
  const [activeModal, setActiveModal] = useState<ModalType>(null);

  const openLogin = useCallback(() => setActiveModal('login'), []);
  const openSignup = useCallback(() => setActiveModal('signup'), []);
  const closeModal = useCallback(() => setActiveModal(null), []);

  return (
    <AuthModalContext.Provider value={{ activeModal, openLogin, openSignup, closeModal }}>
      {children}
    </AuthModalContext.Provider>
  );
}

export function useAuthModal() {
  const ctx = useContext(AuthModalContext);
  if (!ctx) throw new Error('useAuthModal must be used within AuthModalProvider');
  return ctx;
}
