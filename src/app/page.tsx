import type { Metadata } from 'next';
import HomePageClient from '../components/clients/public/home-page-client';

// Metadata ULTRA-optimisées pour la page d'accueil
export const metadata: Metadata = {
  title:
    'Co-Bage - Transport Collaboratif de Colis Cameroun-Afrique | Covoiturage Bagages',
  description:
    "Co-Bage connecte voyageurs et expéditeurs pour un transport de colis économique entre le Cameroun, l'Afrique et la diaspora. Envoyez jusqu'à 60% moins cher ou gagnez de l'argent en transportant. Inscription gratuite, 100% sécurisé.",
  keywords: [
    // Keywords primaires
    'covoiturage colis Cameroun',
    'transport colis Afrique',
    'envoi colis diaspora camerounaise',
    'Co-Bage',

    // Keywords long-tail
    'envoyer colis Cameroun pas cher',
    'transport collaboratif colis Douala Yaoundé',
    'livraison colis Cameroun France',
    'transporter colis voyage international',
    'gagner argent transport colis',

    // Variations locales
    'colis Cameroun vers France',
    'expédition colis Afrique diaspora',
    'marketplace transport colis',
    'plateforme covoiturage bagages',

    // Bénéfices
    'envoi colis économique',
    'transport colis sécurisé',
    'livraison colis rapide Cameroun',
  ],

  // Configuration de base
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },

  // Open Graph - Facebook, LinkedIn, WhatsApp
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    alternateLocale: ['en_US', 'fr_CM'],
    url: '/',
    siteName: 'Co-Bage',
    title:
      'Co-Bage - Transport Collaboratif de Colis Cameroun-Afrique-Diaspora',
    description:
      "Plateforme n°1 pour envoyer ou transporter des colis entre le Cameroun, l'Afrique et leur diaspora. Économique, rapide et sécurisé. Inscrivez-vous gratuitement !",
    images: [
      {
        url: '/images/og-image.jpg', // Image principale 1200x630
        width: 1200,
        height: 630,
        alt: 'Co-Bage - Covoiturage de Colis Cameroun Afrique',
        type: 'image/jpeg',
      },
      {
        url: '/images/hero/hero-image.jpg', // Image secondaire
        width: 800,
        height: 600,
        alt: 'Transport de colis collaboratif',
        type: 'image/jpeg',
      },
    ],
  },

  // Twitter Card
  twitter: {
    card: 'summary_large_image',
    site: '@cobage',
    creator: '@cobage',
    title: 'Co-Bage - Transport Collaboratif Cameroun-Afrique',
    description:
      "Envoyez vos colis jusqu'à 60% moins cher ou gagnez de l'argent en transportant. Inscription gratuite 🚀",
    images: ['/images/twitter-home.jpg'],
  },

  // Canonical URL
  alternates: {
    canonical: '/',
    languages: {
      'fr-FR': '/',
      'fr-CM': '/cm',
      'en-US': '/en',
    },
  },

  // Informations supplémentaires
  category: 'Transport & Logistique',

  // Classification
  classification: 'Plateforme de transport collaboratif',
};

// Structured Data - Organisation (entité principale)
const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Co-Bage',
  alternateName: 'Co-Bage',
  url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  logo: {
    '@type': 'ImageObject',
    url: `${process.env.NEXT_PUBLIC_APP_URL}/images/logo/logo-1.png`,
    width: 250,
    height: 60,
  },
  description:
    "Plateforme de transport collaboratif de colis entre le Cameroun, l'Afrique et leur diaspora",
  foundingDate: '2025',
  founders: [
    {
      '@type': 'Person',
      name: 'Équipe Co-Bage',
    },
  ],
  address: {
    '@type': 'PostalAddress',
    addressCountry: 'FR',
    addressLocality: 'France',
  },
  contactPoint: [
    {
      '@type': 'ContactPoint',
      contactType: 'Support Client',
      telephone: '+33-07-52-89-20-73',
      email: 'support@cobage.joeltech.dev',
      availableLanguage: ['French', 'English'],
      areaServed: ['CM', 'FR', 'US', 'CA', 'GB', 'AF'],
    },
  ],
  sameAs: [
    'https://twitter.com/cobage',
    'https://www.facebook.com/cobage',
    'https://www.linkedin.com/company/cobage',
    'https://www.instagram.com/cobage',
  ],
  areaServed: [
    {
      '@type': 'Country',
      name: 'Cameroun',
    },
    {
      '@type': 'Continent',
      name: 'Afrique',
    },
    {
      '@type': 'Country',
      name: 'France',
    },
  ],
};

// Structured Data - WebSite avec SearchAction
const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Co-Bage',
  alternateName: 'Co-Bage - Covoiturage de Colis',
  url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  description:
    'Plateforme de transport collaboratif de colis pour la diaspora camerounaise et africaine',
  publisher: {
    '@type': 'Organization',
    name: 'Co-Bage',
  },
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/explore?q={search_term_string}`,
    },
    'query-input': 'required name=search_term_string',
  },
  inLanguage: ['fr-FR', 'en-US'],
};

// Structured Data - Service (offre principale)
const serviceSchema = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  serviceType: 'Transport collaboratif de colis',
  name: 'Co-Bage - Service de Transport Collaboratif',
  description:
    "Service de mise en relation entre voyageurs et expéditeurs pour le transport économique de colis entre le Cameroun, l'Afrique et la diaspora",
  provider: {
    '@type': 'Organization',
    name: 'Co-Bage',
    url: process.env.NEXT_PUBLIC_APP_URL,
  },
  serviceOutput: 'Transport de colis international',
  areaServed: [
    {
      '@type': 'Country',
      name: 'Cameroun',
    },
    {
      '@type': 'Continent',
      name: 'Afrique',
    },
  ],
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Services Co-Bage',
    itemListElement: [
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Transport de colis par voyageur',
          description: 'Envoyez vos colis avec des voyageurs de confiance',
        },
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: "Gagner de l'argent en transportant",
          description: 'Rentabilisez vos voyages en transportant des colis',
        },
      },
    ],
  },
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'EUR',
    description: 'Inscription gratuite - Commissions sur transactions',
  },
  audience: {
    '@type': 'Audience',
    audienceType:
      'Diaspora camerounaise et africaine, voyageurs internationaux, expéditeurs de colis',
    geographicArea: {
      '@type': 'Place',
      name: 'Cameroun, Afrique, France, Europe, Amérique du Nord',
    },
  },
  termsOfService: `${process.env.NEXT_PUBLIC_APP_URL}/legal/terms`,
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '4.8',
    reviewCount: '150',
    bestRating: '5',
    worstRating: '1',
  },
};

// Structured Data - BreadcrumbList
const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'Accueil',
      item: process.env.NEXT_PUBLIC_APP_URL,
    },
  ],
};

// Structured Data - FAQPage (extrait du FAQ section)
const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Comment fonctionne Co-Bage ?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "Co-Bage met en relation des voyageurs disposant d'espace dans leurs bagages avec des personnes souhaitant envoyer des colis. Les voyageurs publient leurs trajets, les expéditeurs créent des demandes, et ils se contactent directement pour organiser le transport de manière sécurisée.",
      },
    },
    {
      '@type': 'Question',
      name: "L'inscription est-elle gratuite ?",
      acceptedAnswer: {
        '@type': 'Answer',
        text: "Oui, l'inscription et l'utilisation de la plateforme Co-Bage sont entièrement gratuites. Vous ne payez que pour le transport de votre colis, directement au voyageur selon vos accords.",
      },
    },
    {
      '@type': 'Question',
      name: 'Est-ce sécurisé ?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "Oui. Co-Bage dispose d'un système de vérification d'identité et d'évaluation des utilisateurs. Nous recommandons de toujours vérifier les profils et de privilégier les utilisateurs ayant de bonnes évaluations.",
      },
    },
  ],
};

export default function HomePage() {
  return (
    <>
      {/* Injection de tous les Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            organizationSchema,
            websiteSchema,
            serviceSchema,
            breadcrumbSchema,
            faqSchema,
          ]),
        }}
      />
      <HomePageClient />
    </>
  );
}
