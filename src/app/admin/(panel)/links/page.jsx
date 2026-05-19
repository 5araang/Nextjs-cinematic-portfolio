'use client';
import { useEffect, useState } from 'react';

const SOCIAL_FIELDS = [
  { key: 'instagram',  label: 'Instagram',  placeholder: 'https://instagram.com/yourhandle',  icon: InstagramIcon },
  { key: 'twitter',    label: 'X / Twitter', placeholder: 'https://x.com/yourhandle',          icon: XIcon },
  { key: 'linkedin',   label: 'LinkedIn',   placeholder: 'https://linkedin.com/in/yourhandle', icon: LinkedInIcon },
  { key: 'github',     label: 'GitHub',     placeholder: 'https://github.com/yourhandle',      icon: GithubIcon },
  { key: 'youtube',    label: 'YouTube',    placeholder: 'https://youtube.com/@yourchannel',   icon: YoutubeIcon },
  { key: 'behance',    label: 'Behance',    placeholder: 'https://behance.net/yourprofile',    icon: BehanceIcon },
  { key: 'dribbble',   label: 'Dribbble',   placeholder: 'https://dribbble.com/yourhandle',   icon: DribbbleIcon },
  { key: 'whatsapp',   label: 'WhatsApp',   placeholder: 'https://wa.me/919999999999',        icon: WhatsappIcon },
];

export default function LinksPage() {
  const [links, setLinks]   = useState({});
  const [saving, setSaving] = useState({});
  const [saved, setSaved]   = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/settings?key=social_links')
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (data?.value) setLinks(data.value);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleSave = async (key) => {
    setSaving(s => ({ ...s, [key]: true }));
    await fetch('/api/settings', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key: 'social_links', value: links }),
    });
    setSaving(s => ({ ...s, [key]: false }));
    setSaved(s => ({ ...s, [key]: true }));
    setTimeout(() => setSaved(s => ({ ...s, [key]: false })), 2000);
  };

  const handleSaveAll = async () => {
    setSaving({ _all: true });
    await fetch('/api/settings', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key: 'social_links', value: links }),
    });
    setSaving({});
    setSaved({ _all: true });
    setTimeout(() => setSaved({}), 2000);
  };

  return (
    <div className="max-w-2xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-white font-black text-3xl tracking-tight mb-1">Social Links</h1>
        <p className="text-white/30 text-sm">Manage your social media and contact links. Changes reflect site-wide instantly.</p>
      </div>

      {loading ? (
        <div className="space-y-3">
          {SOCIAL_FIELDS.map(f => (
            <div key={f.key} className="h-16 bg-white/[0.03] border border-white/5 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {SOCIAL_FIELDS.map(({ key, label, placeholder, icon: Icon }) => (
            <div key={key} className="flex items-center gap-3 bg-white/[0.03] border border-white/8 rounded-2xl px-4 py-3 group hover:border-white/15 transition-colors">
              <div className="shrink-0 w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center text-white/40 group-hover:text-white/70 transition-colors">
                <Icon />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] text-white/30 uppercase tracking-widest mb-1">{label}</p>
                <input
                  type="url"
                  value={links[key] || ''}
                  onChange={e => setLinks(l => ({ ...l, [key]: e.target.value }))}
                  placeholder={placeholder}
                  className="w-full bg-transparent text-white text-sm placeholder:text-white/15 focus:outline-none"
                />
              </div>
              {links[key] && (
                <a
                  href={links[key]}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="shrink-0 text-white/20 hover:text-[#ff6b1a] transition-colors"
                  title="Open link"
                >
                  <ExternalIcon />
                </a>
              )}
              <button
                onClick={() => handleSave(key)}
                disabled={saving[key]}
                className={`shrink-0 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${
                  saved[key]
                    ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                    : 'bg-white/5 text-white/40 hover:bg-[#ff6b1a]/10 hover:text-[#ff6b1a] border border-white/5 hover:border-[#ff6b1a]/20'
                }`}
              >
                {saved[key] ? '✓ Saved' : saving[key] ? '...' : 'Save'}
              </button>
            </div>
          ))}

          {/* Save All */}
          <div className="pt-4 flex justify-end">
            <button
              onClick={handleSaveAll}
              disabled={!!saving._all}
              className={`px-6 py-3 rounded-xl text-sm font-bold uppercase tracking-widest transition-all ${
                saved._all
                  ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                  : 'bg-[#ff6b1a] text-black hover:opacity-90'
              }`}
            >
              {saved._all ? '✓ All Saved' : saving._all ? 'Saving…' : 'Save All Links'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Icons ── */
function InstagramIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5"/><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
    </svg>
  );
}
function XIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
    </svg>
  );
}
function LinkedInIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/>
    </svg>
  );
}
function GithubIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 00-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0020 4.77 5.07 5.07 0 0019.91 1S18.73.65 16 2.48a13.38 13.38 0 00-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 005 4.77a5.44 5.44 0 00-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 009 18.13V22"/>
    </svg>
  );
}
function YoutubeIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22.54 6.42a2.78 2.78 0 00-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 001.46 6.42 29 29 0 001 12a29 29 0 00.46 5.58 2.78 2.78 0 001.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 001.95-1.96A29 29 0 0023 12a29 29 0 00-.46-5.58z"/><polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02"/>
    </svg>
  );
}
function BehanceIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M7.5 11.5c1.38 0 2.5-1.12 2.5-2.5S8.88 6.5 7.5 6.5H3v5h4.5zm0 1H3v5.5h4.5c1.66 0 3-1.34 3-3s-1.34-2.5-3-2.5zM21 11h-6c0-1.66 1.34-3 3-3s3 1.34 3 3zm-3-4c-2.76 0-5 2.24-5 5s2.24 5 5 5c2.05 0 3.81-1.23 4.58-3H20.1a2.5 2.5 0 01-2.1 1.14 2.5 2.5 0 01-2.45-2H23c.03-.37.05-.74.05-1.14C23.05 9.24 20.81 7 18 7zM15.5 5h5v1.25h-5z"/>
    </svg>
  );
}
function DribbbleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><path d="M8.56 2.75c4.37 6.03 6.02 9.42 8.03 17.72m2.54-15.38c-3.72 4.35-8.94 5.66-16.88 5.85m19.5 1.9c-3.5-.93-6.63-.82-8.94 0-2.58.92-5.01 2.86-7.44 6.32"/>
    </svg>
  );
}
function WhatsappIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
    </svg>
  );
}
function ExternalIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3"/>
    </svg>
  );
}
