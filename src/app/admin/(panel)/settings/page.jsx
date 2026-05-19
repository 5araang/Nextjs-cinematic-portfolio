'use client';
import { useState } from 'react';

export default function AdminSettings() {
  const [current, setCurrent]   = useState('');
  const [newPass, setNewPass]   = useState('');
  const [confirm, setConfirm]   = useState('');
  const [status, setStatus]     = useState('idle');
  const [message, setMessage]   = useState('');
  const [newValue, setNewValue] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    if (newPass !== confirm) {
      setStatus('error');
      setMessage('New passwords do not match.');
      return;
    }
    if (newPass.length < 8) {
      setStatus('error');
      setMessage('New password must be at least 8 characters.');
      return;
    }

    setStatus('loading');
    const res = await fetch('/api/admin/change-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ currentPassword: current, newPassword: newPass }),
    });

    const data = await res.json();
    if (res.ok) {
      setStatus('success');
      setNewValue(data.newPassword);
      setMessage(data.message);
      setCurrent(''); setNewPass(''); setConfirm('');
    } else {
      setStatus('error');
      setMessage(data.error || 'Something went wrong.');
    }
  };

  return (
    <div className="max-w-lg">
      <h1 className="text-white font-black text-2xl tracking-tight mb-1">Settings</h1>
      <p className="text-white/30 text-sm mb-8">Manage your admin credentials.</p>

      <div className="bg-[#111] border border-white/5 rounded-2xl p-6">
        <h2 className="text-white font-bold text-base mb-1">Change Password</h2>
        <p className="text-white/30 text-xs mb-5">
          After changing, update <code className="text-[#ff6b1a] bg-white/5 px-1.5 py-0.5 rounded">ADMIN_PASSWORD</code> in your <code className="text-[#ff6b1a] bg-white/5 px-1.5 py-0.5 rounded">.env.local</code> file and redeploy.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] text-white/40 tracking-[0.3em] uppercase">Current Password</label>
            <input
              type="password"
              value={current}
              onChange={(e) => setCurrent(e.target.value)}
              required
              placeholder="Enter current password"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-white/20 focus:outline-none focus:border-[#ff6b1a]/50 transition-colors"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] text-white/40 tracking-[0.3em] uppercase">New Password</label>
            <input
              type="password"
              value={newPass}
              onChange={(e) => setNewPass(e.target.value)}
              required
              placeholder="Min. 8 characters"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-white/20 focus:outline-none focus:border-[#ff6b1a]/50 transition-colors"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] text-white/40 tracking-[0.3em] uppercase">Confirm New Password</label>
            <input
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              required
              placeholder="Repeat new password"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-white/20 focus:outline-none focus:border-[#ff6b1a]/50 transition-colors"
            />
          </div>

          {message && (
            <div className={`rounded-xl px-4 py-3 text-sm ${status === 'success' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
              {message}
            </div>
          )}

          {status === 'success' && newValue && (
            <div className="bg-[#ff6b1a]/10 border border-[#ff6b1a]/20 rounded-xl px-4 py-3">
              <p className="text-[10px] text-[#ff6b1a] tracking-widest uppercase mb-2">Set this in .env.local</p>
              <code className="text-white font-mono text-sm break-all">ADMIN_PASSWORD={newValue}</code>
            </div>
          )}

          <button
            type="submit"
            disabled={status === 'loading'}
            className="w-full bg-[#ff6b1a] text-black font-bold py-3 rounded-xl text-sm uppercase tracking-widest hover:bg-[#ff8c42] transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-1"
          >
            {status === 'loading' ? 'Verifying…' : 'Change Password'}
          </button>
        </form>
      </div>
    </div>
  );
}
