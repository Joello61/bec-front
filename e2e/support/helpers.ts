import type { APIRequestContext, Locator, Page } from '@playwright/test';

/**
 * Mailpit (bec-infra/docker-compose.override.yml) capture tous les emails de dev sans
 * jamais les livrer reellement, expose sur le port hote 8025 (README bec-infra) - a la
 * fois en local et en CI (le job E2E de bec-infra publie ce port sur le runner). Racine
 * fixe plutot qu'une variable d'environnement : ce port n'a jamais varie entre les deux
 * environnements, contrairement a baseURL (playwright.config.ts) qui a une raison
 * documentee de ne pas etre 127.0.0.1.
 */
const MAILPIT_URL = 'http://localhost:8025';

/**
 * Bandeau de consentement cookies (CookiesConsent.tsx) affiche en overlay (role="dialog")
 * a chaque premiere page vue d'une session navigateur sans consentement enregistre - il
 * intercepte les clics sur les elements situes derriere lui (constate : un clic sur "Se
 * connecter" n'atteignait jamais le formulaire tant que ce bandeau restait visible).
 * A appeler juste apres waitPageReady, avant toute interaction avec la page.
 */
export async function dismissCookieConsent(page: Page): Promise<void> {
  const acceptButton = page.getByRole('button', { name: 'Accepter les cookies' });
  if (await acceptButton.isVisible({ timeout: 3000 }).catch(() => false)) {
    await acceptButton.click();
  }
}

/**
 * bec-infra fait tourner le frontend en `next dev` (Turbopack) proxifie par nginx sous
 * une origine differente (127.0.0.1:8000) de celle du serveur (frontend:3000). Sans
 * `allowedDevOrigins` dans next.config.ts, Next.js bloquait silencieusement les
 * ressources de dev cross-origin (websocket HMR notamment), empechant l'hydratation
 * React de se terminer - un clic tombait alors sur du HTML non hydrate et provoquait une
 * soumission de formulaire native (GET avec les donnees en query string) au lieu du
 * POST /api/... attendu. Corrige dans next.config.ts (voir son commentaire dedie) ; le
 * court buffer ci-dessous reste une marge de securite pour la compilation a la demande
 * de Turbopack sur un premier acces a une route, pas un contournement du bug d'origine.
 */
export async function waitPageReady(page: Page): Promise<void> {
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(300);
}

export async function gotoAndWaitReady(page: Page, path: string): Promise<void> {
  await page.goto(path);
  await waitPageReady(page);
  await dismissCookieConsent(page);
}

/**
 * src/components/ui/input.tsx et select.tsx rendent tous deux {label}{required && <span>*</span>}
 * a l'interieur du <label> : le nom accessible d'un champ requis est donc "Xxx*", pas "Xxx".
 * getByLabel en mode exact echoue alors sur "Nom" (accessible name reel "Nom*"), et en mode non-exact
 * un label court comme "Nom" matche aussi "Prénom*" (sous-chaine). Cet utilitaire ancre le texte et
 * tolere l'asterisque optionnel, pour ne jamais dependre de la presence de required.
 */
export function labelExact(text: string): RegExp {
  // L'asterisque "requis" est tantot colle au libelle ("Nom*", input.tsx/select.tsx),
  // tantot separe par un espace ("Description *", DemandeForm.tsx/VoyageForm.tsx en
  // <label> manuel) - tolerer les deux plutot que de dependre du composant utilise.
  return new RegExp(`^${text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*\\*?$`);
}

/**
 * Pilote le composant Select personnalise de src/components/ui/select.tsx
 * (pas un <select> natif : bouton + dropdown custom avec recherche debattue a 300ms).
 * getByRole('button', ...).click() attend nativement l'apparition du resultat de
 * recherche, ce qui absorbe le debounce et le round-trip reseau sans attente explicite.
 */
export async function selectSearchableCity(scope: Locator, labelText: string, searchTerm: string): Promise<void> {
  await scope.getByLabel(labelExact(labelText)).click();
  await scope.getByPlaceholder('Rechercher...').fill(searchTerm);
  await scope.getByRole('button', { name: new RegExp(searchTerm, 'i') }).first().click();
}

export function isoDateInDays(days: number): string {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  date.setDate(date.getDate() + days);
  return date.toISOString().slice(0, 10);
}

/**
 * Recupere le dernier email envoye a `toEmail` via l'API REST Mailpit (v1) et en extrait
 * une URL correspondant a `linkPattern` (ex. le lien de reinitialisation de mot de passe,
 * EmailService::getPasswordResetEmailContent - le corps HTML contient l'URL a la fois en
 * href et en texte affiche, donc une simple recherche par regex suffit, pas besoin de
 * parser le HTML). Poll court plutot qu'une seule tentative : Mailpit n'ecrit le message
 * qu'une fois le SMTP du backend termine, un decalage de quelques centaines de ms apres le
 * clic "Envoyer" est attendu, pas une erreur.
 */
export async function fetchLatestEmailLink(
  request: APIRequestContext,
  toEmail: string,
  linkPattern: RegExp,
  timeoutMs = 15000
): Promise<string> {
  const deadline = Date.now() + timeoutMs;
  let lastHtml = '';

  while (Date.now() < deadline) {
    const searchResponse = await request.get(`${MAILPIT_URL}/api/v1/search`, {
      params: { query: `to:${toEmail}`, limit: '1' },
    });
    if (searchResponse.ok()) {
      const searchBody = await searchResponse.json();
      const messageId = searchBody.messages?.[0]?.ID;
      if (messageId) {
        const messageResponse = await request.get(`${MAILPIT_URL}/api/v1/message/${messageId}`);
        if (messageResponse.ok()) {
          const message = await messageResponse.json();
          lastHtml = message.HTML ?? message.Text ?? '';
          const match = lastHtml.match(linkPattern);
          if (match) {
            return match[0];
          }
        }
      }
    }
    await new Promise((resolve) => setTimeout(resolve, 500));
  }

  throw new Error(
    `Aucun email trouve pour ${toEmail} contenant un lien correspondant a ${linkPattern} ` +
      `apres ${timeoutMs}ms (dernier corps recu: ${lastHtml.slice(0, 200) || '(aucun message)'}).`
  );
}
