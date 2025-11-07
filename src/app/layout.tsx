import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import ClientRootProvider from '@/components/clients/dashboard/client-root-provider';
import Script from 'next/script';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
  preload: true,
});

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://cobage.joeltech.dev';

// Configuration du viewport
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#00695c' },
    { media: '(prefers-color-scheme: dark)', color: '#004d40' },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),
  
  title: {
    default: 'Co-Bage - Transport de colis Cameroun-Afrique',
    template: '%s | Co-Bage',
  },
  
  description:
    'Transport collaboratif de colis entre le Cameroun, l\'Afrique et leur diaspora. Économique, sécurisé et humain. Envoyez moins cher.',
  
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
    url: APP_URL,
    siteName: 'Co-Bage',
    title: 'Co-Bage - Transport colis Cameroun-Afrique',
    description:
      'Transport collaboratif de colis entre Cameroun, Afrique et diaspora. Économique et sécurisé.',
    images: [
      {
        url: `${APP_URL}/images/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: 'Co-Bage - Covoiturage de Colis Cameroun Afrique',
        type: 'image/jpeg',
      },
    ],
  },

  twitter: {
    card: 'summary_large_image',
    site: '@cobage_official',
    creator: '@cobage_official',
    title: 'Co-Bage - Transport colis Cameroun-Afrique',
    description:
      'Transport collaboratif de colis économique entre Cameroun, Afrique et diaspora.',
    images: [`${APP_URL}/images/twitter-image.jpg`],
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

  manifest: '/manifest.webmanifest',
  
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
  
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Co-Bage',
    alternateName: ['CoBage', 'COBAGE', 'cobage'],
    url: APP_URL,
    logo: `${APP_URL}/images/logo/logo-1.png`,
    description:
      "Plateforme de transport collaboratif de colis entre le Cameroun, l'Afrique et leur diaspora.",
    areaServed: [
      { '@type': 'Country', name: 'Cameroun' },
      { '@type': 'Continent', name: 'Afrique' },
    ],
    sameAs: [
      'https://x.com/cobage_officiel',
      'https://www.facebook.com/cobageOfficiel',
      'https://www.linkedin.com/company/cobage-officiel',
      'https://www.instagram.com/cobage_officiel',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'Support Client',
      email: 'support@cobage.joeltech.dev',
      telephone: '+33752892073',
      availableLanguage: ['French', 'English'],
      areaServed: ['CM', 'FR', 'US', 'CA', 'GB'],
    },
  };

  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Co-Bage',
    alternateName: ['CoBage', 'COBAGE', 'cobage'],
    url: APP_URL,
    description:
      'Plateforme de transport collaboratif de colis pour la diaspora africaine et camerounaise.',
    inLanguage: 'fr-FR',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${APP_URL}/dashboard/explore?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };

  return (
    <html
      lang="fr"
      suppressHydrationWarning
      className={`${inter.variable} md:scrollbar-thin no-scrollbar-mobile`}
    >
      <body>
        <Script
          id="ld-org"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema),
          }}
        />
        <Script
          id="ld-web"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(websiteSchema),
          }}
        />

        <ClientRootProvider>{children}</ClientRootProvider>
      </body>
    </html>
  );
}