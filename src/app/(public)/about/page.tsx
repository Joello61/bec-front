import type { Metadata } from 'next';
import { AboutSection } from '@/components/sections';

const APP_URL =
  process.env.NEXT_PUBLIC_APP_URL || 'https://cobage.joeltech.dev';

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),

  title: 'À propos de Co-Bage - Transport Collaboratif Cameroun-Afrique',
  description:
    "Découvrez Co-Bage, la première plateforme camerounaise de transport collaboratif de colis entre le Cameroun, l'Afrique et la diaspora. Économique, sécurisé et humain.",

  openGraph: {
    type: 'website',
    url: `${APP_URL}/about`,
    siteName: 'Co-Bage',
    title: 'À propos de Co-Bage - Transport Collaboratif Cameroun-Afrique',
    description:
      'La plateforme camerounaise qui connecte voyageurs et expéditeurs pour un transport de colis économique et sécurisé.',
    images: [
      {
        url: `${APP_URL}/images/og-about.jpg`,
        width: 1200,
        height: 630,
        alt: 'À propos de Co-Bage',
      },
    ],
  },

  twitter: {
    card: 'summary_large_image',
    site: '@cobage_officiel',
    creator: '@cobage_officiel',
    title: 'À propos de Co-Bage',
    description:
      "Plateforme de transport collaboratif de colis entre le Cameroun, l'Afrique et la diaspora.",
    images: [`${APP_URL}/images/twitter-about.jpg`],
  },

  alternates: {
    canonical: `${APP_URL}/about`,
  },

  category: 'Transport & Logistique',
  classification: 'Plateforme de transport collaboratif',
};

export default function AboutPage() {
  return <AboutSection />;
}
