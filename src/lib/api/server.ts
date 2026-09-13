/**
 * Base URL a utiliser pour un appel HTTP effectue depuis un Server Component - execute
 * dans le conteneur Next.js lui-meme, jamais dans le navigateur. `NEXT_PUBLIC_API_URL`
 * pointe en dev (bec-infra) sur le pont nginx via `http://localhost:8000` : injoignable
 * depuis l'interieur du conteneur "frontend" (verifie : ECONNREFUSED, "localhost" y
 * designe le conteneur lui-meme, pas l'hote). `API_URL_SERVER` permet de le surcharger
 * avec l'adresse interne au reseau Docker compose (ex. `http://nginx/api`).
 *
 * En production/staging, `NEXT_PUBLIC_API_URL` pointe deja sur le domaine public reel
 * (cf. bec-frontend/.github/workflows/deploy.yml), joignable depuis n'importe ou y
 * compris depuis le conteneur frontend lui-meme - `API_URL_SERVER` peut y rester absent.
 */
export function getServerApiBaseUrl(): string | undefined {
  return process.env.API_URL_SERVER || undefined;
}
