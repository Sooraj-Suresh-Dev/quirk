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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
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
        <Mail size={48} className="text-coral mx-auto mb-4" />
        <h2 className="font-mono text-xl font-bold text-charcoal mb-2">CHECK YOUR EMAIL</h2>
        <p className="font-serif text-warm-gray mb-6">
          We sent a magic link to <strong>{email}</strong>. Click the link to create your account.
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
          onChange={(e) => setEmail(e.target.value)}
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
