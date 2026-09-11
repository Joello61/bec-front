import { expect, test } from './support/fixtures';
import { gotoAndWaitReady } from './support/helpers';

/**
 * Onglets Notifications/Preferences/Securite de /dashboard/settings (Confidentialite et
 * RGPD deja couverts par profile-settings.spec.ts). Un seul champ modifie par onglet -
 * suffisant pour prouver la persistance reelle (submit -> rechargement -> valeur conservee),
 * meme patron que le test "Confidentialite" existant plutot qu'une couverture exhaustive de
 * chaque case a cocher.
 */
test.describe('Parametres du compte - Notifications, Preferences, Securite', () => {
  test('les modifications de chaque onglet persistent apres rechargement', async ({ authenticatedPage: page }) => {
    await test.step('onglet Notifications', async () => {
      await gotoAndWaitReady(page, '/dashboard/settings');
      await page.locator('nav').getByRole('button', { name: 'Notifications' }).click();

      const avisCheckbox = page.getByRole('checkbox', { name: 'Nouveaux avis' });
      const wasChecked = await avisCheckbox.isChecked();
      await avisCheckbox.click();
      await page.getByRole('button', { name: 'Enregistrer les modifications' }).click();
      await expect(page.getByText('Paramètres mis à jour avec succès')).toBeVisible({ timeout: 10000 });

      await gotoAndWaitReady(page, '/dashboard/settings');
      await page.locator('nav').getByRole('button', { name: 'Notifications' }).click();
      await expect(page.getByRole('checkbox', { name: 'Nouveaux avis' })).toHaveJSProperty('checked', !wasChecked);
    });

    await test.step('onglet Preferences (format de date)', async () => {
      await gotoAndWaitReady(page, '/dashboard/settings');
      await page.locator('nav').getByRole('button', { name: 'Préférences' }).click();

      // Bug backend constate en ecrivant ce test (hors perimetre de ce lot, a signaler
      // separement) : AddressService::updateAddress (bec-backend) ecrit la valeur BRUTE
      // de Country.languages ("en-CM,fr-CM" pour le Cameroun - GeoNames, plusieurs locales
      // separees par des virgules) dans UserSettings.langue des la completion du profil
      // (completeProfile, cf. fixtures.ts), au lieu de la normaliser vers 'fr'/'en'. Le
      // schema zod du formulaire (preferencesSettingsSchema, enum ['fr','en']) rejette
      // cette valeur et bloque alors la sauvegarde de CE FORMULAIRE ENTIER (pas seulement
      // le champ langue) - reproductible pour tout utilisateur dont le pays a plusieurs
      // langues officielles, pas seulement en E2E. Choisir "Français" explicitement avant
      // de toucher le reste du formulaire, comme devrait le faire un utilisateur reel
      // bloque par ce bug.
      await page.getByLabel("Langue de l'interface").click();
      await page.getByRole('button', { name: 'Français' }).click();

      // Deuxieme bug backend constate ici (a signaler separement) : UpdateSettingsDTO
      // (bec-backend) ne declare aucune propriete "devise" - PATCH /api/settings ignore
      // donc silencieusement ce champ, bien que PreferencesSettingsForm le collecte et le
      // soumette. Le selecteur de devise ne persiste jamais rien en pratique. On verifie
      // ici la persistance sur "Format de date", correctement gere par
      // SettingsService::updateSettings (dateFormat), pas sur la devise.
      await page.getByLabel('Format de date').click();
      await page.getByRole('button', { name: 'AAAA-MM-JJ (2025-12-31)' }).click();
      await page.getByRole('button', { name: 'Enregistrer les modifications' }).click();
      await expect(page.getByText('Paramètres mis à jour avec succès')).toBeVisible({ timeout: 10000 });

      await gotoAndWaitReady(page, '/dashboard/settings');
      await page.locator('nav').getByRole('button', { name: 'Préférences' }).click();
      await expect(page.getByLabel('Format de date')).toHaveText(/AAAA-MM-JJ/);
    });

    await test.step('onglet Securite', async () => {
      await gotoAndWaitReady(page, '/dashboard/settings');
      await page.locator('nav').getByRole('button', { name: 'Sécurité' }).click();

      const loginNotifCheckbox = page.getByRole('checkbox', { name: /Notifications de connexion/ });
      const wasChecked = await loginNotifCheckbox.isChecked();
      await loginNotifCheckbox.click();
      await page.getByRole('button', { name: 'Enregistrer les modifications' }).click();
      await expect(page.getByText('Paramètres mis à jour avec succès')).toBeVisible({ timeout: 10000 });

      await gotoAndWaitReady(page, '/dashboard/settings');
      await page.locator('nav').getByRole('button', { name: 'Sécurité' }).click();
      await expect(page.getByRole('checkbox', { name: /Notifications de connexion/ })).toHaveJSProperty(
        'checked',
        !wasChecked
      );
    });
  });
});
