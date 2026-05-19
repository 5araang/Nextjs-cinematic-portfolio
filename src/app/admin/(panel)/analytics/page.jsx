'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

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

export default function AnalyticsAdmin() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeUsers, setActiveUsers] = useState(0);
  const router = useRouter();

  useEffect(() => {
    fetch('/api/analytics/stats')
      .then((r) => {
        if (r.status === 401) { router.push('/admin/login'); return null; }
        return r.json();
      })
      .then((data) => { if (data) { setStats(data); setLoading(false); } });

    // Poll for live active users
    const fetchActive = () => {
      fetch('/api/analytics/active-users')
        .then((r) => r.json())
        .then((d) => {
          if (d.success) setActiveUsers(d.count || 0);
        })
        .catch(() => {});
    };
    fetchActive(); // Initial fetch
    const intervalId = setInterval(fetchActive, 5000); // Poll every 5 seconds

    return () => clearInterval(intervalId);
  }, [router]);

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="text-white/20 text-sm">Loading…</div>
    </div>
  );

  const maxDay = Math.max(...(stats.visitsPerDay?.map((v) => v.count) ?? [1]), 1);
  const maxSearch = stats.topSearches?.[0]?.count || 1;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-white text-2xl font-bold mb-1">Analytics</h1>
          <p className="text-white/30 text-sm">Traffic, searches, and click-through data.</p>
        </div>
        <div className="flex items-center gap-3 bg-[#111] border border-white/5 rounded-full px-4 py-2">
          <div className="relative flex items-center justify-center w-3 h-3">
            <span className="absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75 animate-ping"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
          </div>
          <span className="text-white font-medium text-sm">
            {activeUsers} {activeUsers === 1 ? 'Live User' : 'Live Users'}
          </span>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Visits',   val: stats.totalVisits,           color: '#ff6b1a' },
          { label: "Today's Visits", val: stats.todayVisits,           color: '#38bdf8' },
          { label: 'Link Clicks',    val: stats.totalClicks,           color: '#a78bfa' },
          { label: 'Search Terms',   val: stats.topSearches?.length ?? 0, color: '#34d399' },
        ].map(({ label, val, color }) => (
          <div key={label} className="bg-[#111] border border-white/5 rounded-2xl p-5">
            <p className="text-white/35 text-xs mb-3">{label}</p>
            <p className="text-3xl font-bold" style={{ color }}>{(val ?? 0).toLocaleString()}</p>
          </div>
        ))}
      </div>

      {/* 7-day bar chart */}
      <div className="bg-[#111] border border-white/5 rounded-2xl p-6 mb-6">
        <h2 className="text-white/70 text-sm font-medium mb-6">Daily Visits — Last 7 Days</h2>
        <div className="flex items-end gap-2 h-36">
          {stats.visitsPerDay?.length ? stats.visitsPerDay.map((v, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-1.5">
              <span className="text-white/40 text-xs">{v.count}</span>
              <div
                className="w-full bg-[#ff6b1a] rounded-t-md transition-all"
                style={{ height: `${Math.max((v.count / maxDay) * 120, 4)}px` }}
              />
              <span className="text-white/25 text-[10px]">{v._id?.slice(5)}</span>
            </div>
          )) : (
            <p className="text-white/20 text-sm m-auto">No data for the last 7 days</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Most searched words */}
        <div className="bg-[#111] border border-white/5 rounded-2xl p-6">
          <h2 className="text-white/70 text-sm font-medium mb-5">Most Searched Words</h2>
          <div className="space-y-4">
            {stats.topSearches?.length ? stats.topSearches.map((s, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className="text-white/20 text-xs w-5 text-right shrink-0">{i + 1}</span>
                <div className="flex-1">
                  <div className="flex justify-between mb-1.5">
                    <span className="text-white/70 text-sm">{s.query}</span>
                    <span className="text-[#34d399] text-sm font-medium">{s.count}</span>
                  </div>
                  <div className="h-1 bg-white/5 rounded-full">
                    <div
                      className="h-full bg-[#34d399]/50 rounded-full"
                      style={{ width: `${(s.count / maxSearch) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            )) : <p className="text-white/20 text-sm">No searches tracked yet</p>}
          </div>
        </div>

        {/* Ad / CTA clicks */}
        <div className="bg-[#111] border border-white/5 rounded-2xl p-6">
          <h2 className="text-white/70 text-sm font-medium mb-5">Ad / CTA Clicks</h2>
          <div className="space-y-4">
            {stats.clicksByLabel?.length ? stats.clicksByLabel.map((c, i) => {
              const maxClicks = stats.clicksByLabel[0]?.count || 1;
              return (
                <div key={i} className="flex items-center gap-3">
                  <span className="text-white/20 text-xs w-5 text-right shrink-0">{i + 1}</span>
                  <div className="flex-1">
                    <div className="flex justify-between mb-1.5">
                      <span className="text-white/70 text-sm">{c._id}</span>
                      <span className="text-[#a78bfa] text-sm font-medium">{c.count}</span>
                    </div>
                    <div className="h-1 bg-white/5 rounded-full">
                      <div
                        className="h-full bg-[#a78bfa]/50 rounded-full"
                        style={{ width: `${(c.count / maxClicks) * 100}%` }}
                      />
                    </div>
                    {c.url && <p className="text-white/20 text-xs mt-1 truncate">{c.url}</p>}
                  </div>
                </div>
              );
            }) : <p className="text-white/20 text-sm">No clicks tracked yet</p>}
          </div>
        </div>
      </div>

      {/* Visits by page */}
      <div className="bg-[#111] border border-white/5 rounded-2xl p-6 mb-6">
        <h2 className="text-white/70 text-sm font-medium mb-5">Visits by Page</h2>
        <div className="space-y-3">
          {stats.visitsByPage?.length ? stats.visitsByPage.map((v, i) => {
            const pct = stats.totalVisits ? Math.round((v.count / stats.totalVisits) * 100) : 0;
            return (
              <div key={i} className="flex items-center gap-4">
                <span className="text-white/60 text-sm w-32 shrink-0">{v._id || '/'}</span>
                <div className="flex-1 h-2 bg-white/5 rounded-full">
                  <div className="h-full bg-[#ff6b1a] rounded-full" style={{ width: `${pct}%` }} />
                </div>
                <span className="text-white/30 text-xs w-20 text-right shrink-0">{v.count} ({pct}%)</span>
              </div>
            );
          }) : <p className="text-white/20 text-sm">No page data yet</p>}
        </div>
      </div>

      {/* Recent visits table */}
      <div className="bg-[#111] border border-white/5 rounded-2xl p-6">
        <h2 className="text-white/70 text-sm font-medium mb-4">Recent Visits (last 50)</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-white/25 text-xs border-b border-white/5">
                <th className="text-left pb-3 font-normal">Time</th>
                <th className="text-left pb-3 font-normal">Page</th>
                <th className="text-left pb-3 font-normal">Location</th>
                <th className="text-left pb-3 font-normal">Device</th>
                <th className="text-left pb-3 font-normal">Referrer</th>
              </tr>
            </thead>
            <tbody>
              {stats.recentVisits?.map((v, i) => {
                const loc = (v.city || v.country) ? `${v.city ? v.city + ', ' : ''}${v.country || ''}` : '—';
                const device = getDeviceType(v.useragent || v.user_agent);
                return (
                <tr key={i} className="border-b border-white/5 last:border-0 hover:bg-white/2 transition-colors">
                  <td className="py-2.5 text-white/30 text-xs whitespace-nowrap pr-6">
                    {new Date(v.createdAt).toLocaleString()}
                  </td>
                  <td className="py-2.5 text-white/60 pr-6">{v.page || '/'}</td>
                  <td className="py-2.5 text-white/50 pr-6 text-xs whitespace-nowrap">{loc}</td>
                  <td className="py-2.5 text-white/50 pr-6 text-xs whitespace-nowrap">{device}</td>
                  <td className="py-2.5 text-white/25 text-xs truncate max-w-[240px]">
                    {v.referrer || 'direct'}
                  </td>
                </tr>
              )})}
            </tbody>
          </table>
          {!stats.recentVisits?.length && (
            <p className="text-white/20 text-sm py-4">No visits recorded yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
