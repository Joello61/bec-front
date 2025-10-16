import { ContactSection } from "@/components/sections";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Contactez-nous',
  description: 'Une question sur Co-Bage ? Contactez notre équipe support disponible 24/7. Obtenez de l\'aide pour vos voyages, envois de colis ou tout problème technique entre le Cameroun et l\'Afrique.',
  keywords: [
    'contact Co-Bage',
    'support Co-Bage',
    'aide transport colis',
    'assistance voyageur',
    'service client Co-Bage',
    'contacter équipe Co-Bage',
  ],
  openGraph: {
    title: 'Contactez Co-Bage - Support & Assistance',
    description: 'Notre équipe est disponible 24/7 pour répondre à vos questions sur le transport collaboratif de colis.',
    type: 'website',
    url: '/contact',
    images: [
      {
        url: '/images/og-contact.jpg',
        width: 1200,
        height: 630,
        alt: 'Contact Co-Bage',
      },
    ],
  },
  twitter: {
    card: 'summary',
    title: 'Contactez Co-Bage',
    description: 'Support disponible 24/7 pour vous aider.',
  },
  alternates: {
    canonical: '/contact',
  },
};

// Structured Data - ContactPage Schema
const contactPageSchema = {
  '@context': 'https://schema.org',
  '@type': 'ContactPage',
  name: 'Contact Co-Bage',
  description: 'Page de contact pour Co-Bage, plateforme de transport collaboratif de colis',
  url: process.env.NEXT_PUBLIC_APP_URL + '/contact',
  mainEntity: {
    '@type': 'Organization',
    name: 'Co-Bage',
    email: 'support@cobage.com',
    telephone: '+33-07-52-89-20-73',
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'Support Client',
      availableLanguage: ['French'],
      areaServed: ['CM', 'FR', 'US', 'CA', 'GB'],
    },
  },
};

export default function ContactPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(contactPageSchema) }}
      />
      <ContactSection />
    </>
  );
}