import { getWebInstrumentations, initializeFaro } from '@grafana/faro-web-sdk';

/**
 * Monitoring d'erreurs frontend (Partie D point 9, plan-complements-monetisation-cobage.md) -
 * Grafana Faro plutot que Sentry : reutilise le socle observabilite deja en place sur le VPS
 * (Loki/Tempo/Grafana, depot externe github.com/Joello61/infrastructure), pas un nouveau
 * vendor tiers. Convention Next.js "instrumentation-client" : execute cote navigateur avant
 * l'hydratation React, aucun export requis (docs.nextjs.org/.../instrumentation-client).
 *
 * Ne s'initialise que si NEXT_PUBLIC_FARO_URL est reellement configure - reste inactif en
 * developpement/CI sans casser la CSP ni echouer bruyamment (fail-open, meme principe que
 * les autres integrations tierces de ce projet).
 */
if (process.env.NEXT_PUBLIC_FARO_URL) {
  initializeFaro({
    url: process.env.NEXT_PUBLIC_FARO_URL,
    apiKey: process.env.NEXT_PUBLIC_FARO_API_KEY,
    app: {
      name: process.env.NEXT_PUBLIC_APP_NAME || 'cobage-frontend',
      version: process.env.npm_package_version,
      environment: process.env.NEXT_PUBLIC_ENV || 'development',
    },
    instrumentations: getWebInstrumentations(),
  });
}
