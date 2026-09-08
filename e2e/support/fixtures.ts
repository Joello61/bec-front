import { test as base, expect, type Page } from '@playwright/test';

export interface TestUser {
  nom: string;
  prenom: string;
  email: string;
  password: string;
}

/**
 * Cree un utilisateur de test unique (email horodate/aleatoire) directement via
 * l'API reelle (pas via l'UI) pour isoler les tests entre eux - jamais de fixture
 * partagee mutable. EMAIL_VERIFICATION_ENABLED=false dans cet environnement : le
 * compte est immediatement utilisable apres l'inscription (pas de verification email
 * a simuler ici).
 */
export function makeTestUser(): TestUser {
  const unique = `${Date.now()}-${Math.floor(Math.random() * 100000)}`;
  return {
    nom: 'E2E',
    prenom: `Test${unique}`,
    email: `e2e-${unique}@example.com`,
    password: 'Password1',
  };
}

/**
 * Enregistre puis connecte l'utilisateur via l'API reelle, en reutilisant le
 * contexte de requete de la page (page.request) pour que les cookies d'auth
 * poses par le backend soient partages avec la navigation UI qui suit - c'est le
 * pattern officiel Playwright pour "s'authentifier via l'API, continuer via l'UI".
 */
export async function registerAndLogin(page: Page, user: TestUser): Promise<void> {
  const registerResponse = await page.request.post('/api/register', {
    data: { nom: user.nom, prenom: user.prenom, email: user.email, password: user.password },
  });
  expect(registerResponse.ok(), `Echec inscription API: ${registerResponse.status()}`).toBeTruthy();

  const loginResponse = await page.request.post('/api/login', {
    data: { email: user.email, password: user.password },
  });
  expect(loginResponse.ok(), `Echec connexion API: ${loginResponse.status()}`).toBeTruthy();
}

export const test = base.extend<{ testUser: TestUser; authenticatedPage: Page }>({
  testUser: async ({}, use) => {
    await use(makeTestUser());
  },
  authenticatedPage: async ({ page, testUser }, use) => {
    await registerAndLogin(page, testUser);
    await use(page);
  },
});

export { expect };
