import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  // ── Admin auth ──────────────────────────────────────────────────────────────
  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    const token = request.cookies.get('admin_token')?.value;
    if (!token) return NextResponse.redirect(new URL('/admin/login', request.url));
    try {
      const secret = new TextEncoder().encode(process.env.JWT_SECRET);
      await jwtVerify(token, secret);
    } catch {
      const res = NextResponse.redirect(new URL('/admin/login', request.url));
      res.cookies.delete('admin_token');
      return res;
    }
    return NextResponse.next();
  }

  // ── Coming soon gate ─────────────────────────────────────────────────────────
  // Skip: /coming-soon itself, /api/*, /_next/*, static files, and ALL bots/crawlers
  const ua = (request.headers.get('user-agent') || '').toLowerCase();
  const isBot =
    /bot|crawl|spider|slurp|googlebot|bingbot|yandex|baidu|duckduck|facebookexternalhit|twitterbot|linkedinbot|embedly|quora|pinterest|redditbot|applebot|gptbot|chatgpt-user|google-extended|anthropic|claudebot|perplexitybot|bytespider|ccbot|cohere-ai|ia_archiver|semrush|ahrefsbot|dotbot|rogerbot|seznambot|sogou|exabot|petalbot|mj12bot/i.test(ua);

  const skip =
    isBot ||
    pathname === '/coming-soon' ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    pathname.includes('.');

  if (!skip) {
    // Check bypass cookie first (avoids hitting DB on every request)
    const bypass = request.cookies.get('cs_bypass')?.value;
    const csPass = process.env.COMING_SOON_PASSWORD;
    if (!csPass || bypass !== csPass) {
      // Hit Supabase REST directly (edge-compatible, no SDK needed)
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/settings?key=eq.coming_soon&select=value`,
          {
            headers: {
              apikey: process.env.SUPABASE_SERVICE_ROLE_KEY,
              Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
            },
            cache: 'no-store',
          }
        );
        const [row] = await res.json();
        if (row?.value === true) {
          return NextResponse.redirect(new URL('/coming-soon', request.url));
        }
      } catch {
        // If Supabase unreachable, don't block the site
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.jpg$|.*\\.svg$|.*\\.ico$).*)'],
};
