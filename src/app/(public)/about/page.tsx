import type { Metadata } from 'next';
import { AboutSection } from '@/components/sections';

export const metadata: Metadata = {
  title: 'À propos de Co-Bage',
  description: 'Découvrez Co-Bage, la première plateforme camerounaise de transport collaboratif de colis. Connectez voyageurs et expéditeurs pour un transport intelligent, économique et sécurisé entre le Cameroun, l\'Afrique et la diaspora.',
  keywords: [
    'à propos Co-Bage',
    'plateforme transport collaboratif Cameroun',
    'qui sommes nous Co-Bage',
    'mission Co-Bage',
    'transport colis Cameroun Afrique',
    'covoiturage bagages camerounais',
  ],
  openGraph: {
    title: 'À propos de Co-Bage - Transport Collaboratif Cameroun-Afrique',
    description: 'La première plateforme camerounaise qui connecte voyageurs et expéditeurs pour un transport de colis économique et sécurisé.',
    type: 'website',
    url: '/about',
    images: [
      {
        url: '/images/og-about.jpg',
        width: 1200,
        height: 630,
        alt: 'À propos de Co-Bage',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'À propos de Co-Bage',
    description: 'Plateforme de transport collaboratif entre le Cameroun, l\'Afrique et la diaspora.',
  },
  alternates: {
    canonical: '/about',
  },
};

export default function AboutPage() {
  return <AboutSection />;
}