import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import ClientRootProvider from '@/components/clients/dashboard/client-root-provider';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
  preload: true,
});

// Configuration du viewport
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#00695c' }, // ← CORRIGER (primary color)
    { media: '(prefers-color-scheme: dark)', color: '#004d40' },
  ],
};

// Métadonnées globales de l'application
export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  ),
  title: {
    default:
      "Co-Bage - Covoiturage de colis vers le Cameroun, l'Afrique et la diaspora",
    template: '%s | Co-Bage',
  },
  description:
    "Co-Bage connecte voyageurs et expéditeurs pour un transport collaboratif de colis entre le Cameroun, l'Afrique et leur diaspora. Envoyez vos colis moins cher, transportez et gagnez un revenu complémentaire.",
  keywords: [
    'CoBage', 'Co-Bage', 'COBAGE', 'co bage', 'cobage',
    'covoiturage colis Cameroun',
    'transport colis Afrique',
    'envoi colis diaspora camerounaise',
    'transport collaboratif Cameroun',
    'livraison colis Douala Yaoundé',
    'colis pas cher Cameroun',
    'voyageur transporteur Afrique',
    'envoyer colis famille Cameroun',
    'transport entre particuliers Afrique',
    'bagages voyageur international',
    'covoiturage bagages diaspora',
    'livraison économique Afrique',
    'transport colis Cameroun France',
    'marketplace transport Cameroun',
    'blablacar colis Afrique',
  ],
  authors: [{ name: 'Co-Bage Team' }],
  creator: 'Co-Bage',
  publisher: 'Co-Bage',

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

  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    alternateLocale: ['en_US', 'fr_CM'],
    url: '/',
    siteName: 'Co-Bage',
    title: 'Co-Bage - Transport Collaboratif de Colis Cameroun-Afrique',
    description:
      "Plateforme collaborative pour envoyer et transporter des colis entre le Cameroun, l'Afrique et leur diaspora. Économique, sécurisé et humain.",
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Co-Bage - Covoiturage de Colis Cameroun Afrique',
        type: 'image/jpeg',
      },
    ],
  },

  twitter: {
    card: 'summary_large_image',
    site: '@cobage', // ← CORRIGER (pas de tiret)
    creator: '@cobage',
    title: 'Co-Bage - Transport Collaboratif Cameroun-Afrique',
    description:
      "Connectez voyageurs et expéditeurs pour un transport de colis économique entre le Cameroun, l'Afrique et leur diaspora.",
    images: ['/images/twitter-image.jpg'],
  },

  applicationName: 'Co-Bage',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Co-Bage',
  },
  formatDetection: {
    telephone: false,
    email: false,
    address: false,
  },

  manifest: '/site.webmanifest',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon-96x96.png', sizes: '96x96', type: 'image/png' },
    ],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180' }],
  },

  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
  },

  alternates: {
    canonical: '/',
    languages: {
      'fr-FR': '/',
      'fr-CM': '/cm',
      'en-US': '/en',
    },
  },

  category: 'Transport collaboratif de colis',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="fr"
      suppressHydrationWarning
      className={`${inter.variable} md:scrollbar-thin no-scrollbar-mobile`}
    >
      <head>
        {/* Structured Data - Organization Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: 'Co-Bage',
              alternateName: ['CoBage', 'COBAGE', 'co bage', 'cobage'],
              url: process.env.NEXT_PUBLIC_APP_URL || 'https://cobage.joeltech.dev',
              logo: `${process.env.NEXT_PUBLIC_APP_URL || 'https://cobage.joeltech.dev'}/images/logo/logo-1.png`,
              description:
                "Plateforme de transport collaboratif de colis entre le Cameroun, l'Afrique et leur diaspora.",
              areaServed: [
                { '@type': 'Country', name: 'Cameroun' },
                { '@type': 'Continent', name: 'Afrique' },
              ],
              sameAs: [
                'https://twitter.com/cobage',
                'https://www.facebook.com/cobage',
                'https://www.linkedin.com/company/cobage',
                'https://www.instagram.com/cobage',
              ],
              contactPoint: {
                '@type': 'ContactPoint',
                contactType: 'Support Client',
                email: 'support@cobage.com',
                telephone: '+33752892073',
                availableLanguage: ['French', 'English'],
                areaServed: ['CM', 'FR', 'US', 'CA', 'GB'],
              },
            }),
          }}
        />

        {/* Structured Data - WebSite Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebSite',
              name: 'Co-Bage',
              alternateName: ['CoBage', 'COBAGE', 'cobage'],
              url: process.env.NEXT_PUBLIC_APP_URL || 'https://cobage.joeltech.dev',
              description:
                'Plateforme de transport collaboratif de colis pour la diaspora africaine et camerounaise.',
              inLanguage: 'fr-FR',
              potentialAction: {
                '@type': 'SearchAction',
                target: {
                  '@type': 'EntryPoint',
                  urlTemplate: `${process.env.NEXT_PUBLIC_APP_URL || 'https://cobage.joeltech.dev'}/dashboard/explore?q={search_term_string}`,
                },
                'query-input': 'required name=search_term_string',
              },
            }),
          }}
        />

        {/* Structured Data - Service Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Service',
              name: 'Co-Bage',
              alternateName: ['CoBage', 'COBAGE', 'cobage'],
              serviceType: 'Transport collaboratif de colis',
              provider: {
                '@type': 'Organization',
                name: 'Co-Bage',
                url: process.env.NEXT_PUBLIC_APP_URL || 'https://cobage.joeltech.dev',
                logo: `${process.env.NEXT_PUBLIC_APP_URL || 'https://cobage.joeltech.dev'}/images/logo/logo-1.png`,
              },
              areaServed: [
                { '@type': 'Country', name: 'Cameroun' },
                { '@type': 'Continent', name: 'Afrique' },
              ],
              audience: {
                '@type': 'Audience',
                audienceType:
                  'Diaspora camerounaise et africaine, voyageurs internationaux, expéditeurs de colis',
              },
              offers: {
                '@type': 'Offer',
                description: 'Transport économique de colis entre particuliers',
                priceCurrency: 'EUR',
              },
            }),
          }}
        />

        {/* Structured Data - LocalBusiness Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'LocalBusiness',
              name: 'Co-Bage',
              alternateName: ['CoBage', 'COBAGE', 'cobage'],
              description:
                "Service de covoiturage de colis entre le Cameroun, l'Afrique et leur diaspora.",
              url: process.env.NEXT_PUBLIC_APP_URL || 'https://cobage.joeltech.dev',
              telephone: '+33752892073',
              address: {
                '@type': 'PostalAddress',
                addressCountry: 'FR',
                addressLocality: 'Toulouse',
              },
              geo: {
                '@type': 'GeoCoordinates',
                latitude: '43.5812863',
                longitude: '1.4074899',
              },
              category: 'Transport et logistique',
              openingHours: 'Mo-Fr 09:00-18:00',
              paymentAccepted: ['Card', 'Cash', 'Transfer'],
            }),
          }}
        />
      </head>

      <body>
        <ClientRootProvider>
          {children}
        </ClientRootProvider>
      </body>
    </html>
  );
}
