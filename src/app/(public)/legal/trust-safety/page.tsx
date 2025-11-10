import type { Metadata } from "next";
import TrustSafetyPageClient from "@/components/clients/public/trust-safety-client";
import Script from "next/script";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://cobage.joeltech.dev";

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),

  title: "Confiance et Sécurité – Co-Bage",
  description:
    "Découvrez nos mesures de sécurité et nos conseils pour un transport de colis en toute confiance. Vérification d’identité, objets interdits, signalement et bonnes pratiques sur Co-Bage.",

  robots: { index: true, follow: true },

  openGraph: {
    type: "website",
    url: `${APP_URL}/legal/trust-safety`,
    siteName: "Co-Bage",
    title: "Confiance et Sécurité – Co-Bage",
    description:
      "Guide complet sur la sécurité et la confiance chez Co-Bage : vérification d’identité, signalement, règles de transport et évaluation des utilisateurs.",
    images: [
      {
        url: `${APP_URL}/images/og-legal-trust-safety.jpg`,
        width: 1200,
        height: 630,
        alt: "Confiance et Sécurité Co-Bage",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    site: "@cobage_official",
    creator: "@cobage_official",
    title: "Confiance et Sécurité – Co-Bage",
    description:
      "Conseils pratiques et règles de sécurité pour utiliser Co-Bage en toute confiance.",
    images: [`${APP_URL}/images/og-legal-trust-safety.jpg`],
  },

  alternates: {
    canonical: `${APP_URL}/legal/trust-safety`,
  },

  category: "Mentions légales",
  classification: "Confiance et Sécurité",
};

const trustSafetySchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": ["WebPage", "Guide"],
      name: "Confiance et Sécurité – Co-Bage",
      description:
        "Guide de sécurité et bonnes pratiques pour utiliser Co-Bage en toute confiance. Vérification d'identité, objets interdits, signalement, évaluations et assistance.",
      url: `${APP_URL}/legal/trust-safety`,
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
      mainEntity: {
        "@type": "ItemList",
        name: "Règles de sécurité Co-Bage",
        description:
          "Liste des principales mesures de sécurité appliquées sur la plateforme.",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Vérification d’identité obligatoire",
            description:
              "Tous les utilisateurs doivent vérifier leur identité et leur numéro de téléphone.",
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Objets interdits",
            description:
              "Interdiction stricte de transporter drogues, armes, explosifs et substances dangereuses.",
          },
          {
            "@type": "ListItem",
            position: 3,
            name: "Système de signalement",
            description:
              "Tout utilisateur peut signaler une annonce ou un comportement suspect.",
          },
          {
            "@type": "ListItem",
            position: 4,
            name: "Évaluations et avis",
            description:
              "Les avis des utilisateurs renforcent la confiance et la transparence sur Co-Bage.",
          },
        ],
      },
    },

    {
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "Comment Co-Bage garantit-il la sécurité des utilisateurs ?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Chaque utilisateur est soumis à une vérification d’identité. Les profils et avis permettent de construire la confiance au sein de la communauté.",
          },
        },
        {
          "@type": "Question",
          name: "Que faire en cas de problème ou de comportement suspect ?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Vous pouvez signaler un utilisateur ou un trajet directement depuis l’application. L’équipe Co-Bage analyse chaque signalement sous 24 heures.",
          },
        },
        {
          "@type": "Question",
          name: "Quels objets sont interdits sur Co-Bage ?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Les objets illégaux, dangereux ou interdits par les compagnies aériennes (armes, produits inflammables, drogues, etc.) sont strictement prohibés.",
          },
        },
      ],
    },

    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Accueil", item: APP_URL },
        { "@type": "ListItem", position: 2, name: "Mentions légales", item: `${APP_URL}/legal` },
        { "@type": "ListItem", position: 3, name: "Confiance et Sécurité", item: `${APP_URL}/legal/trust-safety` },
      ],
    },
  ],
};

export default function TrustSafetyPage() {
  return (
    <>
      <Script
        id="trust-safety-page-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(trustSafetySchema) }}
      />
      <TrustSafetyPageClient />
    </>
  );
}
