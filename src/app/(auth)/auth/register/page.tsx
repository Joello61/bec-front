import { Metadata } from "next";
import RegisterPageClient from "../../../../components/clients/auth/register-client";

export const metadata: Metadata = {
  title: 'Inscription',
  description: 'Rejoignez Co-Bage gratuitement ! Transportez des colis lors de vos voyages internationaux ou envoyez vos colis vers le Cameroun et l\'Afrique à petit prix.',
  keywords: [
    'inscription Co-Bage',
    's\'inscrire transporteur colis',
    'créer compte voyageur',
    'devenir transporteur colis Cameroun',
    'inscription gratuite Co-Bage',
    'rejoindre communauté transport collaboratif',
  ],
  robots: {
    index: false, // Pas d'indexation des pages d'inscription
    follow: true,
  },
  openGraph: {
    title: 'Rejoignez Co-Bage - Inscription Gratuite',
    description: 'Créez votre compte pour transporter ou envoyer des colis entre le Cameroun, l\'Afrique et la diaspora.',
    type: 'website',
    url: '/auth/register',
    images: [
      {
        url: '/images/auth/register-og.jpg',
        width: 1200,
        height: 630,
        alt: 'Inscription Co-Bage',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Rejoignez Co-Bage',
    description: 'Inscrivez-vous gratuitement et commencez à transporter ou envoyer des colis.',
  },
  alternates: {
    canonical: '/auth/register',
  },
};

export default function RegisterPage() {
  return <RegisterPageClient/>
}