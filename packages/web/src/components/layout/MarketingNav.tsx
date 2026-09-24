import { useState, useEffect, useRef, lazy, Suspense } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { useAuthModal } from '@/lib/auth-modal';

const LoginForm = lazy(() => import('@/components/auth/LoginForm').then((m) => ({ default: m.LoginForm })));
const SignupForm = lazy(() => import('@/components/auth/SignupForm').then((m) => ({ default: m.SignupForm })));

const AuthModalFallback = (
  <div className="py-8 text-center font-mono text-sm text-warm-gray">Loading...</div>
);

export function MarketingNav() {
  const { activeModal, openLogin, openSignup, closeModal } = useAuthModal();
  const [mobileOpen, setMobileOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const navLinks = [
    { to: '/', label: 'Home', end: true },
    { to: '/features', label: 'Features' },
    { to: '/pricing', label: 'Pricing' },
    { to: '/about', label: 'About' },
    { to: '/faq', label: 'FAQ' },
  ];

  useEffect(() => {
    if (!mobileOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMobileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [mobileOpen]);

  return (
    <>
      <nav className="flex items-center px-8 py-6 relative">
        <div className="flex-1">
          <Link to="/" className="flex items-center gap-2">
            <img
              src="/logo.svg"
              alt="Quirk"
              className="h-12 w-auto"
              width="48"
              height="48"
              fetchPriority="high"
              decoding="async"
            />
            <span className="font-mono text-2xl font-bold text-coral">QUIRK</span>
          </Link>
        </div>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-6">
          {navLinks.map(({ to, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `font-mono text-sm uppercase transition-all duration-150 ${
                  isActive ? 'text-coral' : 'text-warm-gray hover:text-charcoal hover:scale-110'
                }`
              }
            >
              {label}
            </NavLink>
          ))}
        </div>

        <div className="flex-1 flex justify-end gap-4 items-center">
          <Button variant="ghost" onClick={openLogin} className="hidden sm:inline-flex">LOG IN</Button>
          <Button onClick={openSignup} className="hidden sm:inline-flex">GET STARTED</Button>

          {/* Mobile hamburger */}
          <div ref={menuRef} className="md:hidden relative">
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-2 text-charcoal hover:text-coral transition-colors duration-150"
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            >
              {mobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* Dropdown */}
            <div
              className={`absolute right-0 top-full mt-2 w-96 bg-soft-white border-3 border-deep-black rounded-card shadow-card transition-all duration-200 ease-out origin-top-right z-50 ${
                mobileOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0 pointer-events-none'
              }`}
            >
              <nav className="p-4">
                {navLinks.map(({ to, label, end }, i) => (
                  <NavLink
                    key={to}
                    to={to}
                    end={end}
                    onClick={() => setMobileOpen(false)}
                    className={({ isActive }) =>
                      `font-mono text-sm uppercase py-3 px-3 block rounded-button transition-all duration-150 ${
                        isActive
                          ? 'bg-coral text-soft-white'
                          : 'text-charcoal hover:bg-cream hover:text-coral'
                      } ${mobileOpen ? `animate-slide-up stagger-${i}` : 'opacity-0'}`
                    }
                  >
                    {label}
                  </NavLink>
                ))}
              </nav>

              <div className="mx-4 border-t-2 border-deep-black/10" />

              <div className={`p-4 flex gap-3 ${mobileOpen ? 'animate-slide-up stagger-4' : 'opacity-0'}`}>
                <Button variant="secondary" onClick={() => { openLogin(); setMobileOpen(false); }} className="flex-1">
                  LOG IN
                </Button>
                <Button onClick={() => { openSignup(); setMobileOpen(false); }} className="flex-1">
                  GET STARTED
                </Button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <Modal isOpen={activeModal === 'login'} onClose={closeModal}>
        <Suspense fallback={AuthModalFallback}>
          <LoginForm onSwitchToSignup={openSignup} />
        </Suspense>
      </Modal>
      <Modal isOpen={activeModal === 'signup'} onClose={closeModal}>
        <Suspense fallback={AuthModalFallback}>
          <SignupForm onSwitchToLogin={openLogin} />
        </Suspense>
      </Modal>
    </>
  );
}
