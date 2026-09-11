import { completeProfile, expect, makeTestUser, registerAndLogin, test } from './support/fixtures';
import { fetchLatestEmailLink, gotoAndWaitReady, labelExact, waitPageReady } from './support/helpers';

/**
 * Parcours complet mot de passe oublie -> reinitialisation, bout en bout via Mailpit
 * (capture reelle des emails de dev, bec-infra/docker-compose.override.yml) plutot qu'un
 * token lu directement en base - c'est justement le comportement email qu'on veut
 * verifier, reproductible en CI puisque le meme conteneur Mailpit y tourne (decision actee
 * avec l'utilisateur). Lien extrait de EmailService::getPasswordResetEmailContent
 * (src/Service/EmailService.php, bec-backend) : "{FRONTEND_URL}/auth/reset-password?token=...".
 */
test.describe('Mot de passe oublie', () => {
  test('un utilisateur peut reinitialiser son mot de passe via le lien recu par email', async ({ page }) => {
    const user = makeTestUser();
    const newPassword = 'NouveauPassword1';

    // Profil complet des l'inscription (login-client.tsx redirige un profil incomplet
    // vers /auth/complete-profile plutot que /dashboard/** apres connexion) - hors
    // perimetre de ce scenario, qui verifie le seul flux mot de passe oublie -> reset.
    await registerAndLogin(page, user);
    await completeProfile(page);
    // Le flux mot de passe oublie est teste comme un utilisateur deconnecte (cas reel :
    // on ne l'utilise que quand on n'arrive plus a se connecter) - le cookie pose par
    // registerAndLogin ci-dessus n'a servi qu'a completer le profil.
    await page.context().clearCookies();

    await gotoAndWaitReady(page, '/auth/forgot-password');
    await page.getByLabel(labelExact('Email')).fill(user.email);
    await page.getByRole('button', { name: 'Envoyer le lien' }).click();

    await expect(page.getByRole('heading', { name: 'Email envoyé !' })).toBeVisible({ timeout: 15000 });

    const resetLink = await fetchLatestEmailLink(
      page.request,
      user.email,
      /https?:\/\/[^\s"'<]+\/auth\/reset-password\?token=[^\s"'<]+/
    );
    const token = new URL(resetLink).searchParams.get('token');
    expect(token).toBeTruthy();

    await gotoAndWaitReady(page, `/auth/reset-password?token=${token}`);
    await page.getByLabel(labelExact('Nouveau mot de passe')).fill(newPassword);
    await page.getByLabel(labelExact('Confirmer le mot de passe')).fill(newPassword);
    await page.getByRole('button', { name: 'Réinitialiser le mot de passe' }).click();

    await expect(page.getByRole('heading', { name: 'Mot de passe réinitialisé !' })).toBeVisible({
      timeout: 15000,
    });
    await page.waitForURL('**/auth/login**', { timeout: 10000 });
    await waitPageReady(page);

    // L'ancien mot de passe ne doit plus fonctionner. Depuis le correctif de l'intercepteur
    // axios (src/lib/api/client.ts, Phase 13/Lot F1 du plan de correction) : /login est
    // exclu de la logique refresh+reload sur 401 - un mauvais mot de passe affiche desormais
    // une erreur inline (toast), sans rechargement complet de page. Meme patron de
    // verification que e2e/auth.spec.ts ("un identifiant invalide affiche une erreur sans
    // connecter l'utilisateur") : toHaveURL reessaie nativement pendant son timeout, pas
    // besoin d'attendre un evenement "load" qui ne se produit plus.
    await page.getByLabel(labelExact('Email')).fill(user.email);
    await page.getByLabel(labelExact('Mot de passe')).fill(user.password);
    await page.getByRole('button', { name: 'Se connecter' }).click();
    await expect(page).toHaveURL(/\/auth\/login/, { timeout: 10000 });
    await expect(page.getByRole('button', { name: 'Menu utilisateur' })).not.toBeVisible();

    // Le nouveau mot de passe fonctionne.
    await page.getByLabel(labelExact('Email')).fill(user.email);
    await page.getByLabel(labelExact('Mot de passe')).fill(newPassword);
    await page.getByRole('button', { name: 'Se connecter' }).click();
    await page.waitForURL('**/dashboard/**', { timeout: 30000 });
    await expect(page.getByRole('button', { name: 'Menu utilisateur' })).toBeVisible();
  });

  test('un lien de reinitialisation invalide affiche un message explicite', async ({ page }) => {
    await gotoAndWaitReady(page, '/auth/reset-password?token=token-invalide-e2e');

    const newPassword = 'AutrePassword1';
    await page.getByLabel(labelExact('Nouveau mot de passe')).fill(newPassword);
    await page.getByLabel(labelExact('Confirmer le mot de passe')).fill(newPassword);
    await page.getByRole('button', { name: 'Réinitialiser le mot de passe' }).click();

    await expect(page.getByRole('heading', { name: 'Lien invalide ou expiré' })).toBeVisible({ timeout: 15000 });
  });
});
