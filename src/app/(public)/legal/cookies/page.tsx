import CookiePolicyPageClient from '@/components/clients/public/cookies-page-client';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Politique de Cookies - Co-Bage',
  description:
    "Découvrez comment Co-Bage utilise des cookies et technologies similaires pour améliorer votre expérience utilisateur, mesurer l'audience et personnaliser certaines fonctionnalités.",
  keywords: [
    'cookies Co-Bage',
    'politique cookies',
    'gestion des cookies',
    'traceurs',
    'consentement cookies CNIL',
    'CoBage', 'Co-Bage', 'COBAGE', 'co bage', 'cobage',
  ],
  robots: {
    index: true, // les politiques légales doivent être indexées
    follow: true,
  },
  openGraph: {
    title: 'Politique de Cookies - Co-Bage',
    description:
      "Informations sur l'utilisation des cookies par la plateforme Co-Bage : finalités, durée de conservation, gestion du consentement.",
    type: 'website',
    url: '/legal/cookies',
  },
  twitter: {
    card: 'summary',
    title: 'Politique de Cookies - Co-Bage',
    description:
      "En savoir plus sur l'utilisation des cookies sur la plateforme Co-Bage.",
  },
  alternates: {
    canonical: '/legal/cookies',
  },
};

// Données structurées JSON-LD pour le SEO
const cookiesPageSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: 'Politique de Cookies',
  description:
    "Informations détaillées sur l'utilisation des cookies et traceurs par Co-Bage, conformément au RGPD et aux recommandations de la CNIL.",
  url: process.env.NEXT_PUBLIC_APP_URL + '/legal/cookies',
  publisher: {
    '@type': 'Organization',
    name: 'Co-Bage',
    url: process.env.NEXT_PUBLIC_APP_URL,
  },
  datePublished: '2025-10-18', // 📅 date de mise en ligne
  dateModified: '2025-10-18', // 📅 date de dernière mise à jour
  inLanguage: 'fr-FR',
};

export default function CookiePolicyPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(cookiesPageSchema) }}
      />
      <CookiePolicyPageClient />
    </>
  );
}
