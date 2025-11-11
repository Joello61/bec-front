import type { Metadata } from 'next';
import CookiePolicyPageClient from '@/components/clients/public/cookies-page-client';
import Script from 'next/script';

const APP_URL =
  process.env.NEXT_PUBLIC_APP_URL || 'https://cobage.joeltech.dev';

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),

  title: 'Politique de Cookies – Co-Bage',
  description:
    'Découvrez comment Co-Bage utilise des cookies et technologies similaires pour améliorer votre expérience, mesurer l’audience et personnaliser certaines fonctionnalités, conformément au RGPD et aux recommandations de la CNIL.',

  robots: {
    index: true,
    follow: true,
  },

  openGraph: {
    type: 'website',
    url: `${APP_URL}/legal/cookies`,
    siteName: 'Co-Bage',
    title: 'Politique de Cookies – Co-Bage',
    description:
      'Informations sur l’utilisation des cookies par la plateforme Co-Bage : finalités, durée de conservation et gestion du consentement utilisateur.',
    images: [
      {
        url: `${APP_URL}/images/og-legal-cookies.jpg`,
        width: 1217,
        height: 500,
        alt: 'Politique de Cookies Co-Bage',
      },
    ],
  },

  twitter: {
    card: 'summary_large_image',
    site: '@cobage_officiel',
    creator: '@cobage_officiel',
    title: 'Politique de Cookies – Co-Bage',
    description:
      'En savoir plus sur l’utilisation des cookies et traceurs sur la plateforme Co-Bage.',
    images: [`${APP_URL}/images/og-legal-cookies.jpg`],
  },

  alternates: {
    canonical: `${APP_URL}/legal/cookies`,
  },

  category: 'Mentions légales',
  classification: 'Politique d’utilisation des cookies',
};

const cookiesPageSchema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebPage',
      name: 'Politique de Cookies',
      description:
        'Informations détaillées sur l’utilisation des cookies et traceurs par Co-Bage, conformément au RGPD et aux recommandations de la CNIL.',
      url: `${APP_URL}/legal/cookies`,
      datePublished: '2025-10-18',
      dateModified: '2025-10-18',
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
          name: 'Politique de Cookies',
          item: `${APP_URL}/legal/cookies`,
        },
      ],
    },
  ],
};

export default function CookiePolicyPage() {
  return (
    <>
      <Script
        id="cookies-page-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(cookiesPageSchema) }}
      />
      <CookiePolicyPageClient />
    </>
  );
}
