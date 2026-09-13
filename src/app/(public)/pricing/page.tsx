import type { Metadata } from 'next';

import PricingPageClient from '@/components/clients/public/pricing-client';
import { boostsApi } from '@/lib/api/boosts';
import { getServerApiBaseUrl } from '@/lib/api/server';
import { subscriptionsApi } from '@/lib/api/subscriptions';

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://cobage.joeltech.fr';

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),
  title: 'Tarifs - Plans et boosts Co-Bage',
  description:
    'Découvrez les plans Free, Plus et Pro de Co-Bage ainsi que les offres de boost pour mettre en avant vos voyages et demandes de transport de colis.',
  openGraph: {
    type: 'website',
    url: `${APP_URL}/pricing`,
    siteName: 'Co-Bage',
    title: 'Tarifs Co-Bage - Plans et boosts',
    description:
      'Comparez les plans Free, Plus et Pro et les offres de boost de visibilité de Co-Bage.',
    images: [
      {
        url: `${APP_URL}/images/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: 'Tarifs Co-Bage',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@cobage_officiel',
    title: 'Tarifs Co-Bage',
    description: 'Plans Free, Plus, Pro et boosts de visibilité pour vos annonces Co-Bage.',
  },
  alternates: {
    canonical: `${APP_URL}/pricing`,
  },
};

// Rendu dynamique (a la requete), jamais au build : un export `revalidate` (ISR) ferait
// tenter a `next build` un fetch reel pendant le prerendering - or le job CI "Frontend -
// Build" (.github/workflows/lint.yml) tourne sur un runner nu sans aucun backend
// accessible, et meme le build Docker de deploiement (deploy.yml) ne devrait pas dependre
// de la disponibilite de l'API prod/staging au moment de construire l'image. Verifie en
// pratique : `npm run build` echoue systematiquement sur cette page des qu'un
// `revalidate` est present et qu'aucune API n'est joignable. Le SEO reste couvert (HTML
// genere cote serveur a chaque requete, identique pour un crawler), seul le cache est
// sacrifie.
export const dynamic = 'force-dynamic';

export default async function PricingPage() {
  const serverConfig = { baseURL: getServerApiBaseUrl() };

  const [plans, offers] = await Promise.all([
    subscriptionsApi.getPlans(serverConfig),
    boostsApi.getOffers(serverConfig),
  ]);

  return <PricingPageClient plans={plans} offers={offers} />;
}
