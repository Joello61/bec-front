import { completeProfile, expect, makeTestUser, registerAndLogin, test } from './support/fixtures';
import { gotoAndWaitReady, isoDateInDays, waitPageReady } from './support/helpers';

/**
 * Lot admin de la Phase 7b-B. Utilise le compte admin fixe seede (fixture `adminPage`,
 * jamais recree) + un utilisateur cible jetable cree via l'API (isolation, comme le reste
 * de la suite). Le champ de recherche texte libre de /admin/users et
 * /admin/moderation/voyages est deja documente comme inerte (Phase 7b-B Lot 1, meme
 * constat que voyages-client/demandes-clients) - jamais utilise ici, on navigue
 * directement par id/on filtre la ligne par prenom du voyageur plutot que par le champ de
 * recherche. Pas par email : ModerationVoyagesTable.tsx affiche voyage.voyageur.email,
 * mais le endpoint sous-jacent (GET /api/voyages, groupe de serialisation 'voyage:list',
 * reutilise tel quel par cette page admin) n'inclut jamais l'email du voyageur (verifie
 * via curl direct) - la colonne "Voyageur" de la table de moderation est donc TOUJOURS
 * vide sous l'email, un bug de serialisation non corrige ici (hors perimetre de ce lot,
 * distinct de celui de admin:user:read corrige separement, cf. plan-correction-cobage.md).
 */
test.describe('Administration - gestion utilisateurs et moderation', () => {
  test('un admin peut bannir/debannir, promouvoir/retrograder et moderer le contenu d\'un utilisateur', async ({
    adminPage,
    browser,
  }) => {
    const targetContext = await browser.newContext();
    const targetPage = await targetContext.newPage();
    const targetUser = makeTestUser();
    await registerAndLogin(targetPage, targetUser);
    await completeProfile(targetPage);

    const meResponse = await targetPage.request.get('/api/me');
    const target = await meResponse.json();
    const targetId: number = target.id;

    const voyageResponse = await targetPage.request.post('/api/voyages', {
      data: {
        villeDepart: 'Douala',
        villeArrivee: 'Paris',
        dateDepart: isoDateInDays(5),
        dateArrivee: isoDateInDays(6),
        poidsDisponible: 20,
      },
    });
    expect(voyageResponse.ok(), `Echec creation voyage API: ${voyageResponse.status()}`).toBeTruthy();

    await test.step('bannir la cible puis verifier le blocage effectif', async () => {
      await gotoAndWaitReady(adminPage, `/admin/users/${targetId}`);
      await adminPage.getByRole('button', { name: 'Bannir' }).click();

      const dialog = adminPage.getByRole('dialog');
      await dialog.getByPlaceholder('Expliquez la raison du bannissement...').fill(
        'Comportement inapproprie repete sur la plateforme'
      );
      await dialog.getByRole('button', { name: "Bannir l'utilisateur" }).click();
      await expect(dialog).not.toBeVisible({ timeout: 10000 });
      await expect(adminPage.getByText('Utilisateur banni avec succès')).toBeVisible({ timeout: 5000 });

      // Le login reste autorise pendant un bannissement (route publique,
      // BannedUserListener) - c'est la requete authentifiee SUIVANTE qui est bloquee.
      const targetLogin = await targetPage.request.post('/api/login', {
        data: { email: targetUser.email, password: targetUser.password },
      });
      expect(targetLogin.ok()).toBeTruthy();
      const meAfterBan = await targetPage.request.get('/api/me');
      expect(meAfterBan.status()).toBe(403);
    });

    await test.step('debannir la cible via le bouton "Débannir" puis verifier l\'acces retabli', async () => {
      await gotoAndWaitReady(adminPage, `/admin/users/${targetId}`);
      await adminPage.getByRole('button', { name: 'Débannir' }).click();
      await adminPage.getByRole('dialog').getByRole('button', { name: 'Débannir' }).click();
      await expect(adminPage.getByRole('dialog')).not.toBeVisible({ timeout: 10000 });

      const meAfterUnban = await targetPage.request.get('/api/me');
      expect(meAfterUnban.status()).toBe(200);
    });

    await test.step('promouvoir la cible administrateur', async () => {
      await adminPage.getByRole('button', { name: 'Modifier les rôles' }).click();
      const dialog = adminPage.getByRole('dialog');
      await dialog.getByRole('checkbox', { name: 'Administrateur' }).check();
      await dialog.getByRole('button', { name: 'Modifier les rôles' }).click();

      // Scope a <main> : le topbar de l'admin connecte affiche aussi "Admin" (son propre
      // role), getByText('Admin', {exact:true}) sur toute la page serait ambigu.
      await expect(adminPage.locator('main').getByText('Admin', { exact: true })).toBeVisible({ timeout: 10000 });
    });

    await test.step('retrograder la cible en utilisateur standard', async () => {
      await adminPage.getByRole('button', { name: 'Modifier les rôles' }).click();
      const dialog = adminPage.getByRole('dialog');
      await dialog.getByRole('checkbox', { name: 'Administrateur' }).uncheck();
      await dialog.getByRole('button', { name: 'Modifier les rôles' }).click();

      await expect(adminPage.locator('main').getByText('Utilisateur', { exact: true })).toBeVisible({
        timeout: 10000,
      });
    });

    await test.step('supprimer le voyage de la cible via la moderation', async () => {
      await gotoAndWaitReady(adminPage, '/admin/moderation/voyages');
      const row = adminPage.getByRole('row').filter({ hasText: targetUser.prenom });

      // Pagination fixe a 10/page (voyages-client.tsx), sans filtre par utilisateur
      // possible (champ de recherche inerte, cf. commentaire d'en-tete) - la base de dev
      // accumule les voyages de toutes les sessions E2E precedentes, notre voyage n'est
      // donc pas forcement sur la premiere page. On avance page par page jusqu'a le
      // trouver plutot que de supposer un ordre de tri.
      for (let attempt = 0; attempt < 15 && !(await row.isVisible().catch(() => false)); attempt++) {
        const nextButton = adminPage.getByRole('button', { name: 'Page suivante' });
        if (!(await nextButton.isEnabled().catch(() => false))) break;
        await nextButton.click();
        await waitPageReady(adminPage);
      }
      await expect(row).toBeVisible({ timeout: 15000 });
      await row.getByRole('button', { name: 'Supprimer' }).click();

      const dialog = adminPage.getByRole('dialog');
      await dialog.getByPlaceholder('Expliquez en détail la raison de la suppression...').fill(
        'Contenu supprime dans le cadre du test E2E de moderation'
      );
      await dialog.getByRole('button', { name: 'Supprimer le contenu' }).click();
      await waitPageReady(adminPage);

      await expect(adminPage.getByRole('row').filter({ hasText: targetUser.prenom })).not.toBeVisible();
    });

    await test.step('verifier les logs admin', async () => {
      await gotoAndWaitReady(adminPage, '/admin/logs');
      await expect(adminPage.getByText('Bannissement utilisateur').first()).toBeVisible({ timeout: 15000 });
      await expect(adminPage.getByText('Débannissement utilisateur').first()).toBeVisible();
      await expect(adminPage.getByText('Modification des rôles').first()).toBeVisible();
      await expect(adminPage.getByText('Suppression voyage').first()).toBeVisible();
    });

    await targetContext.close();
  });
});
