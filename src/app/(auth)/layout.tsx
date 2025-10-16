import type { Metadata } from 'next';
import AuthLayoutClient from '../../components/clients/auth/auth-layout-client';

// Metadata pour toutes les pages d'authentification
export const metadata: Metadata = {
  title: {
    default: 'Connexion - Co-Bage',
    template: '%s | Co-Bage',
  },
  description: 'Connectez-vous à Co-Bage pour transporter ou envoyer des colis entre le Cameroun, l\'Afrique et leur diaspora. Accédez à votre compte voyageur ou expéditeur.',
  keywords: [
    'connexion Co-Bage',
    'inscription transporteur colis',
    'compte voyageur Cameroun',
    'créer compte Co-Bage',
    'login transport colis',
    's\'inscrire covoiturage colis',
  ],
  robots: {
    index: false, // On n'indexe généralement pas les pages d'auth
    follow: true,
  },
  openGraph: {
    title: 'Rejoignez Co-Bage - Transport Collaboratif',
    description: 'Créez votre compte pour transporter ou envoyer des colis entre le Cameroun, l\'Afrique et la diaspora.',
    type: 'website',
    images: [
      {
        url: '/images/auth/og-auth.jpg',
        width: 1200,
        height: 630,
        alt: 'Co-Bage - Connexion',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Rejoignez Co-Bage',
    description: 'Créez votre compte pour transporter ou envoyer des colis.',
  },
  alternates: {
    canonical: '/auth/login',
  },
};

// Server Component qui wrap le Client Component
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AuthLayoutClient>{children}</AuthLayoutClient>;
}