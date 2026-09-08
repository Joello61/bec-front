'use client';

/**
 * Global error boundary racine (segment /_global-error). Doit definir son propre document
 * complet (html/body) et ne peut dependre d'aucun provider du layout racine (contexte non
 * disponible ici) ni des styles globaux (non charges pour ce segment) - cf. doc officielle
 * Next.js. Volontairement minimal et sans dependance (pas de Tailwind, pas de framer-motion) :
 * Next.js 16.x genere sinon son propre gabarit de secours en son absence, qui plante de facon
 * connue au build (vercel/next.js#86178, #95741 - regression confirmee, sans correctif upstream
 * a ce jour) en tentant d'acceder a un contexte React absent a ce niveau.
 */
export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="fr">
      <body
        style={{
          margin: 0,
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          backgroundColor: '#f9fafb',
          color: '#111827',
        }}
      >
        <div style={{ textAlign: 'center', maxWidth: '28rem', padding: '1.5rem' }}>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.75rem' }}>
            Une erreur inattendue est survenue
          </h1>
          <p style={{ color: '#4b5563', marginBottom: '1.5rem' }}>
            Nous sommes désolés pour la gêne occasionnée. Vous pouvez réessayer ou revenir à
            l&apos;accueil.
          </p>
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
            <button
              onClick={reset}
              style={{
                padding: '0.5rem 1.25rem',
                borderRadius: '0.5rem',
                border: 'none',
                backgroundColor: '#00695c',
                color: '#ffffff',
                cursor: 'pointer',
              }}
            >
              Réessayer
            </button>
            {/* Lien natif volontaire, pas next/link : une erreur globale peut refleter un
                etat du routeur client corrompu, un rechargement complet est plus sur ici. */}
            {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
            <a
              href="/"
              style={{
                padding: '0.5rem 1.25rem',
                borderRadius: '0.5rem',
                border: '1px solid #d1d5db',
                color: '#111827',
                textDecoration: 'none',
              }}
            >
              Accueil
            </a>
          </div>
        </div>
      </body>
    </html>
  );
}
