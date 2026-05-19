'use client';
import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { FiToggleLeft, FiToggleRight, FiRefreshCw } from 'react-icons/fi';

const SOURCE_COLORS = {
  'Instagram':   { bg: 'bg-pink-500/15',    text: 'text-pink-400',    dot: 'bg-pink-400'    },
  'Google':      { bg: 'bg-blue-500/15',    text: 'text-blue-400',    dot: 'bg-blue-400'    },
  'LinkedIn':    { bg: 'bg-sky-500/15',     text: 'text-sky-400',     dot: 'bg-sky-400'     },
  'Twitter / X': { bg: 'bg-slate-500/15',   text: 'text-slate-300',   dot: 'bg-slate-300'   },
  'Facebook':    { bg: 'bg-indigo-500/15',  text: 'text-indigo-400',  dot: 'bg-indigo-400'  },
  'YouTube':     { bg: 'bg-red-500/15',     text: 'text-red-400',     dot: 'bg-red-400'     },
  'Reddit':      { bg: 'bg-orange-500/15',  text: 'text-orange-400',  dot: 'bg-orange-400'  },
  'WhatsApp':    { bg: 'bg-green-500/15',   text: 'text-green-400',   dot: 'bg-green-400'   },
  'Bing':        { bg: 'bg-teal-500/15',    text: 'text-teal-400',    dot: 'bg-teal-400'    },
  'DuckDuckGo':  { bg: 'bg-yellow-500/15',  text: 'text-yellow-400',  dot: 'bg-yellow-400'  },
  'TikTok':      { bg: 'bg-white/8',        text: 'text-white/70',    dot: 'bg-white/60'    },
  'Snapchat':    { bg: 'bg-yellow-400/15',  text: 'text-yellow-300',  dot: 'bg-yellow-300'  },
  'Telegram':    { bg: 'bg-sky-500/15',     text: 'text-sky-400',     dot: 'bg-sky-400'     },
  'LINE':        { bg: 'bg-green-500/15',   text: 'text-green-400',   dot: 'bg-green-400'   },
  'Pinterest':   { bg: 'bg-red-500/15',     text: 'text-red-400',     dot: 'bg-red-400'     },
  'Direct':      { bg: 'bg-white/8',        text: 'text-white/50',    dot: 'bg-white/40'    },
  // AI tools
  'ChatGPT':     { bg: 'bg-emerald-500/15', text: 'text-emerald-400', dot: 'bg-emerald-400' },
  'Gemini':      { bg: 'bg-violet-500/15',  text: 'text-violet-400',  dot: 'bg-violet-400'  },
  'Claude':      { bg: 'bg-[#ff6b1a]/15',   text: 'text-[#ff6b1a]',  dot: 'bg-[#ff6b1a]'  },
  'Perplexity':  { bg: 'bg-cyan-500/15',    text: 'text-cyan-400',    dot: 'bg-cyan-400'    },
  'Copilot':     { bg: 'bg-blue-400/15',    text: 'text-blue-300',    dot: 'bg-blue-300'    },
  'Grok':        { bg: 'bg-white/8',        text: 'text-white/60',    dot: 'bg-white/40'    },
  'Meta AI':     { bg: 'bg-sky-600/15',     text: 'text-sky-300',     dot: 'bg-sky-300'     },
  'You.com':     { bg: 'bg-purple-500/15',  text: 'text-purple-400',  dot: 'bg-purple-400'  },
};

function sourceMeta(s) {
  return SOURCE_COLORS[s] ?? { bg: 'bg-white/8', text: 'text-white/40', dot: 'bg-white/30' };
}

function parseSourceClient(referrer) {
  if (!referrer) return 'Direct';
  try {
    const h = new URL(referrer).hostname.toLowerCase();
    if (h === 'chatgpt.com' || h.includes('chat.openai.com'))  return 'ChatGPT';
    if (h.includes('gemini.google.com'))                        return 'Gemini';
    if (h === 'claude.ai')                                      return 'Claude';
    if (h.includes('perplexity.ai'))                            return 'Perplexity';
    if (h.includes('copilot.microsoft'))                        return 'Copilot';
    if (h === 'grok.com' || h.includes('grok.x.ai'))           return 'Grok';
    if (h === 'meta.ai')                                        return 'Meta AI';
    if (h === 'you.com')                                        return 'You.com';
    if (h.includes('instagram') || h === 'l.instagram.com')    return 'Instagram';
    if (h.includes('google.'))    return 'Google';
    if (h.includes('bing.'))      return 'Bing';
    if (h.includes('yahoo.'))     return 'Yahoo';
    if (h.includes('duckduckgo.'))return 'DuckDuckGo';
    if (h.includes('linkedin.'))  return 'LinkedIn';
    if (h.includes('twitter.') || h.includes('t.co') || h === 'x.com') return 'Twitter / X';
    if (h.includes('facebook.') || h.includes('fb.com')) return 'Facebook';
    if (h.includes('youtube.'))   return 'YouTube';
    if (h.includes('reddit.'))    return 'Reddit';
    if (h.includes('whatsapp.'))  return 'WhatsApp';
    return new URL(referrer).hostname;
  } catch { return 'Direct'; }
}

function getDeviceType(ua) {
  if (!ua) return 'Unknown';
  const u = ua.toLowerCase();
  
  // Apple Devices
  if (u.includes('ipad')) return 'Tab';
  if (u.includes('iphone')) return 'iPhone';
  if (u.includes('macintosh') || u.includes('mac os')) return 'Mac';
  
  // Android Devices
  if (u.includes('android')) {
    if (u.includes('mobile')) return 'Android';
    return 'Tab';
  }
  
  // PCs
  if (u.includes('windows') || u.includes('linux') || u.includes('cros')) return 'Laptop / PC';

  return 'Unknown';
}

function timeAgo(date) {
  const s = Math.floor((Date.now() - date) / 1000);
  if (s < 10)  return 'just now';
  if (s < 60)  return `${s}s ago`;
  if (s < 3600)return `${Math.floor(s / 60)}m ago`;
  return `${Math.floor(s / 3600)}h ago`;
}

const EMPTY_STATS = {
  totalVisits: 0, todayVisits: 0, totalClicks: 0, totalReviews: 0,
  activeUsers: 0, topSearches: [], recentVisits: [],
  clicksByLabel: [], visitsByPage: [], visitsBySource: [], aiVisits: [],
  visitsPerDay: [], visitsByCountry: [],
};

export default function AdminDashboard() {
  const [stats, setStats]           = useState(null);
  const [loading, setLoading]       = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [comingSoon, setComingSoon] = useState(false);
  const [csToggling, setCsToggling] = useState(false);
  
  const currentYear = new Date().getFullYear();
  const [filterMonth, setFilterMonth] = useState('');
  const [filterYear, setFilterYear]   = useState('');
  
  const router = useRouter();

  // ── Fetch stats ───────────────────────────────────────────────────────────
  const fetchStats = useCallback(async (silent = false) => {
    if (!silent) setRefreshing(true);
    const params = new URLSearchParams();
    if (filterMonth) params.set('month', filterMonth);
    if (filterYear) params.set('year', filterYear);
    const url = '/api/analytics/stats' + (params.toString() ? `?${params.toString()}` : '');
    
    const r = await fetch(url).catch(() => null);
    if (!r) {
      setLoading(false);
      setRefreshing(false);
      return;
    }
    if (r.status === 401) { router.push('/admin/login'); return; }
    if (r.ok) {
      const data = await r.json().catch(() => null);
      if (data) { setStats(data); setLastUpdated(new Date()); }
    }
    setLoading(false);
    setRefreshing(false);
  }, [router, filterMonth, filterYear]);

  useEffect(() => {
    fetchStats(false);
    // Poll every 5 seconds to provide "realtime" log updates without needing client-side Supabase keys
    const iv = setInterval(() => fetchStats(true), 5000);
    return () => clearInterval(iv);
  }, [fetchStats]);

  // ── Coming soon ───────────────────────────────────────────────────────────
  useEffect(() => {
    fetch('/api/settings?key=coming_soon')
      .then(r => r.ok ? r.json() : null)
      .then(d => { if (d) setComingSoon(d.value === true); })
      .catch(() => {});
  }, []);

  const toggleComingSoon = async () => {
    setCsToggling(true);
    const next = !comingSoon;
    await fetch('/api/settings', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key: 'coming_soon', value: next }),
    });
    setComingSoon(next);
    setCsToggling(false);
  };

  if (loading) return <LoadingState />;

  const s         = stats || EMPTY_STATS;
  const maxDay    = Math.max(...(s.visitsPerDay?.map(v => v.count) ?? [1]), 1);
  const totalV    = s.totalVisits || 1;
  const maxClicks  = s.clicksByLabel?.[0]?.count  || 1;
  const maxCountry = s.visitsByCountry?.[0]?.count || 1;
  const maxAI      = s.aiVisits?.[0]?.count        || 1;

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-0 mb-4 md:mb-1">
        <div>
          <h1 className="text-white text-2xl font-bold">Dashboard</h1>
          <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-3 mt-1">
            <p className="text-white/30 text-sm">Overview of your portfolio performance.</p>
            {lastUpdated && (
              <span className="text-[10px] text-white/20 tracking-widest hidden md:inline">
                · Updated {timeAgo(lastUpdated)}
              </span>
            )}
          </div>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          <select
            value={filterMonth}
            onChange={(e) => setFilterMonth(e.target.value)}
            className="bg-[#111] border border-white/5 text-white/70 text-xs rounded-xl px-3 py-1.5 focus:outline-none focus:border-white/20"
          >
            <option value="">All Months</option>
            {Array.from({ length: 12 }).map((_, i) => (
              <option key={i + 1} value={i + 1}>
                {new Date(0, i).toLocaleString('default', { month: 'long' })}
              </option>
            ))}
          </select>

          <select
            value={filterYear}
            onChange={(e) => setFilterYear(e.target.value)}
            className="bg-[#111] border border-white/5 text-white/70 text-xs rounded-xl px-3 py-1.5 focus:outline-none focus:border-white/20"
          >
            <option value="">All Years</option>
            {[currentYear, currentYear - 1, currentYear - 2].map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Coming Soon toggle */}
      <div className="flex items-center justify-between bg-[#111] border border-white/5 rounded-2xl px-4 md:px-6 py-3 md:py-4 mb-6">
        <div>
          <p className="text-white text-sm font-semibold">Coming Soon Mode</p>
          <p className="text-white/30 text-xs mt-0.5">When on, all visitors see the coming soon page.</p>
        </div>
        <button
          onClick={toggleComingSoon}
          disabled={csToggling}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${
            comingSoon
              ? 'bg-[#ff6b1a]/15 text-[#ff6b1a] border border-[#ff6b1a]/30'
              : 'bg-white/5 text-white/40 border border-white/10 hover:border-white/20'
          }`}
        >
          {comingSoon ? <FiToggleRight size={16} /> : <FiToggleLeft size={16} />}
          {csToggling ? 'Saving…' : comingSoon ? 'On' : 'Off'}
        </button>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-3 xl:grid-cols-5 gap-3 md:gap-4 mb-8">
        <StatCard label="Total Visits"    value={s.totalVisits}    color="#ff6b1a" />
        <StatCard label="Today's Visits"  value={s.todayVisits}    color="#38bdf8" />
        <StatCard label="Link Clicks"     value={s.totalClicks}    color="#a78bfa" />
        <StatCard label="Reviews"         value={s.totalReviews}   color="#34d399" />
        <StatCard label="Active Now"      value={s.activeUsers}    color="#f43f5e" />
      </div>

      {/* 7-day chart */}
      <div className="bg-[#111] border border-white/5 rounded-2xl p-6 mb-6">
        <h2 className="text-white/70 text-sm font-medium mb-6">Visits — last 7 days</h2>
        <div className="flex items-end gap-2 h-28">
          {s.visitsPerDay?.length ? s.visitsPerDay.map((v, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-1.5">
              <span className="text-white/40 text-[10px]">{v.count}</span>
              <div
                className="w-full bg-[#ff6b1a] rounded-t-md transition-all"
                style={{ height: `${Math.max((v.count / maxDay) * 96, 4)}px` }}
              />
              <span className="text-white/25 text-[9px]">{v._id?.slice(5)}</span>
            </div>
          )) : <p className="text-white/20 text-sm m-auto">No data yet</p>}
        </div>
      </div>

      {/* Traffic sources + AI Traffic + Link clicks */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">

        {/* Traffic Sources */}
        <div className="bg-[#111] border border-white/5 rounded-2xl p-6">
          <h2 className="text-white/70 text-sm font-medium mb-1">Traffic Sources</h2>
          <p className="text-white/25 text-xs mb-5">Where visitors come from</p>
          <div className="space-y-3">
            {s.visitsBySource?.length ? s.visitsBySource.map((src, i) => {
              const meta = sourceMeta(src.source);
              const pct  = Math.round((src.count / totalV) * 100);
              return (
                <div key={i}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${meta.dot}`} />
                      <span className={`text-sm ${meta.text}`}>{src.source}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-white/25 text-xs">{pct}%</span>
                      <span className={`text-xs font-semibold ${meta.text}`}>{src.count}</span>
                    </div>
                  </div>
                  <div className="h-1 bg-white/5 rounded-full">
                    <div className={`h-full rounded-full ${meta.dot} opacity-60`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            }) : <p className="text-white/20 text-sm">No traffic data yet</p>}
          </div>
        </div>

        {/* AI Traffic */}
        <div className="bg-[#111] border border-white/5 rounded-2xl p-6">
          <h2 className="text-white/70 text-sm font-medium mb-1">AI Traffic</h2>
          <p className="text-white/25 text-xs mb-5">Visitors referred by AI tools</p>
          <div className="space-y-3">
            {s.aiVisits?.length ? s.aiVisits.map((v, i) => {
              const meta = sourceMeta(v.source);
              const pct  = Math.round((v.count / maxAI) * 100);
              return (
                <div key={i}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${meta.dot}`} />
                      <span className={`text-sm ${meta.text}`}>{v.source}</span>
                    </div>
                    <span className={`text-xs font-semibold ${meta.text}`}>{v.count}</span>
                  </div>
                  <div className="h-1 bg-white/5 rounded-full">
                    <div className={`h-full rounded-full ${meta.dot} opacity-60`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            }) : (
              <p className="text-white/20 text-sm">No AI referrals yet</p>
            )}
          </div>
        </div>

        {/* Link Clicks */}
        <div className="bg-[#111] border border-white/5 rounded-2xl p-6">
          <h2 className="text-white/70 text-sm font-medium mb-1">Link Clicks</h2>
          <p className="text-white/25 text-xs mb-5">CTAs and shared links, sorted by clicks</p>
          <div className="space-y-3">
            {s.clicksByLabel?.length ? s.clicksByLabel.map((c, i) => {
              const pct = Math.round((c.count / maxClicks) * 100);
              return (
                <div key={i}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-white/60 text-sm truncate">{c._id}</span>
                    <span className="text-[#a78bfa] text-xs font-semibold ml-2 shrink-0">{c.count}</span>
                  </div>
                  <div className="h-1 bg-white/5 rounded-full">
                    <div className="h-full bg-[#a78bfa]/50 rounded-full" style={{ width: `${pct}%` }} />
                  </div>
                  {c.url && <p className="text-white/15 text-[10px] mt-0.5 truncate">{c.url}</p>}
                </div>
              );
            }) : <p className="text-white/20 text-sm">No clicks yet</p>}
          </div>
        </div>
      </div>

      {/* Searches + Pages + Countries */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">

        {/* Top Searches */}
        <div className="bg-[#111] border border-white/5 rounded-2xl p-6">
          <h2 className="text-white/70 text-sm font-medium mb-5">Top Searches</h2>
          <div className="space-y-3">
            {s.topSearches?.length ? s.topSearches.slice(0, 8).map((q, i) => (
              <div key={i} className="flex items-center justify-between">
                <span className="text-white/60 text-sm truncate">{q.query}</span>
                <span className="text-[#ff6b1a] text-sm font-medium ml-2 shrink-0">{q.count}</span>
              </div>
            )) : <p className="text-white/20 text-sm">No searches yet</p>}
          </div>
        </div>

        {/* Pages */}
        <div className="bg-[#111] border border-white/5 rounded-2xl p-6">
          <h2 className="text-white/70 text-sm font-medium mb-5">Visits by Page</h2>
          <div className="space-y-3">
            {s.visitsByPage?.length ? s.visitsByPage.map((v, i) => {
              const pct = Math.round((v.count / totalV) * 100);
              return (
                <div key={i} className="flex items-center gap-3">
                  <span className="text-white/60 text-xs w-20 shrink-0 truncate">{v._id || '/'}</span>
                  <div className="flex-1 h-1.5 bg-white/5 rounded-full">
                    <div className="h-full bg-[#ff6b1a]/60 rounded-full" style={{ width: `${pct}%` }} />
                  </div>
                  <span className="text-white/30 text-xs w-8 text-right shrink-0">{v.count}</span>
                </div>
              );
            }) : <p className="text-white/20 text-sm">No page data yet</p>}
          </div>
        </div>

        {/* Visitor Locations */}
        <div className="bg-[#111] border border-white/5 rounded-2xl p-6">
          <h2 className="text-white/70 text-sm font-medium mb-1">Visitor Locations</h2>
          <p className="text-white/25 text-xs mb-5">Top countries</p>
          <div className="space-y-3">
            {s.visitsByCountry?.length ? s.visitsByCountry.slice(0, 8).map((c, i) => {
              const pct = Math.round((c.count / maxCountry) * 100);
              return (
                <div key={i}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-white/60 text-sm truncate">{c.country}</span>
                    <span className="text-[#38bdf8] text-xs font-semibold ml-2 shrink-0">{c.count}</span>
                  </div>
                  <div className="h-1 bg-white/5 rounded-full">
                    <div className="h-full bg-[#38bdf8]/50 rounded-full" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            }) : <p className="text-white/20 text-sm">Location data will appear as visitors arrive</p>}
          </div>
        </div>
      </div>

      {/* Recent visits */}
      <div className="bg-[#111] border border-white/5 rounded-2xl p-4 md:p-6">
        <h2 className="text-white/70 text-sm font-medium mb-4">Recent Visits</h2>

        {!s.recentVisits?.length && (
          <p className="text-white/20 text-sm py-4">No visits recorded yet.</p>
        )}

        {/* Mobile cards */}
        <div className="md:hidden space-y-2">
          {s.recentVisits?.map((v, i) => {
            const src  = parseSourceClient(v.referrer);
            const meta = sourceMeta(src);
            const device = getDeviceType(v.useragent || v.user_agent);
            const loc = v.city
              ? `${v.city}, ${v.country}`
              : v.country || null;
            return (
              <div key={i} className="border border-white/5 rounded-xl p-3 hover:bg-white/[0.02] transition-colors">
                <div className="flex items-center justify-between mb-1.5">
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium ${meta.bg} ${meta.text}`}>
                    <span className={`w-1 h-1 rounded-full ${meta.dot}`} />
                    {src}
                  </span>
                  <span className="text-white/25 text-[10px]">{timeAgo(new Date(v.createdAt))}</span>
                </div>
                <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
                  <span className="text-white/60 text-xs font-medium">{v.page || '/'}</span>
                  {loc && <span className="text-white/30 text-xs">· {loc}</span>}
                  <span className="text-white/25 text-xs">· {device}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Desktop table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-white/25 text-xs border-b border-white/5">
                <th className="text-left pb-3 font-normal">Time</th>
                <th className="text-left pb-3 font-normal">Page</th>
                <th className="text-left pb-3 font-normal">Location</th>
                <th className="text-left pb-3 font-normal">Device</th>
                <th className="text-left pb-3 font-normal">Source</th>
                <th className="text-left pb-3 font-normal">Referrer</th>
              </tr>
            </thead>
            <tbody>
              {s.recentVisits?.map((v, i) => {
                const src  = parseSourceClient(v.referrer);
                const meta = sourceMeta(src);
                let flag = '';
                if (v.country && v.country !== 'Dev') {
                  const codePoints = v.country.toUpperCase().split('').map(char => 127397 + char.charCodeAt(0));
                  flag = String.fromCodePoint(...codePoints) + ' ';
                } else if (v.country === 'Dev') {
                  flag = '💻 ';
                }
                const loc    = v.city ? `${flag}${v.city}, ${v.country}` : (v.country ? `${flag}${v.country}` : '—');
                const device = getDeviceType(v.useragent || v.user_agent);
                return (
                  <tr key={i} className="border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors">
                    <td className="py-2.5 text-white/30 text-xs whitespace-nowrap pr-4">
                      {new Date(v.createdAt).toLocaleString()}
                    </td>
                    <td className="py-2.5 text-white/60 pr-4 text-xs">{v.page || '/'}</td>
                    <td className="py-2.5 text-white/50 pr-4 text-xs whitespace-nowrap">{loc}</td>
                    <td className="py-2.5 text-white/50 pr-4 text-xs whitespace-nowrap">{device}</td>
                    <td className="py-2.5 pr-4">
                      <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-medium ${meta.bg} ${meta.text}`}>
                        <span className={`w-1 h-1 rounded-full ${meta.dot}`} />
                        {src}
                      </span>
                    </td>
                    <td className="py-2.5 text-white/20 text-xs truncate max-w-[160px]">
                      {v.referrer || '—'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, color }) {
  return (
    <div className="bg-[#111] border border-white/5 rounded-2xl p-3 md:p-5">
      <p className="text-white/35 text-[10px] md:text-xs mb-2 md:mb-3 leading-tight">{label}</p>
      <p className="text-xl md:text-3xl font-bold" style={{ color }}>{(value ?? 0).toLocaleString()}</p>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="flex items-center justify-center h-64">
      <div className="text-white/20 text-sm">Loading…</div>
    </div>
  );
}
