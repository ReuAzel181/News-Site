'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function SignInPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const res = await signIn('credentials', {
      redirect: false,
      username,
      password
    });
    setLoading(false);

    if (res?.error) {
      setError('Invalid credentials');
      return;
    }
    // Redirect to main page after successful authentication
    router.push('/');
  };

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--background)' }}>
      <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4 p-6" style={{ backgroundColor: 'var(--card)' }}>
        <h1 className="text-xl font-bold" style={{ color: 'var(--foreground)' }}>Sign In</h1>
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <div className="space-y-1">
          <label htmlFor="username" className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Username</label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-3 py-2"
            style={{ backgroundColor: 'var(--background)', color: 'var(--foreground)' }}
            required
          />
        </div>
        <div className="space-y-1">
          <label htmlFor="password" className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2"
            style={{ backgroundColor: 'var(--background)', color: 'var(--foreground)' }}
            required
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full px-4 py-2 text-white"
          style={{ backgroundColor: '#000057' }}
        >
          {loading ? 'Signing in…' : 'Sign In'}
        </button>
      </form>
    </div>
  );
}