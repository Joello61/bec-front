const apiOrigin = new URL(
  process.env.NEXT_PUBLIC_API_DOMAIN || 'http://localhost:8000'
).origin;
const mercureOrigin = new URL(
  process.env.NEXT_PUBLIC_MERCURE_HUB_URL || 'http://localhost:3001/.well-known/mercure'
).origin;
// Bucket Cloudflare R2 (Phase D1/D2) - remplace l'ancien sous-domaine "cobage-api"
// utilisé pour /uploads/** (obsolète : les avatars sont servis directement par R2 en
// production, plus par le backend). Fallback dev-safe si la variable n'est pas encore
// définie (aucune image R2 réelle en local, où le disque local sert déjà les avatars).
const r2PublicUrl = process.env.R2_PUBLIC_URL || 'https://example.r2.dev';
const r2Hostname = new URL(r2PublicUrl).hostname;

// next dev --turbopack (bec-infra/docker-compose.yml, service "frontend", target: dev)
// injecte ses propres scripts inline (runtime Fast Refresh/HMR, overlay d'erreurs) en plus
// du payload RSC standard (self.__next_f) que Next.js injecte aussi en production - la CSP
// ci-dessous avait ete verifiee uniquement via `npm run build && npm run start` (voir le
// commit qui l'a introduite), jamais via `next dev`. Sans 'unsafe-inline'/nonce, TOUS ces
// scripts inline sont bloques par le navigateur y compris celui qui hydrate React, d'ou des
// pages entierement blanches en developpement (constate : erreurs CSP "script-src" dans la
// console + `InvariantError: Expected a request ID... self.__next_r`, symptome classique du
// payload RSC bloque). Pas de regression en production : cette CSP ne s'applique qu'a ce
// mode (voir son usage conditionnel dans headers() ci-dessous).
const isProd = process.env.NODE_ENV === 'production';
// NODE_ENV vaut "production" pour staging ET production (même cible Docker "prod",
// Dockerfile) - jamais utilisable pour distinguer les deux. NEXT_PUBLIC_ENV, injecté
// différemment par bec-frontend/.github/workflows/deploy.yml selon l'environnement,
// est la seule variable qui les distingue réellement au moment du build.
const isRealProduction = process.env.NEXT_PUBLIC_ENV === 'production';

// Seuls tiers identifies dans le code (CookiesConsent.tsx, HomeBannerAd.tsx) : Google Analytics + AdSense.
// "'unsafe-inline'" sur script-src (constaté necessaire en production, 2026-09-10) : le
// App Router injecte ses propres scripts inline pour l'hydratation progressive (streaming
// RSC), bloques sinon (erreur React #412, hydratation cassee) - la doc officielle Next.js
// (Configuring: Content Security Policy) documente exactement ce cas : la seule alternative
// (nonce via proxy.ts) exige un rendu 100% dynamique sur tout le site, incompatible avec le
// prerendering statique deja en place ("x-nextjs-cache: HIT" constate en production).
//
// Wildcards sur *.adtrafficquality.google (constate en production, 2026-09-10 : d'abord
// ep1, puis ep2 quelques minutes plus tard - Google fait tourner ces sous-domaines de
// verification sans preavis) plutot que des sous-domaines exacts - Google documente
// explicitement (support.google.com/adsense/answer/16283098) ne PAS supporter de liste de
// domaines statique pour AdSense pour cette meme raison, et recommande une CSP stricte a
// base de nonce a la place (ecartee ici, memes raisons que pour l'hydratation ci-dessus -
// perte du rendu statique). Ce wildcard est un compromis assume : moins strict qu'une
// liste exacte, mais reste scope aux domaines Google connus, jamais un fallback "https:"
// ouvert a n'importe quelle origine.
const cspHeader = `
  default-src 'self';
  script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://*.googlesyndication.com https://*.adtrafficquality.google;
  style-src 'self' 'unsafe-inline';
  img-src 'self' data: blob: https://www.google-analytics.com https://www.googletagmanager.com https://*.googlesyndication.com https://*.g.doubleclick.net;
  font-src 'self';
  connect-src 'self' https://www.google-analytics.com https://*.googlesyndication.com https://*.adtrafficquality.google ${apiOrigin} ${mercureOrigin};
  frame-src https://googleads.g.doubleclick.net https://*.googlesyndication.com https://*.adtrafficquality.google;
  object-src 'none';
  base-uri 'self';
  form-action 'self';
  frame-ancestors 'self';
  upgrade-insecure-requests;
`.replace(/\s{2,}/g, ' ').trim();

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  reactStrictMode: true,
  poweredByHeader: false,

  // bec-infra/docker/nginx/dev.conf fait pont vers ce serveur `next dev` (conteneur
  // "frontend", port interne 3000) sous l'origine http://127.0.0.1:8000 - sans cette
  // liste, Next.js bloque par defaut toute requete cross-origin vers ses ressources de
  // dev (HMR notamment) des lors que l'origine du navigateur differe de l'hote de
  // demarrage du serveur (doc officielle Next.js, allowedDevOrigins). Constate : le
  // websocket HMR echouait silencieusement (ERR_INVALID_HTTP_RESPONSE) et l'hydratation
  // React ne se terminait jamais en passant par le pont nginx - reproductible avec
  // n'importe quelle interaction cote client (formulaires, bouton oeil mot de passe).
  allowedDevOrigins: ['127.0.0.1', 'localhost'],

  typescript: {
    ignoreBuildErrors: false,
  },

  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8000',
        pathname: '/uploads/**',
      },
      {
        protocol: 'https',
        hostname: r2Hostname,
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        pathname: '/**',
      },
    ],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 5184000,
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },

  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-DNS-Prefetch-Control', value: 'on' },
          // Codé en dur sans condition jusqu'ici (piège réel constaté le 2026-09-09) :
          // HSTS était donc déjà actif sur staging dès son premier certificat TLS valide,
          // alors que la variable "HSTS_ENABLED" censée le retarder n'était en réalité
          // lue par aucun code (ni ici, ni côté backend) - un navigateur mémorise cet
          // en-tête pour "max-age" (2 ans) dès la première visite HTTPS valide, y compris
          // sur un domaine de test. Restreint désormais à la production réelle - jamais
          // besoin d'un "flip" manuel après coup, contrairement au cadrage initial de ce
          // document (voir bec-docs/docs/deploiement/deploiement-cobage.md §14 D6).
          ...(isRealProduction
            ? [{ key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' }]
            : []),
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(self)' },
          { key: 'Cache-Control', value: 'public, max-age=3600, stale-while-revalidate=86400' },
          ...(isProd ? [{ key: 'Content-Security-Policy', value: cspHeader }] : []),
        ],
      },
      {
        source: '/images/:path*',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
      },
      {
        source: '/fonts/:path*',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
      },
      // Places apres le bloc generique /:path* : Next.js applique le dernier header
      // correspondant en cas de cle dupliquee sur un meme chemin (Cache-Control ici).
      {
        source: '/dashboard/:path*',
        headers: [{ key: 'Cache-Control', value: 'private, no-store' }],
      },
      {
        source: '/admin/:path*',
        headers: [{ key: 'Cache-Control', value: 'private, no-store' }],
      },
    ];
  },

  async redirects() {
    return [];
  },

  env: {
    NEXT_PUBLIC_APP_NAME: 'Co-Bage',
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || 'https://cobage.joeltech.fr',
  },

  reactCompiler: true,

  experimental: {
    optimizePackageImports: ['lucide-react', 'framer-motion'],
  },

  logging: {
    fetches: { fullUrl: true },
  },

  typedRoutes: true,
} satisfies import('next').NextConfig;

// @next/bundle-analyzer s'appuie sur webpack-bundle-analyzer, incompatible avec
// Turbopack (avertissement explicite du package a l'execution) - `npm run analyze`
// lance donc `next build --webpack` plutot que le build Turbopack par defaut.
import withBundleAnalyzer from '@next/bundle-analyzer';

export default withBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
})(nextConfig);
