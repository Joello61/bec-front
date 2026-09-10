import { completeProfile, expect, makeTestUser, registerAndLogin, test } from './support/fixtures';
import { gotoAndWaitReady, isoDateInDays, waitPageReady } from './support/helpers';

/**
 * Lot messagerie de la Phase 7b-B. Deux comptes (voyageur + demandeur), voyage cree via
 * l'API (support, pas sous test) pour que le demandeur ait un voyageur reel a contacter -
 * flux reel trace dans le code : visiter /dashboard/explore/voyage/{id} declenche
 * useConversationWithUser (GET /api/conversations/with/{userId}, "recupere ou cree"),
 * donc la conversation existe deja avant meme le premier message. Pas d'assertion sur la
 * livraison Mercure temps reel (decision deja documentee, Phase 7b-A/7b-B) : la reception
 * cote destinataire est verifiee par rechargement de page, jamais par un evenement SSE.
 */
test.describe('Messagerie, favoris, notifications et signalement', () => {
  test('deux utilisateurs peuvent echanger des messages, favoriser, etre notifies et signaler', async ({
    authenticatedPage: voyageurPage,
    browser,
  }, testInfo) => {
    // Scenario le plus long de la suite (2 comptes, 5 steps sequentiels) - proche des 60s
    // par defaut (playwright.config.ts) meme execute seul, et les depasse sous charge
    // (execution de la suite complete). Le dernier step (signalement, modale framer-motion)
    // est celui qui en patit le plus (animation d'entree pas encore stabilisee au moment
    // du clic).
    testInfo.setTimeout(90_000);
    const demandeurContext = await browser.newContext();
    const demandeurPage = await demandeurContext.newPage();
    const demandeur = makeTestUser();
    await registerAndLogin(demandeurPage, demandeur);
    await completeProfile(demandeurPage);

    const voyageResponse = await voyageurPage.request.post('/api/voyages', {
      data: {
        villeDepart: 'Douala',
        villeArrivee: 'Marseille',
        dateDepart: isoDateInDays(10),
        dateArrivee: isoDateInDays(11),
        poidsDisponible: 15,
      },
    });
    expect(voyageResponse.ok(), `Echec creation voyage API: ${voyageResponse.status()}`).toBeTruthy();
    const { id: voyageId } = await voyageResponse.json();

    let conversationId: number;

    await test.step('le demandeur visite le voyage, ce qui cree la conversation, puis envoie un message', async () => {
      await gotoAndWaitReady(demandeurPage, `/dashboard/explore/voyage/${voyageId}`);

      // handleContact() (voyage-details-client.tsx) ne navigue que si `conversation` est
      // deja chargee (useConversationWithUser, un GET/POST distinct declenche apres
      // useVoyage) - sinon le clic est un silencieux no-op. Pas d'indicateur visuel de ce
      // chargement : on reessaie le clic plutot que de supposer un unique clic suffisant.
      const contactButton = demandeurPage
        .getByRole('button', { name: 'Contacter le voyageur' })
        .filter({ visible: true })
        .first();
      await expect(contactButton).toBeVisible({ timeout: 15000 });
      for (let attempt = 0; attempt < 10; attempt++) {
        await contactButton.click();
        try {
          await demandeurPage.waitForURL('**/dashboard/messages/**', { timeout: 2000 });
          break;
        } catch {
          if (attempt === 9) throw new Error('Navigation vers la conversation jamais declenchee apres 10 clics');
        }
      }
      await waitPageReady(demandeurPage);

      conversationId = Number(new URL(demandeurPage.url()).pathname.split('/').pop());
      expect(conversationId).toBeGreaterThan(0);

      const firstMessage = `Bonjour, ce voyage m'interesse ! ${Date.now()}`;
      await demandeurPage.getByPlaceholder('Écrivez votre message...').fill(firstMessage);
      await demandeurPage.getByPlaceholder('Écrivez votre message...').press('Enter');
      await expect(demandeurPage.getByText(firstMessage)).toBeVisible({ timeout: 10000 });
    });

    await test.step('le voyageur recoit le message (apres rechargement) et repond', async () => {
      await gotoAndWaitReady(voyageurPage, `/dashboard/messages/${conversationId!}`);
      await expect(voyageurPage.getByText("m'interesse")).toBeVisible({ timeout: 10000 });

      const reply = `Avec plaisir, contactez-moi ! ${Date.now()}`;
      await voyageurPage.getByPlaceholder('Écrivez votre message...').fill(reply);
      await voyageurPage.getByPlaceholder('Écrivez votre message...').press('Enter');
      await expect(voyageurPage.getByText(reply)).toBeVisible({ timeout: 10000 });

      // Reception cote demandeur verifiee par rechargement, jamais par un evenement Mercure.
      await gotoAndWaitReady(demandeurPage, `/dashboard/messages/${conversationId!}`);
      await expect(demandeurPage.getByText(reply)).toBeVisible({ timeout: 10000 });
    });

    await test.step('le demandeur ajoute le voyage aux favoris', async () => {
      await gotoAndWaitReady(demandeurPage, `/dashboard/explore/voyage/${voyageId}`);
      await demandeurPage
        .getByRole('button', { name: 'Ajouter aux favoris' })
        .filter({ visible: true })
        .first()
        .click();

      await gotoAndWaitReady(demandeurPage, '/dashboard/favoris');
      await expect(demandeurPage.getByText('Marseille').filter({ visible: true }).first()).toBeVisible({
        timeout: 10000,
      });
    });

    await test.step('une notification de nouveau message apparait (apres rechargement)', async () => {
      await gotoAndWaitReady(voyageurPage, '/dashboard/notifications');
      await expect(voyageurPage.getByText('Nouveau message').first()).toBeVisible({ timeout: 10000 });
    });

    await test.step('le voyageur signale le message du demandeur', async () => {
      // Interaction constatee comme intermittente en session (pas liee a l'ordre des tests
      // ni a une erreur console/JS - verifie explicitement) : le menu "Options du message"
      // (MessageBubble.tsx, reveal au survol + dropdown framer-motion) se detache parfois
      // du DOM pendant le clic. Cause racine non isolee avec certitude (piste : re-render
      // de la liste de messages pendant l'animation du dropdown) - signale comme trouvaille,
      // pas corrige (pas de fix backend/frontend evident). Reessai de la sequence complete
      // plutot qu'un force-click, qui masquerait le comportement reel plutot que de tolerer
      // une instabilite transitoire de rendu.
      await gotoAndWaitReady(voyageurPage, `/dashboard/messages/${conversationId!}`);

      const dialog = voyageurPage.getByRole('dialog');
      let reported = false;
      for (let attempt = 0; attempt < 5 && !reported; attempt++) {
        try {
          await voyageurPage.getByLabel('Options du message').first().click({ timeout: 10000 });
          await voyageurPage.getByRole('button', { name: 'Signaler' }).click({ timeout: 10000 });
          await dialog
            .getByLabel('Description détaillée')
            .fill("Message signale dans le cadre du test E2E de moderation, contenu jugé suspect.", { timeout: 10000 });
          await dialog.getByRole('button', { name: 'Envoyer le signalement' }).click({ timeout: 10000 });
          await expect(dialog).not.toBeVisible({ timeout: 10000 });
          reported = true;
        } catch (err) {
          if (attempt === 4) throw err;
          await voyageurPage.keyboard.press('Escape').catch(() => {});
        }
      }
    });

    await demandeurContext.close();
  });
});
