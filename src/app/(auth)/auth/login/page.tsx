import { Metadata } from "next";
import LoginPageClient from "../../../../components/clients/auth/login-client"

export const metadata: Metadata = {
  title: 'Connexion',
  description: 'Connectez-vous à Co-Bage pour gérer vos voyages et envois de colis entre le Cameroun, l\'Afrique et la diaspora. Accès sécurisé à votre espace personnel.',
  keywords: [
    'connexion Co-Bage',
    'login transport colis',
    'se connecter compte voyageur',
    'accès compte Co-Bage',
    'authentification transporteur',
  ],
  robots: {
    index: false, // Pas d'indexation des pages de connexion
    follow: true,
  },
  openGraph: {
    title: 'Connexion à Co-Bage',
    description: 'Accédez à votre compte pour gérer vos voyages et envois de colis.',
    type: 'website',
    url: '/auth/login',
  },
  twitter: {
    card: 'summary',
    title: 'Connexion à Co-Bage',
    description: 'Accédez à votre compte Co-Bage.',
  },
  alternates: {
    canonical: '/auth/login',
  },
};

export default function LoginPage() {
  return <LoginPageClient/>
}