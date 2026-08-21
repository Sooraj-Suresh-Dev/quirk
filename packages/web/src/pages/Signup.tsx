import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/lib/auth';
import { PageLayout } from '@/components/layout/PageLayout';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Mail } from 'lucide-react';

export function Signup() {
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
      <PageLayout>
        <Card className="text-center">
          <Mail size={48} className="text-coral mx-auto mb-4" />
          <h2 className="font-mono text-xl font-bold text-charcoal mb-2">CHECK YOUR EMAIL</h2>
          <p className="font-serif text-warm-gray mb-6">
            We sent a magic link to <strong>{email}</strong>. Click the link to create your account.
          </p>
          <Link to="/login" className="font-mono text-sm text-coral hover:underline">
            BACK TO LOGIN
          </Link>
        </Card>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <Card>
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
          <Link to="/login" className="text-coral hover:underline">Log in</Link>
        </p>
      </Card>
    </PageLayout>
  );
}
