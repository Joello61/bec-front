import type { Metadata } from "next";
import HomePageClient from "../components/clients/public/home-page-client";
import Script from "next/script";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://cobage.joeltech.dev";

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),
  title:
    "Co-Bage - Transport Collaboratif Cameroun-Afrique | Covoiturage Bagages",
  description:
    "Envoyez ou transportez vos colis entre le Cameroun, l'Afrique et la diaspora jusqu'à 60% moins cher. Économique, sécurisé et humain. Inscription gratuite.",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  openGraph: {
    type: "website",
    locale: "fr_FR",
    alternateLocale: ["en_US", "fr_CM"],
    url: APP_URL,
    siteName: "Co-Bage",
    title: "Co-Bage - Transport Collaboratif Cameroun-Afrique",
    description:
      "Plateforme de transport collaboratif de colis entre le Cameroun, l'Afrique et leur diaspora. Envoyez ou transportez en toute sécurité.",
    images: [
      {
        url: `${APP_URL}/images/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: "Co-Bage - Covoiturage de Colis Cameroun Afrique",
        type: "image/jpeg",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    site: "@cobage_official",
    creator: "@cobage_official",
    title: "Co-Bage - Transport Collaboratif Cameroun-Afrique",
    description:
      "Envoyez vos colis jusqu'à 60% moins cher ou gagnez de l'argent en transportant. Inscription gratuite 🚀",
    images: [`${APP_URL}/images/twitter-home.jpg`],
  },

  alternates: {
    canonical: APP_URL,
    languages: {
      "fr-FR": `${APP_URL}/`,
      "fr-CM": `${APP_URL}/cm`,
      "en-US": `${APP_URL}/en`,
    },
  },

  category: "Transport & Logistique",
  classification: "Plateforme de transport collaboratif",
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Co-Bage",
  alternateName: ["CoBage", "COBAGE", "co bage", "cobage"],
  url: APP_URL,
  logo: {
    "@type": "ImageObject",
    url: `${APP_URL}/images/logo/logo-1.png`,
    width: 250,
    height: 60,
  },
  description:
    "Plateforme de transport collaboratif de colis entre le Cameroun, l'Afrique et leur diaspora.",
  contactPoint: [
    {
      "@type": "ContactPoint",
      contactType: "Support Client",
      telephone: "+33-07-52-89-20-73",
      email: "support@cobage.joeltech.dev",
      availableLanguage: ["French", "English"],
      areaServed: ["CM", "FR", "US", "CA", "GB", "AF"],
    },
  ],
  sameAs: [
    "https://twitter.com/cobage_official",
    "https://www.facebook.com/cobage",
    "https://www.linkedin.com/company/cobage",
    "https://www.instagram.com/cobage",
  ],
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Co-Bage",
  alternateName: "Co-Bage - Covoiturage de Colis",
  url: APP_URL,
  description:
    "Plateforme de transport collaboratif de colis pour la diaspora camerounaise et africaine.",
  publisher: {
    "@type": "Organization",
    name: "Co-Bage",
  },
  potentialAction: {
    "@type": "SearchAction",
    target: `${APP_URL}/dashboard/explore?q={search_term_string}`,
    "query-input": "required name=search_term_string",
  },
  inLanguage: ["fr-FR", "en-US"],
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Comment fonctionne Co-Bage ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Co-Bage met en relation des voyageurs disposant d'espace dans leurs bagages avec des personnes souhaitant envoyer des colis. Les deux parties se contactent directement pour organiser le transport.",
      },
    },
    {
      "@type": "Question",
      name: "L'inscription est-elle gratuite ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Oui, l'inscription et l'utilisation de Co-Bage sont entièrement gratuites. Les paiements se font directement entre voyageurs et expéditeurs.",
      },
    },
    {
      "@type": "Question",
      name: "Est-ce sécurisé ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Oui. Co-Bage vérifie les profils et permet aux utilisateurs d'évaluer leurs expériences pour renforcer la confiance.",
      },
    },
  ],
};

export default function HomePage() {
  return (
    <>
      <Script
        id="organization-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <Script
        id="website-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <Script
        id="faq-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <HomePageClient />
    </>
  );
}