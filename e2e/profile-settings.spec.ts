import { expect, test } from './support/fixtures';
import { gotoAndWaitReady, labelExact, waitPageReady } from './support/helpers';

/**
 * Parcours complementaire Phase 7b-B : profil, mot de passe, confidentialite, suppression
 * de compte. Un seul compte enregistre, reutilise du debut a la fin via test.step() (comme
 * reservation-lifecycle.spec.ts) - la suppression de compte est forcement le dernier step,
 * elle detruit le compte utilise par tous les steps precedents.
 */
test.describe('Profil, parametres et suppression de compte', () => {
  test('un utilisateur peut modifier son profil, son mot de passe, sa confidentialite puis supprimer son compte', async ({
    authenticatedPage: page,
    testUser,
  }) => {
    await test.step('modifier les informations du profil (bio)', async () => {
      await gotoAndWaitReady(page, '/dashboard/profile');
      await page.getByRole('button', { name: 'Modifier' }).click();

      const bio = `Bio de test ${Date.now()}`;
      await page.getByLabel('Bio').fill(bio);
      await page.getByRole('button', { name: 'Enregistrer' }).click();

      // Retour automatique en mode lecture (ProfileInfoCard) apres succes.
      await expect(page.getByText(bio)).toBeVisible({ timeout: 10000 });
    });

    await test.step("uploader un avatar", async () => {
      await page.getByRole('button', { name: 'Modifier' }).click();

      const fileInput = page.locator('input[type="file"]');
      await fileInput.setInputFiles('e2e/support/fixtures/avatar.png');

      // AvatarUploadField affiche un bouton de suppression uniquement une fois un
      // avatar existant present (currentAvatar) et aucun nouveau fichier en attente -
      // ici on vient de selectionner un fichier, on verifie plutot l'aperçu (alt de
      // l'image de previsualisation genere par InputFile) avant de soumettre.
      await expect(page.getByRole('img').first()).toBeVisible({ timeout: 5000 });

      await page.getByRole('button', { name: 'Enregistrer' }).click();
      await waitPageReady(page);
    });

    await test.step('changer le mot de passe puis se reconnecter avec le nouveau', async () => {
      await gotoAndWaitReady(page, '/dashboard/profile/change-password');

      const newPassword = 'NouveauPass2';
      await page.getByLabel(labelExact('Mot de passe actuel')).fill(testUser.password);
      await page.getByLabel(labelExact('Nouveau mot de passe')).fill(newPassword);
      await page.getByLabel(labelExact('Confirmer le nouveau mot de passe')).fill(newPassword);
      await page.getByRole('button', { name: 'Changer le mot de passe' }).click();

      await page.waitForURL('**/dashboard/profile**', { timeout: 15000 });

      // Deconnexion puis reconnexion avec le NOUVEAU mot de passe - verifie le changement
      // reel, pas seulement le toast de succes.
      await page.getByRole('button', { name: 'Menu utilisateur' }).click();
      await page.getByRole('button', { name: 'Déconnexion' }).click();
      await page.waitForURL('http://localhost:8000/', { timeout: 30000 });

      await gotoAndWaitReady(page, '/auth/login');
      await page.getByLabel(labelExact('Email')).fill(testUser.email);
      await page.getByLabel(labelExact('Mot de passe')).fill(newPassword);
      await page.getByRole('button', { name: 'Se connecter' }).click();
      await page.waitForURL('**/dashboard/**', { timeout: 30000 });
      await expect(page.getByRole('button', { name: 'Menu utilisateur' })).toBeVisible();

      // Mis a jour pour le reste du test (suppression de compte au step suivant).
      testUser.password = newPassword;
    });

    await test.step('modifier un parametre de confidentialite et verifier sa persistance', async () => {
      await gotoAndWaitReady(page, '/dashboard/settings');
      await page.getByRole('button', { name: 'Confidentialité' }).click();

      const showPhoneCheckbox = page.getByRole('checkbox', { name: /Afficher mon téléphone/ });
      const wasChecked = await showPhoneCheckbox.isChecked();
      await showPhoneCheckbox.click();
      await page.getByRole('button', { name: 'Enregistrer les modifications' }).click();
      await expect(page.getByText('Paramètres mis à jour avec succès')).toBeVisible({ timeout: 10000 });

      await gotoAndWaitReady(page, '/dashboard/settings');
      await page.getByRole('button', { name: 'Confidentialité' }).click();
      await expect(page.getByRole('checkbox', { name: /Afficher mon téléphone/ })).toHaveJSProperty(
        'checked',
        !wasChecked
      );
    });

    await test.step('supprimer le compte (dernier step)', async () => {
      await gotoAndWaitReady(page, '/dashboard/settings');
      await page.getByRole('button', { name: 'RGPD' }).click();
      await page.getByRole('button', { name: 'Supprimer mon compte' }).click();

      const dialog = page.getByRole('dialog');
      await dialog.getByLabel(labelExact('Mot de passe actuel')).fill(testUser.password);
      await dialog.getByPlaceholder('Tapez ici pour confirmer').fill('SUPPRIMER');
      await dialog.getByRole('button', { name: 'Supprimer mon compte' }).click();

      await page.waitForURL('http://localhost:8000/', { timeout: 30000 });

      // Reconnexion avec les (anciens, desormais seuls valides puisque le mot de passe a
      // change au step precedent) identifiants doit maintenant echouer (compte anonymise/
      // soft-delete, Phase 5) - ferme la boucle avec ce travail plutot que de s'arreter au
      // seul comportement UI.
      const loginResponse = await page.request.post('/api/login', {
        data: { email: testUser.email, password: testUser.password },
      });
      expect(loginResponse.ok()).toBeFalsy();
    });
  });

  // Ajout leger (pas de nouveau fichier, plan Lot B) : DashboardStatsCard.tsx n'a jusque-la
  // aucune couverture E2E - /dashboard (distinct de /dashboard/explore, destination du
  // login) est la seule page qui la monte.
  test('la page /dashboard affiche la carte de statistiques utilisateur', async ({ authenticatedPage: page }) => {
    await gotoAndWaitReady(page, '/dashboard');
    await expect(page.getByRole('heading', { name: 'Mes Statistiques' })).toBeVisible({ timeout: 10000 });
  });
});
