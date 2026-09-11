import { completeProfile, expect, makeTestUser, registerAndLogin, test } from './support/fixtures';
import { gotoAndWaitReady, isoDateInDays, waitPageReady } from './support/helpers';

/**
 * Cycle de vie complet d'une proposition (Lot 2/E2E de la Phase 8 laissait ce flux non
 * couvert) : demandeur propose -> voyageur refuse (motif verifie) -> demandeur propose une
 * autre demande, acceptee -> demandeur propose une derniere demande qui consomme exactement
 * le poids restant, acceptee -> le voyage passe automatiquement statut=complete
 * (PropositionService::respondToProposition, poidsDisponibleRestant - poidsEstime == 0) ->
 * le demandeur laisse un avis, verifie que la note moyenne du voyageur
 * (voyage.voyageur.noteAvisMoyen) apparait desormais sur la page du voyage.
 *
 * Deux acceptations (pas une seule qui viderait tout le poids d'un coup) : constate en
 * ecrivant ce test que PropositionService::createProposition (bec-backend) compare le
 * poids demande a Voyage::poidsDisponible (capacite ORIGINALE, jamais decrementee) plutot
 * qu'a poidsDisponibleRestant (capacite reellement libre) - une demande dont le poids
 * egale exactement poidsDisponible est donc systematiquement rejetee a la creation
 * ("Le voyage n'a plus de place disponible"), meme sur un voyage neuf sans aucune
 * proposition acceptee. Consommer le poids en deux acceptations plutot qu'une seule evite
 * cette incoherence (a signaler separement, hors perimetre de ce lot de tests) tout en
 * verifiant le meme comportement cible : le voyage se complete quand
 * poidsDisponibleRestant atteint zero.
 *
 * Voyage et demandes crees via l'API (support, deja couverts par
 * reservation-lifecycle.spec.ts) - seul le cycle proposition/avis est pilote via l'UI ici.
 */
test.describe('Cycle de vie d\'une proposition (refus, acceptation, completion, avis)', () => {
  test('un voyage se complete automatiquement quand ses propositions acceptees consomment tout le poids disponible, et peut alors recevoir un avis', async ({
    authenticatedPage: voyageurPage,
    browser,
  }, testInfo) => {
    testInfo.setTimeout(90_000);

    const demandeurContext = await browser.newContext();
    const demandeurPage = await demandeurContext.newPage();
    const demandeur = makeTestUser();
    await registerAndLogin(demandeurPage, demandeur);
    await completeProfile(demandeurPage);

    const villeDepart = 'Douala';
    const villeArrivee = 'Marseille';

    const voyageResponse = await voyageurPage.request.post('/api/voyages', {
      data: {
        villeDepart,
        villeArrivee,
        dateDepart: isoDateInDays(10),
        dateArrivee: isoDateInDays(11),
        poidsDisponible: 10,
      },
    });
    expect(voyageResponse.ok(), `Echec creation voyage API: ${voyageResponse.status()}`).toBeTruthy();
    const { id: voyageId } = await voyageResponse.json();

    // Demande A (poids 3/10 kg) - destinee a etre refusee, poids neutre pour la suite.
    const demandeAResponse = await demandeurPage.request.post('/api/demandes', {
      data: {
        villeDepart,
        villeArrivee,
        dateLimite: isoDateInDays(20),
        poidsEstime: 3,
        description: 'Colis test E2E - proposition destinee a etre refusee.',
      },
    });
    expect(demandeAResponse.ok(), `Echec creation demande A API: ${demandeAResponse.status()}`).toBeTruthy();

    await test.step('le demandeur propose la demande A sur le voyage', async () => {
      await gotoAndWaitReady(demandeurPage, `/dashboard/explore/voyage/${voyageId}`);

      const proposeButton = demandeurPage.getByRole('button', { name: 'Faire une proposition' });
      await expect(proposeButton).toBeVisible({ timeout: 15000 });
      await proposeButton.click();

      const dialog = demandeurPage.getByRole('dialog');
      await expect(dialog).toBeVisible();

      // Select custom (src/components/ui/select.tsx, searchable={false}) : bouton qui
      // ouvre un menu de boutons-options, jamais un <select> natif - pas de selectOption().
      // Une seule demande correspond a ce stade (demande A).
      await dialog.getByLabel('Sélectionnez votre demande').click();
      await dialog.getByRole('button', { name: /Douala vers Marseille du/ }).click();
      await dialog.getByLabel(/Prix par kilo/).fill('15');
      await dialog.getByLabel(/Commission pour un bagage complet/).fill('5000');

      await dialog.getByRole('button', { name: 'Envoyer la proposition' }).click();
      await expect(dialog).not.toBeVisible({ timeout: 10000 });
    });

    await test.step('le voyageur refuse la proposition avec un motif', async () => {
      await gotoAndWaitReady(voyageurPage, '/dashboard/mes-propositions');

      const refuseButton = voyageurPage.getByRole('button', { name: 'Refuser' }).filter({ visible: true }).first();
      await expect(refuseButton).toBeVisible({ timeout: 15000 });
      await refuseButton.click();

      const refuseDialog = voyageurPage.getByRole('dialog');
      await expect(refuseDialog).toBeVisible();
      await refuseDialog.getByPlaceholder('Raison du refus...').fill('Poids incompatible avec mon itineraire, desole.');
      await refuseDialog.getByRole('button', { name: 'Refuser la proposition' }).click();
      await expect(refuseDialog).not.toBeVisible({ timeout: 10000 });
    });

    await test.step('le demandeur constate le refus et le motif sur sa proposition envoyee', async () => {
      await gotoAndWaitReady(demandeurPage, '/dashboard/mes-propositions');
      await demandeurPage.getByRole('button', { name: /Envoyées/ }).filter({ visible: true }).first().click();

      const detailsButton = demandeurPage.getByRole('button', { name: 'Détails' }).filter({ visible: true }).first();
      await expect(detailsButton).toBeVisible({ timeout: 10000 });
      await detailsButton.click();

      await expect(demandeurPage).toHaveURL(/\/dashboard\/mes-propositions\/\d+/, { timeout: 10000 });
      await expect(demandeurPage.getByText('Refusée').filter({ visible: true }).first()).toBeVisible();
      await expect(
        demandeurPage.getByText('Poids incompatible avec mon itineraire, desole.').filter({ visible: true }).first()
      ).toBeVisible();
    });

    // Demande B (poids 4/10 kg) - premiere acceptation, consomme une partie du poids
    // (poidsDisponibleRestant : 10 -> 6, le voyage reste "actif").
    const demandeBResponse = await demandeurPage.request.post('/api/demandes', {
      data: {
        villeDepart,
        villeArrivee,
        dateLimite: isoDateInDays(25),
        poidsEstime: 4,
        description: 'Colis test E2E - premiere proposition acceptee.',
      },
    });
    expect(demandeBResponse.ok(), `Echec creation demande B API: ${demandeBResponse.status()}`).toBeTruthy();

    await test.step('le demandeur propose la demande B, le voyageur accepte (le voyage reste actif)', async () => {
      await gotoAndWaitReady(demandeurPage, `/dashboard/explore/voyage/${voyageId}`);

      const dialog = demandeurPage.getByRole('dialog');
      await demandeurPage.getByRole('button', { name: 'Faire une proposition' }).click();
      await expect(dialog).toBeVisible();

      // Deux demandes correspondent desormais (A et B, memes villes) : cibler B par sa
      // date limite (25 jours, format DD/MM/YYYY - formatDateShort), seul champ qui les
      // distingue dans le libelle de l'option (PropositionForm.tsx :
      // "{depart} vers {arrivee} du {dateLimite}").
      const dateLimiteB = isoDateInDays(25).split('-').reverse().join('/');
      await dialog.getByLabel('Sélectionnez votre demande').click();
      await dialog.getByRole('button', { name: new RegExp(`du ${dateLimiteB}`) }).click();
      await dialog.getByLabel(/Prix par kilo/).fill('15');
      await dialog.getByLabel(/Commission pour un bagage complet/).fill('5000');
      await dialog.getByRole('button', { name: 'Envoyer la proposition' }).click();
      await expect(dialog).not.toBeVisible({ timeout: 10000 });

      await gotoAndWaitReady(voyageurPage, '/dashboard/mes-propositions');
      const acceptButton = voyageurPage.getByRole('button', { name: 'Accepter' }).filter({ visible: true }).first();
      await expect(acceptButton).toBeVisible({ timeout: 15000 });
      await acceptButton.click();
      await expect(voyageurPage.getByText('Proposition acceptée avec succès')).toBeVisible({ timeout: 10000 });

      const voyageResponseAfter = await voyageurPage.request.get(`/api/voyages/${voyageId}`);
      expect(voyageResponseAfter.ok()).toBeTruthy();
      expect((await voyageResponseAfter.json()).statut).toBe('actif');
    });

    // Demande C (poids 6/10 kg) - consomme exactement le poids restant (6 kg) : passe la
    // verification de creation (comparee a poidsDisponible=10, jamais atteinte par 6) et
    // amene poidsDisponibleRestant a 0 une fois acceptee.
    const demandeCResponse = await demandeurPage.request.post('/api/demandes', {
      data: {
        villeDepart,
        villeArrivee,
        dateLimite: isoDateInDays(30),
        poidsEstime: 6,
        description: 'Colis test E2E - derniere proposition, complete le voyage.',
      },
    });
    expect(demandeCResponse.ok(), `Echec creation demande C API: ${demandeCResponse.status()}`).toBeTruthy();

    await test.step('le demandeur propose la demande C, le voyageur accepte (le voyage se complete)', async () => {
      await gotoAndWaitReady(demandeurPage, `/dashboard/explore/voyage/${voyageId}`);

      const dialog = demandeurPage.getByRole('dialog');
      await demandeurPage.getByRole('button', { name: 'Faire une proposition' }).click();
      await expect(dialog).toBeVisible();

      const dateLimiteC = isoDateInDays(30).split('-').reverse().join('/');
      await dialog.getByLabel('Sélectionnez votre demande').click();
      await dialog.getByRole('button', { name: new RegExp(`du ${dateLimiteC}`) }).click();
      await dialog.getByLabel(/Prix par kilo/).fill('15');
      await dialog.getByLabel(/Commission pour un bagage complet/).fill('5000');
      await dialog.getByRole('button', { name: 'Envoyer la proposition' }).click();
      await expect(dialog).not.toBeVisible({ timeout: 10000 });

      await gotoAndWaitReady(voyageurPage, '/dashboard/mes-propositions');
      const acceptButton = voyageurPage.getByRole('button', { name: 'Accepter' }).filter({ visible: true }).first();
      await expect(acceptButton).toBeVisible({ timeout: 15000 });
      await acceptButton.click();
      await expect(voyageurPage.getByText('Proposition acceptée avec succès')).toBeVisible({ timeout: 10000 });

      const voyageResponseAfter = await voyageurPage.request.get(`/api/voyages/${voyageId}`);
      expect(voyageResponseAfter.ok()).toBeTruthy();
      expect((await voyageResponseAfter.json()).statut).toBe('complete');
    });

    await test.step('le demandeur laisse un avis sur le voyageur une fois le voyage complete', async () => {
      await gotoAndWaitReady(demandeurPage, `/dashboard/explore/voyage/${voyageId}`);

      const avisButton = demandeurPage.getByRole('button', { name: 'Laisser un avis' }).filter({ visible: true }).first();
      await expect(avisButton).toBeVisible({ timeout: 15000 });
      await avisButton.click();

      const avisDialog = demandeurPage.getByRole('dialog');
      await expect(avisDialog).toBeVisible();
      await avisDialog.getByRole('button', { name: '5 étoiles' }).click();
      await avisDialog.getByLabel('Commentaire').fill('Voyageur tres fiable, echange fluide. Test E2E.');
      await avisDialog.getByRole('button', { name: "Publier l'avis" }).click();
      await expect(avisDialog).not.toBeVisible({ timeout: 10000 });

      await gotoAndWaitReady(demandeurPage, `/dashboard/explore/voyage/${voyageId}`);
      await waitPageReady(demandeurPage);
      await expect(demandeurPage.getByText('5.0').filter({ visible: true }).first()).toBeVisible({ timeout: 10000 });
    });
  });
});
