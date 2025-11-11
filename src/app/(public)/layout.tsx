import type { Metadata } from 'next';
import PublicLayoutClient from '../../components/clients/public/public-layout-client';

const APP_URL =
  process.env.NEXT_PUBLIC_APP_URL || 'https://cobage.joeltech.dev';

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),
  title: {
    default: 'Co-Bage - À propos',
    template: '%s | Co-Bage',
  },
  description:
    "Découvrez Co-Bage, la plateforme qui révolutionne le transport de colis entre le Cameroun, l'Afrique et leur diaspora. Économique, sécurisé et humain.",
  openGraph: {
    title: 'Co-Bage - Transport Collaboratif de Colis',
    description:
      'Découvrez comment Co-Bage connecte voyageurs et expéditeurs pour un transport de colis économique et sécurisé.',
    type: 'website',
    url: `${APP_URL}/about`,
    siteName: 'Co-Bage',
    images: [
      {
        url: `${APP_URL}/images/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: 'Co-Bage - À propos',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@cobage_officiel',
    creator: '@cobage_officiel',
    title: 'À propos de Co-Bage',
    description:
      'La plateforme de transport collaboratif de colis pour la diaspora africaine.',
    images: [`${APP_URL}/images/twitter-image.jpg`],
  },
  alternates: {
    canonical: `${APP_URL}/about`,
  },
  category: 'Transport & Logistique',
};

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <PublicLayoutClient>{children}</PublicLayoutClient>;
}
