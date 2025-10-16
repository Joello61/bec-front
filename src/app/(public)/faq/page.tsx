import type { Metadata } from 'next';
import { FaqSection } from '@/components/sections/FaqSection';

export const metadata: Metadata = {
  title: 'Questions Fréquentes (FAQ)',
  description: 'Trouvez toutes les réponses à vos questions sur Co-Bage : fonctionnement, sécurité, paiement, types d\'objets autorisés, évaluations et plus. Guide complet pour voyageurs et expéditeurs.',
  keywords: [
    'FAQ Co-Bage',
    'questions fréquentes transport colis',
    'comment fonctionne Co-Bage',
    'sécurité transport collaboratif',
    'aide covoiturage colis Cameroun',
    'guide utilisation Co-Bage',
  ],
  openGraph: {
    title: 'FAQ Co-Bage - Questions Fréquentes',
    description: 'Toutes les réponses à vos questions sur le transport collaboratif de colis avec Co-Bage.',
    type: 'website',
    url: '/faq',
    images: [
      {
        url: '/images/og-faq.jpg',
        width: 1200,
        height: 630,
        alt: 'FAQ Co-Bage',
      },
    ],
  },
  twitter: {
    card: 'summary',
    title: 'FAQ Co-Bage',
    description: 'Questions fréquentes sur le transport collaboratif de colis.',
  },
  alternates: {
    canonical: '/faq',
  },
};

// Structured Data - FAQPage Schema
const faqPageSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Comment fonctionne Co-Bage ?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Co-Bage met en relation des voyageurs disposant d\'espace dans leurs bagages avec des personnes souhaitant envoyer des colis. Les voyageurs publient leurs trajets, les expéditeurs créent des demandes, et ils se contactent directement pour organiser le transport.',
      },
    },
    {
      '@type': 'Question',
      name: 'La plateforme est-elle sécurisée ?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Oui. Nous avons un système d\'évaluation qui permet de consulter les avis des utilisateurs. Nous recommandons de toujours vérifier le profil de votre interlocuteur et de privilégier les utilisateurs ayant de bonnes évaluations.',
      },
    },
    {
      '@type': 'Question',
      name: 'Comment se fait le paiement ?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Le paiement se fait directement entre le voyageur et l\'expéditeur selon les modalités qu\'ils conviennent ensemble. Co-Bage facilite uniquement la mise en relation, sans gérer les transactions financières.',
      },
    },
    {
      '@type': 'Question',
      name: 'Quels types d\'objets peuvent être transportés ?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Seuls les objets légaux, non dangereux et autorisés par les compagnies aériennes peuvent être transportés. Il est interdit de transporter des substances illicites, des armes, ou tout objet prohibé.',
      },
    },
    {
      '@type': 'Question',
      name: 'L\'inscription est-elle gratuite ?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Oui, l\'inscription et l\'utilisation de la plateforme sont entièrement gratuites. Vous ne payez que pour le transport de votre colis, directement au voyageur.',
      },
    },
  ],
};

export default function FaqPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqPageSchema) }}
      />
      <FaqSection />
    </>
  );
}