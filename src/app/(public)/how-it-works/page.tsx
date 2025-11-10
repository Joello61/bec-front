import type { Metadata } from "next";
import { HowItWorksSection } from "@/components/sections/HowItWorksSection";
import Script from "next/script";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://cobage.joeltech.dev";

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),

  title: "Comment ça marche ? – Utiliser Co-Bage en 4 étapes simples",
  description:
    "Découvrez en 4 étapes simples comment utiliser Co-Bage pour envoyer ou transporter vos colis entre le Cameroun, l’Afrique et la diaspora. Une solution économique et sécurisée.",

  openGraph: {
    type: "website",
    url: `${APP_URL}/how-it-works`,
    siteName: "Co-Bage",
    title: "Comment fonctionne Co-Bage ? – Guide Complet",
    description:
      "Apprenez à utiliser Co-Bage étape par étape pour transporter ou envoyer vos colis facilement et à moindre coût.",
    images: [
      {
        url: `${APP_URL}/images/og-how-it-works.jpg`,
        width: 1200,
        height: 630,
        alt: "Comment ça marche - Co-Bage",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    site: "@cobage_official",
    creator: "@cobage_official",
    title: "Comment ça marche – Co-Bage",
    description:
      "Guide rapide en 4 étapes pour utiliser Co-Bage et simplifier vos envois de colis.",
    images: [`${APP_URL}/images/og-how-it-works.jpg`],
  },

  alternates: {
    canonical: `${APP_URL}/how-it-works`,
  },

  category: "Transport & Logistique",
  classification: "Guide d’utilisation Co-Bage",
};

const howToSchema = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "Comment utiliser Co-Bage pour envoyer ou transporter des colis",
  description:
    "Tutoriel pas à pas pour comprendre le fonctionnement de Co-Bage, la plateforme de transport collaboratif entre le Cameroun, l’Afrique et la diaspora.",
  image: `${APP_URL}/images/og-how-it-works.jpg`,
  estimatedCost: {
    "@type": "MonetaryAmount",
    currency: "EUR",
    value: "0",
  },
  supply: [
    { "@type": "HowToSupply", name: "Compte Co-Bage" },
    { "@type": "HowToSupply", name: "Accès internet ou mobile" },
  ],
  tool: [
    { "@type": "HowToTool", name: "Application Co-Bage" },
    { "@type": "HowToTool", name: "Smartphone ou ordinateur" },
  ],
  step: [
    {
      "@type": "HowToStep",
      position: 1,
      name: "Recherchez",
      text: "Trouvez un voyageur allant vers votre destination ou une demande de transport correspondant à votre trajet.",
      image: `${APP_URL}/images/how-it-works/step1.jpg`,
    },
    {
      "@type": "HowToStep",
      position: 2,
      name: "Contactez",
      text: "Échangez via la messagerie sécurisée de Co-Bage pour convenir des détails du transport.",
      image: `${APP_URL}/images/how-it-works/step2.jpg`,
    },
    {
      "@type": "HowToStep",
      position: 3,
      name: "Organisez",
      text: "Fixez le lieu, l’heure et les modalités de remise du colis entre l’expéditeur et le voyageur.",
      image: `${APP_URL}/images/how-it-works/step3.jpg`,
    },
    {
      "@type": "HowToStep",
      position: 4,
      name: "Évaluez",
      text: "Une fois la livraison terminée, laissez une évaluation pour renforcer la confiance dans la communauté Co-Bage.",
      image: `${APP_URL}/images/how-it-works/step4.jpg`,
    },
  ],
  totalTime: "PT30M",
};

export default function HowItWorksPage() {
  return (
    <>
      <Script
        id="howto-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(howToSchema),
        }}
      />
      <HowItWorksSection />
    </>
  );
}
