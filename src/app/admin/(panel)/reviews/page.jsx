'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const EMPTY_FORM = { author: '', role: '', company: '', content: '', rating: 5, avatar: '' };

export default function ReviewsAdmin() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  const load = () => {
    fetch('/api/reviews?all=true')
      .then(async (r) => {
        if (r.status === 401) { router.push('/admin/login'); return null; }
        if (!r.ok) return null;
        try { return await r.json(); } catch { return null; }
      })
      .then((data) => { 
        setReviews(data || []); 
        setLoading(false); 
      });
  };

  useEffect(load, [router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    await fetch('/api/reviews', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    setForm(EMPTY_FORM);
    setShowForm(false);
    load();
    setSaving(false);
  };

  const toggle = async (id, approved) => {
    await fetch(`/api/reviews/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ approved: !approved }),
    });
    load();
  };

  const remove = async (id) => {
    if (!confirm('Delete this review?')) return;
    await fetch(`/api/reviews/${id}`, { method: 'DELETE' });
    load();
  };

  const field = (key) => ({
    value: form[key],
    onChange: (e) => setForm({ ...form, [key]: e.target.value }),
    className:
      'w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-white/25 focus:outline-none focus:border-[#ff6b1a]/50 transition-colors',
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-white text-2xl font-bold mb-1">Reviews</h1>
          <p className="text-white/30 text-sm">{reviews.length} review{reviews.length !== 1 ? 's' : ''} total</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-[#ff6b1a] text-black font-bold px-5 py-2.5 rounded-xl text-sm uppercase tracking-widest hover:bg-[#ff8c42] transition-colors"
        >
          {showForm ? 'Cancel' : '+ Add Review'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-[#111] border border-white/5 rounded-2xl p-6 mb-8">
          <h2 className="text-white font-semibold mb-5">New Review</h2>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <input required placeholder="Author name *" {...field('author')} />
            <input placeholder="Role / Title" {...field('role')} />
            <input placeholder="Company" {...field('company')} />
            <select
              value={form.rating}
              onChange={(e) => setForm({ ...form, rating: Number(e.target.value) })}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#ff6b1a]/50 transition-colors"
            >
              {[5, 4, 3, 2, 1].map((n) => (
                <option key={n} value={n} style={{ background: '#111' }}>{n} ★</option>
              ))}
            </select>
          </div>
          <textarea
            required
            placeholder="Review content *"
            rows={4}
            {...field('content')}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-white/25 focus:outline-none focus:border-[#ff6b1a]/50 transition-colors resize-none mb-4"
          />
          <input placeholder="Avatar URL (optional)" {...field('avatar')} className="mb-4 w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-white/25 focus:outline-none focus:border-[#ff6b1a]/50 transition-colors" />
          <button
            type="submit"
            disabled={saving}
            className="bg-[#ff6b1a] text-black font-bold px-6 py-2.5 rounded-xl text-sm uppercase tracking-widest hover:bg-[#ff8c42] transition-colors disabled:opacity-50"
          >
            {saving ? 'Saving…' : 'Save Review'}
          </button>
        </form>
      )}

      {loading ? (
        <div className="text-white/20 text-sm">Loading reviews…</div>
      ) : reviews.length === 0 ? (
        <div className="text-center py-20 text-white/15">No reviews yet. Add your first one!</div>
      ) : (
        <div className="space-y-4">
          {reviews.map((r) => (
            <div key={r._id} className="bg-[#111] border border-white/5 rounded-2xl p-6">
              <div className="flex items-start justify-between gap-4 mb-3">
                <div className="flex items-center gap-3">
                  {r.avatar && (
                    <img src={r.avatar} alt={r.author} className="w-10 h-10 rounded-full object-cover opacity-80" />
                  )}
                  <div>
                    <p className="text-white font-medium text-sm">{r.author}</p>
                    {(r.role || r.company) && (
                      <p className="text-white/35 text-xs mt-0.5">
                        {[r.role, r.company].filter(Boolean).join(' · ')}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-[#ff6b1a] text-xs">{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</span>
                  <button
                    onClick={() => toggle(r._id, r.approved)}
                    className={`text-xs px-3 py-1 rounded-full border transition-colors ${
                      r.approved
                        ? 'border-green-500/30 text-green-400 hover:border-red-400/30 hover:text-red-400'
                        : 'border-white/10 text-white/30 hover:border-green-500/30 hover:text-green-400'
                    }`}
                  >
                    {r.approved ? 'Published' : 'Hidden'}
                  </button>
                  <button
                    onClick={() => remove(r._id)}
                    className="text-xs text-white/20 hover:text-red-400 transition-colors px-2 py-1"
                  >
                    Delete
                  </button>
                </div>
              </div>
              <p className="text-white/55 text-sm leading-relaxed">{r.content}</p>
              <p className="text-white/20 text-xs mt-3">
                {new Date(r.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
