import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://cobage.com';

  return {
    rules: [
      {
        userAgent: '*',
        allow: [
          '/',
          '/about',
          '/how-it-works',
          '/faq',
          '/contact',
          '/legal/terms',
          '/legal/privacy',
          '/legal/trust-safety',
          '/auth/login',
          '/auth/register',
        ],
        disallow: [
          '/dashboard/*',        // Toutes les pages dashboard (privées)
          '/admin/*',            // Toutes les pages admin
          '/api/*',              // Routes API
          '/auth/forgot-password',
          '/auth/reset-password',
          '/auth/verify-email',
          '/auth/oauth-callback',
          '/_next/*',            // Next.js internal files
          '/static/*',           // Static files
        ],
        crawlDelay: 0, // Pas de délai pour les crawlers
      },
      // Configuration spécifique pour Googlebot (optimal)
      {
        userAgent: 'Googlebot',
        allow: [
          '/',
          '/about',
          '/how-it-works',
          '/faq',
          '/contact',
          '/legal/*',
        ],
        disallow: [
          '/dashboard/*',
          '/admin/*',
          '/api/*',
          '/auth/forgot-password',
          '/auth/reset-password',
          '/auth/verify-email',
          '/auth/oauth-callback',
        ],
        crawlDelay: 0,
      },
      // Bloquer complètement les mauvais bots
      {
        userAgent: [
          'GPTBot',           // OpenAI
          'ChatGPT-User',     // ChatGPT
          'Google-Extended',  // Bard
          'CCBot',            // Common Crawl
          'anthropic-ai',     // Claude
          'PerplexityBot',    // Perplexity
        ],
        disallow: ['/'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}