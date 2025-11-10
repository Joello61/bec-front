import RechercherPublicPageClient from "@/components/clients/public/explore-public-client";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Explorer les voyages et demandes | Co-Bage Cameroun-Afrique",
  description:
    "Explorez les voyages disponibles ou les demandes de transport de colis entre le Cameroun, l’Afrique et la diaspora. Trouvez un voyageur de confiance ou une expédition adaptée à votre itinéraire.",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    title: "Explorer les voyages et demandes – Co-Bage",
    description:
      "Découvrez les trajets disponibles, trouvez un voyageur ou publiez votre demande de transport de colis. Simple, économique et sécurisé.",
    type: "website",
    url: "/explore",
    siteName: "Co-Bage",
    images: [
      {
        url: "/images/og-explore.jpg",
        width: 1211,
        height: 840,
        alt: "Explorer les voyages et demandes Co-Bage Cameroun-Afrique",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Explorer les voyages et demandes | Co-Bage",
    description:
      "Recherchez des voyages, transportez ou envoyez vos colis entre le Cameroun, l’Afrique et la diaspora.",
    images: ["/images/og-explore.jpg"],
  },
  alternates: {
    canonical: "/explore",
  },
  category: "Transport collaboratif",
};

const explorePageSchema = {
  "@context": "https://schema.org",
  "@type": "SearchResultsPage",
  name: "Explorer les voyages et demandes | Co-Bage",
  description:
    "Page d’exploration des trajets et demandes de transport collaboratif entre le Cameroun, l’Afrique et la diaspora.",
  url: process.env.NEXT_PUBLIC_APP_URL + "/explore",
  publisher: {
    "@type": "Organization",
    name: "Co-Bage",
    url: process.env.NEXT_PUBLIC_APP_URL,
    logo: {
      "@type": "ImageObject",
      url: process.env.NEXT_PUBLIC_APP_URL + "/images/logo/logo-1.png",
    },
  },
  inLanguage: "fr-FR",
};

export default function RechercherPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(explorePageSchema),
        }}
      />
      <RechercherPublicPageClient />
    </>
  );
}
