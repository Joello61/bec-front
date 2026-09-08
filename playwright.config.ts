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
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://127.0.0.1:8000',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
