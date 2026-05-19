import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

function isPrivateIP(ip) {
  return !ip || ip === '::1' || ip === '127.0.0.1' ||
    ip.startsWith('192.168.') || ip.startsWith('10.') || ip.startsWith('172.');
}

export async function POST(request) {
  try {
    const { page, referrer, source } = await request.json();
    const userAgent = request.headers.get('user-agent') || '';
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
               request.headers.get('x-real-ip') || '';

    // Use native Vercel/Cloudflare headers for geolocation instead of an external API
    let country = request.headers.get('x-vercel-ip-country') || request.headers.get('cf-ipcountry') || '';
    let city = request.headers.get('x-vercel-ip-city') || '';
    
    // Fallback URL decoding for Vercel city headers
    if (city) {
      try { city = decodeURIComponent(city); } catch {}
    }

    if (isPrivateIP(ip)) {
      city = 'Localhost';
      country = 'Dev';
    } else if (!country && !city && ip) {
      try {
        const geoRes = await fetch(`http://ip-api.com/json/${ip}?fields=status,city,countryCode`, { signal: AbortSignal.timeout(1500) });
        if (geoRes.ok) {
          const geo = await geoRes.json();
          if (geo.status === 'success') {
            city = geo.city || '';
            country = geo.countryCode || '';
          }
        }
      } catch (err) {
        // silently ignore external API failure
      }
    }

    // Extract search terms from Referrer
    let searchQuery = '';
    try {
      if (referrer) {
        const refUrl = new URL(referrer);
        if (refUrl.hostname.includes('google.') || refUrl.hostname.includes('bing.') || refUrl.hostname.includes('yahoo.') || refUrl.hostname.includes('duckduckgo.')) {
           searchQuery = refUrl.searchParams.get('q') || refUrl.searchParams.get('p') || '';
        }
      }
    } catch {}

    if (searchQuery && searchQuery.trim().length >= 2) {
      const q = searchQuery.toLowerCase().trim();
      // Record search query in background
      supabase.from('searches').select('count').eq('query', q).single().then(({ data }) => {
        if (data) {
          supabase.from('searches').update({ count: data.count + 1, last_searched: new Date().toISOString() }).eq('query', q);
        } else {
          supabase.from('searches').insert([{ query: q, count: 1, last_searched: new Date().toISOString() }]);
        }
      }).catch(() => {});
    }

    // We will insert what matches the `visits` table in create_analytics_tables.sql
    // If country/city/source columns don't exist yet, this insert will fail.
    // To ensure the visit is always recorded, we will omit the non-existent columns.
    const visitData = {
      page: page || '/',
      referrer: referrer || '',
      // source: source || '', // ❌ Omitted: 'source' column is missing in DB
      useragent: userAgent,
      ip: ip,
      country: country,
      city: city
    };
    
    // Attempt the insert. We log errors so they are visible in the terminal.
    const { error } = await supabase.from('visits').insert([visitData]);
    if (error) console.error("VISIT INSERT ERROR:", error);

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
