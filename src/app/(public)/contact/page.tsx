import type { Metadata } from "next";
import { ContactSection } from "@/components/sections";
import Script from "next/script";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://cobage.joeltech.dev";

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),

  title: "Contactez Co-Bage - Support et Assistance 24/7",
  description:
    "Une question sur Co-Bage ? Contactez notre équipe support disponible 24/7. Obtenez de l'aide pour vos voyages, envois de colis ou problèmes techniques entre le Cameroun, l'Afrique et la diaspora.",

  openGraph: {
    type: "website",
    url: `${APP_URL}/contact`,
    siteName: "Co-Bage",
    title: "Contactez Co-Bage - Support & Assistance 24/7",
    description:
      "Notre équipe vous aide 24h/24 et 7j/7 pour tout besoin lié à vos voyages ou envois de colis.",
    images: [
      {
        url: `${APP_URL}/images/og-contact.jpg`,
        width: 1200,
        height: 630,
        alt: "Contact Co-Bage",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    site: "@cobage_official",
    creator: "@cobage_official",
    title: "Contactez Co-Bage",
    description:
      "Notre support est disponible 24/7 pour répondre à toutes vos questions.",
    images: [`${APP_URL}/images/twitter-contact.jpg`],
  },

  alternates: {
    canonical: `${APP_URL}/contact`,
  },

  category: "Support & Assistance",
  classification: "Page de contact officielle",
};

const contactPageSchema = {
  "@context": "https://schema.org",
  "@type": "ContactPage",
  name: "Contact Co-Bage",
  description:
    "Page de contact officielle de Co-Bage, plateforme de transport collaboratif de colis.",
  url: `${APP_URL}/contact`,
  mainEntity: {
    "@type": "Organization",
    name: "Co-Bage",
    url: APP_URL,
    email: "support@cobage.joeltech.dev",
    telephone: "+33-07-52-89-20-73",
    logo: `${APP_URL}/images/logo/logo-1.png`,
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "Support Client",
      email: "support@cobage.joeltech.dev",
      telephone: "+33-07-52-89-20-73",
      availableLanguage: ["French", "English"],
      areaServed: ["CM", "FR", "US", "CA", "GB"],
      hoursAvailable: {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday",
        ],
        opens: "00:00",
        closes: "23:59",
      },
    },
  },
};

export default function ContactPage() {
  return (
    <>
      <Script
        id="contact-page-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(contactPageSchema),
        }}
      />
      <ContactSection />
    </>
  );
}
