import { Metadata } from 'next';
import PrivacyPageClient from '../../../../components/clients/public/privacy-client';

export const metadata: Metadata = {
  title: 'Politique de Confidentialité',
  description:
    'Découvrez comment Co-Bage collecte, utilise et protège vos données personnelles. Notre engagement RGPD pour la protection de votre vie privée sur notre plateforme de transport collaboratif.',
  keywords: [
    'politique confidentialité Co-Bage',
    'protection données personnelles',
    'RGPD Co-Bage',
    'vie privée transport colis',
    'données utilisateurs Co-Bage',
    'cookies Co-Bage',
    'CoBage', 'Co-Bage', 'COBAGE', 'co bage', 'cobage',
  ],
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: 'Politique de Confidentialité - Co-Bage',
    description:
      'Comment nous protégeons vos données personnelles en conformité avec le RGPD.',
    type: 'website',
    url: '/legal/privacy',
  },
  twitter: {
    card: 'summary',
    title: 'Politique de Confidentialité Co-Bage',
    description: 'Protection de vos données personnelles.',
  },
  alternates: {
    canonical: '/legal/privacy',
  },
};

// Structured Data - PrivacyPolicy
const privacyPageSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: 'Politique de Confidentialité',
  description:
    'Politique de confidentialité et protection des données de Co-Bage',
  url: process.env.NEXT_PUBLIC_APP_URL + '/legal/privacy',
  publisher: {
    '@type': 'Organization',
    name: 'Co-Bage',
  },
  datePublished: '2025-01-01',
  dateModified: '2025-01-01',
  inLanguage: 'fr-FR',
  about: {
    '@type': 'Thing',
    name: 'Protection des données personnelles',
  },
};

export default function PrivacyPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(privacyPageSchema) }}
      />
      <PrivacyPageClient />
    </>
  );
}
