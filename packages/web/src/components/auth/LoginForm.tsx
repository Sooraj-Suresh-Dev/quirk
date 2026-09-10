import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/lib/auth';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

interface LoginFormProps {
  onSwitchToSignup?: () => void;
}

export function LoginForm({ onSwitchToSignup }: LoginFormProps) {
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const errors: typeof fieldErrors = {};
    if (!email.trim()) errors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = 'Enter a valid email address';
    if (!password) errors.password = 'Password is required';
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }
    setFieldErrors({});
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    }
  };

  return (
    <>
      <div className="text-center mb-6">
        <h1 className="font-mono text-2xl font-bold text-charcoal mb-2">LOG IN</h1>
        <p className="font-serif text-warm-gray">Welcome back to Quirk</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => { setEmail(e.target.value); setFieldErrors(prev => ({ ...prev, email: undefined })); }}
          error={fieldErrors.email}
          required
        />
        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => { setPassword(e.target.value); setFieldErrors(prev => ({ ...prev, password: undefined })); }}
          error={fieldErrors.password}
          required
        />
        {error && <p className="text-sm text-red-500 font-serif">{error}</p>}
        <Button type="submit" isLoading={isLoading} className="w-full">
          LOG IN
        </Button>
      </form>

      <p className="mt-6 text-center font-serif text-sm text-warm-gray">
        Don't have an account?{' '}
        {onSwitchToSignup ? (
          <button onClick={onSwitchToSignup} className="text-coral hover:underline">
            Sign up
          </button>
        ) : (
          <span className="text-coral">Sign up</span>
        )}
      </p>
    </>
  );
}
