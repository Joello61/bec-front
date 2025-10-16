import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

import ToastProvider from '@/components/providers/ToastProvider';
import { Footer, Header } from '@/components/layout';
import { AuthProvider } from '@/components/providers/AuthProvider';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
  preload: true,
});

// Configuration du viewport (séparée depuis Next.js 14+)
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0f172a' },
  ],
};

// Métadonnées globales de l'application
export const metadata: Metadata = {
  // Informations de base
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  ),
  title: {
    default:
      'Co-Bage - Covoiturage de colis vers le Cameroun, l’Afrique et la diaspora',
    template: '%s | CoBage',
  },
  description:
    "Co-Bage connecte voyageurs et expéditeurs pour un transport collaboratif de colis entre le Cameroun, l'Afrique et leur diaspora. Envoyez vos colis moins cher, transportez et gagnez un revenu complémentaire.",
  keywords: [
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

  // Robots et indexation
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

  // Open Graph (Facebook, LinkedIn, etc.)
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

  // Twitter/X
  twitter: {
    card: 'summary_large_image',
    site: '@co-bage',
    creator: '@co-bage',
    title: 'Co-Bage - Transport Collaboratif Cameroun-Afrique',
    description:
      "Connectez voyageurs et expéditeurs pour un transport de colis économique entre le Cameroun, l'Afrique et leur diaspora.",
    images: ['/images/twitter-image.jpg'],
  },

  // Configuration PWA
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

  // Manifest et icônes
  manifest: '/site.webmanifest',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon-96x96.png', sizes: '96x96', type: 'image/png' },
    ],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180' }],
  },

  // Vérification des outils webmaster
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
  },

  // Métadonnées alternatives
  alternates: {
    canonical: '/',
    languages: {
      'fr-FR': '/',
      'fr-CM': '/cm',
      'en-US': '/en',
    },
  },

  // Autres métadonnées
  category: 'Transport collaboratif de colis',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" suppressHydrationWarning className={inter.variable}>
      <head>
        {/* Structured Data - Organisation Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: 'Co-Bage',
              url: process.env.NEXT_PUBLIC_APP_URL || 'http://locahost:3000',
              logo: `${process.env.NEXT_PUBLIC_APP_URL}/images/logo/logo.png`,
              description:
                "Plateforme de transport collaboratif de colis entre le Cameroun, l'Afrique et leur diaspora",
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
              sameAs: [
                'https://twitter.com/co-bage',
                'https://www.facebook.com/co-bage',
                'https://www.linkedin.com/company/co-bage',
                'https://www.instagram.com/co-bage',
              ],
              contactPoint: {
                '@type': 'ContactPoint',
                contactType: 'Support Client',
                email: 'support@cobage.joeltech.dev',
                availableLanguage: ['French', 'English'],
                areaServed: ['CM', 'FR', 'US', 'CA', 'GB'],
              },
            }),
          }}
        />

        {/* Structured Data - WebSite Schema avec SearchAction */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebSite',
              name: 'Co-Bage',
              alternateName: 'Co-Bage - Covoiturage de Colis Cameroun',
              url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
              description:
                'Plateforme de transport collaboratif de colis pour la diaspora africaine et camerounaise',
              potentialAction: {
                '@type': 'SearchAction',
                target: {
                  '@type': 'EntryPoint',
                  urlTemplate: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/explore?q={search_term_string}`,
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
              serviceType: 'Transport collaboratif de colis',
              provider: {
                '@type': 'Organization',
                name: 'Co-Bage',
              },
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
              audience: {
                '@type': 'Audience',
                audienceType:
                  'Diaspora camerounaise et africaine, voyageurs internationaux, expéditeurs de colis',
              },
              offers: {
                '@type': 'Offer',
                description: 'Transport économique de colis entre particuliers',
                priceCurrency: 'XAF',
              },
            }),
          }}
        />

        {/* Structured Data - LocalBusiness (si pertinent) */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'LocalBusiness',
              name: 'CoBage',
              description:
                "Service de covoiturage de colis entre le Cameroun, l'Afrique et leur diaspora",
              url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
              telephone: '+33-07-52-89-20-73',
              address: {
                '@type': 'PostalAddress',
                addressCountry: 'FR',
                addressLocality: 'France',
              },
              geo: {
                '@type': 'GeoCoordinates',
                latitude: '43.5812863',
                longitude: '1.4074899',
              },
              servesCuisine: 'Transport collaboratif de colis',
            }),
          }}
        />
      </head>
      <body className="min-h-screen bg-gray-50 antialiased">
        <AuthProvider>
          <Header />

          <main id="main-content" role="main">
            {children}
          </main>

          <Footer />
        </AuthProvider>

        <ToastProvider />
      </body>
    </html>
  );
}
