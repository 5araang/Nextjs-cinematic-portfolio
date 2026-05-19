export default function robots() {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/api/admin", "/coming-soon"],
      },
      // ── Explicitly allow all major AI / LLM crawlers ──
      { userAgent: "GPTBot",        allow: "/" },
      { userAgent: "ChatGPT-User",  allow: "/" },
      { userAgent: "Google-Extended",allow: "/" },
      { userAgent: "Googlebot",     allow: "/" },
      { userAgent: "Bingbot",       allow: "/" },
      { userAgent: "Anthropic-ai",  allow: "/" },
      { userAgent: "ClaudeBot",     allow: "/" },
      { userAgent: "PerplexityBot", allow: "/" },
      { userAgent: "Bytespider",    allow: "/" },
      { userAgent: "CCBot",         allow: "/" },
      { userAgent: "FacebookBot",    allow: "/" },
      { userAgent: "Twitterbot",    allow: "/" },
      { userAgent: "LinkedInBot",   allow: "/" },
      { userAgent: "OAI-SearchBot", allow: "/" },
      { userAgent: "cohere-ai",     allow: "/" },
      { userAgent: "Diffbot",       allow: "/" },
      { userAgent: "Applebot",      allow: "/" },
      { userAgent: "Meta-ExternalAgent", allow: "/" },
      { userAgent: "Grok",          allow: "/" },
      { userAgent: "iaskspider",    allow: "/" },
      { userAgent: "YouBot",        allow: "/" },
    ],
    sitemap: "https://sarang-space.site/sitemap.xml",
  };
}
