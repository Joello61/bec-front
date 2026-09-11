import { completeProfile, expect, makeTestUser, registerAndLogin, test } from './support/fixtures';
import { gotoAndWaitReady, waitPageReady } from './support/helpers';

/**
 * Lot A1 (bec-backend + bec-frontend, cette session) : page de moderation des avis,
 * jusque-la un placeholder. Avis cree via l'API (AvisService::createAvis n'exige aucun
 * lien prealable reel entre auteur et cible - constate en lisant le code, distinct du
 * garde-fou uniquement cote frontend "canLeaveReview" de VoyageDetails.tsx, a signaler
 * separement) - suffisant pour peupler la table sous test, le parcours de creation d'avis
 * bout en bout est deja couvert par proposition-lifecycle.spec.ts.
 */
test.describe('Administration - moderation des avis', () => {
  test('un admin peut consulter puis supprimer un avis', async ({ adminPage, browser }) => {
    const auteurContext = await browser.newContext();
    const auteurPage = await auteurContext.newPage();
    const auteur = makeTestUser();
    await registerAndLogin(auteurPage, auteur);
    await completeProfile(auteurPage);

    const cibleContext = await browser.newContext();
    const ciblePage = await cibleContext.newPage();
    const cible = makeTestUser();
    await registerAndLogin(ciblePage, cible);
    await completeProfile(ciblePage);

    const cibleMeResponse = await ciblePage.request.get('/api/me');
    const cibleId: number = (await cibleMeResponse.json()).id;

    const commentaire = `Avis test E2E ${Date.now()}`;
    const avisResponse = await auteurPage.request.post('/api/avis', {
      data: { cibleId, note: 2, commentaire },
    });
    expect(avisResponse.ok(), `Echec creation avis API: ${avisResponse.status()}`).toBeTruthy();

    await gotoAndWaitReady(adminPage, '/admin/moderation/avis');
    const row = adminPage.getByRole('row').filter({ hasText: commentaire });
    await expect(row).toBeVisible({ timeout: 15000 });
    await expect(row).toContainText(auteur.prenom);
    await expect(row).toContainText(cible.prenom);

    await row.getByRole('button', { name: 'Supprimer' }).click();

    const dialog = adminPage.getByRole('dialog');
    await expect(dialog.getByText("Supprimer l'avis")).toBeVisible();
    await dialog.getByPlaceholder('Expliquez en détail la raison de la suppression...').fill(
      'Avis supprime dans le cadre du test E2E de moderation'
    );
    await dialog.getByRole('button', { name: 'Supprimer le contenu' }).click();
    await waitPageReady(adminPage);

    await expect(adminPage.getByRole('row').filter({ hasText: commentaire })).not.toBeVisible();

    await gotoAndWaitReady(adminPage, '/admin/logs');
    await expect(adminPage.getByText('Suppression avis').first()).toBeVisible({ timeout: 15000 });

    await auteurContext.close();
    await cibleContext.close();
  });
});
