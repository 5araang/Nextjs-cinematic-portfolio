/**
 * Call this on any CTA/link click you want to track in the admin analytics.
 * Example: onClick={() => trackClick('hire-me-btn', 'mailto:...', '/home')}
 */
export function trackClick(label, url = '', page = '') {
  fetch('/api/analytics/click', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      label,
      url: url || '',
      page: page || (typeof window !== 'undefined' ? window.location.pathname : ''),
    }),
  }).catch(() => {});
}
