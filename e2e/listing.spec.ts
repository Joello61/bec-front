import { test, expect } from './support/fixtures';

/**
 * Zone "Accueil / Listing" (Lot 1 de la Phase 8) : page d'exploration authentifiee,
 * bascule entre les onglets Voyages/Demandes. Le contenu reel des listes depend des
 * donnees deja presentes en base (pas de creation prealable ici) : on verifie la
 * structure et le comportement de la page, pas un jeu de donnees precis.
 */
test.describe('Exploration - listing voyages et demandes', () => {
  test('affiche la page d\'exploration et permet de basculer entre les onglets', async ({ authenticatedPage }) => {
    await authenticatedPage.goto('/dashboard/explore');

    await expect(authenticatedPage.getByRole('heading', { name: 'Explorer les opportunités' })).toBeVisible();

    const voyagesTab = authenticatedPage.getByRole('button', { name: /Voyages/ }).first();
    const demandesTab = authenticatedPage.getByRole('button', { name: /Demandes/ }).first();

    await expect(voyagesTab).toBeVisible();
    await expect(authenticatedPage.getByText('Erreur de chargement')).not.toBeVisible();

    await demandesTab.click();
    // Le contenu associe a l'onglet "Demandes" doit apparaitre (liste ou etat vide) - jamais rester bloque sur le spinner ni planter.
    await expect(
      authenticatedPage.getByText(/Aucune demande|Aucun résultat/).or(authenticatedPage.locator('[class*="grid"] a'))
    ).toBeVisible({ timeout: 10000 });
    await expect(authenticatedPage.getByText('Erreur de chargement')).not.toBeVisible();

    await voyagesTab.click();
    await expect(
      authenticatedPage.getByText(/Aucun voyage|Aucun résultat/).or(authenticatedPage.locator('[class*="grid"] a'))
    ).toBeVisible({ timeout: 10000 });
  });
});
