import type { Metadata } from 'next';
import { FaqSection } from '@/components/sections/FaqSection';
import Script from 'next/script';

const APP_URL =
  process.env.NEXT_PUBLIC_APP_URL || 'https://cobage.joeltech.dev';

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),

  title: 'FAQ Co-Bage – Questions fréquentes sur le transport collaboratif',
  description:
    'Trouvez toutes les réponses à vos questions sur Co-Bage : fonctionnement, sécurité, paiement, objets autorisés et plus. Le guide complet pour voyageurs et expéditeurs.',

  openGraph: {
    type: 'website',
    url: `${APP_URL}/faq`,
    siteName: 'Co-Bage',
    title: 'FAQ Co-Bage - Questions fréquentes',
    description:
      'Toutes les réponses à vos questions sur le transport collaboratif de colis avec Co-Bage.',
    images: [
      {
        url: `${APP_URL}/images/og-faq.jpg`,
        width: 1200,
        height: 630,
        alt: 'FAQ Co-Bage',
      },
    ],
  },

  twitter: {
    card: 'summary_large_image',
    site: '@cobage_officiel',
    creator: '@cobage_officiel',
    title: 'FAQ Co-Bage',
    description:
      'Questions fréquentes sur la plateforme de transport collaboratif de colis Co-Bage.',
    images: [`${APP_URL}/images/og-faq.jpg`],
  },

  alternates: {
    canonical: `${APP_URL}/faq`,
  },

  category: 'Aide & Support',
  classification: 'Foire aux questions Co-Bage',
};

const faqPageSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Comment fonctionne Co-Bage ?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Co-Bage met en relation des voyageurs disposant d’espace dans leurs bagages avec des personnes souhaitant envoyer des colis. Les voyageurs publient leurs trajets et les expéditeurs créent des demandes ; ils se contactent directement pour organiser le transport.',
      },
    },
    {
      '@type': 'Question',
      name: 'La plateforme est-elle sécurisée ?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Oui. Co-Bage dispose d’un système d’évaluation et de vérification des profils. Nous recommandons de consulter les avis et de privilégier les utilisateurs bien notés.',
      },
    },
    {
      '@type': 'Question',
      name: 'Comment se fait le paiement ?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Le paiement se fait directement entre le voyageur et l’expéditeur selon les modalités convenues ensemble. Co-Bage facilite uniquement la mise en relation et ne gère pas les transactions financières.',
      },
    },
    {
      '@type': 'Question',
      name: 'Quels types d’objets peuvent être transportés ?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Seuls les objets légaux, non dangereux et autorisés par les compagnies aériennes peuvent être transportés. Les substances illicites, armes et objets prohibés sont interdits.',
      },
    },
    {
      '@type': 'Question',
      name: 'L’inscription est-elle gratuite ?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Oui, l’inscription et l’utilisation de la plateforme sont entièrement gratuites. Vous ne payez que le transport, directement au voyageur.',
      },
    },
  ],
};

export default function FaqPage() {
  return (
    <>
      <Script
        id="faq-page-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqPageSchema) }}
      />
      <FaqSection />
    </>
  );
}
