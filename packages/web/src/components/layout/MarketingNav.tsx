import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { LoginForm } from '@/components/auth/LoginForm';
import { SignupForm } from '@/components/auth/SignupForm';
import { useAuthModal } from '@/lib/auth-modal';

export function MarketingNav() {
  const { activeModal, openLogin, openSignup, closeModal } = useAuthModal();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
    { to: '/', label: 'Home', end: true },
    { to: '/features', label: 'Features' },
    { to: '/pricing', label: 'Pricing' },
    { to: '/about', label: 'About' },
    { to: '/faq', label: 'FAQ' },
  ];

  return (
    <>
      <nav className="flex items-center px-8 py-6 relative">
        <div className="flex-1">
          <Link to="/" className="font-mono text-2xl font-bold text-coral">
            QUIRK
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
          <button
            className="md:hidden p-2 text-charcoal"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-b-3 border-deep-black bg-soft-white px-8 pb-6">
          <div className="flex flex-col gap-4">
            {navLinks.map(({ to, label, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `font-mono text-sm uppercase py-2 transition-all duration-150 ${
                    isActive ? 'text-coral' : 'text-charcoal hover:text-coral hover:scale-110'
                  }`
                }
              >
                {label}
              </NavLink>
            ))}
            <div className="flex gap-4 pt-2 border-t border-deep-black/10">
              <Button variant="ghost" onClick={() => { openLogin(); setMobileOpen(false); }}>LOG IN</Button>
              <Button onClick={() => { openSignup(); setMobileOpen(false); }}>GET STARTED</Button>
            </div>
          </div>
        </div>
      )}

      <Modal isOpen={activeModal === 'login'} onClose={closeModal}>
        <LoginForm onSwitchToSignup={openSignup} />
      </Modal>
      <Modal isOpen={activeModal === 'signup'} onClose={closeModal}>
        <SignupForm onSwitchToLogin={openLogin} />
      </Modal>
    </>
  );
}
