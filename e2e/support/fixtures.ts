import { expect, type Page, test as base } from '@playwright/test';

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

/**
 * User.isProfileComplete() (backend, src/Entity/User.php) exige emailVerifie +
 * telephoneVerifie + telephone + une adresse valide - sans profil complet, la
 * creation de voyage/demande/avis/message reste bloquee cote UI ("Profil incomplet").
 * SMS_VERIFICATION_ENABLED=false dans cet environnement : UserController::completeProfile
 * auto-verifie le telephone (skip SMS), sur le meme modele que EMAIL_VERIFICATION_ENABLED.
 */
export async function completeProfile(page: Page): Promise<void> {
  const response = await page.request.post('/api/users/me/complete-profile', {
    data: {
      telephone: `+2376${Math.floor(10000000 + Math.random() * 89999999)}`,
      pays: 'Cameroun',
      ville: 'Douala',
      quartier: 'Akwa',
    },
  });
  expect(response.ok(), `Echec completion profil API: ${response.status()}`).toBeTruthy();
}

/**
 * Connecte le compte admin fixe seede une fois via `app:user:promote-admin`
 * (bec-infra/README.md) - jamais recree par cette fixture, contrairement a
 * registerAndLogin/makeTestUser : promouvoir un utilisateur en ROLE_ADMIN n'a pas
 * d'equivalent en self-service (l'API l'exige deja), et re-executer la commande a chaque
 * lancement de la suite consommerait inutilement le quota d'inscription pour rien (le
 * compte existe deja). Email/mot de passe lus depuis E2E_ADMIN_EMAIL/E2E_ADMIN_PASSWORD
 * (.env.e2e.local, charge par playwright.config.ts) - pas de defaut code en dur pour le
 * mot de passe, echec explicite si absent plutot qu'un compte devine.
 */
async function loginAsAdmin(page: Page): Promise<void> {
  const email = process.env.E2E_ADMIN_EMAIL;
  const password = process.env.E2E_ADMIN_PASSWORD;

  if (!email || !password) {
    throw new Error(
      'E2E_ADMIN_EMAIL/E2E_ADMIN_PASSWORD manquants - voir bec-infra/README.md ' +
        '("Creer le premier administrateur") puis renseigner bec-frontend/.env.e2e.local.'
    );
  }

  const loginResponse = await page.request.post('/api/login', {
    data: { email, password },
  });
  expect(loginResponse.ok(), `Echec connexion admin E2E: ${loginResponse.status()}`).toBeTruthy();
}

export const test = base.extend<{ testUser: TestUser; authenticatedPage: Page; adminPage: Page }>({
  testUser: async ({}, use) => {
    await use(makeTestUser());
  },
  authenticatedPage: async ({ page, testUser }, use) => {
    await registerAndLogin(page, testUser);
    await completeProfile(page);
    await use(page);
  },
  adminPage: async ({ page }, use) => {
    await loginAsAdmin(page);
    await use(page);
  },
});

export { expect };
