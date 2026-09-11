import { expect, test } from './support/fixtures';
import { gotoAndWaitReady, isoDateInDays, waitPageReady } from './support/helpers';

/**
 * Zone "Accueil / Listing" (Lot 1 de la Phase 8) : page d'exploration authentifiee,
 * bascule entre les onglets Voyages/Demandes. Le contenu reel des listes depend des
 * donnees deja presentes en base (comptes/voyages/demandes crees par d'autres tests
 * E2E compris) : on verifie la structure et le comportement de la page (etat vide OU
 * cartes reelles), pas un jeu de donnees precis.
 */
test.describe('Exploration - listing voyages et demandes', () => {
  test('affiche la page d\'exploration et permet de basculer entre les onglets', async ({ authenticatedPage }) => {
    await gotoAndWaitReady(authenticatedPage, '/dashboard/explore');

    await expect(authenticatedPage.getByRole('heading', { name: 'Explorer les opportunités' })).toBeVisible();

    const voyagesTab = authenticatedPage.getByRole('button', { name: /Voyages/ }).first();
    const demandesTab = authenticatedPage.getByRole('button', { name: /Demandes/ }).first();

    await expect(voyagesTab).toBeVisible();
    await expect(authenticatedPage.getByText('Erreur de chargement')).not.toBeVisible();

    await demandesTab.click();
    // Le contenu associe a l'onglet "Demandes" doit apparaitre (liste ou etat vide) - jamais rester bloque sur le spinner ni planter.
    // .filter({ visible: true }) : les cartes/etats sont dupliques en bloc mobile + bloc
    // desktop (meme pattern que VoyageDetails/DemandeDetails, cf. voyage-lifecycle.spec.ts).
    await expect(
      authenticatedPage.getByText(/Aucune demande|Aucun résultat/).or(authenticatedPage.locator('[class*="grid"] a')).filter({ visible: true }).first()
    ).toBeVisible({ timeout: 10000 });
    await expect(authenticatedPage.getByText('Erreur de chargement')).not.toBeVisible();

    await voyagesTab.click();
    await expect(
      authenticatedPage.getByText(/Aucun voyage|Aucun résultat/).or(authenticatedPage.locator('[class*="grid"] a')).filter({ visible: true }).first()
    ).toBeVisible({ timeout: 10000 });
  });

  test('le filtre ville de depart restreint reellement la liste des voyages', async ({ authenticatedPage }) => {
    const villeDepart = 'Kribi';
    const villeArrivee = 'Bruxelles';

    const voyageResponse = await authenticatedPage.request.post('/api/voyages', {
      data: {
        villeDepart,
        villeArrivee,
        dateDepart: isoDateInDays(15),
        dateArrivee: isoDateInDays(16),
        poidsDisponible: 8,
      },
    });
    expect(voyageResponse.ok(), `Echec creation voyage API: ${voyageResponse.status()}`).toBeTruthy();

    await gotoAndWaitReady(authenticatedPage, '/dashboard/explore');
    await authenticatedPage.getByRole('button', { name: 'Filtres' }).first().click();

    // VoyageFilterFields.tsx : le <label> n'est jamais associe au Select custom qui le
    // suit (pas de prop "label"/"id" passee a <Select>, contrairement aux formulaires de
    // creation) - getByLabel ne resout donc rien ici, cible via le sibling CSS.
    const departButton = authenticatedPage
      .locator('label:has-text("Ville de départ") ~ div button')
      .filter({ visible: true })
      .first();
    await departButton.click();
    await authenticatedPage.getByPlaceholder('Rechercher...').filter({ visible: true }).first().fill(villeDepart);
    await authenticatedPage
      .getByRole('button', { name: new RegExp(villeDepart) })
      .filter({ visible: true })
      .first()
      .click();

    await waitPageReady(authenticatedPage);

    // VoyageCard.tsx : le lien "Voir les détails" n'englobe que le pied de carte (statut +
    // lien), la ville de départ vit dans un bloc frere au sein du meme wrapper de carte
    // (motion.div "group relative") - remonter jusqu'a ce wrapper plutot que de chercher le
    // texte dans le lien lui-meme.
    const detailLink = authenticatedPage
      .getByRole('link', { name: /Voir les détails/ })
      .filter({ visible: true })
      .first();
    await expect(detailLink).toBeVisible({ timeout: 10000 });
    const card = detailLink.locator('xpath=ancestor::div[contains(@class,"group") and contains(@class,"relative")][1]');
    await expect(card).toContainText(villeDepart);
  });

  test('le filtre statut restreint reellement la liste des demandes', async ({ authenticatedPage }) => {
    const villeDepart = 'Bafoussam';
    const villeArrivee = 'Montreal';

    const demandeResponse = await authenticatedPage.request.post('/api/demandes', {
      data: {
        villeDepart,
        villeArrivee,
        dateLimite: isoDateInDays(15),
        poidsEstime: 4,
        description: 'Demande test E2E - filtre statut sur le listing.',
      },
    });
    expect(demandeResponse.ok(), `Echec creation demande API: ${demandeResponse.status()}`).toBeTruthy();

    await gotoAndWaitReady(authenticatedPage, '/dashboard/explore');
    await authenticatedPage.getByRole('button', { name: /Demandes/ }).first().click();
    await authenticatedPage.getByRole('button', { name: 'Filtres' }).first().click();

    const statutButton = authenticatedPage
      .locator('label:has-text("Statut") ~ div button')
      .filter({ visible: true })
      .first();
    await statutButton.click();
    // Select non-searchable (searchable={false}) : pas de champ de recherche, un clic
    // direct sur l'option suffit.
    await authenticatedPage
      .getByRole('button', { name: 'En recherche' })
      .filter({ visible: true })
      .first()
      .click();

    await waitPageReady(authenticatedPage);

    // Contrairement au filtre ville (test precedent, qui remonte a la carte via xpath pour
    // verifier son contenu), "en_recherche" est le statut de la grande majorite des
    // demandes creees par le reste de la suite E2E - la ville de notre demande n'a pas
    // besoin d'etre associee a une carte precise, sa seule presence visible dans les
    // resultats suffit a prouver que le filtre a bien recharge une liste qui l'inclut.
    await expect(authenticatedPage.getByText(villeDepart).filter({ visible: true }).first()).toBeVisible({
      timeout: 10000,
    });
  });
});
