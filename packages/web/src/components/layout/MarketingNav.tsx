import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { LoginForm } from '@/components/auth/LoginForm';
import { SignupForm } from '@/components/auth/SignupForm';
import { useAuthModal } from '@/lib/auth-modal';

export function MarketingNav() {
  const { activeModal, openLogin, openSignup, closeModal } = useAuthModal();

  return (
    <>
      <nav className="flex items-center px-8 py-6">
        <div className="flex-1">
          <Link to="/" className="font-mono text-2xl font-bold text-coral">
            QUIRK
          </Link>
        </div>
        <div className="hidden md:flex items-center gap-6">
          <Link
            to="/features"
            className="font-mono text-sm uppercase text-warm-gray hover:text-charcoal transition-colors"
          >
            Features
          </Link>
          <Link
            to="/pricing"
            className="font-mono text-sm uppercase text-warm-gray hover:text-charcoal transition-colors"
          >
            Pricing
          </Link>
          <Link
            to="/about"
            className="font-mono text-sm uppercase text-warm-gray hover:text-charcoal transition-colors"
          >
            About
          </Link>
          <Link
            to="/faq"
            className="font-mono text-sm uppercase text-warm-gray hover:text-charcoal transition-colors"
          >
            FAQ
          </Link>
        </div>
        <div className="flex-1 flex justify-end gap-4">
          <Button variant="ghost" onClick={openLogin}>LOG IN</Button>
          <Button onClick={openSignup}>GET STARTED</Button>
        </div>
      </nav>

      <Modal isOpen={activeModal === 'login'} onClose={closeModal}>
        <LoginForm onSwitchToSignup={openSignup} />
      </Modal>
      <Modal isOpen={activeModal === 'signup'} onClose={closeModal}>
        <SignupForm onSwitchToLogin={openLogin} />
      </Modal>
    </>
  );
}
