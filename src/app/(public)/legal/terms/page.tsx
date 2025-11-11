import type { Metadata } from 'next';
import TermsPageClient from '@/components/clients/public/terms-client';
import Script from 'next/script';

const APP_URL =
  process.env.NEXT_PUBLIC_APP_URL || 'https://cobage.joeltech.dev';

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),

  title: 'Conditions Générales d’Utilisation (CGU) – Co-Bage',
  description:
    'Lisez les conditions générales d’utilisation de Co-Bage. Découvrez vos droits et obligations en tant qu’utilisateur de la plateforme de transport collaboratif de colis entre le Cameroun, l’Afrique et la diaspora.',

  robots: { index: true, follow: true },

  openGraph: {
    type: 'website',
    url: `${APP_URL}/legal/terms`,
    siteName: 'Co-Bage',
    title: 'Conditions Générales d’Utilisation (CGU) – Co-Bage',
    description:
      'Conditions générales d’utilisation de la plateforme Co-Bage : droits, obligations et cadre d’utilisation du service.',
    images: [
      {
        url: `${APP_URL}/images/og-legal-terms.jpg`,
        width: 1200,
        height: 630,
        alt: 'Conditions Générales d’Utilisation Co-Bage',
      },
    ],
  },

  twitter: {
    card: 'summary_large_image',
    site: '@cobage_officiel',
    creator: '@cobage_officiel',
    title: 'CGU – Co-Bage',
    description:
      'Conditions générales d’utilisation de la plateforme Co-Bage pour voyageurs et expéditeurs.',
    images: [`${APP_URL}/images/og-legal-terms.jpg`],
  },

  alternates: {
    canonical: `${APP_URL}/legal/terms`,
  },

  category: 'Mentions légales',
  classification: 'Conditions Générales d’Utilisation',
};

const termsPageSchema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': ['WebPage', 'Legislation'],
      name: 'Conditions Générales d’Utilisation (CGU)',
      description:
        'Conditions générales d’utilisation de Co-Bage. Informations légales sur l’utilisation du service et les droits des utilisateurs.',
      url: `${APP_URL}/legal/terms`,
      datePublished: '2025-01-01',
      dateModified: '2025-01-01',
      inLanguage: 'fr-FR',
      isPartOf: {
        '@type': 'WebSite',
        name: 'Co-Bage',
        url: APP_URL,
      },
      publisher: {
        '@type': 'Organization',
        name: 'Co-Bage',
        url: APP_URL,
        logo: {
          '@type': 'ImageObject',
          url: `${APP_URL}/images/logo/logo-1.png`,
          width: 250,
          height: 60,
        },
      },
      legislationType: 'Conditions Générales d’Utilisation',
      legislationJurisdiction: {
        '@type': 'Country',
        name: 'France',
      },
      legislationIdentifier: 'CGU-CoBage-2025',
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Accueil',
          item: APP_URL,
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Mentions légales',
          item: `${APP_URL}/legal`,
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: 'Conditions Générales d’Utilisation',
          item: `${APP_URL}/legal/terms`,
        },
      ],
    },
  ],
};

export default function TermsPage() {
  return (
    <>
      <Script
        id="terms-page-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(termsPageSchema) }}
      />
      <TermsPageClient />
    </>
  );
}
