import { Route } from 'next';

/**
 * Un chemin de redirection est sur uniquement s'il s'agit d'un chemin
 * interne relatif : pas d'URL absolue (http:, https:, javascript:...),
 * pas de protocol-relative URL (//evil.tld), pas de backslash (variante
 * de bypass historique traitee comme un slash par certains navigateurs).
 */
export function isSafeRedirect(path: string | null | undefined): path is string {
  if (!path) return false;
  if (!path.startsWith('/')) return false;
  if (path.startsWith('//') || path.startsWith('/\\')) return false;

  return true;
}

export function getSafeRedirect(path: string | null | undefined, fallback: Route): Route {
  return isSafeRedirect(path) ? (path as Route) : fallback;
}
