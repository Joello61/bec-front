import { defineConfig, devices } from '@playwright/test';

/**
 * La stack bec-infra (docker compose : nginx + frontend en `next dev` + backend + postgres)
 * doit deja tourner avant de lancer ces tests (`docker compose up -d` depuis bec-infra) - pas
 * de `webServer` ici, ces tests visent le vrai backend Symfony via le pont nginx, pas un serveur
 * de dev isole. `npm run build` est actuellement casse par un bug amont Next.js 16.x (voir
 * bec-docs/docs/plan-correction/plan-correction-cobage.md, Phase 7b-A) : ces tests ciblent donc
 * le serveur `next dev` deja lance par bec-infra, jamais un build de production.
 */
export default defineConfig({
  testDir: './e2e',
  // Un seul serveur `next dev` partage (bec-infra), pas une instance par worker : plusieurs
  // tests en parallele declenchant chacun une compilation Turbopack a la demande sur une
  // route jamais visitee se font concurrence sur le meme processus et amplifient la lenteur
  // du premier acces (constate en session : echecs intermittents de timeout disparus une
  // fois la parallelisation retiree). Un seul worker, quitte a etre plus lent.
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  // Au-dela du defaut (30s) : un premier acces a une route non encore compilee sous
  // `next dev`/Turbopack peut a lui seul prendre 10+ secondes (constate en session,
  // cf. Phase 7b-A) - un scenario qui traverse plusieurs routes jamais visitees peut
  // legitimement depasser 30s au total sans qu'il s'agisse d'une regression.
  timeout: 60000,
  reporter: 'html',
  use: {
    // "localhost", pas "127.0.0.1" : bec-backend/.env fixe JWT_COOKIE_DOMAIN=localhost
    // (choix backend delibere, hors perimetre de cette phase) - un cookie pose pour le
    // domaine "localhost" n'est jamais envoye a "127.0.0.1", meme si les deux resolvent
    // vers la meme boucle locale (constate : /api/me repond 403 juste apres un login 200
    // reussi lorsqu'on accede au pont nginx via 127.0.0.1).
    baseURL: 'http://localhost:8000',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
