import { Metadata } from 'next';
import TermsPageClient from '../../../../components/clients/public/terms-client';

export const metadata: Metadata = {
  title: "Conditions Générales d'Utilisation (CGU)",
  description:
    "Consultez les conditions générales d'utilisation de Co-Bage. Découvrez vos droits et obligations en tant qu'utilisateur de notre plateforme de transport collaboratif de colis entre le Cameroun, l'Afrique et la diaspora.",
  keywords: [
    'CGU Co-Bage',
    'conditions générales utilisation',
    'règles plateforme Co-Bage',
    'termes et conditions transport colis',
    'mentions légales Co-Bage',
    'CoBage', 'Co-Bage', 'COBAGE', 'co bage', 'cobage',
  ],
  robots: {
    index: true, // Pages légales doivent être indexées
    follow: true,
  },
  openGraph: {
    title: 'CGU - Co-Bage',
    description: "Conditions générales d'utilisation de la plateforme Co-Bage.",
    type: 'website',
    url: '/legal/terms',
  },
  twitter: {
    card: 'summary',
    title: 'CGU Co-Bage',
    description: "Conditions générales d'utilisation.",
  },
  alternates: {
    canonical: '/legal/terms',
  },
};

// Structured Data - WebPage avec datePublished
const termsPageSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: "Conditions Générales d'Utilisation",
  description: "Conditions générales d'utilisation de Co-Bage",
  url: process.env.NEXT_PUBLIC_APP_URL + '/legal/terms',
  publisher: {
    '@type': 'Organization',
    name: 'Co-Bage',
  },
  datePublished: '2025-01-01', // À mettre à jour avec la vraie date
  dateModified: '2025-01-01', // À mettre à jour lors des modifications
  inLanguage: 'fr-FR',
};

export default function TermsPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(termsPageSchema) }}
      />
      <TermsPageClient />
    </>
  );
}
