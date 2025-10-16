import type { Metadata } from 'next';
import { HowItWorksSection } from '@/components/sections/HowItWorksSection';

export const metadata: Metadata = {
  title: 'Comment ça marche ?',
  description: 'Découvrez en 4 étapes simples comment utiliser Co-Bage pour transporter ou envoyer des colis entre le Cameroun, l\'Afrique et la diaspora. Guide complet pour voyageurs et expéditeurs.',
  keywords: [
    'comment utiliser Co-Bage',
    'guide transport colis collaboratif',
    'étapes covoiturage colis',
    'fonctionnement Co-Bage',
    'tutoriel envoi colis Cameroun',
    'devenir transporteur colis',
  ],
  openGraph: {
    title: 'Comment fonctionne Co-Bage ? Guide Complet',
    description: 'Processus simple en 4 étapes pour transporter ou envoyer des colis de manière économique et sécurisée.',
    type: 'website',
    url: '/how-it-works',
    images: [
      {
        url: '/images/og-how-it-works.jpg',
        width: 1200,
        height: 630,
        alt: 'Comment ça marche - Co-Bage',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Comment ça marche - Co-Bage',
    description: 'Guide en 4 étapes pour utiliser Co-Bage.',
  },
  alternates: {
    canonical: '/how-it-works',
  },
};

// Structured Data - HowTo Schema
const howToSchema = {
  '@context': 'https://schema.org',
  '@type': 'HowTo',
  name: 'Comment utiliser Co-Bage pour transporter des colis',
  description: 'Guide étape par étape pour utiliser Co-Bage, la plateforme de transport collaboratif de colis',
  step: [
    {
      '@type': 'HowToStep',
      position: 1,
      name: 'Recherchez',
      text: 'Trouvez un voyageur allant vers votre destination ou une demande de transport correspondant à votre trajet.',
      image: process.env.NEXT_PUBLIC_APP_URL + '/images/how-it-works/step1.jpg',
    },
    {
      '@type': 'HowToStep',
      position: 2,
      name: 'Contactez',
      text: 'Échangez directement via notre messagerie sécurisée pour convenir des détails du transport.',
      image: process.env.NEXT_PUBLIC_APP_URL + '/images/how-it-works/step2.jpg',
    },
    {
      '@type': 'HowToStep',
      position: 3,
      name: 'Organisez',
      text: 'Convenez ensemble du lieu, de l\'heure et des modalités de remise du colis.',
      image: process.env.NEXT_PUBLIC_APP_URL + '/images/how-it-works/step3.jpg',
    },
    {
      '@type': 'HowToStep',
      position: 4,
      name: 'Évaluez',
      text: 'Après la livraison, laissez un avis pour renforcer la confiance dans la communauté.',
      image: process.env.NEXT_PUBLIC_APP_URL + '/images/how-it-works/step4.jpg',
    },
  ],
  totalTime: 'PT30M',
};

export default function HowItWorksPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
      />
      <HowItWorksSection />
    </>
  );
}