/**
 * Decodage du payload d'un JWT SANS verification de signature.
 * Usage strictement limite au routage (proxy.ts) : la decision d'autorisation
 * reelle reste toujours revalidee par le backend Symfony (Voters).
 *
 * Implementation compatible Edge Runtime (atob, pas Buffer/Node.js).
 */
export function decodeJwtRoles(token: string): string[] {
  try {
    const payloadSegment = token.split('.')[1];
    if (!payloadSegment) return [];

    const base64 = payloadSegment.replace(/-/g, '+').replace(/_/g, '/');
    const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), '=');
    const payload = JSON.parse(atob(padded));

    return Array.isArray(payload.roles) ? payload.roles : [];
  } catch {
    return [];
  }
}
