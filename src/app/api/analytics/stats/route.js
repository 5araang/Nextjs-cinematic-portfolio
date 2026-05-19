import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';
import { supabase } from '@/lib/supabase';

const AI_SOURCE_SET = new Set(['ChatGPT', 'Gemini', 'Claude', 'Perplexity', 'Copilot', 'Grok', 'Meta AI', 'You.com']);

const SOURCE_PARAM_MAP = {
  instagram: 'Instagram', whatsapp: 'WhatsApp', twitter: 'Twitter / X', x: 'Twitter / X',
  facebook: 'Facebook',  linkedin: 'LinkedIn',  youtube: 'YouTube',     reddit: 'Reddit',
  google: 'Google',      bing: 'Bing',           tiktok: 'TikTok',      pinterest: 'Pinterest',
  chatgpt: 'ChatGPT',   gemini: 'Gemini',        claude: 'Claude',      perplexity: 'Perplexity',
  copilot: 'Copilot',   grok: 'Grok',            meta: 'Meta AI',
};

function detectFromUA(ua) {
  if (!ua) return null;
  const u = ua.toLowerCase();
  if (u.includes('instagram'))                              return 'Instagram';
  if (u.includes('fban') || u.includes('fbav') || u.includes('fbios')) return 'Facebook';
  if (u.includes('whatsapp'))                               return 'WhatsApp';
  if (u.includes('tiktok') || u.includes('musical_ly'))    return 'TikTok';
  if (u.includes('snapchat'))                               return 'Snapchat';
  if (u.includes('twitterandroid') || u.includes('twitterios')) return 'Twitter / X';
  if (u.includes('telegrambot') || u.includes('telegram')) return 'Telegram';
  if (u.includes('linkedinapp'))                            return 'LinkedIn';
  if (u.includes('pinterest'))                              return 'Pinterest';
  if (u.includes('line/'))                                  return 'LINE';
  return null;
}

function resolveSource(source, referrer, userAgent) {
  if (source) {
    const mapped = SOURCE_PARAM_MAP[source.toLowerCase().trim()];
    if (mapped) return mapped;
    return source.charAt(0).toUpperCase() + source.slice(1).toLowerCase();
  }
  const fromRef = parseSource(referrer);
  if (fromRef !== 'Direct') return fromRef;
  return detectFromUA(userAgent) ?? 'Direct';
}

function parseSource(referrer) {
  if (!referrer) return 'Direct';
  try {
    const h = new URL(referrer).hostname.toLowerCase();
    // AI tools
    if (h === 'chatgpt.com' || h.includes('chat.openai.com'))  return 'ChatGPT';
    if (h.includes('gemini.google.com'))                        return 'Gemini';
    if (h === 'claude.ai')                                      return 'Claude';
    if (h.includes('perplexity.ai'))                            return 'Perplexity';
    if (h.includes('copilot.microsoft'))                        return 'Copilot';
    if (h === 'grok.com' || h.includes('grok.x.ai'))           return 'Grok';
    if (h === 'meta.ai')                                        return 'Meta AI';
    if (h === 'you.com')                                        return 'You.com';
    // Social & search
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
  } catch {
    return 'Direct';
  }
}

async function isAdmin() {
  const store = await cookies();
  const token = store.get('admin_token')?.value;
  if (!token) return false;
  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    await jwtVerify(token, secret);
    return true;
  } catch { return false; }
}

export async function GET(request) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const monthStr = searchParams.get('month');
  const yearStr = searchParams.get('year');

  let filterStart = null;
  let filterEnd = null;

  if (yearStr) {
    const y = parseInt(yearStr, 10);
    if (monthStr) {
      const m = parseInt(monthStr, 10) - 1; // 0-indexed
      filterStart = new Date(y, m, 1).toISOString();
      filterEnd = new Date(y, m + 1, 1).toISOString();
    } else {
      filterStart = new Date(y, 0, 1).toISOString();
      filterEnd = new Date(y + 1, 0, 1).toISOString();
    }
  }

  const todayStart    = new Date(); todayStart.setHours(0, 0, 0, 0);
  const sevenDaysAgo  = new Date(); sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  const fiveMinsAgo   = new Date(); fiveMinsAgo.setMinutes(fiveMinsAgo.getMinutes() - 5);

  let totalVisitsQuery = supabase.from('visits').select('*', { count: 'exact', head: true });
  let totalClicksQuery = supabase.from('ad_clicks').select('*', { count: 'exact', head: true });
  let totalReviewsQuery = supabase.from('reviews').select('*', { count: 'exact', head: true });
  let recentVisitsQuery = supabase.from('visits').select('*').order('created_at', { ascending: false }).limit(50);
  let allClicksQuery = supabase.from('ad_clicks').select('*').order('created_at', { ascending: false });
  let allVisitsQuery = supabase.from('visits').select('*');

  if (filterStart && filterEnd) {
    totalVisitsQuery = totalVisitsQuery.gte('created_at', filterStart).lt('created_at', filterEnd);
    totalClicksQuery = totalClicksQuery.gte('created_at', filterStart).lt('created_at', filterEnd);
    totalReviewsQuery = totalReviewsQuery.gte('created_at', filterStart).lt('created_at', filterEnd);
    recentVisitsQuery = recentVisitsQuery.gte('created_at', filterStart).lt('created_at', filterEnd);
    allClicksQuery = allClicksQuery.gte('created_at', filterStart).lt('created_at', filterEnd);
    allVisitsQuery = allVisitsQuery.gte('created_at', filterStart).lt('created_at', filterEnd);
  }

  const [
    { count: totalVisits },
    { count: todayVisits },
    { count: totalClicks },
    { count: totalReviews },
    { count: activeUsers },
    { data: topSearches },
    { data: recentVisits },
    { data: allClicks },
    { data: allVisits },
    { data: weekVisits },
  ] = await Promise.all([
    totalVisitsQuery,
    supabase.from('visits').select('*', { count: 'exact', head: true }).gte('created_at', todayStart.toISOString()),
    totalClicksQuery,
    totalReviewsQuery,
    supabase.from('visits').select('*', { count: 'exact', head: true }).gte('created_at', fiveMinsAgo.toISOString()),
    supabase.from('searches').select('*').order('count', { ascending: false }).limit(10),
    recentVisitsQuery,
    allClicksQuery,
    allVisitsQuery,
    supabase.from('visits').select('created_at').gte('created_at', sevenDaysAgo.toISOString()),
  ]);

  // ── Link clicks ───────────────────────────────────────────────────────────
  const clicksByLabelMap = {};
  (allClicks || []).forEach(c => {
    if (!clicksByLabelMap[c.label]) clicksByLabelMap[c.label] = { _id: c.label, count: 0, url: c.url };
    clicksByLabelMap[c.label].count++;
  });
  const clicksByLabel = Object.values(clicksByLabelMap).sort((a, b) => b.count - a.count).slice(0, 10);

  // ── Visits by page ────────────────────────────────────────────────────────
  const visitsByPageMap = {};
  (allVisits || []).forEach(v => {
    const p = v.page || '/';
    if (!visitsByPageMap[p]) visitsByPageMap[p] = { _id: p, count: 0 };
    visitsByPageMap[p].count++;
  });
  const visitsByPage = Object.values(visitsByPageMap).sort((a, b) => b.count - a.count);

  // ── Traffic sources ───────────────────────────────────────────────────────
  const visitsBySourceMap = {};
  (allVisits || []).forEach(v => {
    const src = resolveSource(v.source, v.referrer, v.useragent);
    visitsBySourceMap[src] = (visitsBySourceMap[src] || 0) + 1;
  });
  const visitsBySource = Object.entries(visitsBySourceMap)
    .map(([source, count]) => ({ source, count }))
    .sort((a, b) => b.count - a.count);

  // ── AI traffic ────────────────────────────────────────────────────────────
  const aiVisits = visitsBySource.filter(v => AI_SOURCE_SET.has(v.source));

  // ── Visits per day (last 7) ───────────────────────────────────────────────
  const visitsPerDayMap = {};
  (weekVisits || []).forEach(v => {
    const d = v.created_at.split('T')[0];
    if (!visitsPerDayMap[d]) visitsPerDayMap[d] = { _id: d, count: 0 };
    visitsPerDayMap[d].count++;
  });
  const visitsPerDay = Object.values(visitsPerDayMap).sort((a, b) => a._id.localeCompare(b._id));

  // ── Country breakdown ─────────────────────────────────────────────────────
  const countryMap = {};
  (recentVisits || []).forEach(v => {
    const c = v.country || '';
    if (!c) return;
    countryMap[c] = (countryMap[c] || 0) + 1;
  });

  // Also count from allVisits if they have country
  (allVisits || []).forEach(v => {
    if (v.country) {
      countryMap[v.country] = (countryMap[v.country] || 0) + 1;
    }
  });

  const visitsByCountry = Object.entries(countryMap)
    .map(([country, count]) => ({ country, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 15);

  // ── Recent visits ─────────────────────────────────────────────────────────
  const mappedRecentVisits = (recentVisits || []).map(v => ({
    ...v,
    createdAt: v.created_at,
  }));

  return NextResponse.json({
    totalVisits:    totalVisits    || 0,
    todayVisits:    todayVisits    || 0,
    totalClicks:    totalClicks    || 0,
    totalReviews:   totalReviews   || 0,
    activeUsers:    activeUsers    || 0,
    topSearches:    topSearches    || [],
    recentVisits:   mappedRecentVisits,
    clicksByLabel,
    visitsByPage,
    visitsBySource,
    aiVisits,
    visitsPerDay,
    visitsByCountry,
  });
}
