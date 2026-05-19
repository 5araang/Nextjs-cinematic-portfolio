'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function InquiriesAdmin() {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Email Composer State
  const [composeTo, setComposeTo] = useState(null); // null means closed, string means opened with initial 'to'
  const [emailForm, setEmailForm] = useState({ to: '', subject: '', message: '' });
  const [emailFile, setEmailFile] = useState(null);
  const [sending, setSending] = useState(false);
  const [sendResult, setSendResult] = useState('');

  const load = () => {
    fetch('/api/inquiries')
      .then(async (r) => {
        if (r.status === 401) { router.push('/admin/login'); return null; }
        if (!r.ok) return null;
        try { return await r.json(); } catch { return null; }
      })
      .then((data) => { 
        setInquiries(data || []); 
        setLoading(false); 
      });
  };

  useEffect(load, [router]);

  const toggleRead = async (id, currentReadStatus) => {
    await fetch(`/api/inquiries/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ read: !currentReadStatus }),
    });
    load();
  };

  const remove = async (id) => {
    if (!confirm('Delete this inquiry?')) return;
    await fetch(`/api/inquiries/${id}`, { method: 'DELETE' });
    load();
  };

  const openCompose = (to = '') => {
    setEmailForm({ to, subject: '', message: '' });
    setEmailFile(null);
    setSendResult('');
    setComposeTo(to || '');
  };

  const handleSendEmail = async (e) => {
    e.preventDefault();
    setSending(true);
    setSendResult('');

    const formData = new FormData();
    formData.append('to', emailForm.to);
    formData.append('subject', emailForm.subject);
    formData.append('message', emailForm.message);
    if (emailFile) {
      formData.append('file', emailFile);
    }

    try {
      const res = await fetch('/api/admin/send-email', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (res.ok) {
        setSendResult('Email sent successfully!');
        setTimeout(() => setComposeTo(null), 2000);
      } else {
        setSendResult(`Error: ${data.error}`);
      }
    } catch {
      setSendResult('Network error.');
    }
    setSending(false);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-white text-2xl font-bold mb-1">Inquiries</h1>
          <p className="text-white/30 text-sm">{inquiries.length} message{inquiries.length !== 1 ? 's' : ''} total</p>
        </div>
        <button
          onClick={() => openCompose('')}
          className="bg-[#ff6b1a] text-black font-bold px-5 py-2.5 rounded-xl text-sm uppercase tracking-widest hover:bg-[#ff8c42] transition-colors"
        >
          Compose Email
        </button>
      </div>

      {/* Compose Modal */}
      {composeTo !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
          <div className="bg-[#111] border border-white/10 rounded-2xl p-6 w-full max-w-lg shadow-2xl relative">
            <button 
              onClick={() => setComposeTo(null)}
              className="absolute top-4 right-4 text-white/40 hover:text-white"
            >
              ✕
            </button>
            <h2 className="text-white font-bold mb-5">Send Email</h2>
            
            <form onSubmit={handleSendEmail} className="flex flex-col gap-4">
              <input 
                required
                type="email" 
                placeholder="To (e.g. hello@example.com)" 
                value={emailForm.to}
                onChange={(e) => setEmailForm({ ...emailForm, to: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#ff6b1a]/50"
              />
              <input 
                required
                type="text" 
                placeholder="Subject" 
                value={emailForm.subject}
                onChange={(e) => setEmailForm({ ...emailForm, subject: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#ff6b1a]/50"
              />
              <textarea 
                required
                rows={5}
                placeholder="Message body..." 
                value={emailForm.message}
                onChange={(e) => setEmailForm({ ...emailForm, message: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#ff6b1a]/50 resize-none"
              />
              <div>
                <label className="text-xs text-white/40 block mb-1">Attachment (Optional)</label>
                <input 
                  type="file" 
                  onChange={(e) => setEmailFile(e.target.files[0] || null)}
                  className="w-full text-white/50 text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-[#ff6b1a]/10 file:text-[#ff6b1a] hover:file:bg-[#ff6b1a]/20 cursor-pointer"
                />
              </div>

              {sendResult && (
                <p className={`text-sm ${sendResult.includes('Error') ? 'text-red-400' : 'text-green-400'}`}>
                  {sendResult}
                </p>
              )}

              <button
                type="submit"
                disabled={sending}
                className="w-full bg-[#ff6b1a] text-black font-bold py-3 rounded-xl text-sm uppercase tracking-widest hover:bg-[#ff8c42] transition-colors disabled:opacity-50 mt-2"
              >
                {sending ? 'Sending...' : 'Send'}
              </button>
            </form>
          </div>
        </div>
      )}

      {loading ? (
        <div className="text-white/20 text-sm">Loading inquiries…</div>
      ) : inquiries.length === 0 ? (
        <div className="text-center py-20 text-white/15">No inquiries yet.</div>
      ) : (
        <div className="space-y-4">
          {inquiries.map((inq) => (
            <div key={inq.id} className={`bg-[#111] border ${inq.read ? 'border-white/5 opacity-60' : 'border-[#ff6b1a]/30'} rounded-2xl p-6 transition-all`}>
              <div className="flex items-start justify-between gap-4 mb-3">
                <div>
                  <p className="text-white font-medium text-sm">{inq.name}</p>
                  <a href={`mailto:${inq.email}`} className="text-[#ff6b1a] text-xs hover:underline mt-0.5 inline-block mr-3">
                    {inq.email}
                  </a>
                  <button onClick={() => openCompose(inq.email)} className="text-xs text-white/40 hover:text-white underline">
                    Reply
                  </button>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => toggleRead(inq.id, inq.read)}
                    className={`text-xs px-3 py-1 rounded-full border transition-colors ${
                      inq.read
                        ? 'border-white/10 text-white/30 hover:border-white/30 hover:text-white'
                        : 'border-[#ff6b1a]/30 text-[#ff6b1a] hover:bg-[#ff6b1a]/10'
                    }`}
                  >
                    {inq.read ? 'Mark Unread' : 'Mark Read'}
                  </button>
                  <button
                    onClick={() => remove(inq.id)}
                    className="text-xs text-white/20 hover:text-red-400 transition-colors px-2 py-1"
                  >
                    Delete
                  </button>
                </div>
              </div>
              <p className="text-white/80 text-sm leading-relaxed whitespace-pre-wrap mt-4">{inq.message}</p>
              <p className="text-white/20 text-xs mt-4">
                {new Date(inq.created_at).toLocaleString('en-US', { 
                  year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' 
                })}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
