'use client';
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function TrackVisit() {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname?.startsWith('/admin')) return;

    const source = new URLSearchParams(window.location.search).get('source') || '';

    fetch('/api/analytics/visit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ page: pathname, referrer: document.referrer || '', source }),
    }).catch(() => {});

    // Track search query from URL params (utm_term, q, search, etc.)
    const params = new URLSearchParams(window.location.search);
    const query =
      params.get('utm_term') || params.get('q') || params.get('query') || params.get('search');
    if (query && query.trim().length >= 2) {
      fetch('/api/analytics/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: query.trim() }),
      }).catch(() => {});
    }

    // Live Users Ping Logic
    if (typeof window !== 'undefined') {
      if (!window.sessionTrackingId) {
        window.sessionTrackingId = crypto.randomUUID();
      }
      
      const ping = () => {
        fetch('/api/analytics/ping', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sessionId: window.sessionTrackingId, page: pathname }),
          keepalive: true
        }).catch(() => {});
      };
      
      ping(); // Initial ping
      const interval = setInterval(ping, 30000); // Ping every 30 seconds to save DB usage
      
      const cleanup = () => {
        fetch('/api/analytics/ping-leave', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sessionId: window.sessionTrackingId }),
          keepalive: true
        }).catch(() => {});
      };
      
      window.addEventListener('beforeunload', cleanup);
      return () => {
        clearInterval(interval);
        window.removeEventListener('beforeunload', cleanup);
        // We don't call cleanup() here because it's just a route change, 
        // the session is still active, it just changed pages. 
        // The new pathname will trigger a new useEffect and ping immediately.
      };
    }
  }, [pathname]);

  return null;
}
