'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLogin() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });

    if (res.ok) {
      router.push('/admin');
    } else {
      setError('Invalid password. Try again.');
      setLoading(false);
    }
  };

  return (
    <div className="admin-cursor min-h-screen bg-[#080808] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="mb-10 text-center">
          <span className="text-[#ff6b1a] font-black text-3xl tracking-tight">Sarang</span>
          <p className="text-white/30 text-sm mt-2">Admin Panel</p>
        </div>

        <div className="bg-[#111] border border-white/5 rounded-2xl p-8">
          <h1 className="text-white font-bold text-lg mb-1">Sign in</h1>
          <p className="text-white/30 text-sm mb-6">Enter your admin password to continue.</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
              autoFocus
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-white/25 focus:outline-none focus:border-[#ff6b1a]/50 transition-colors"
            />

            {error && (
              <p className="text-red-400 text-sm">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#ff6b1a] text-black font-bold py-3 rounded-xl text-sm uppercase tracking-widest hover:bg-[#ff8c42] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing in…' : 'Sign In'}
            </button>
          </form>
        </div>

        <p className="text-center text-white/15 text-xs mt-6">
          This page is not indexed by search engines.
        </p>
      </div>
    </div>
  );
}
