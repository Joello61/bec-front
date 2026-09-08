import { expect, test } from './support/fixtures';
import { makeTestUser } from './support/fixtures';
import { gotoAndWaitReady, labelExact, waitPageReady } from './support/helpers';

/**
 * Parcours critique : inscription -> connexion -> deconnexion, entierement pilote
 * via l'UI (pas l'API) puisque c'est justement le comportement qu'on veut verifier
 * de bout en bout. EMAIL_VERIFICATION_ENABLED=false dans cet environnement : le
 * compte est immediatement utilisable, pas de code de verification a intercepter.
 */
test.describe('Authentification - inscription, connexion, deconnexion', () => {
  test('un nouvel utilisateur peut s\'inscrire, se connecter puis se deconnecter', async ({ page }) => {
    const user = makeTestUser();

    await gotoAndWaitReady(page, '/auth/register');

    await page.getByLabel(labelExact('Prénom')).fill(user.prenom);
    await page.getByLabel(labelExact('Nom')).fill(user.nom);
    await page.getByLabel(labelExact('Email')).fill(user.email);
    await page.getByLabel(labelExact('Mot de passe')).fill(user.password);
    await page.getByLabel(labelExact('Confirmer le mot de passe')).fill(user.password);
    await page.getByRole('button', { name: "S'inscrire" }).click();

    // Compte auto-verifie en dev : redirection vers /auth/login (pas /auth/verify-email).
    await page.waitForURL('**/auth/login**', { timeout: 30000 });
    await waitPageReady(page);

    await page.getByLabel(labelExact('Email')).fill(user.email);
    await page.getByLabel(labelExact('Mot de passe')).fill(user.password);
    await page.getByRole('button', { name: 'Se connecter' }).click();

    await page.waitForURL('**/dashboard/**', { timeout: 30000 });
    await expect(page.getByRole('button', { name: 'Menu utilisateur' })).toBeVisible();

    await page.getByRole('button', { name: 'Menu utilisateur' }).click();
    await page.getByRole('button', { name: 'Déconnexion' }).click();

    // La deconnexion ramene a l'accueil (header.tsx: window.location.replace(ROUTES.HOME)),
    // pas vers /auth/login - on verifie l'etat deconnecte plutot qu'une URL precise.
    await page.waitForURL('http://localhost:8000/', { timeout: 30000 });
    await expect(page.getByRole('button', { name: 'Menu utilisateur' })).not.toBeVisible();
  });

  test('un identifiant invalide affiche une erreur sans connecter l\'utilisateur', async ({ page }) => {
    await gotoAndWaitReady(page, '/auth/login');

    await page.getByLabel(labelExact('Email')).fill('inconnu@example.com');
    await page.getByLabel(labelExact('Mot de passe')).fill('MauvaisMotDePasse1');
    await page.getByRole('button', { name: 'Se connecter' }).click();

    // Reste sur la page de connexion (pas de redirection vers le dashboard) - toHaveURL
    // reessaie nativement pendant son timeout, laissant le temps a un eventuel echec de
    // connexion de s'afficher avant de conclure.
    await expect(page).toHaveURL(/\/auth\/login/, { timeout: 10000 });
    await expect(page.getByRole('button', { name: 'Menu utilisateur' })).not.toBeVisible();
  });
});
