import { useState } from 'react';
import { useAuth } from '@/lib/auth';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Mail } from 'lucide-react';

interface SignupFormProps {
  onSwitchToLogin?: () => void;
}

export function SignupForm({ onSwitchToLogin }: SignupFormProps) {
  const { signup, isLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const [fieldError, setFieldError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email.trim()) {
      setFieldError('Email is required');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setFieldError('Enter a valid email address');
      return;
    }
    setFieldError('');
    try {
      await signup(email);
      setSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send magic link');
    }
  };

  if (sent) {
    return (
      <div className="text-center">
        <div className="w-16 h-16 rounded-full bg-mint/10 flex items-center justify-center mx-auto mb-4">
          <Mail size={32} className="text-mint" />
        </div>
        <h2 className="font-mono text-xl font-bold text-charcoal mb-2">CHECK YOUR EMAIL</h2>
        <p className="font-serif text-warm-gray mb-2">
          We sent a magic link to
        </p>
        <p className="font-mono text-sm text-charcoal font-bold mb-6">{email}</p>
        <div className="bg-cream rounded-card border-2 border-deep-black/10 p-4 mb-6">
          <p className="font-serif text-sm text-warm-gray">
            Click the link in the email to sign in. The link expires in 15 minutes.
          </p>
        </div>
        <p className="font-serif text-xs text-warm-gray mb-4">
          Didn't receive it? Check your spam folder or try again.
        </p>
        {onSwitchToLogin ? (
          <button onClick={onSwitchToLogin} className="font-mono text-sm text-coral hover:underline">
            BACK TO LOGIN
          </button>
        ) : null}
      </div>
    );
  }

  return (
    <>
      <div className="text-center mb-6">
        <h1 className="font-mono text-2xl font-bold text-charcoal mb-2">SIGN UP</h1>
        <p className="font-serif text-warm-gray">Enter your email to get a magic link</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => { setEmail(e.target.value); setFieldError(''); }}
          error={fieldError}
          required
        />
        {error && <p className="text-sm text-red-500 font-serif">{error}</p>}
        <Button type="submit" isLoading={isLoading} className="w-full">
          SEND MAGIC LINK
        </Button>
      </form>

      <p className="mt-6 text-center font-serif text-sm text-warm-gray">
        Already have an account?{' '}
        {onSwitchToLogin ? (
          <button onClick={onSwitchToLogin} className="text-coral hover:underline">
            Log in
          </button>
        ) : (
          <span className="text-coral">Log in</span>
        )}
      </p>
    </>
  );
}
