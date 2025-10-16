import { Metadata } from 'next';
import TrustSafetyPageClient from '../../../../components/clients/public/trust-safety-client';

export const metadata: Metadata = {
  title: 'Confiance et Sécurité',
  description:
    "Conseils de sécurité pour utiliser Co-Bage en toute confiance. Vérification d'identité, objets interdits, signalement et bonnes pratiques pour un transport de colis sécurisé entre voyageurs et expéditeurs.",
  keywords: [
    'sécurité Co-Bage',
    'confiance transport colis',
    'objets interdits transport',
    'vérification identité voyageur',
    'signalement Co-Bage',
    'bonnes pratiques covoiturage colis',
    'transport sécurisé Cameroun',
  ],
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: 'Confiance et Sécurité - Co-Bage',
    description:
      'Découvrez nos mesures de sécurité et conseils pour un transport de colis en toute confiance.',
    type: 'website',
    url: '/legal/trust-safety',
    images: [
      {
        url: '/images/og-trust-safety.jpg',
        width: 1200,
        height: 630,
        alt: 'Confiance et Sécurité Co-Bage',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Confiance et Sécurité Co-Bage',
    description: 'Conseils pour transporter vos colis en toute sécurité.',
  },
  alternates: {
    canonical: '/legal/trust-safety',
  },
};

// Structured Data - WebPage avec focus sécurité
const trustSafetyPageSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: 'Confiance et Sécurité',
  description: 'Guide de sécurité et bonnes pratiques pour utiliser Co-Bage',
  url: process.env.NEXT_PUBLIC_APP_URL + '/legal/trust-safety',
  publisher: {
    '@type': 'Organization',
    name: 'Co-Bage',
  },
  datePublished: '2025-01-01',
  dateModified: '2025-01-01',
  inLanguage: 'fr-FR',
  mainEntity: {
    '@type': 'Guide',
    name: 'Guide de sécurité Co-Bage',
    about: 'Conseils de sécurité pour le transport collaboratif de colis',
  },
};

// Structured Data - ItemList pour les règles de sécurité
const safetyRulesSchema = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: 'Règles de sécurité Co-Bage',
  description: 'Liste des règles de sécurité à respecter sur la plateforme',
  itemListElement: [
    {
      '@type': 'ListItem',
      position: 1,
      name: "Vérification d'identité obligatoire",
      description:
        'Tous les utilisateurs doivent vérifier leur identité et numéro de téléphone',
    },
    {
      '@type': 'ListItem',
      position: 2,
      name: 'Objets interdits',
      description:
        'Interdiction stricte de transporter drogues, armes, explosifs et substances dangereuses',
    },
    {
      '@type': 'ListItem',
      position: 3,
      name: 'Système de signalement',
      description:
        'Possibilité de signaler tout comportement ou annonce suspecte',
    },
    {
      '@type': 'ListItem',
      position: 4,
      name: 'Évaluations et avis',
      description:
        "Système d'évaluation pour construire la confiance dans la communauté",
    },
  ],
};

export default function TrustSafetyPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([trustSafetyPageSchema, safetyRulesSchema]),
        }}
      />
      <TrustSafetyPageClient />
    </>
  );
}
