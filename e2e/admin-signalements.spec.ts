import { completeProfile, expect, makeTestUser, registerAndLogin, test } from './support/fixtures';
import { gotoAndWaitReady, isoDateInDays, waitPageReady } from './support/helpers';

/**
 * Lot A2 (bec-frontend, cette session) : page de moderation des signalements, jusque-la
 * un lien mort ("admin/moderation/messages"). Backend deja complet (SignalementController),
 * signalement cree via l'API (support) - le parcours de creation est hors perimetre ici.
 *
 * Note constatee en ecrivant ce test (pas corrigee, a signaler separement) : contrairement
 * a ban/unban/update_roles/delete_*, traiter un signalement (SignalementController::process)
 * n'ecrit aucune entree AdminLog - 'approve_signalement'/'reject_signalement' n'existent
 * que comme libelles morts dans AdminLog::getActionLabel (jamais atteints, aucun appel a
 * ce code trouve ailleurs dans bec-backend). Rien a verifier sur /admin/logs pour cette
 * action, contrairement aux autres tests de ce fichier de suite.
 */
test.describe('Administration - moderation des signalements', () => {
  test('un admin peut traiter (rejeter) un signalement', async ({ adminPage, browser }) => {
    const signaleurContext = await browser.newContext();
    const signaleurPage = await signaleurContext.newPage();
    const signaleur = makeTestUser();
    await registerAndLogin(signaleurPage, signaleur);
    await completeProfile(signaleurPage);

    const cibleContext = await browser.newContext();
    const ciblePage = await cibleContext.newPage();
    const cible = makeTestUser();
    await registerAndLogin(ciblePage, cible);
    await completeProfile(ciblePage);

    const voyageResponse = await ciblePage.request.post('/api/voyages', {
      data: {
        villeDepart: 'Douala',
        villeArrivee: 'Berlin',
        dateDepart: isoDateInDays(12),
        dateArrivee: isoDateInDays(13),
        poidsDisponible: 6,
      },
    });
    expect(voyageResponse.ok(), `Echec creation voyage API: ${voyageResponse.status()}`).toBeTruthy();
    const { id: voyageId } = await voyageResponse.json();

    const description = `Signalement test E2E ${Date.now()} - annonce suspecte.`;
    const signalementResponse = await signaleurPage.request.post('/api/signalements', {
      data: { voyageId, motif: 'spam', description },
    });
    expect(signalementResponse.ok(), `Echec creation signalement API: ${signalementResponse.status()}`).toBeTruthy();

    await gotoAndWaitReady(adminPage, '/admin/moderation/signalements');
    const row = adminPage.getByRole('row').filter({ hasText: signaleur.prenom });
    await expect(row).toBeVisible({ timeout: 15000 });
    await expect(row).toContainText('En attente');

    await row.getByRole('button', { name: 'Traiter' }).click();

    const dialog = adminPage.getByRole('dialog');
    await expect(dialog.getByText(description)).toBeVisible();
    await dialog.getByRole('radio', { name: 'Rejeter' }).check();
    await dialog.getByPlaceholder("Expliquez pourquoi ce signalement est rejeté...").fill(
      'Signalement non fonde, annonce conforme aux regles - test E2E'
    );
    await dialog.getByRole('button', { name: 'Confirmer' }).click();
    await expect(adminPage.getByText('Signalement traité avec succès')).toBeVisible({ timeout: 10000 });
    await waitPageReady(adminPage);

    // signalements-client.tsx : filtre par defaut sur "En attente" - notre signalement,
    // desormais rejete, disparait du refetch tant qu'on ne change pas ce filtre. Le Select
    // n'a ni prop "label" ni <label> associe (seul Select de ce panneau) - cible via son
    // texte affiche courant, role=button (les badges de statut en cellule sont des <span>,
    // jamais des boutons - pas d'ambiguite).
    await adminPage.getByRole('button', { name: 'En attente' }).click();
    await adminPage.getByRole('button', { name: 'Rejeté' }).click();
    await waitPageReady(adminPage);

    const updatedRow = adminPage.getByRole('row').filter({ hasText: signaleur.prenom });
    await expect(updatedRow).toContainText('Rejeté');
    await expect(updatedRow).toContainText('Déjà traité');

    await signaleurContext.close();
    await cibleContext.close();
  });
});
