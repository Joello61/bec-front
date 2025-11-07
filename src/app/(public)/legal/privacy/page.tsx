import type { Metadata } from "next";
import PrivacyPageClient from "@/components/clients/public/privacy-client";
import Script from "next/script";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://cobage.joeltech.dev";

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),
  title: "Politique de Confidentialité – Co-Bage",
  description:
    "Découvrez comment Co-Bage collecte, utilise et protège vos données personnelles. Engagement RGPD pour la protection de votre vie privée.",
  robots: { index: true, follow: true },

  openGraph: {
    type: "website",
    url: `${APP_URL}/legal/privacy`,
    siteName: "Co-Bage",
    title: "Politique de Confidentialité – Co-Bage",
    description:
      "Comment nous protégeons vos données personnelles en conformité avec le RGPD.",
    images: [
      {
        url: `${APP_URL}/images/og-legal-privacy.jpg`,
        width: 1200,
        height: 630,
        alt: "Politique de Confidentialité Co-Bage",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    site: "@cobage_official",
    creator: "@cobage_official",
    title: "Politique de Confidentialité – Co-Bage",
    description: "Protection de vos données personnelles (RGPD).",
    images: [`${APP_URL}/images/twitter-legal-privacy.jpg`],
  },

  alternates: {
    canonical: `${APP_URL}/legal/privacy`,
  },

  category: "Mentions légales",
  classification: "Politique de confidentialité (RGPD)",
};

const privacyPageSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": ["WebPage", "PrivacyPolicy"],
      name: "Politique de Confidentialité",
      description:
        "Politique de confidentialité et protection des données de Co-Bage conformément au RGPD.",
      url: `${APP_URL}/legal/privacy`,
      datePublished: "2025-01-01",
      dateModified: "2025-01-01",
      inLanguage: "fr-FR",
      isPartOf: {
        "@type": "WebSite",
        name: "Co-Bage",
        url: APP_URL,
      },
      publisher: {
        "@type": "Organization",
        name: "Co-Bage",
        url: APP_URL,
        logo: {
          "@type": "ImageObject",
          url: `${APP_URL}/images/logo/logo-1.png`,
          width: 250,
          height: 60,
        },
      },
      about: {
        "@type": "Thing",
        name: "Protection des données personnelles",
      },
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Accueil", item: APP_URL },
        { "@type": "ListItem", position: 2, name: "Mentions légales", item: `${APP_URL}/legal` },
        { "@type": "ListItem", position: 3, name: "Politique de Confidentialité", item: `${APP_URL}/legal/privacy` },
      ],
    },
  ],
};

export default function PrivacyPage() {
  return (
    <>
      <Script
        id="privacy-page-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(privacyPageSchema) }}
      />
      <PrivacyPageClient />
    </>
  );
}
