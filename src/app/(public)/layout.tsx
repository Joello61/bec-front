import type { Metadata } from 'next';
import PublicLayoutClient from '../../components/clients/public/public-layout-client';

// Metadata pour les pages publiques (About, FAQ, Contact, etc.)
export const metadata: Metadata = {
  title: {
    default: 'Co-Bage - À propos',
    template: '%s | Co-Bage',
  },
  description: 'Découvrez Co-Bage, la plateforme qui révolutionne le transport de colis entre le Cameroun, l\'Afrique et leur diaspora. Économique, sécurisé et humain.',
  keywords: [
    'à propos Co-Bage',
    'comment ça marche covoiturage colis',
    'FAQ transport colis Cameroun',
    'contact Co-Bage',
    'aide envoi colis Afrique',
    'questions transport collaboratif',
    'CoBage', 'Co-Bage', 'COBAGE', 'co bage', 'cobage',
  ],
  openGraph: {
    title: 'Co-Bage - Transport Collaboratif de Colis',
    description: 'Découvrez comment Co-Bage connecte voyageurs et expéditeurs pour un transport de colis économique et sécurisé.',
    type: 'website',
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Co-Bage - À propos',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'À propos de Co-Bage',
    description: 'La plateforme de transport collaboratif de colis pour la diaspora africaine.',
  },
};

// Server Component qui wrap le Client Component
export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <PublicLayoutClient>{children}</PublicLayoutClient>;
}