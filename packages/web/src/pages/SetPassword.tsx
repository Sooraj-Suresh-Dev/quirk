import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/lib/auth';
import { safeNextPath } from '@/lib/redirect';
import { PageLayout } from '@/components/layout/PageLayout';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

export function SetPassword() {
  const { setPassword, isLoading } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [password, setPasswordValue] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<{ password?: string; confirm?: string }>({});
  const [magicToken, setMagicToken] = useState('');

  useEffect(() => {
    // Check query params first: ?token=...
    const queryToken = searchParams.get('token');
    if (queryToken) {
      setMagicToken(queryToken);
      return;
    }

    // Check URL hash: #access_token=...&token_type=bearer&type=magiclink
    const hash = window.location.hash.substring(1);
    if (hash) {
      const params = new URLSearchParams(hash);
      const accessToken = params.get('access_token');
      if (accessToken) {
        setMagicToken(accessToken);
        // Clean up URL hash
        window.history.replaceState({}, '', window.location.pathname + window.location.search);
      }
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const errors: typeof fieldErrors = {};
    if (!password) errors.password = 'Password is required';
    else if (password.length < 8) errors.password = 'At least 8 characters';
    if (!confirm) errors.confirm = 'Please confirm your password';
    else if (password !== confirm) errors.confirm = 'Passwords do not match';
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }
    setFieldErrors({});
    if (!magicToken) {
      setError('Invalid or expired magic link');
      return;
    }
    try {
      await setPassword(magicToken, password);
      const next = safeNextPath(searchParams.get('next'));
      navigate(next || '/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to set password');
    }
  };

  if (!magicToken) {
    return (
      <PageLayout>
        <Card className="text-center">
          <h1 className="font-mono text-2xl font-bold text-charcoal mb-2">INVALID LINK</h1>
          <p className="font-serif text-warm-gray mb-6">
            This magic link is invalid or has expired. Please request a new one.
          </p>
          <Button onClick={() => navigate('/signup')} className="w-full">
            SIGN UP
          </Button>
        </Card>
      </PageLayout>
    );
  }

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
            onChange={(e) => { setPasswordValue(e.target.value); setFieldErrors(prev => ({ ...prev, password: undefined })); }}
            error={fieldErrors.password}
            required
            minLength={8}
          />
          <Input
            type="password"
            placeholder="Confirm password"
            value={confirm}
            onChange={(e) => { setConfirm(e.target.value); setFieldErrors(prev => ({ ...prev, confirm: undefined })); }}
            error={fieldErrors.confirm}
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
