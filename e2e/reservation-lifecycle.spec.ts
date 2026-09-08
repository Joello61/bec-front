import { expect, test } from './support/fixtures';
import { gotoAndWaitReady, isoDateInDays, labelExact, selectSearchableCity } from './support/helpers';

/**
 * Zone "Details voyage & reservation" (Lot 2 de la Phase 8, le plus complexe :
 * DemandeDetails.tsx/VoyageDetails.tsx, tous deux 700+ lignes). Cree un voyage puis une
 * demande via l'UI (formulaires critiques au sens de CLAUDE.md), verifie leur apparition
 * dans la liste et leur affichage sur la page de detail - le vrai parcours que la
 * decomposition de la Phase 8 va toucher.
 *
 * Un seul utilisateur pour les deux creations (au lieu d'un par test) : le rate-limiter
 * d'inscription (3/IP/heure, cf. bec-backend/config/packages/rate_limiter.yaml) est vite
 * atteint quand toute la suite E2E tourne d'un bloc - chaque test E2E authentifie via
 * l'API un utilisateur unique, donc reduire leur nombre reduit la pression sur cette
 * limite sans rien perdre en isolation entre executions de la suite.
 */
test.describe('Reservation - creation puis consultation du detail (voyage et demande)', () => {
  test('un utilisateur peut creer un voyage et une demande, et consulter leur detail', async ({ authenticatedPage }) => {
    await test.step('creer un voyage et consulter son detail', async () => {
      const villeDepart = 'Douala';
      const villeArrivee = 'Paris';

      await gotoAndWaitReady(authenticatedPage, '/dashboard/mes-voyages');

      await authenticatedPage.getByRole('button', { name: 'Créer un voyage' }).first().click();

      const dialog = authenticatedPage.getByRole('dialog');
      await expect(dialog).toBeVisible();

      await selectSearchableCity(dialog, 'Ville de départ', villeDepart);
      await selectSearchableCity(dialog, "Ville d'arrivée", villeArrivee);

      await dialog.getByLabel(labelExact('Date de départ')).fill(isoDateInDays(5));
      await dialog.getByLabel(labelExact("Date d'arrivée")).fill(isoDateInDays(10));
      await dialog.getByLabel(labelExact('Poids disponible (kg)')).fill('20');
      await dialog.getByLabel(/Prix par kilo/).fill('15');
      await dialog.getByLabel(/Commission pour un bagage/).fill('5000');

      await dialog.getByRole('button', { name: 'Créer le voyage' }).click();
      await expect(dialog).not.toBeVisible({ timeout: 10000 });

      // "Douala"/"Paris" vivent dans des noeuds de texte separes de la carte (pas un bloc
      // combine) : cibler le lien vers le detail plutot qu'une recherche de texte combine,
      // fragile aux doublons mobile/desktop du meme contenu (cf. listing.spec.ts).
      const detailLink = authenticatedPage.getByRole('link', { name: /Voir les détails/ }).first();
      await expect(detailLink).toBeVisible({ timeout: 10000 });
      await detailLink.click();

      await expect(authenticatedPage).toHaveURL(/\/dashboard\/mes-voyages\/\d+/, { timeout: 10000 });
      // VoyageDetails.tsx duplique son rendu (bloc mobile + bloc desktop, cf. Phase 10) :
      // .filter({ visible: true }) ecarte la copie masquee par CSS a la largeur de viewport courante.
      await expect(authenticatedPage.getByText(villeDepart).filter({ visible: true }).first()).toBeVisible();
      await expect(authenticatedPage.getByText(villeArrivee).filter({ visible: true }).first()).toBeVisible();
    });

    await test.step('creer une demande et consulter son detail', async () => {
      const villeDepart = 'Yaoundé';
      const villeArrivee = 'Lyon';

      await gotoAndWaitReady(authenticatedPage, '/dashboard/mes-demandes');

      await authenticatedPage.getByRole('button', { name: 'Créer une demande' }).first().click();

      const dialog = authenticatedPage.getByRole('dialog');
      await expect(dialog).toBeVisible();

      await selectSearchableCity(dialog, 'Ville de départ', villeDepart);
      await selectSearchableCity(dialog, "Ville d'arrivée", villeArrivee);

      await dialog.getByLabel(labelExact('Date limite')).fill(isoDateInDays(7));
      await dialog.getByLabel(labelExact('Poids estimé (kg)')).fill('5');
      await dialog.getByLabel(/Prix max par kilo/).fill('15');
      await dialog.getByLabel(/Commission max pour bagage/).fill('3000');
      await dialog.getByLabel(labelExact('Description')).fill('Colis fragile a expedier rapidement, test E2E.');

      await dialog.getByRole('button', { name: 'Créer la demande' }).click();
      await expect(dialog).not.toBeVisible({ timeout: 10000 });

      const detailLink = authenticatedPage.getByRole('link', { name: /Voir les détails/ }).first();
      await expect(detailLink).toBeVisible({ timeout: 10000 });
      await detailLink.click();

      await expect(authenticatedPage).toHaveURL(/\/dashboard\/mes-demandes\/\d+/, { timeout: 10000 });
      // DemandeDetails.tsx duplique son rendu (bloc mobile + bloc desktop, cf. Phase 10).
      await expect(authenticatedPage.getByText(villeDepart).filter({ visible: true }).first()).toBeVisible();
      await expect(authenticatedPage.getByText(villeArrivee).filter({ visible: true }).first()).toBeVisible();
    });
  });
});
