import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/lib/auth';
import { PageLayout } from '@/components/layout/PageLayout';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

export function SetPassword() {
  const { setPassword, isLoading } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const magicToken = searchParams.get('token');
  const [password, setPasswordValue] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (password !== confirm) {
      setError('Passwords do not match');
      return;
    }
    if (!magicToken) {
      setError('Invalid or expired magic link');
      return;
    }
    try {
      await setPassword(magicToken, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to set password');
    }
  };

  return (
    <PageLayout>
      <Card>
        <div className="text-center mb-6">
          <h1 className="font-mono text-2xl font-bold text-charcoal mb-2">SET PASSWORD</h1>
          <p className="font-serif text-warm-gray">Create a password for your account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="password"
            placeholder="New password"
            value={password}
            onChange={(e) => setPasswordValue(e.target.value)}
            required
            minLength={8}
          />
          <Input
            type="password"
            placeholder="Confirm password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            required
          />
          {error && <p className="text-sm text-red-500 font-serif">{error}</p>}
          <Button type="submit" isLoading={isLoading} className="w-full">
            CREATE ACCOUNT
          </Button>
        </form>
      </Card>
    </PageLayout>
  );
}
